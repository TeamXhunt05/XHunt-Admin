

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { Row, Col, Card, Select, Form, Input, Button, message, Switch, TimePicker, InputNumber } from 'antd';
// import { LeftOutlined, MailOutlined, UserOutlined, MobileOutlined, SendOutlined } from '@ant-design/icons';
// import { connect } from 'dva';
// import MultiImageInput from 'react-multiple-image-input';
// import { antdIsValidString, convertToFormData, dataURLtoFile, getUploadsImages, isEmpty } from '../../../utils/functions';
// import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
// import { API_URL_SERN, MAP_API_KEY } from '../../../utils/constants';
// import Geocode from "react-geocode";
// import moment from 'moment'
// import './style.css'
// import ToggleDays from './ToggleDays'
// import Apploader from '../../../components/loader/loader'
// import io from 'socket.io-client';

// const socket = io(process.env.REACT_APP_ApiUrl);



// const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };

// const { Option } = Select;
// const { TextArea } = Input;
// const { RangePicker } = TimePicker;







// const PinAddEdit = props => {
// 	const PIN_CATEGORY_TYPES =  props.match.params.category
// 	const [form] = Form.useForm();
// 	let idAdd = props.match.params.id === undefined ? true : false
// 	const { dispatch } = props;
// 	const [galleryImagesList, setGalleryImagesList] = useState([]);
// 	const [btnDisabled, setBtnDisabled] = useState(false)
// 	const [galleryImageUriList, setGalleryImageUriList] = useState({});
// 	const [autocomplete, setAutocomplete] = useState();
// 	const [latLng, setLatLng] = useState({
// 		lat: 26.896593,
// 		lng: 75.770676
// 	});
// 	const [days, setDays] = useState([1, 2, 3, 4, 5, 6]);



// 	const pin_list = [{ key: 0, value: 'CATALOG_PIN' }, { key: 1, value: 'INFO_PIN' }, { key: 2, value: 'DEAL_PIN' }]
// 	const pinOfferList = [{ key: 0, value: 'LAST_MINUTE_OFFER' }, { key: 1, value: 'HOT_DEAL_OFFER' }, { key: 2, value: 'MYSTERY_OFFER' }, { key: 3, value: 'IN_STORE_OFFER' }, ]
// 	const discountList = [{ key: 0, value: 'AMOUNT' }, { key: 1, value: 'PERCENT' }, 
// 	// { key: 2, value: 'UNIT' }
// ]







// useEffect(() => {
// 	   socket.on('show_pins', (show_pins) => {
// 		console.log("🚀 ~ addEdit", show_pins)
// 		// setTodos(todos);
// 	  });
// } , [])



// 	useEffect(() => {
	

// 		if (idAdd) {

// 		} else {
// 			let pins = JSON.parse(sessionStorage.getItem("pinsData"));



			
		


// 			for (let i in pins) {
// 				form.setFieldsValue({
// 					[i]: pins[i],
// 				})
// 			}


// 		}
// 	}, [])

// 	useEffect(() => {
// 		let unmounted = false;
// 		console.log('props',props)
// 		return () => {
// 		  unmounted = true;
// 		}
// 	  }, [dispatch])

// 	const onFinish = async (val) => {
	
		
// 			val.categories = PIN_CATEGORY_TYPES
		

	


// 		let result;
// 		if (props.match.params.id) {

// 			val._id = props.match.params.id
// 			result = await dispatch({ type: 'pins/edit', payload: val });
// 		}
// 		else {

// 			result = await dispatch({ type: 'pins/add', payload: val });
// 		}


// 		if (result.status) {
// 			props.history.push('/pins');
// 		}
// 		// setTimeout(() => {
// 		// }, 500)
// 	}

// 	const cancelFun = () => {
// 		form.resetFields();
// 		props.history.push('/pins');
// 	}










// 	return (

// 		<>
	
// 			<Apploader show={props.loading.global} />
// 			<Card title={<span><LeftOutlined onClick={() => props.history.push('/pins')} /> {idAdd ? 'Add pins' : 'Edit pins'}</span>} style={{ marginTop: "0" }}>
// 				<Form {...formItemLayout} form={form} name="picture" layout="vertical" onFinish={onFinish} className="innerFields">

// {PIN_CATEGORY_TYPES === "LAST_MINUTE_PIN" && <>
// <Row gutter={15}>


// <Col sm={12} md={12}>
// 	<Form.Item name="title" label="Title" rules={antdIsValidString("Title" , 20)}  >
// 		<Input  placeholder="Title" />
// 	</Form.Item>
// </Col>


// <Col sm={12} md={12}>
// 	<Form.Item name="discount_unit" label="Pin Discount Unit" rules={[{ required: true, message: 'This field is required!' }]}  >
// <Select placeholder="Select Discount Unit" >
// {discountList && discountList.map((item,  index) => <Select.Option key={index} value={item.value}>{item.value}</Select.Option>)}
// </Select>
// </Form.Item>
// </Col>

// </Row>

// <Row gutter={15}>




// </Row>



// <Row gutter={15}>
// <Col sm={12} md={12}>

// 	<Form.Item name="min_transaction_value" label="Pin Min Transaction Value"
// rules={[{ required: true, message: 'This field is required.' } ,
// ({ getFieldValue }) => ({
// validator(rule, value) {
// if (!value) {
// return Promise.reject('');
// }
// if (value > 999999) {
// return Promise.reject('Pin Min Transaction Value can not be greater than 999999');
// }
// return Promise.resolve();

// },
// }),

// ]}

// >
// <InputNumber type={'number'} placeholder="Pin Min Transaction Value"



// />
// </Form.Item>
// </Col>


// <Col sm={12} md={12}>
// 	<Form.Item name="discount_amount" label="Pin Discount"
// 			rules={[{ required: true, message: 'This field is required.' },
// 			({ getFieldValue }) => ({
// 			  validator(rule, value) {
// 				if (!value) {
// 				  return Promise.reject('');
// 				}
	 
// 				if(getFieldValue('discount_unit') === "PERCENT"){
// 				 if (value > 100) {
// 					 return Promise.reject('Pin Discount Value can not be greater than 99%');
// 				   }
// 				}
	 
	 
				
// 				if(value && getFieldValue('discount_unit') === "AMOUNT"){
				 
// 				 if (value && getFieldValue('min_transaction_value') < value) {
// 					 if (getFieldValue('min_transaction_value') < value) {
// 						return Promise.reject('Pin Discount Value can not be Pin Min Transaction Value');
// 					 }
// 					 return Promise.resolve();
// 				   }
// 				}
	 
	 
	 
// 				return Promise.resolve();
				
// 			  },
// 			}),
// 			]}
// 	   >
// 		<InputNumber  placeholder="Pin Discount" />
// 	</Form.Item>
// </Col>

// </Row>

// <Row gutter={15}>
// <Col sm={12} md={12}>
// 	<Form.Item name="max_discount_value" label="Pin Max Discount Value"

// //validateStatus={error ? "error":''}
// rules={[{ required: true, message: 'This field is required.' },
// ({ getFieldValue }) => ({
// validator(rule, value) {
// if (!value) {
// return Promise.reject('');
// }

// if(getFieldValue('discount_unit') === "PERCENT"){
// if (getFieldValue('min_transaction_value') < value) {
// return Promise.reject('Pin Max Discount Value can not be Pin Min Transaction Value');
// }
// }



// if(value && getFieldValue('discount_unit') === "AMOUNT"){

// if (value && getFieldValue('discount_amount') < value) {
// if (getFieldValue('discount_amount') < value) {
// return Promise.reject('Pin Max Discount Value can not be Pin Discount');
// }
// return Promise.resolve();
// }
// }


// return Promise.resolve();
// //    setConfirm(false)

// },
// }),
// ]}
// >
// <InputNumber type={'number'} placeholder="Pin Max Discount Value"



// />
// </Form.Item>
// </Col>
// {/* <Col sm={12} md={12}>
// 	<Form.Item name="title" label="Title" rules={antdIsValidString("Title")}  >
// 		<Input  placeholder="Title" />
// 	</Form.Item>
// </Col> */}

// </Row>


// <Row gutter={15}>
// <Col sm={24} md={24}>
// 	<Form.Item name="description" label="Description" rules={antdIsValidString("Description", 2000)}   >
// 		<TextArea rows={4} placeholder="Description" />
// 	</Form.Item>
// </Col>
// </Row></>}

// {PIN_CATEGORY_TYPES === "FLAT_DISCOUNT_PIN" && <>
// <Row gutter={15}>


// <Col sm={24} md={24}>
// 	<Form.Item name="title" label="Title" rules={antdIsValidString("Title")}  >
// 		<Input  placeholder="Title" />
// 	</Form.Item>
// </Col>




// <Col sm={24} md={24}>
// 	<Form.Item name="description" label="Description" rules={antdIsValidString("Description", 2000)}   >
// 		<TextArea rows={4} placeholder="Description" />
// 	</Form.Item>
// </Col>
// </Row></>}






// 					<Form.Item className="mb-0">
// 						<Button onClick={cancelFun}>Cancel</Button>&nbsp;&nbsp;
// 						<Button type="primary" disabled={btnDisabled} className="btn-w25 btn-primary-light" onClick={() => form.submit()}>Save</Button>
// 					</Form.Item>
// 				</Form>
// 			</Card>
// 		</>

// 	)
// };

// export default connect(({ pins, loading }) => ({
// 	pins, loading
// }))(PinAddEdit);


//18 APRIL 2023



import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Card, Select, Form, Input, Button, message, Switch, TimePicker, InputNumber } from 'antd';
import { LeftOutlined, MailOutlined, UserOutlined, MobileOutlined, SendOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import MultiImageInput from 'react-multiple-image-input';
import { antdIsValidString, convertToFormData, dataURLtoFile, getUploadsImages, isEmpty } from '../../../utils/functions';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { API_URL_SERN, MAP_API_KEY } from '../../../utils/constants';
import Geocode from "react-geocode";
import moment from 'moment'
import './style.css'
import ToggleDays from './ToggleDays'
import Apploader from '../../../components/loader/loader'
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_ApiUrl);



const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = TimePicker;







const PinAddEdit = props => {
	console.log("🚀 ~ file: addEdit.jsx:394 ~ PinAddEdit ~ props:", props)
	const PIN_CATEGORY_TYPES =  props.match.params.category
	const isDashbord =  props.location.search === "?redirect=dashboard" ? true : false

	const [form] = Form.useForm();
	let idAdd = props.match.params.id === undefined ? true : false
	const { dispatch } = props;
	const [galleryImagesList, setGalleryImagesList] = useState([]);
	const [btnDisabled, setBtnDisabled] = useState(false)
	const [galleryImageUriList, setGalleryImageUriList] = useState({});
	const [autocomplete, setAutocomplete] = useState();
	const [latLng, setLatLng] = useState({
		lat: 26.896593,
		lng: 75.770676
	});
	const [days, setDays] = useState([1, 2, 3, 4, 5, 6]);



	const pin_list = [{ key: 0, value: 'CATALOG_PIN' }, { key: 1, value: 'INFO_PIN' }, { key: 2, value: 'DEAL_PIN' }]
	const pinOfferList = [{ key: 0, value: 'LAST_MINUTE_OFFER' }, { key: 1, value: 'HOT_DEAL_OFFER' }, { key: 2, value: 'MYSTERY_OFFER' }, { key: 3, value: 'IN_STORE_OFFER' }, ]
	const discountList = [{ key: 0, value: 'AMOUNT' }, { key: 1, value: 'PERCENT' }, 
	// { key: 2, value: 'UNIT' }
]







useEffect(() => {
	   socket.on('show_pins', (show_pins) => {
		console.log("🚀 ~ addEdit", show_pins)
		// setTodos(todos);
	  });
} , [])



	useEffect(() => {
	

		if (idAdd) {

		} else {
			let pins = JSON.parse(sessionStorage.getItem("pinsData"));



			
		


			for (let i in pins) {
				form.setFieldsValue({
					[i]: pins[i],
				})
			}


		}
	}, [])

	useEffect(() => {
		let unmounted = false;
		console.log('props',props)
		return () => {
		  unmounted = true;
		}
	  }, [dispatch])

	const onFinish = async (val) => {
	
		
			val.categories = PIN_CATEGORY_TYPES
		

	


		let result;
		if (props.match.params.id) {

			val._id = props.match.params.id
			result = await dispatch({ type: 'pins/edit', payload: val });
		}
		else {

			result = await dispatch({ type: 'pins/add', payload: val });
		}


		if (result.status) {
			if(isDashbord){
				props.history.push('/');
			}else{
				props.history.push('/pins');
			}
		
		}
		// setTimeout(() => {
		// }, 500)
	}

	const cancelFun = () => {
		form.resetFields();
		if(isDashbord){
			props.history.push('/');
		}else{
			props.history.push('/pins');
		}
	}










	return (

		<>
	
			<Apploader show={props.loading.global} />
			<Card title={<span><LeftOutlined onClick={() => {if(isDashbord){
			props.history.push('/');
		}else{
			props.history.push('/pins');
		}}} /> {idAdd ? 'Add pins' : 'Edit pins'}</span>} style={{ marginTop: "0" }}>
				<Form {...formItemLayout} form={form} name="picture" layout="vertical" onFinish={onFinish} className="innerFields">

{PIN_CATEGORY_TYPES === "LAST_MINUTE_PIN" && <>
<Row gutter={15}>


<Col sm={24} md={24}>
	<Form.Item name="title" label="Title" rules={antdIsValidString("Title" , 15)}  >
		<Input  placeholder="Title" />
	</Form.Item>
</Col>

</Row>
<Row gutter={15}>
<Col sm={24} md={24}>
	<Form.Item name="description" label="Description" rules={antdIsValidString("Description", 2000)}   >
		<TextArea rows={4} placeholder="Description" />
	</Form.Item>
</Col>
</Row></>}

{PIN_CATEGORY_TYPES === "FLAT_DISCOUNT_PIN" && <>
<Row gutter={15}>


<Col sm={24} md={24}>
	<Form.Item name="title" label="Title" rules={antdIsValidString("Title" ,20)}  >
		<Input  placeholder="Title" /> 
	</Form.Item>
</Col>


 <Col sm={24} md={24}>
 	<Form.Item name="discount_amount" label="Pin Discount(%)"
 			rules={[{ required: true, message: 'This field is required.' },
 			({ getFieldValue }) => ({
 			  validator(rule, value) {
 				if (!value) {
 				  return Promise.reject('');
 				}
	 
 				if(getFieldValue('discount_unit') === "PERCENT"){
 				 if (value > 99) {
 					 return Promise.reject('Pin Discount Value can not be greater than 99%');
 				   }
 				}
	 
	 
				
 	
	 
	 
	 
 				return Promise.resolve();
				
 			  },
 			}),
 			]}
 	   >
 		<InputNumber  placeholder="Pin Discount" />
 	</Form.Item>
 </Col>


<Col sm={24} md={24}>
	<Form.Item name="description" label="Description" rules={antdIsValidString("Description", 2000)}   >
		<TextArea rows={4} placeholder="Description" />
	</Form.Item>
</Col>
</Row></>}






					<Form.Item className="mb-0">
						<Button onClick={cancelFun}>Cancel</Button>&nbsp;&nbsp;
						<Button type="primary" disabled={btnDisabled} className="btn-w25 btn-primary-light" onClick={() => form.submit()}>Save</Button>
					</Form.Item>
				</Form>
			</Card>
		</>

	)
};

export default connect(({ pins, loading }) => ({
	pins, loading
}))(PinAddEdit);