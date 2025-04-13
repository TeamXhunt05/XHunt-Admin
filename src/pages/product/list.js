import React from 'react';
import AddEdit from './action/pinaddEdit';

import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import { Card, Typography, Input, Button, Table, Row, Col, Popconfirm ,Avatar} from 'antd';
import { DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';




// import AddEdit from './action/addEdit'
const { Search } = Input;
const { Text } = Typography;
const baseUrl = process.env.REACT_APP_ApiUrl;

 
class ProductList extends React.Component {
	constructor(props) {
		super(props);
		this.state = { limit: 10, current: 0, sortBy: 'asc', searchText: '',addModel: false, loader: false, count: 0, listData: [] , isAdmin : false , pin_detail : {}  }
		setTimeout(() => document.title = 'Store List', 100);
	}

	componentDidMount() {
		this.ListFun();
		
		if(localStorage.getItem('role') === "ADMIN"){
			this.setState({isAdmin : true})
		}
	}

	ListFun = () => {

		


		



		let searchData = { limit: this.state.limit, page: this.state.current, sortBy: this.state.sortBy  }
		if(this.props.match.params.user_id){
			searchData.user_id =  this.props.match.params.user_id
		}
		this.props.dispatch({ type: 'products/listData', payload: searchData });
	}

	ShowSizeChange = (current, size) => {
		this.setState({ limit: size, current: current - 1 }, () => this.ListFun())
	};
	  
	updatePin = (val) => {
		console.log(val)
		if (val) { this.ListFun() }
		this.setState({ pin_detail: {}, addModel: false })
  }

	// paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

	searchVal = (val) => {
		this.state.searchText = val;
		const resultAutos = this.props.products.list.filter((auto) =>
			JSON.stringify(auto).toLowerCase().includes(val.toLowerCase())
		)
		this.setState({ listData: resultAutos })
	}


	deleteItem = (_id) => {
		let val = { _id }
		this.props.dispatch({ type: 'products/delete', payload: val });
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
		await axios.post(`${baseUrl}/api/product/status`, {id: data});
	}


	render() {
		const { location } = this.props;
		let user_id = this?.props?.match?.params?.user_id
		console.log("🚀 ~ file: list.js:100 ~ ProductList ~ render ~ user_id:", user_id)
		const pathSnippets = location.pathname.split('/').filter(i => i);
		let url = pathSnippets[0].toUpperCase();

		const { searchText ,isAdmin } = this.state;
		const { products } = this.props;
		const count = products?.count;


		if (this.state.searchText == '') {
			this.state.listData = products ? products.list : [];
		}

		 this.state.pin_detail = products?.pin_detail
		 console.log("🚀 ~ file: list.js:92 ~ ProductList ~ render ~ products?.pin_detail:", products?.pin_detail)


		


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
			{ title: <strong>Product Unit</strong>, dataIndex: 'item_unit' , render:(val,data)=> {
				// `${data.price}/${val}`
				return  (
				<>
				<div>{data.price}₹/<strong>{val}</strong></div>
				</>)
			} },

			{ title:<strong> Status </strong>, dataIndex: 'is_published', render:(val,data)=> 

			<div>
		  
			   <Popconfirm title={`Are you sure you want to ${data.is_published ? "UnPublish" : "Publish"} this product?`} onConfirm={e=> {this.handleDeactiveUser(data._id)}} okText="Yes" cancelText="No" >
				   <Button type="default" className={data.is_published ? "bg-success" : "bg-danger"}> {data.is_published && data.is_published  ? `Published` : `UnPublished`}  </Button>
			   </Popconfirm>
			</div>
	   },

			{
				title: <strong>Action</strong>, width: 150, // align:'center',	
				render: (val, data) =>
					<div>

						{/* <Button className="eye_btn" type="default" onClick={() => {
							this.props.history.push('/product/view/' + data._id)
						}}><EyeOutlined /></Button>&nbsp; */}

						
							<>
								<Button className="edit_btn" type="default" onClick={() => {
									sessionStorage.setItem("productsData", JSON.stringify(data));

									if(isAdmin){
										 this.props.history.push(`/product/edit/${data._id}/${user_id}`)
	
									}else{
										this.props.history.push('/product/edit/' + data._id)
	
									}
					
									
								}}><EditOutlined /></Button>&nbsp;
							</>
						

						
							<>
								<Popconfirm title="Are you sure delete this product?" onConfirm={e => { this.deleteItem(data._id) }} okText="Yes" cancelText="No" >
									<Button type="danger" className="mt-2"><DeleteOutlined /></Button>
								</Popconfirm>
							</>
						




					</div>
			},
		];

		return (
			<div>

				{this.state.pin_detail && 
				 <Card className="mb-3" title={<div class="d-flex justify-content-between">
				 <span> LAST MINUTES PIN </span>
				 {
				 <span> <Button type="primary" onClick={() => this.setState({ addModel: true})}>Edit Pin</Button></span>
				 }
				 
				 </div>} 
				 style={{ marginTop: "0rem" }}>
				 
				 <>
				 <Row style={{marginBottom:'0.625rem'}}>
				 <Col span={8}>
						<span style={{color:'#666', fontWeight:'700'}}>Title</span>
				 </Col>
				 <Col span={16}>
				{ this.state.pin_detail && this.state.pin_detail?.title}
				 </Col>
				 </Row> 
				 
				 <Row style={{marginBottom:'0.625rem'}}>
				 <Col span={8}>
						<span  style={{color:'#666', fontWeight:'700'}} >Status</span>
				 </Col>
				 <Col span={16}>
				 {  this.state.pin_detail && ( this.state.pin_detail.is_published ?<span style={{color : "green"}}>Publish</span>:<span style={{color : "red"}}>UnPublish</span>) || '-'  }
				 </Col>
				 </Row>
				 </>
				 </Card>
				
				 }


				<Row className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">



					<Col>
					 <Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText}
							loading={this.props.submitting} />						
					</Col>
					<Col>
				
							<>

							{this.state.listData.length === 0 && !this.state.pin_detail ? 
							
							 <Button type="primary" onClick={() =>{
								// this.props.history.push(`/product/admin/add/${data._id}/LAST_MINUTE_PIN`)

								if(isAdmin){
									console.log('admin')
			                         this.props.history.push(`/product/add/${user_id}?redirect=lastMinute`)

								}else{
									this.props.history.push('/product/add?redirect=lastMinute')

								}


							 }}>Add Last Minute Pin</Button>  :
							 <Button type="primary" onClick={() => {

								if(isAdmin){
									this.props.history.push(`/product/add/${user_id}?redirect=lastMinute`)


								}else{
									this.props.history.push('/product/add?redirect=lastMinute')

								}

							 }}>Add Last Minute Product</Button> }
							
								
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
							
							pagination={ {
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

				<AddEdit visible={this.state.addModel} returnData={this.updatePin} closeModel={() => this.setState({ addModel: false,  pin_detail: {} })} detail={ this.state.pin_detail} user_id={this.props.match.params.user_id} />
			</div>
		);
	}
};

export default connect(({ products, loading }) => ({
	products, loading
}))(ProductList);