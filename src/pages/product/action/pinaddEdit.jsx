import React, { useState,useEffect,useRef, Fragment} from 'react';
import {Empty, Modal,Form,Input,Button,Switch, Dropdown, Menu, Select, notification, Transfer, DatePicker } from 'antd';

import { connect } from 'dva';

const formItemLayout = { labelCol: {xs: { span: 24, },  sm: { span: 24, },}};

const AddEdit =props => {
	const [form] = Form.useForm();
	const { dispatch} = props;
	const [catlist, setCatlist] = useState([])
	const [count, setCount] = useState(0)
	const [dcount, setDCount] = useState(0)
	const [btnDis, setBtnDis] = useState(false)
	 
	useEffect(() => {
		let unmounted = false;
		return () => {unmounted = true;}
    },[dispatch])
	
	
	useEffect(() => {
		let unmounted = false;

		let data = props.detail;		
		if(props.detail){
			form.setFieldsValue({
			  ['title']: data.title, 
			  ['is_published']: data.is_published, 

			  
			});}
		else{ form.resetFields(); }
		
		return () => {unmounted = true;}
    },[props.visible])
	
	useEffect(() => {
		let unmounted = false;
		let {products} = props;
		setCatlist(products.list ? products.list.data:[]);
		return () => {unmounted = true;}
    },[props.products.list])
	
	const onFinish= async val => {	
		
		setBtnDis(true);
		if(props.detail){

			val._id = props.detail._id
			val.productPin = true
			let result = {}

if(props.user_id){
	
	val.user_id = props.user_id
	val.categories = 'FLAT_DISCOUNT_PIN'
	result = await dispatch({ type: 'pins/editAdmin', payload: val });

}else{
	result = await dispatch({ type: 'pins/edit', payload: val });

}

			



			

			setBtnDis(false);
			if (result.status) {
			
				form.resetFields();
				props.closeModel()
				props.returnData('success');

				}
		}
		
	}
	

	
	const cancelFun = ()=>{
		if(!props.detail)
			form.resetFields();
		props.closeModel()
	}

	
return (
	<Modal visible={props.visible} title={props.detail?'Edit Pin':'Add Pin'} onCancel={cancelFun} footer={<Fragment>
				<Button onClick={cancelFun}>Cancel</Button>
				<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light" onClick={()=>form.submit()}>{props.detail?'Edit Pin':'Add Pin'}</Button>
			</Fragment>} >
		<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
			<Form.Item name="title"  rules={[{ required: true, message: 'This field is required!' },{ max: 15, message: 'Pin must not be greater than 15 characters.' }]} >
				<Input placeholder="Enter Pin " />
			</Form.Item>

			<Form.Item name="is_published"  valuePropName='checked'  >
    <Switch checkedChildren="Publish"  unCheckedChildren="UnPublish" />

  </Form.Item>
		</Form>
		
	</Modal>
)};

export default connect(({ products, global, loading }) => ({
  products:products,
  global: global,
  loading: loading 
}))(AddEdit);