import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Card, Select, Form, Input, Button, message, Switch, TimePicker, DatePicker,notification ,InputNumber } from 'antd';
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



const ProductAddEdit = props => {
	const [form] = Form.useForm();
	let idAdd = props.match.params.id === undefined ? true : false
	const islastMinute =  props.location.search === "?redirect=lastMinute" ? true : false


	const { dispatch } = props;
	const [galleryImagesList, setGalleryImagesList] = useState([]);
	const [btnDisabled, setBtnDisabled] = useState(false)
	const [galleryImageUriList, setGalleryImageUriList] = useState({});
	const [autocomplete, setAutocomplete] = useState();
	const [ispostal, sePostal] = useState(true)
	const [isAddMore, setAddMore] = useState(false)


	const [latLng, setLatLng] = useState({
		lat: 26.896593,
		lng: 75.770676
	});
	const [days, setDays] = useState([1, 2, 3, 4, 5, 6]);
	const itemUnitList = [{ key: 0, value: 'KILO_GRAM' }, { key: 1, value: 'PCS' }, { key: 2, value: 'GRAM' }, { key: 3, value: 'PACKET' }, { key: 4, value: 'BOTTLE' },{ key: 5, value: 'POUCH' }, { key: 6, value: 'FEET' }, { key: 7, value: 'CENTI_METER' }, { key: 8, value: 'MILI_METER' }, { key: 9, value: 'QUINTAL' },{ key: 10, value: 'TON' }, { key: 11, value: 'SEAT' },]



	useEffect(() => {
	
		if (idAdd) {
			form.setFieldsValue({
				['is_published']: true,
			})
		} else {

			let products = JSON.parse(sessionStorage.getItem("productsData"));
			console.log("🚀 ~ file: addEdit.jsx:57 ~ useEffect ~ products:", products.cuisine)



			if (products.open_time) {
				products.open_time = moment(products.open_time);
			}
			if (products.close_time) {
				products.close_time = moment(products.close_time);
			}


			// return




			if (products.visiting_days) {
				let arr = products.visiting_days
				// let arr = products.visiting_days.split(",");

				const intArr = [];
				for (let i = 0; i < arr.length; i++) {
					intArr.push(parseInt(arr[i]))
				}

				setDays(intArr)
			} else {
				setDays([])
			}
			

			
			
		


			for (let i in products) {
				form.setFieldsValue({
					[i]: products[i],
				})
			}






			let image = `${products.images[0].url}`;
			setGalleryImageUriList([image])
		}
	}, [])

	useEffect(() => {
		let unmounted = false;
		console.log('props',props)
		return () => {
		  unmounted = true;
		  setAddMore(false)
		}
	  }, [dispatch])

	const onFinish = async (val) => {
	



		if (!galleryImageUriList.length > 0 && galleryImagesList.length === 0) {
			return message.error('please upload product image');
		}


		if (galleryImagesList[0]) {
			val.product_image = galleryImagesList[0];
		}

	

		

		const formData = convertToFormData(val);
		formData.append('user_id',props.match.params.user_id);



		let result;
		if (props.match.params.id) {
			formData.append('_id', props.match.params.id);
			result = await dispatch({ type: 'products/editAdmin', payload: formData });
		}
		else {
			result = await dispatch({ type: 'products/addAdmin', payload: formData });
		}



		



		if (result.status) {
// 			if(idAdd){
// return props.history.push('/store-users');
// 			}

			if(islastMinute){
				return props.history.push('/store-users');
			}

			if(isAddMore){
				window.scrollTo({
					top: 0,
					behavior: 'smooth',
				});
form.resetFields(['price'  ,'discount_amount' , 'number_of_pieces' , 'description' , 'is_published'  ,'title'  ,'item_unit']);
		setGalleryImageUriList({})
		setGalleryImagesList([])
			}else{
				props.history.push('/store-users');
			}
			
		}

	}



	const cancelFun = () => {
		form.resetFields();
		props.history.push('/store-users');
	}

	const onUploadGallery = async (data) => {


		let images = await getUploadsImages(data);

		setGalleryImageUriList(data);
		setGalleryImagesList([...images]);
	}







	return (

		<>
	
			<Apploader show={props.loading.global} />
			<Card title={<span><LeftOutlined onClick={() => props.history.push('/store-users')} /> {idAdd ? 'Add Last Mintute Product' : 'Edit Last Mintute Product'}</span>} style={{ marginTop: "0" }}>
				<Form {...formItemLayout} form={form} name="picture" layout="vertical" onFinish={onFinish} className="innerFields">

{!islastMinute && idAdd && <Row gutter={15}>

<Col sm={24} md={24}>
		<Form.Item name="pin_title" label="Pin Title" rules={antdIsValidString("Pin Title" , 15)}  >
			<Input  placeholder="Pin Title" />
		</Form.Item>
	</Col>


</Row>}
					
					<Row gutter={15}>



	<Col sm={6} md={6}>
		<Form.Item label={<span><span style={{ color: 'red' }}>*</span>Product Images</span>} >
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

		


						<Col sm={12} md={12}>
							<Form.Item name="title" label="Product Name" rules={antdIsValidString("Product Name")}  >
								<Input  placeholder="Product Name" />
							</Form.Item>
						</Col>

						<Col sm={12} md={12}>
						<Form.Item name="item_unit" label="Select Product Unit" rules={[{ required: true, message: 'Field required!' },]}  >
							<Select
								// mode="multiple"
								allowClear
								style={{
									width: '100%',
								}}
								placeholder="Please Product Unit"

								// onChange={handleChange}
							>
								{itemUnitList.map((item, index) =>
									<Option key={index} value={item.value} label={item.value}>
										<div className="demo-option-label-item">
										{item.value}
										</div>
									</Option>)}
							</Select>
						</Form.Item>
						</Col>

						
					</Row>

					<Row gutter={15}>
					<Col sm={12} md={12}>
						
							<Form.Item name="price" label="Product Price"
          rules={[{ required: true, message: 'This field is required.' } ,
		  ({ getFieldValue }) => ({
			validator(rule, value) {
			  if (!value) {
				return Promise.reject('');
			  }
			  if (value > 999999) {
				  return Promise.reject('Product Price can not be greater than 999999');
				}
				return Promise.resolve();
  
			},
		  }),
		  
          ]}
        
        >
          <InputNumber type={'number'} placeholder="Product Price"
         
           
           
          />
        </Form.Item>
						</Col>
	

						<Col sm={12} md={12}>
							<Form.Item name="discount_amount" label="Product Discount Price"
							 	   rules={[{ required: true, message: 'This field is required.' },
									({ getFieldValue }) => ({
									  validator(rule, value) {
										if (!value) {
										  return Promise.reject('');
										}
							 
					
							 
							 
										
			
										 
										 if (value && getFieldValue('price') < value) {
											 if (getFieldValue('price') < value) {
												return Promise.reject('Product Discount Value can not be Product Price Value');
											 }
											 return Promise.resolve();
										   }
										
							 
							 
							 
										return Promise.resolve();
										
									  },
									}),
									]}
							   >
								<InputNumber  placeholder="Pin Discount" />
							</Form.Item>
						</Col>
						
					</Row>





					<Row gutter={15}>
					<Col sm={12} md={12}>
						
						<Form.Item name="number_of_pieces" label="Quantity"
	  rules={[{ required: true, message: 'This field is required.' } ,
	  ({ getFieldValue }) => ({
		validator(rule, value) {
		  if (!value) {
			return Promise.reject('');
		  }
		  if (value > 999999) {
			  return Promise.reject('Quantity can not be greater than 999999');
			}
			return Promise.resolve();

		},
	  }),
	  
	  ]}
	
	>
	  <InputNumber type={'number'} placeholder="Product Quantity"
	 
	   
	   
	  />
	</Form.Item>
					</Col>
						<Col sm={24} md={24}>
							<Form.Item name="description" label="Product Description" rules={antdIsValidString("Product Description", 2000)}   >
								<TextArea rows={4} placeholder="Product Description" />
							</Form.Item>
						</Col>
					</Row>


					

					<Row gutter={15}>
						<Col sm={12} md={12}>
							<Form.Item name="is_published" valuePropName='checked'  >
								<Switch checkedChildren="Publish" unCheckedChildren="UnPublish" />
							</Form.Item>
						</Col>
					</Row>

					{!islastMinute && idAdd && <Row gutter={15}>
						<Col sm={12} md={12}>
						<Button  shape="round" className='mb-4 bg-primary' onClick={() => {
						    setAddMore(true)
							form.submit()}}>Add More Product</Button>

						</Col>
					</Row>}

					


					<Form.Item className="mb-0">
						<Button onClick={cancelFun}>Cancel</Button>&nbsp;&nbsp;
						<Button type="primary" disabled={btnDisabled} className="btn-w25 btn-primary-light" onClick={() => {
						    setAddMore(false)
							form.submit()}}>Save</Button>
					</Form.Item>
				</Form>
			</Card>
		</>

	)
};

export default connect(({ products, loading }) => ({
	products, loading
}))(ProductAddEdit);