import React from 'react';
import Apploader from '../../components/loader/loader'
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { API_URL, MAP_API_KEY } from '../../utils/constants';
import { connect } from 'dva';
import { Card, Typography, Input, Button, Table, Row,Avatar, Col, Popconfirm } from 'antd';
import { DeleteOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';



// import AddEdit from './action/addEdit'
const { Search } = Input;
const { Text } = Typography;
const baseUrl = process.env.REACT_APP_ApiUrl;


class BusinessList extends React.Component {
	constructor(props) {
		super(props);
		this.state = { limit: 10, current: 0, sortBy: 'asc', searchText: '', loader: false, count: 0, listData: [] , isAdmin : false  }
		setTimeout(() => document.title = 'Approve List', 100);
	}

	componentDidMount() {
		this.ListFun();
		
		if(localStorage.getItem('role') === "ADMIN"){
			this.setState({isAdmin : true})
		}
	}

	ListFun = () => {
		let searchData = { limit: this.state.limit, page: this.state.current, sortBy: this.state.sortBy }
		this.props.dispatch({ type: 'stores/listApprove', payload: searchData });
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


	deleteItem = (_id) => {
		let val = { _id }
		this.props.dispatch({ type: 'stores/delete', payload: val });
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot) {
			this.ListFun();
		}
	}


	handleDeactiveUser = async (data) => {
		let list = this.state.listData;
		
		let list_update = list.map((item) => {
			if(item.store_id === data) {
				item.is_approve = !item.is_approve;
			}
			return item;	
		})
		this.setState({ listData: list_update })
		await axios.post(`${baseUrl}/api/store-approve/status`, {id: data});
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
		
					
					return (<Avatar shape="square" size={60} src={`${val && val[0]?.url}`} style={{ margin: 5 }} />);
				}
			},

			{ title: <strong>Email</strong>, dataIndex: 'email', sorter: (a, b) => a.email.localeCompare(b.email) },
			{ title: <strong>Phone</strong>, dataIndex: 'mobile_number' },
			{ title: <strong>Store Name</strong>, dataIndex: 'title', sorter: (a, b) => a.name.localeCompare(b.name) },
			{ title: <strong>Store Address</strong>, dataIndex: 'address' },
			{ title:<strong>Verified</strong>, dataIndex: 'is_approve', render:(val,data)=> 

			<div className={val ? 'text-success' : 'text-danger'}>
				{console.log(data , 'is_approve')}
		 { val == true ? 'Approved' : 'Not Approved'}

			</div>
	   },
			{ title: <strong>Submited On</strong>, dataIndex: 'created_at',render:(val,data)=> {
				return moment(val).format("DD-MM-YYYY")
			} },

			{
				title: <strong>Action</strong>, width: 150, // align:'center',	
				render: (val, data) =>
					<div>



{!data.is_approve && <>
	<Popconfirm title={"Do you want to approve this store?"} onConfirm={e=> {this.handleDeactiveUser(data.store_id)}} okText="Yes" cancelText="No" >
				   <Button type="default"> <CheckOutlined /> </Button>
			   </Popconfirm>&nbsp;</>}





						<Button className="eye_btn" type="default" onClick={() => {
							this.props.history.push('/store/view/' + data.store_id+'?redirect=approve')
						}}><EyeOutlined /></Button>



						
							

						
							{/* <>
								<Popconfirm title="Are you sure delete this store?" onConfirm={e => { this.deleteItem(data._id) }} okText="Yes" cancelText="No" >
									<Button type="danger" className="mt-2"><DeleteOutlined /></Button>
								</Popconfirm>
							</> */}
						




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
}))(BusinessList);