import React, { useEffect, useState } from 'react';
import { Card, Typography, Form, Col, Row, Avatar, Popconfirm, Button, Table } from 'antd';
import { LeftOutlined ,EyeOutlined} from '@ant-design/icons';
import { connect } from 'dva';
import getObjectIteratedValues from '../../../utils/functions';
import axios from 'axios';
const baseUrl = process.env.REACT_APP_ApiUrl;



 
const PinsView = props => {

	let { pins } = props;
	// let  [product , setProduct]= useState([]);
	let {detail} = pins
	let product = []


	if(detail && pins.product){
		product = pins.product
	}
	
	

	useEffect(() => {
		DetailFun(props.match.params.id)
	}, [])

	const DetailFun = (id) => {
		props.dispatch({ type: 'pins/getDetail', payload: { id } });

		console.log('pinsuseEffect',pins)

	}

	const	handleDeactiveUser = async (data) => {
		let list = pins && pins.product;
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
		{
			title: <strong>Product Image</strong>,
			dataIndex: 'images',
			cursor: 'pointer',
			width: 150,
			render: (val, data) => {
	
				console.log("🚀 ~ file: list.js:118 ~ PinList ~ render ~ val:", val)
				return (<Avatar shape="square" size={60} src={`${val && val[0]?.url}`} style={{ margin: 5 }} />);
			}
		},
		{ title: <strong>Product Title</strong>, dataIndex: 'title', sorter: (a, b) => a.title.localeCompare(b.title) },
		{ title: <strong>Product Price</strong>, dataIndex: 'price' },
		{ title: <strong>Discount Amount</strong>, dataIndex: 'discount_amount' },
		{ title: <strong>Product Quantity</strong>, dataIndex: 'number_of_pieces' },
		{ title:<strong> Status </strong>, dataIndex: 'is_published', render:(val,data)=> 

		<div>

			   <div className={data.is_published ? "text-success" : "text-danger"}> {data.is_published && data.is_published  ? `Published` : `UnPublished`}  </div>
		   
{/* 	  
		   <Popconfirm title={`Are you sure you want to ${data.is_published ? "UnPublish" : "Publish"} this product?`} onConfirm={e=> {handleDeactiveUser(data._id)}} okText="Yes" cancelText="No" >
			   <Button type="default" className={data.is_published ? "bg-success" : "bg-danger"}> {data.is_published && data.is_published  ? `Published` : `UnPublished`}  </Button>
		   </Popconfirm> */}
		</div>
   },

		// {
		// 	title: <strong>Action</strong>, width: 150, // align:'center',	
		// 	render: (val, data) =>
		// 		<div>

		// 			<Button className="eye_btn" type="default" onClick={() => {
		// 				props.history.push('/product/view/' + data._id)
		// 			}}><EyeOutlined /></Button>&nbsp;

					
					
					




		// 		</div>
		// },
	];



	return (
		<>
		

	
            {/* <Card title={<span><LeftOutlined onClick={() => props.history.push('/pins')} /> Store Detail </span>} style={{ marginTop: "0" }}>
				
            <Row style={{marginBottom:'0.625rem'}}>
                <Col span={8}>
                        <span style={{color:'#666', fontWeight:'700'}}>Store Name</span>
                </Col>
                <Col span={16}>
                    {detail && detail.storenInfo?.title}
                </Col>
            </Row> 


			<Row style={{marginBottom:'0.625rem'}} >
                <Col span={8}>
                        <span  style={{color:'#666', fontWeight:'700'}} >Store Description</span>
                </Col>
                <Col span={16}>
				{detail && detail.storenInfo?.description}
                </Col>
            </Row> 



			
			<Row style={{marginBottom:'0.625rem'}} >
                <Col span={8}>
                        <span  style={{color:'#666', fontWeight:'700'}} >Store Address</span>
                </Col>
                <Col span={16}>
				{detail && detail.storenInfo?.address}
                </Col>
            </Row> 


         
            <Row style={{marginBottom:'0.625rem'}}>
                <Col span={8}>
                        <span  style={{color:'#666', fontWeight:'700'}} >Status</span>
                </Col>
                <Col span={16}>
                { detail && (detail.storenInfo?.status ?<span style={{color : "green"}}>Publish</span>:<span style={{color : "red"}}>UnPublish</span>) || '-'  }
                </Col>
            </Row>
            <Row style={{marginBottom:'0.625rem'}}>
                <Col span={8}>
                        <span  style={{color:'#666', fontWeight:'700'}} >Description</span>
                </Col>
                <Col span={16}>
                {(detail && detail.description) || '-'}
                </Col>
            </Row>
        </Card> */}

		{detail && detail.categories === "LAST_MINUTE_PIN" ? 
		<>
					<Card title={<span><LeftOutlined onClick={() => props.history.push('/pins')} /> Pin Detail </span>} style={{ marginTop: "0" }}>
				
					<Row style={{marginBottom:'0.625rem'}}>
						<Col span={8}>
								<span style={{color:'#666', fontWeight:'700'}}>Titles</span>
						</Col>
						<Col span={16}>
							{detail && detail.title}
						</Col>
					</Row> 
					<Row style={{marginBottom:'0.625rem'}} >
						<Col span={8}>
								<span  style={{color:'#666', fontWeight:'700'}} >Category</span>
						</Col>
						<Col span={16}>
						{detail && detail.categories || '-'}
						</Col>
					</Row> 

					<Row style={{marginBottom:'0.625rem'}} >
						<Col span={8}>
								<span  style={{color:'#666', fontWeight:'700'}} >Pin Discount Unit</span>
						</Col>
						<Col span={16}>
						{detail && detail.discount_unit || '-'}
						</Col>
					</Row> 

{/* 
					<Row style={{marginBottom:'0.625rem'}} >
						<Col span={8}>
								<span  style={{color:'#666', fontWeight:'700'}} >Pin Min Transaction Value</span>
						</Col>
						<Col span={16}>
						{detail && detail.min_transaction_value || '-'}
						</Col>
					</Row> 

					<Row style={{marginBottom:'0.625rem'}} >
						<Col span={8}>
								<span  style={{color:'#666', fontWeight:'700'}} >Pin Discount</span>
						</Col>
						<Col span={16}>
						{detail && detail.discount_amount || '-'}
						</Col>
					</Row> 

					<Row style={{marginBottom:'0.625rem'}} >
						<Col span={8}>
								<span  style={{color:'#666', fontWeight:'700'}} >Pin Max Discount Value</span>
						</Col>
						<Col span={16}>
						{detail && detail.max_discount_value || '-'}
						</Col>
					</Row>  */}
					
					<Row style={{marginBottom:'0.625rem'}}>
						<Col span={8}>
								<span  style={{color:'#666', fontWeight:'700'}} >Status</span>
						</Col>
						<Col span={16}>
						{ detail && (detail.is_published?<span style={{color : "green"}}>Publish</span>:<span style={{color : "red"}}>UnPublish</span>) || '-'  }
						</Col>
					</Row>
					{/* <Row style={{marginBottom:'0.625rem'}}>
						<Col span={8}>
								<span  style={{color:'#666', fontWeight:'700'}} >Description</span>
						</Col>
						<Col span={16}>
						{(detail && detail.description) || '-'}
						</Col>
					</Row> */}
				</Card>
				<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
				<Table columns={columns} dataSource={product }
					// loading={props.loading.global}
					// onChange={this.paginationFun}
					rowKey={record => record._id}
					
					
				/>
			</Card>
				</>

			:

			<Card title={<span><LeftOutlined onClick={() => props.history.push('/pins')} /> Pin Detail </span>} style={{ marginTop: "0" }}>
				
			<Row style={{marginBottom:'0.625rem'}}>
				<Col span={8}>
						<span style={{color:'#666', fontWeight:'700'}}>Title</span>
				</Col>
				<Col span={16}>
					{detail && detail.title}
				</Col>
			</Row> 
			<Row style={{marginBottom:'0.625rem'}} >
				<Col span={8}>
						<span  style={{color:'#666', fontWeight:'700'}} >Category</span>
				</Col>
				<Col span={16}>
				{detail && detail.categories || '-'}
				</Col>
			</Row> 

			<Row style={{marginBottom:'0.625rem'}} >
						<Col span={8}>
								<span  style={{color:'#666', fontWeight:'700'}} >Pin Discount</span>
						</Col>
						<Col span={16}>
						{detail && detail.discount_amount || '-'}%
						</Col>
					</Row> 

			
			<Row style={{marginBottom:'0.625rem'}}>
				<Col span={8}>
						<span  style={{color:'#666', fontWeight:'700'}} >Status</span>
				</Col>
				<Col span={16}>
				{ detail && (detail.is_published?<span style={{color : "green"}}>Publish</span>:<span style={{color : "red"}}>UnPublish</span>) || '-'  }
				</Col>
			</Row>
			<Row style={{marginBottom:'0.625rem'}}>
				<Col span={8}>
						<span  style={{color:'#666', fontWeight:'700'}} >Description</span>
				</Col>
				<Col span={16}>
				{(detail && detail.description) || '-'}
				</Col>
			</Row>
		</Card>
		}






		</>
	)
};

export default connect(({ pins }) => ({
	pins,
}))(PinsView);