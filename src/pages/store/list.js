import React from 'react';
import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import { Card, Typography, Input, Button, Table, Row,Avatar, Col, Popconfirm } from 'antd';
import { DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';



// import AddEdit from './action/addEdit'
const { Search } = Input;
const { Text } = Typography;
const baseUrl = process.env.REACT_APP_ApiUrl;


class StoreList extends React.Component {
	constructor(props) {
		super(props);
		this.state = { limit: 10, current: 0, sortBy: 'asc', searchText: '', loader: false, count: 0, listData: [] , isAdmin : false  }
		setTimeout(() => document.title = 'Store List', 100);
	}

	componentDidMount() {
		this.ListFun();
		
		if(localStorage.getItem('role') === "ADMIN"){
			this.setState({isAdmin : true})
		}
	}

	ListFun = () => {
		let searchData = { limit: this.state.limit, page: this.state.current, sortBy: this.state.sortBy }
		this.props.dispatch({ type: 'stores/listData', payload: searchData });
	}

	ShowSizeChange = (current, size) => {
		this.setState({ limit: size, current: current - 1 }, () => this.ListFun())
	};

	// paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

	searchVal = (val) => {
		this.state.searchText = val;
		const resultAutos = this.props.stores.list.filter((auto) =>
			JSON.stringify(auto).toLowerCase().includes(val.toLowerCase())
		)
		this.setState({ listData: resultAutos })
	}


	deleteItem = async (_id) => {
		let val = { _id }
		let result =  await this.props.dispatch({ type: 'stores/delete', payload: val });


		if(result.status === true){
			if(localStorage.getItem('role') !== "ADMIN"){
				this.props.history.push('/')
			}

			
		}
		
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
				item.status = !item.status;
			}
			return item;	
		})
		this.setState({ listData: list_update })
		await axios.post(`${baseUrl}/api/store/status`, {id: data});
	}


	render() {
		const { location } = this.props;
		const pathSnippets = location.pathname.split('/').filter(i => i);
		let url = pathSnippets[0].toUpperCase();

		const { searchText } = this.state;
		const { stores } = this.props;
		const count = stores?.count;


		if (this.state.searchText == '') {
			this.state.listData = stores ? stores.list : [];
		}


		


		const columns = 
		[

			{
				title: <strong>Store Image</strong>,
				dataIndex: 'images',
				cursor: 'pointer',
				width: 150,
				render: (val, data) => {
		
					console.log("🚀 ~ file: list.js:118 ~ PinList ~ render ~ val:", val)
					return (<Avatar shape="square" size={60} src={`${val && val[0]?.url}`} style={{ margin: 5 }} />);
				}
			},
			{ title: <strong>Store Name</strong>, dataIndex: 'title', sorter: (a, b) => a.name.localeCompare(b.name) },
			{ title: <strong>Store Address</strong>, dataIndex: 'address' },
			{ title: <strong>State</strong>, dataIndex: 'state' },
			{ title: <strong>city</strong>, dataIndex: 'city' },
			{
				title: <strong className='time_table_text'>Start Time</strong>, dataIndex: 'open_time',
				render: (value, row) => {
					return <span className='time_table_text'>{moment(value).format("hh:mm a")}</span>
				}
			},
			{
				title: <strong className='time_table_text'>End Time</strong>, dataIndex: 'close_time',
				render: (value, row) => {
					return <span className='time_table_text'>{moment(value).format("hh:mm a")}</span>
				}
			},

			{ title:<strong> Status </strong>, dataIndex: 'status', render:(val,data)=> 

			<div>
		  
			   <Popconfirm title={`Are you sure you want to ${data.status ? "Deactivate" : "Activate"} this store?`} onConfirm={e=> {this.handleDeactiveUser(data._id)}} okText="Yes" cancelText="No" >
				   <Button type="default" className={data.status ? "bg-success" : "bg-danger"}> {data.status && data.status  ? `Activated` : `Deactivated`}  </Button>
			   </Popconfirm>
			</div>
	   },
			{
				title: <strong>Action</strong>, width: 150, // align:'center',	
				render: (val, data) =>
					<div>

						<Button className="eye_btn" type="default" onClick={() => {
							this.props.history.push('/store/view/' + data._id)
						}}><EyeOutlined /></Button>&nbsp;


{
					!this.state.isAdmin &&
					<>
								<Button className="edit_btn" type="default" onClick={() => {
									sessionStorage.setItem("storesData", JSON.stringify(data));
					
									this.props.history.push('/store/edit/' + data._id)
								}}><EditOutlined /></Button>&nbsp;
							</>
						 
					}
						
							

						
							<>
								<Popconfirm title="Are you sure delete this store?" onConfirm={e => { this.deleteItem(data._id) }} okText="Yes" cancelText="No" >
									<Button type="danger" className="mt-2"><DeleteOutlined /></Button>
								</Popconfirm>
							</>
						




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
							    {/* {!this.state.isAdmin && <Button type="primary" onClick={() => this.props.history.push('/store/add')}>Add</Button> } */}
								{ this.state.listData.length === 0 && <Button type="primary" onClick={() => this.props.history.push('/store/add')}>Add</Button>}
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

export default connect(({ stores, loading }) => ({
	stores, loading
}))(StoreList);