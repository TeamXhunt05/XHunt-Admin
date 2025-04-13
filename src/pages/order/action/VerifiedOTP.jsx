import React, { useState,useEffect,useRef, Fragment} from 'react';
import {Empty, Modal,Form,Input,Button,Switch, Dropdown, Menu, Select, notification, Transfer, DatePicker } from 'antd';

import { connect } from 'dva';

const formItemLayout = { labelCol: {xs: { span: 24, },  sm: { span: 24, },}};

const VerifiedOTP =props => {
	console.log("🚀 ~ file: VerifiedOTP.jsx:9 ~ VerifiedOTP ~ props:", props)
	const [form] = Form.useForm();
	const { dispatch} = props;
	const [catlist, setCatlist] = useState([])
	const [count, setCount] = useState(0)
	const [dcount, setDCount] = useState(0)
	const [btnDis, setBtnDis] = useState(false)
	 
	useEffect(() => {
		let unmounted = false;
		return () => {unmounted = true;}
    },[dispatch ,props.visible])
	
	const onFinish= async val => {	
		setBtnDis(true);

		let data = {
			order_id : props.order_id,
			otp : val.otp
		}

		
			let result = await dispatch({ type: 'orders/verify', payload: data });
			setBtnDis(false);
			if (result.status) {
			
				form.resetFields();
				props.closeModel()
				props.returnData('success');

				}
		
		
	}
	



	
	const cancelFun = ()=>{
		if(!props.detail)
			form.resetFields();
		props.closeModel()
	}

	
return (
	<Modal visible={props.visible} title={'Verify OTP'} onCancel={cancelFun} footer={<Fragment>
				<Button onClick={cancelFun}>Cancel</Button>
				<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light" onClick={()=>form.submit()}>{'Verify OTP'}</Button>
			</Fragment>} >
		<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
			<Form.Item name="otp"  rules={[{ required: true, message: 'This field is required!' }]} >
				<Input placeholder="Enter OTP " />
			</Form.Item>

		</Form>
		
	</Modal>
)};

export default connect(({ orders, global, loading }) => ({
  orders:orders,
  global: global,
  loading: loading 
}))(VerifiedOTP);