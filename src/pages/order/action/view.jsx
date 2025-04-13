import React, { useEffect, useState } from 'react';
import { Card, Typography, Form, Col, Row, Avatar, Popconfirm, Button, Table } from 'antd';
import { LeftOutlined ,EyeOutlined} from '@ant-design/icons';
import { connect } from 'dva';
import moment from 'moment';

import getObjectIteratedValues from '../../../utils/functions';
import axios from 'axios';
import VerifiedOTP from './VerifiedOTP';
const baseUrl = process.env.REACT_APP_ApiUrl;



 
const OrderView = props => {

	let { orders } = props;
    const [addModel, setModal] = useState(false);
	// let  [product , setProduct]= useState([]);
	let {detail} = orders
	let product = []


	if(detail && orders.product){
		product = orders.product
	}
	
	const returnData = () => {
		DetailFun(props.match.params.id)
	}

	useEffect(() => {
		DetailFun(props.match.params.id)
	}, [])

	const DetailFun = (id) => {
		props.dispatch({ type: 'orders/getDetail', payload: { id } });

		

	}

	const	handleDeactiveUser = async (data) => {
		let list = orders && orders.product;
		console.log("list" , list)
		let list_update = list.map((item) => {
			if(item._id === data) {
				item.is_published = !item.is_published;
			}
			return item;	
		})
		// this.setState({ listData: list_update })
		product = list_update
		await axios.post(`${baseUrl}/api/product/status`, {id: data});
	}


	const columns = 

	
	[

		{ title: <strong>Product Image</strong>, dataIndex: 'productDetail'  , render:(val,data)=> {
			return (<Avatar shape="square" size={60} src={`${val && val.images && val.images[0]?.url}`} style={{ margin: 5 }} />);
		}},

		{ title: <strong>Product Title</strong>, dataIndex: 'productDetail'  , render:(val,data)=> val.title},
		{ title: <strong>Product Price</strong>, dataIndex: 'productDetail'  , render:(val,data)=> val.price},
		{ title: <strong>Product Price</strong>, dataIndex: 'productDetail'  , render:(val,data)=> {
			return(
						<div>

			   <div className={val.is_published ? "text-success" : "text-danger"}> {val.is_published && val.is_published  ? `Published` : `UnPublished`}  </div>
		   

		</div>
			)
		}},


		
		{ title: <strong>Product Quantity</strong>, dataIndex: 'quantity' },
		



	];



	return (
		<>


	

		{detail && detail.order_type  === "LAST_MINUTE_PIN" ? 
		<>
{
	console.log('detailsddssdsdds',detail)
}
		{detail && detail?.status !== "ORDER_RECEIVED" ?
		<Button className="submitbutton_edit mb-3" type="default" onClick={()=> setModal(true)}>Verify OTP</Button> 
		:
		<h1>ORDER RECEVIED</h1>

	}


				<Card title={<span><LeftOutlined onClick={() => props.history.push('/orders')} /> Order Detail : (Product) </span>} style={{ marginTop: "0" }}>

					
				
				<Row style={{marginBottom:'0.625rem'}}>
					<Col span={8}>
							<span style={{color:'#666', fontWeight:'700'}}>Order ID</span>
					</Col>
					<Col span={16}>
						{detail && detail._id}
					</Col>
				</Row> 
				<Row style={{marginBottom:'0.625rem'}} >
					<Col span={8}>
							<span  style={{color:'#666', fontWeight:'700'}} >Customer ID</span>
					</Col>
					<Col span={16}>
					{detail && detail.user_id || '-'}
					</Col>
				</Row> 
	
				<Row style={{marginBottom:'0.625rem'}} >
							<Col span={8}>
									<span  style={{color:'#666', fontWeight:'700'}} >Total Amount</span>
							</Col>
							<Col span={16}>
							{detail && detail.total_amount || '-'}
							</Col>
						</Row> 
	
						<Row style={{marginBottom:'0.625rem'}} >
							<Col span={8}>
									<span  style={{color:'#666', fontWeight:'700'}} >Payable Amount</span>
							</Col>
							<Col span={16}>
							{detail && detail.payable_amount || '-'}
							</Col>
						</Row> 
	
						<Row style={{marginBottom:'0.625rem'}} >
							<Col span={8}>
									<span  style={{color:'#666', fontWeight:'700'}} >Discount Amount</span>
							</Col>
							<Col span={16}>
							{detail && detail.discounted_amount || '-'}
							</Col>
						</Row> 
	
						<Row style={{marginBottom:'0.625rem'}} >
							<Col span={8}>
									<span  style={{color:'#666', fontWeight:'700'}} >Payment Status</span>
							</Col>
							<Col span={16}>
							{detail && detail.payment_status || '-'}
							</Col>
						</Row> 
	
						<Row style={{marginBottom:'0.625rem'}} >
							<Col span={8}>
									<span  style={{color:'#666', fontWeight:'700'}} >Order Date</span>
							</Col>
							<Col span={16}>
							{detail && moment(detail.created_at).format('DD/MM/YYYY',"hh:mm a") || '-'}
							
							</Col>
						</Row> 

						<Row style={{marginBottom:'0.625rem'}} >
							<Col span={8}>
									<span  style={{color:'#666', fontWeight:'700'}} >Order Time</span>
							</Col>
							<Col span={16}>
							{detail && moment(detail.created_at).format("hh:mm a") || '-'}
							
							</Col>
						</Row> 
	

						
	
				
				
			</Card>
				<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
				<Table columns={columns} dataSource={detail && detail.products && detail.products }
					// loading={props.loading.global}
					// onChange={this.paginationFun}
					rowKey={record => record._id}
					
					
				/>
			</Card>
				</>

			:

			
			<Card title={<span><LeftOutlined onClick={() => props.history.push('/orders')} /> Order Detail : (Store)</span>} style={{ marginTop: "0" }}>
				
			<Row style={{marginBottom:'0.625rem'}}>
				<Col span={8}>
						<span style={{color:'#666', fontWeight:'700'}}>Order ID</span>
				</Col>
				<Col span={16}>
					{detail && detail._id}
				</Col>
			</Row> 
			<Row style={{marginBottom:'0.625rem'}} >
				<Col span={8}>
						<span  style={{color:'#666', fontWeight:'700'}} >Customer ID</span>
				</Col>
				<Col span={16}>
				{detail && detail.user_id || '-'}
				</Col>
			</Row> 

			<Row style={{marginBottom:'0.625rem'}} >
						<Col span={8}>
								<span  style={{color:'#666', fontWeight:'700'}} >Total Amount</span>
						</Col>
						<Col span={16}>
						{detail && detail.total_amount || '-'}
						</Col>
					</Row> 

					<Row style={{marginBottom:'0.625rem'}} >
						<Col span={8}>
								<span  style={{color:'#666', fontWeight:'700'}} >Payable Amount</span>
						</Col>
						<Col span={16}>
						{detail && detail.payable_amount || '-'}
						</Col>
					</Row> 

					<Row style={{marginBottom:'0.625rem'}} >
						<Col span={8}>
								<span  style={{color:'#666', fontWeight:'700'}} >Discount Amount</span>
						</Col>
						<Col span={16}>
						{detail && detail.discounted_amount || '-'}
						</Col>
					</Row> 

					<Row style={{marginBottom:'0.625rem'}} >
						<Col span={8}>
								<span  style={{color:'#666', fontWeight:'700'}} >Payment Status</span>
						</Col>
						<Col span={16}>
						{detail && detail.payment_status || '-'}
						</Col>
					</Row> 

				
					<Row style={{marginBottom:'0.625rem'}} >
							<Col span={8}>
									<span  style={{color:'#666', fontWeight:'700'}} >Order Date</span>
							</Col>
							<Col span={16}>
							{detail && moment(detail.created_at).format('DD/MM/YYYY',"hh:mm a") || '-'}
							
							</Col>
						</Row> 

						<Row style={{marginBottom:'0.625rem'}} >
							<Col span={8}>
									<span  style={{color:'#666', fontWeight:'700'}} >Order Time</span>
							</Col>
							<Col span={16}>
							{detail && moment(detail.created_at).format("hh:mm a") || '-'}
							
							</Col>
						</Row> 

			
			
		</Card>
		}



<VerifiedOTP visible={addModel} closeModel={() => setModal(false)} order_id={props.match.params.id} returnData={returnData} />



		</>
	)
};

export default connect(({ orders }) => ({
	orders,
}))(OrderView);