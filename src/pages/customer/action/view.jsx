import React, { useState,useEffect,useRef, Fragment} from 'react';
import {Row, Col, Empty, Modal, Card, Typography, Alert,Form,Input, Checkbox,Button,Switch, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker, Avatar, message, Descriptions } from 'antd';
import { LeftOutlined, LoadingOutlined, EditOutlined, CloseOutlined} from '@ant-design/icons';

import moment from 'moment';
import { connect } from 'dva';

const dateFormat = 'YYYY/MM/DD';

const ViewCustomer =props => {
	const [form] = Form.useForm();
	const { dispatch, category } = props;
	const [detail, setDetail] = useState({});

	
	useEffect(() => {
		let unmounted = false;
		window.scroll(0, 0);
		if(props.match && props.match.params.id)
		{
			DetailFun(props.match.params.id)
		}else {
			form.resetFields();
		}
		return () => { unmounted = true; }
    },[dispatch])
	
	
	const DetailFun=(id)=>{
		props.dispatch({type: 'users/getDetail', payload: { _id: id, profile_id: id }});
	}

	
	useEffect(() => {
		let unmounted = false;
		// Edit
		

		
		
		// detail
		if(props.match && props.match.params.id)
		{
			
			let detail = props.users.detail;
			console.log("detail : ", detail);
			if(!unmounted &&  detail && detail.status){
		
			  let data = detail.profile;
				setDetail({
					...data,
					username: data.username,
					email: data.email,
					mobile_number: data.mobile_number,
					isEmailVerified: data.isEmailVerified,
					isMobileVerified: data.isMobileVerified,
					roles: data.roles,
				})
	
			}else if(!unmounted && detail && !detail.status){
			
			}
		}
		return () => {unmounted = true;	}

    },[props.users])
	
	const cancelFun = ()=>{
		form.resetFields();
		props.history.push('/customers');
	}


	
return (

<> 
	<Card title={<span><LeftOutlined onClick={()=> props.history.push('/customers')}/> User Details</span>} style={{marginTop:"0"}}>
	<Avatar shape="round" size={160} src={detail.avatar} style={{marginBottom: '2px'}} />
		<Descriptions size={'middle'} bordered>					
          <Descriptions.Item label="Name">{detail.username}</Descriptions.Item>
		  <Descriptions.Item label="Email">{detail.email}</Descriptions.Item>
		  <Descriptions.Item label="Role">{detail.roles}</Descriptions.Item>
          <Descriptions.Item label="Profile Created On">{moment(detail.create).format(dateFormat)}</Descriptions.Item>{console.log('detail.rolesdetail.roles',detail)}
		  <Descriptions.Item label="Mobile No">{detail.mobile_number}</Descriptions.Item>


		  
        </Descriptions>
	</Card>

	</>
)}; 

export default connect(({ users, global, loading }) => ({
  users:users,
  global: global
}))(ViewCustomer);