import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Card, Select, Form, Input, Button, message, Switch, TimePicker, DatePicker,notification } from 'antd';
import { LeftOutlined, MailOutlined, UserOutlined, MobileOutlined, SendOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import MultiImageInput from 'react-multiple-image-input';
import { antdIsValidString, convertToFormData, dataURLtoFile, getUploadsImages, isEmpty } from '../../../utils/functions';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { API_URL, MAP_API_KEY } from '../../../utils/constants';
import Geocode from "react-geocode";
import moment from 'moment'
import Apploader from '../../../components/loader/loader'
import ToggleDays from './ToggleDays'
import axios from 'axios';






const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };


const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = TimePicker;



const OrderAddEdit = props => {
	const [form] = Form.useForm();
	const isVerify = props.location.search.substr(8)
	console.log("🚀 ~ file: addEdit.jsx:32 ~ OrderAddEdit ~ isVerify:", isVerify)
	let idAdd = props.match.params.id === undefined ? true : false
	const { dispatch } = props;
	const [galleryImagesList, setGalleryImagesList] = useState([]);
	const [btnDisabled, setBtnDisabled] = useState(false)
	const [galleryImageUriList, setGalleryImageUriList] = useState({});
	const [autocomplete, setAutocomplete] = useState();
	const [ispostal, sePostal] = useState(true)

	const [latLng, setLatLng] = useState({
		lat: 26.896593,
		lng: 75.770676
	});
	const [days, setDays] = useState([1, 2, 3, 4, 5, 6]);
	const cuisineList = [{ value: 0, day: 'Indian' }, { value: 1, day: 'Chinese' }, { value: 2, day: 'Italian' }, { value: 3, day: 'American' }, { value: 4, day: 'German' }]
	const storeList = [{ value: 0, category: 'Restaurants' }, { value: 1, category: 'Bars & Pubs' }, { value: 2, category: 'Bakery' }, { value: 3, category: 'Cafe' }, { value: 4, category: 'Sweets' },]



	const locationRef = useRef();
	useEffect(() => {
	
		if (idAdd) {
			// form.setFieldsValue({
			// 	['status']: true,
			// })
		} else {

			let orders = JSON.parse(sessionStorage.getItem("ordersData"));
			console.log("🚀 ~ file: addEdit.jsx:57 ~ useEffect ~ orders:", orders.cuisine)



			if (orders.open_time) {
				orders.open_time = moment(orders.open_time);
			}
			if (orders.close_time) {
				orders.close_time = moment(orders.close_time);
			}


			// return




			if (orders.visiting_days) {
				let arr = orders.visiting_days
				// let arr = orders.visiting_days.split(",");

				const intArr = [];
				for (let i = 0; i < arr.length; i++) {
					intArr.push(parseInt(arr[i]))
				}

				setDays(intArr)
			} else {
				setDays([])
			}
			

			
			
		
			form.setFieldsValue({
				cuisine: Number[orders.cuisine],
			})

			for (let i in orders) {
				form.setFieldsValue({
					[i]: orders[i],
				})
			}


console.log(orders)
			setLatLng({
				lat: orders.latitude,
				lng: orders.longitude
			})



			let image = `${orders.images[0].url}`;
			setGalleryImageUriList([image])
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

		const res = await axios.get(`https://api.postalpincode.in/pincode/${val.postal}`);
		if(res.data[0].Status === "Error") {
			notification.error({message: "This pincode is not a available"});
			return;
		}else{
			sePostal(true)

		}
	if(!ispostal){
notification.error({message: "This pincode is not a available"});
return;
}

		if (!galleryImageUriList.length > 0 && galleryImagesList.length === 0) {
			return message.error('please upload store image');
		}

		val["latitude"] = latLng.lat;
		val["longitude"] = latLng.lng;
		val["visiting_days"] = days;

		if (galleryImagesList[0]) {
			val.store_image = galleryImagesList[0];
		}
		console.log("val",val)

		

		const formData = convertToFormData(val);


		let result;
		if (props.match.params.id) {

			formData.append('_id', props.match.params.id);
			result = await dispatch({ type: 'orders/edit', payload: formData });
		}
		else {
			result = await dispatch({ type: 'orders/add', payload: formData });
		}


		if (result.status) {
			if(isVerify === "verify"){
				props.history.push('/')
			}else{
				props.history.push('/orders')
			}
		
		}

	}

	const handleWeekDays = (event, value) => {
		setDays(value)
	}

	const cancelFun = () => {
		form.resetFields();
		if(isVerify === "verify"){
			props.history.push('/')
		}else{
			props.history.push('/orders')
		}
	}

	const onUploadGallery = async (data) => {


		let images = await getUploadsImages(data);

		setGalleryImageUriList(data);
		setGalleryImagesList([...images]);
	}


	const onLoad = useCallback((props) => {
		setAutocomplete(props)
	}, [])

	const onPlaceChanged = () => {


		console.log('autocomplete')
		console.log(autocomplete.getPlace().formatted_address)

		if (!isEmpty(autocomplete)) {
			const latitudeLongitude = {

				lat: autocomplete.getPlace().geometry.location.lat(),
				lng: autocomplete.getPlace().geometry.location.lng()
			}

			form.setFieldsValue({
				location: autocomplete.getPlace().formatted_address
			})

			setLatLng(latitudeLongitude);
		}
	}


	const onMarkerDragEnd = async (event) => {
		const lat = event.latLng.lat();
		const lng = event.latLng.lng();

		const latitudeLongitude = {
			lat: lat,
			lng: lng
		}

		let result = await fetchLocationName(lat, lng);

		console.log({ result })
		if (result) {
			setLatLng(latitudeLongitude);
		}
	};


	const fetchLocationName = async (lat, lng) => {

		console.log('fetching location name')
		Geocode.setApiKey(MAP_API_KEY);
		Geocode.setLanguage("en");
		Geocode.setLocationType("ROOFTOP");
		Geocode.enableDebug();

		try {

			let response = await Geocode.fromLatLng(lat, lng);
			console.log({ response })
			if (response) {
				const address = response.results[0].formatted_address;
				console.log('address', address);
				form.setFieldsValue({
					address: address
				})

				return true;
			}

		} catch (e) {
			console.log('error', e);
			alert("Location Name not found!")
			return false;
		}

		Geocode.setLanguage("en");



	};

	const handlePostal = async (e) =>{
		let value = e.target.value;

		form.setFieldsValue({
			city:'',
			state: '',
		});

		if(value.length === 6) {
			
			const res = await axios.get(`https://api.postalpincode.in/pincode/${value}`);
			console.log(res.data[0].Status)
			if(res.data[0].Status === "Error") {
				sePostal(false)
			}else{
				sePostal(true)

			}



			if(res.data[0].PostOffice != null && res.data[0].PostOffice != undefined && res.data[0].PostOffice != "") {

				let pincode_data = res.data[0].PostOffice[0];
				form.setFieldsValue({
					city:pincode_data.District,
					state: pincode_data.State,
				});
			}else{
				form.setFieldsValue({
					city:'',
					state: '',
				});

			}
		}
	  }



	  const handleChange = (value) => {
		console.log(`selected ${value}`);
	};



	return (

		<>
	
			<Apploader show={props.loading.global} />
			<Card title={<span><LeftOutlined onClick={() => {
				if(isVerify === "verify"){
					props.history.push('/')
				}else{
					props.history.push('/orders')
				}
				
				
				}} /> {idAdd ? 'Add Store' : 'Edit Store'}</span>} style={{ marginTop: "0" }}>
				<Form {...formItemLayout} form={form} name="picture" layout="vertical" onFinish={onFinish} className="innerFields">

					<Row gutter={15}>
						<Col sm={6} md={6}>
							<Form.Item label={<span><span style={{ color: 'red' }}>*</span>Store Images</span>} >
								<MultiImageInput
									images={galleryImageUriList}
									setImages={onUploadGallery}
									allowCrop={false}
									theme="light"
									max={1}
									cropConfig={{ minWidth: 10, maxWidth: 2000 }}

								/>
							</Form.Item>
						</Col>
					</Row>

				

					<Row gutter={15}>

					<Col sm={24} md={24}>
							{/* <WeekdayPicker /> */}
							<Form.Item name="visiting_days" label="Visiting Days">
								<ToggleDays days={days} handleWeekDays={handleWeekDays} />
							</Form.Item>
						</Col>


						<Col sm={12} md={12}>
							<Form.Item name="title" label="Store Title" rules={antdIsValidString("Store Title" , 15)}  >
								<Input  placeholder="Store Title" />
							</Form.Item>
						</Col>

						
						<Col sm={12} md={12}>
						<Form.Item name="cuisine" label="Select Store Cuisine" rules={[{ required: true, message: 'Field required!' },]}  >
							<Select
								mode="multiple"
								allowClear
								style={{
									width: '100%',
								}}
								placeholder="Please Store Cuisine"

								onChange={handleChange}
							>
								{cuisineList.map((item, index) =>
									<Option key={index} value={item.day} label={item.day}>
										<div className="demo-option-label-item">
										{item.day}
										</div>
									</Option>)}
							</Select>
						</Form.Item>
						</Col>
						
					</Row>

					<Row gutter={15}>
						<Col sm={12} md={12}>
							<Form.Item name="open_time" label="Store Open Time" rules={[
								{
									required: true,
									message: 'Please input your Open Time!',
								}
							]}>
								<TimePicker showNow={false} style={{ width: '100%' }} use12Hours format="h:mm a" onChange={(time, timeString) => {
									form.setFieldsValue({
										['open_time']: time,
									})
								}} />
							</Form.Item>
						</Col>
						<Col sm={12} md={12}>
							<Form.Item name="close_time" label="Store Close Time" rules={[
								{
									required: true,
									// message: 'Please input your Close Time!',
								},
								({ getFieldValue }) => ({
									validator(rule, value) {
										if (!value) {
											return Promise.reject('Please input your Close Time!');
										}



										var startTime = moment(getFieldValue('open_time')._d, 'h:mm:ss a');
										var endTime = moment(value._d, 'h:mm:ss a');

										if (startTime.isBefore(endTime)) {
											return Promise.resolve();
										} else {
											return Promise.reject('close time must be greater than open time');
										}
									},
								}),




							]}>
								<TimePicker showNow={false} style={{ width: '100%' }} use12Hours format="h:mm a" onChange={(time, timeString) => {
									form.setFieldsValue({
										['close_time']: time,
									})
								}} />
							</Form.Item>
						</Col>
					</Row>


					<Row gutter={15}>
						<Col sm={24} md={24}>
							<Form.Item name="description" label="Store Description" rules={antdIsValidString("Description", 2000)}   >
								<TextArea rows={4} placeholder="Store Description" />
							</Form.Item>
						</Col>
					</Row>

	<Row gutter={15}>

	<Col xs={24} sm={24} md={12}>
						<Form.Item name="postal" label="Postal" onChange={(e) => { handlePostal(e) }} rules={[{	 required: true, message: 'Numeric Value Required' },{max : 6 , message: 'Postal Code must be 6 digits'}]} >
						<Input placeholder="Postal" type="number" />
						</Form.Item>
					</Col>




					<Col xs={24} sm={24} md={12}>
						<Form.Item name="state" label="State" rules={[ { required: true, message: 'Field required!', }, { max: 20, message: 'State must not be greater than 20 characters.' }, ]} >
						<Input placeholder="State" />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={12}>
						<Form.Item name="city" label="City" rules={[ { required: true, message: 'Field required!', }, { max: 20, message: 'City must not be greater than 20 characters.' }, ]} >
						<Input placeholder="City" />
						</Form.Item>
					</Col>
					<Col sm={12} md={12}>
						<Form.Item name="store_category" label="Select Store Category" rules={[{ required: true, message: 'Field required!' },]}  >
							<Select
								// mode="multiple"
								allowClear
								style={{
									width: '100%',
								}}
								placeholder="Please Store Category"

								// onChange={handleChange}
							>
								{storeList.map((item, index) =>
									<Option key={index} value={item.category} label={item.category}>
										<div className="demo-option-label-item">
										{item.category}
										</div>
									</Option>)}
							</Select>
						</Form.Item>
						</Col>

</Row>


<Col sm={12} md={12} style>
						<LoadScript
							googleMapsApiKey={MAP_API_KEY}
							libraries={['places']}
						>
							<Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} bounds={true} onUnmount={true} >
								<Form.Item name="address" label="Store Address" rules={[{ required: true, message: 'Field required!' },]}  >
									<Input ref={locationRef} prefix={<SendOutlined />} placeholder="Store Address " type="text" />
								</Form.Item>
							</Autocomplete>
						</LoadScript>
					</Col>



					<Row gutter={15} className="" style={{ height: '500px', width: "100%" }}>
						<Col sm={24} md={24}>
							<LoadScript
								googleMapsApiKey={MAP_API_KEY}
								libraries={['places']}
							>
								<GoogleMap center={latLng} zoom={15} mapContainerStyle={{ width: '50%', height: '100%' }}>
									<Marker
										//onLoad={onLoad}
										position={latLng}
										draggable={true}
										onDragEnd={(e) => onMarkerDragEnd(e)}
									/>
								</GoogleMap>
							</LoadScript>

						</Col>
					</Row>
					<br /><br />

					{/* <Row gutter={15}>
						<Col sm={12} md={12}>
							<Form.Item name="status" valuePropName='checked'  >
								<Switch checkedChildren="Publish" unCheckedChildren="UnPublish" />
							</Form.Item>
						</Col>
					</Row> */}


					<Form.Item className="mb-0">
						<Button onClick={cancelFun}>Cancel</Button>&nbsp;&nbsp;
						<Button type="primary" disabled={btnDisabled} className="btn-w25 btn-primary-light" onClick={() => form.submit()}>Save</Button>
					</Form.Item>
				</Form>
			</Card>
		</>

	)
};

export default connect(({ orders, loading }) => ({
	orders, loading
}))(OrderAddEdit);