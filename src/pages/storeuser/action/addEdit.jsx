import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Row, Col, Empty, Modal, Card, Typography, Alert, Form, Input, Checkbox, Button, Space, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker, Avatar, message, InputNumber } from 'antd';
import { LeftOutlined, LoadingOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone, LockOutlined ,MobileOutlined } from '@ant-design/icons';
import CropImage from '../../../components/sharing/crop-image'
import TextEditor from '../../../components/sharing/text-editor'
import moment from 'moment';
import { connect } from 'dva';
import MultiImageInput from 'react-multiple-image-input';
const dateFormat = 'MM/DD/YYYY';
const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };
const AddEditStoreUser = props => {
	const [form] = Form.useForm();
	let idAdd = props.match.params.id === undefined ? true : false
	const { dispatch } = props;
	const [gallaryImagesList, setGallaryImagesList] = useState([]);
	const [count, setCount] = useState(0)
	const [ecount, setECount] = useState(0)
	const [btnDis, setBtnDis] = useState(false)
	const [galleryImageUriList,setGalleryImageUriList] = useState({});
	const [showPassword, setShowPassword] = useState(false);

	const handelPassword = () => {
	  setShowPassword(!showPassword);
	};
	let roleList = []
	
    if(props?.roles?.list?.data?.length > 0){
		roleList  =  props?.roles?.list?.data
	}
	


	useEffect(() => {
		
		let unmounted = false;
		window.scroll(0, 0);

		if (props.match.params.id) {
			DetailFun(props.match.params.id)
		} else {
			form.resetFields();
		}
		return () => { unmounted = true; }
	}, [dispatch])

	useEffect(() => {
        let unmounted = false;

		return () => { unmounted = true; }
	}, [props.users])

	const DetailFun = (id) => {
			props.dispatch({type: 'users/getDetail', payload: { _id: id, profile_id: id }});
	}



	const onFinish = val => {
		


		
		if (props.match.params.id) {
			val._id = props.match.params.id
			dispatch({ type: 'users/addStoreUser', payload: val });
		}
		else {
			dispatch({ type: 'users/editStoreUser', payload: val });
		}
	}

	useEffect(() => {	
		let unmounted = false;
		let add = props.users.add
		if (!unmounted && add.count > count && add && add.status) {
            props.dispatch({ type: 'users/clearAction'});
			setBtnDis(false);	
			cancelFun();
			props.history.push('/store-users');
		} else if (!unmounted && add.count > count && add && !add.status) {
			setBtnDis(false);
			setCount(add.count);
		}

	// Edit
		let edit = props.users.edit 
		if (!unmounted && edit.count > ecount && edit.status) {
            props.dispatch({ type: 'users/clearAction'});
			setECount(edit.count);
			setBtnDis(false);
			
			cancelFun();
			props.history.push('/store-users');
		} else if (!unmounted && edit.count > ecount && !edit.status) {
			setBtnDis(false);
			setECount(edit.count);
		}

		// detail
		if (props.match.params.id) {
			let detail = props.users.detail;
	
			if (!unmounted && detail && detail.status) {
				let data = detail.userLogin;
				form.setFieldsValue({
				 ['username']: data.username, ['email']: data.email, ['mobile_number']: data.mobile_number
				});



	

			} else if (!unmounted && detail && !detail.status) {
				setBtnDis(false);
			}
		}
		return () => { unmounted = true; }
	


	}, [props.users])

	const cancelFun = () => {
		form.resetFields();	
		props.history.push('/store-users');
	}






	
	


	  


	return (
		<Card title={<span><LeftOutlined onClick={() => props.history.push('/store-users')} /> {idAdd ? 'Add' : 'Edit'}</span>} style={{ marginTop: "0" }}>

			<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
				<Row gutter={15}>
			


					<Col flex="auto">
						<Row gutter={15}>
							<Col sm={12} md={12}>
								<Form.Item name="username" label="Name" rules={[{ required: true, message: 'This field is required!' },{ max: 25, message: 'Name must not be greater than 25 characters.' }]}  >
									<Input placeholder="Name" />
								</Form.Item>
							</Col>

							<Col sm={12} md={12}>
							<Form.Item name="email" label="Email" rules={[
							{ 
								required: true, 
								message: 'Please input your Email!'
							},
							{
								type: 'email',
								message: 'The input is not valid E-mail!',
							}, 
						]} >
						{idAdd ? 
							<Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
						:
						<Input disabled prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
						}
					  </Form.Item>
							</Col>
                           
						</Row>
					</Col>
			
				</Row>
				<Row gutter={15}>
				<Col flex="auto">
						<Row gutter={15}>
							<Col sm={12} md={12}>
							<Form.Item name="mobile_number" label="Mobile Number" rules={[ 
						 	{
							required: true,
								message: 'Please input your Mobile Number!', 
							},
							{
								pattern: /^[0-9]+$/,
								message: 'Need to enter number'
							},
							{ 
								len: 10, 
								message: 'Mobile number should be 10 digits long.' 
							},
						]} >

						{idAdd ? 	<Input type="tel"    prefix={<MobileOutlined className="site-form-item-icon" />} placeholder="Mobile Number" />
						:
						<Input type="tel" disabled   prefix={<MobileOutlined className="site-form-item-icon" />} placeholder="Mobile Number" />}
					
					  </Form.Item>
							</Col>

							{idAdd && 			<Col sm={12} md={12}>
							<Form.Item
                name="password"
				label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                  {
                    pattern:
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    message:
                      "Minimum eight characters, at least one letter, one number and one special character:",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  suffix={
                    showPassword ? (
                      <EyeTwoTone onClick={handelPassword} />
                    ) : (
                      <EyeInvisibleOutlined onClick={handelPassword} />
                    )
                  }
                />
              </Form.Item>
							</Col>}

				
                           
						</Row>
					</Col>
				</Row>

				<Row gutter={15}>
				<Col flex="auto">
						<Row gutter={15}>
					

	
                           
						</Row>
					</Col>
				</Row>
				<Form.Item className="mb-0">
					<Button onClick={cancelFun}>Cancel</Button>&nbsp;&nbsp;
				<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light" onClick={() => form.submit()}>Save</Button>
				</Form.Item>
			</Form>
		</Card>
	)
};

export default connect(({users ,global ,roles }) => ({
	users:users,
	global: global ,
	roles : roles

}))(AddEditStoreUser);