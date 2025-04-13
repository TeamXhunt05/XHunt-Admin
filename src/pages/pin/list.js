import React from 'react';
import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import { Card, Typography, Input, Button, Table,Avatar, Row, Col, Popconfirm } from 'antd';
import { DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import io from 'socket.io-client';
// const socket = io('http://localhost:4001');
const socket = io(process.env.REACT_APP_ApiUrl);





// import AddEdit from './action/addEdit'
const { Search } = Input;
const { Text } = Typography;
const baseUrl = process.env.REACT_APP_ApiUrl;



class PinList extends React.Component {
	constructor(props) {
		super(props);
		this.state = { limit: 10, current: 0, sortBy: 'asc', searchText: '', loader: false, count: 0, listData: [] , isAdmin : false  }
		setTimeout(() => document.title = 'Pin List', 100);
	}

	componentDidMount() {
		

		socket.on('show_pins', (show_pins) => {
			console.log("🚀 ~ list", show_pins)
			// setTodos(todos);
		  });


		this.ListFun();

		if(localStorage.getItem('role') === "ADMIN"){
			this.setState({isAdmin : true})
		}
	}

	ListFun = () => {
		let searchData = { limit: this.state.limit, page: this.state.current, sortBy: this.state.sortBy }
		this.props.dispatch({ type: 'pins/listData', payload: searchData });
	}

	ShowSizeChange = (current, size) => {
		this.setState({ limit: size, current: current - 1 }, () => this.ListFun())
	};

	// paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

	searchVal = (val) => {
		this.state.searchText = val;
		const resultAutos = this.props.pins.list.filter((auto) =>
			JSON.stringify(auto).toLowerCase().includes(val.toLowerCase())
		)
		this.setState({ listData: resultAutos })
	}


	deleteItem = (_id) => {
		let val = { _id } 
		this.props.dispatch({ type: 'pins/delete', payload: val });
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot) {
			this.ListFun();
		}
	}

	handleDeactiveUser = async (data) => {
		let list = this.state.listData;
		console.log("list" , list)
		let list_update = list.map((item) => {
			if(item._id === data) {
				item.is_published = !item.is_published;
			}
			return item;	
		})
		this.setState({ listData: list_update })
		await axios.post(`${baseUrl}/api/pin/status`, {id: data});
	}


	render() {
		const { location } = this.props;
		const pathSnippets = location.pathname.split('/').filter(i => i);
		let url = pathSnippets[0].toUpperCase();

		const { searchText } = this.state;
		const { pins } = this.props;
		const count = pins?.count;


		if (this.state.searchText == '') {
			this.state.listData = pins ? pins.list : [];
		}

		const columns = 
		[


			

			{ title:<strong> Store Name </strong>, dataIndex: 'storenInfo', render:(val,data)=> val.title },
			{ title:<strong> Store Address </strong>, dataIndex: 'storenInfo', render:(val,data)=> val.address },


			{ title: <strong>Pin Name</strong>, dataIndex: 'title', sorter: (a, b) => a.title.localeCompare(b.title) },
			{ title: <strong>Pin Category</strong>, dataIndex: 'categories' },

			// { title: <strong>Type</strong>, dataIndex: 'type' },
			// { title: <strong>Discount Amount</strong>, dataIndex: 'discount_amount' },
			// { title: <strong>Discount Unit</strong>, dataIndex: 'discount_unit' },
			{ title:<strong>Pin Status </strong>, dataIndex: 'is_published', render:(val,data)=> 

			<div>
		  
			   <Popconfirm title={`Are you sure you want to ${data.is_published ? "UnPublish" : "Publish"} this pin?`} onConfirm={e=> {this.handleDeactiveUser(data._id)}} okText="Yes" cancelText="No" >
				   <Button type="default" className={data.is_published ? "bg-success" : "bg-danger"}> {data.is_published && data.is_published  ? `Published` : `UnPublished`}  </Button>
			   </Popconfirm>
			</div>
	   },

			{
				title: <strong>Action</strong>, width: 150, // align:'center',	
				render: (val, data) =>
					<div>
             		
								<Button className="eye_btn" type="default" onClick={() => {
							this.props.history.push('/pin/view/' + data._id)
						}}><EyeOutlined /></Button>&nbsp;

					 
					{
					!this.state.isAdmin &&
					<>
			<Button className="edit_btn" type="default" onClick={() => {
									sessionStorage.setItem("pinsData", JSON.stringify(data));
									this.props.history.push('/pin/edit/' + data._id+"/"+data.categories)
								}}><EditOutlined /></Button>&nbsp;

					<Popconfirm title="Are you sure delete this pin?" onConfirm={e => { this.deleteItem(data._id) }} okText="Yes" cancelText="No" >
						<Button type="danger" className="mt-2"><DeleteOutlined /></Button>
					</Popconfirm>
				    </>
					}
							
						




					</div>
			},
		];

		return (
			<div>
				<Row className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
					<Col>
					{this.state.isAdmin && <Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText}
							loading={this.props.submitting} />}
					</Col>
					<Col>
						
							<>

							{/* {this.state.listData && !this.state.listData.find(data => data.categories === "LAST_MINUTE_PIN") && !this.state.isAdmin &&	<Button type="primary" onClick={() => {
								this.props.history.push('/pin/add/LAST_MINUTE_PIN' )
								
							}}>Add Last Minute Pin</Button>} */}

                           {this.state.listData && !this.state.listData.find(data => data.categories === "FLAT_DISCOUNT_PIN") && !this.state.isAdmin && 	<Button type="primary" onClick={() => {
								this.props.history.push('/pin/add/FLAT_DISCOUNT_PIN' )
								
							}}>Add Flat Discount Pin</Button>}
						

								{/* <Button type="primary" onClick={() => {
									this.props.history.push('/pin/add?PIN_CATEGORY_TYPES=FLAT_DISCOUNT_PIN')
								}}>Add Flat Discount Pin</Button> */}
							</>
						

					</Col>
				</Row>

				{console.log({ count })}
				<div className="innerContainer">
					<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
						<Table columns={columns} dataSource={this.state.listData}
							loading={this.props.loading.global}
							// onChange={this.paginationFun}
							rowKey={record => record._id}
							
							pagination={this.state.isAdmin && {
								position: ['bottomLeft'],
								showTotal: (total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger: true,
								responsive: true,
								total: count,
								onShowSizeChange: (current, size) => this.ShowSizeChange(current, size),
								pageSizeOptions: ['10', '25', '50', '100', '250', '500'],
							}}
						/>
					</Card>
				</div>
			</div>
		);
	}
};

export default connect(({ pins, loading }) => ({
	pins, loading
}))(PinList);