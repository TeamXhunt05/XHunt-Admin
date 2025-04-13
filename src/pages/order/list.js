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


class OrderList extends React.Component {
	constructor(props) {
		super(props);
		this.state = { limit: 10, current: 0, sortBy: 'asc', searchText: '', loader: false, count: 0, listData: [] , isAdmin : false  }
		setTimeout(() => document.title = 'Order List', 100);
	}

	componentDidMount() {
		this.ListFun();
		
		if(localStorage.getItem('role') === "ADMIN"){
			this.setState({isAdmin : true})
		}
	}

	ListFun = () => {
		let searchData = { limit: this.state.limit, page: this.state.current, sortBy: this.state.sortBy }
		this.props.dispatch({ type: 'orders/listData', payload: searchData });
	}

	ShowSizeChange = (current, size) => {
		this.setState({ limit: size, current: current - 1 }, () => this.ListFun())
	};

	// paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

	searchVal = (val) => {
		this.state.searchText = val;
		const resultAutos = this.props.orders.list.filter((auto) =>
			JSON.stringify(auto).toLowerCase().includes(val.toLowerCase())
		)
		this.setState({ listData: resultAutos })
	}


	deleteItem = (_id) => {
		let val = { _id }
		this.props.dispatch({ type: 'orders/delete', payload: val });
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
		await axios.post(`${baseUrl}/api/order/status`, {id: data});
	}


	render() {
		const { location } = this.props;
		const pathSnippets = location.pathname.split('/').filter(i => i);
		let url = pathSnippets[0].toUpperCase();

		const { searchText } = this.state;
		const { orders } = this.props;
		const count = orders?.count;


		if (this.state.searchText == '') {
			this.state.listData = orders ? orders.list : [];
		}


		


		const columns = 
		[

			{
				title: <strong className=''>ID</strong>, dataIndex: '_id',
				render: (value, row) => {
					return <span className='text-primary'>{row._id}</span>
				}
			},

			{
				title: <strong className=''>Customer ID</strong>, dataIndex: 'user_id',
				render: (value, row) => {
					return <span className='time_table_text'>{row.user_id}</span>
				}
			},

			{
				title: <strong className=''>Total Amount</strong>, dataIndex: 'total_amount',
				render: (value, row) => {
					return <span className='time_table_text'>{row.total_amount}</span>
				}
			},

			{
				title: <strong className=''>Payable Amount</strong>, dataIndex: 'payable_amount',
				render: (value, row) => {
					return <span className='time_table_text'>{row.payable_amount}</span>
				}
			},
			{
				title: <strong className=''>Discount Amount</strong>, dataIndex: 'discounted_amount',
				render: (value, row) => {
					return <span className='time_table_text'>{row.discounted_amount}</span>
				}
			},

			{
				title: <strong className=''>Payment Status</strong>, dataIndex: 'payment_status',
				render: (value, row) => {
					return <span className='time_table_text'>{row.payment_status}</span>
				}
			},

			{
				title: <strong className=''>Order Type</strong>, dataIndex: 'order_type',
				render: (value, row) => {
					return <span className='time_table_text'>{row.order_type}</span>
				}
			},



			{
				title: <strong className='time_table_text'>Order Date</strong>, dataIndex: 'created_at',
				render: (value, row) => {
					return <span className='time_table_text'>{moment(value).format('DD/MM/YYYY',"hh:mm a")}</span>
				}
			},

			// {
			// 	title: <strong className='time_table_text'>Order Time</strong>, dataIndex: 'created_at',
			// 	render: (value, row) => {
			// 		return <span className='time_table_text'>{moment(value).format("hh:mm a")}</span>

			// 	}
			// },
		

			{
				title: <strong>Action</strong>, width: 150, // align:'center',	
				render: (val, data) =>
					<div>

						<Button className="eye_btn" type="default" onClick={() => {
							this.props.history.push('/order/view/' + data._id)
						}}><EyeOutlined /></Button>&nbsp;



						


					</div>
			},
		];

		return (
			<div>
				<Row className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
					<Col>
					{<Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText}
							loading={this.props.submitting} />}

						
					</Col>
				
				</Row>

				
				<div className="innerContainer">
					<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
						<Table columns={columns} dataSource={this.state.listData}
							loading={this.props.loading.global}
							// onChange={this.paginationFun}
							rowKey={record => record._id}
							
							pagination={{
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

export default connect(({ orders, loading }) => ({
	orders, loading
}))(OrderList);