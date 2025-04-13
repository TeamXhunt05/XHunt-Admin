import React, { useEffect, useMemo } from 'react';
import { Card, Typography, Form, Col, Row, Avatar, message, Descriptions, Table } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import getObjectIteratedValues from '../../../utils/functions';
import moment from 'moment';

 
const BusinessView = props => {

	const { stores } = props;
	const {detail} = stores
	console.log('props ::=')
	console.log(stores)

	useEffect(() => {
		DetailFun(props.match.params.id)
	}, [])

	const DetailFun = (id) => {
		props.dispatch({ type: 'stores/getDetail', payload: { id } });
	}



	return (


<>



<Card title={<span><LeftOutlined onClick={() => props.history.push('/stores')} /> Store Detail </span>} style={{ marginTop: "0" }}>
<div style={{ display: 'flex', justifyContent: "left", padding: "20px 10px" }}>
   <Avatar shape="square" size={160} src={stores?.detail?.images && stores?.detail?.images[0]?.url} style={{ marginBottom: '2px' }} />

</div>

<Row style={{marginBottom:'0.625rem'}}>
<Col span={8}>
	   <span style={{color:'#666', fontWeight:'700'}}>Store Name</span>
</Col>
<Col span={16}>
   {detail && detail?.title}
</Col>
</Row> 
{/* <Row style={{marginBottom:'0.625rem'}}>
<Col span={8}>
	   <span style={{color:'#666', fontWeight:'700'}}>Visiting Days</span>
</Col>
<Col span={16}>
   {detail && detail?.visiting_days}
</Col>
</Row>  */}
<Row style={{marginBottom:'0.625rem'}}>
<Col span={8}>
	   <span style={{color:'#666', fontWeight:'700'}}>Store Cuisine</span>
</Col>
<Col span={16}>
   {/* {detail && detail?.cuisine} */}
   {detail && detail?.cuisine?.map((val) => <>{val} </>)}
  
</Col>
</Row> 

<Row style={{marginBottom:'0.625rem'}}>
<Col span={8}>
	   <span style={{color:'#666', fontWeight:'700'}}>Store Category</span>
</Col>
<Col span={16}>
   {detail && detail?.store_category}
</Col>
</Row> 

<Row style={{marginBottom:'0.625rem'}}>
<Col span={8}>
	   <span style={{color:'#666', fontWeight:'700'}}>Store Open Time</span>
</Col>
<Col span={16}>
   {detail && 
moment(detail?.open_time).format("hh:mm a")

   }
</Col>
</Row> 


<Row style={{marginBottom:'0.625rem'}}>
<Col span={8}>
	   <span style={{color:'#666', fontWeight:'700'}}>Store Close Time</span>
</Col>
<Col span={16}>
   {detail &&
moment(detail?.close_time).format("hh:mm a")
   }
</Col>
</Row> 


<Row style={{marginBottom:'0.625rem'}}>
<Col span={8}>
	   <span style={{color:'#666', fontWeight:'700'}}>State</span>
</Col>
<Col span={16}>
   {detail && detail?.state}
</Col>
</Row> 



<Row style={{marginBottom:'0.625rem'}}>
<Col span={8}>
	   <span style={{color:'#666', fontWeight:'700'}}>City</span>
</Col>
<Col span={16}>
   {detail && detail?.city}
</Col>
</Row> 



<Row style={{marginBottom:'0.625rem'}}>
<Col span={8}>
	   <span style={{color:'#666', fontWeight:'700'}}>Postal</span>
</Col>
<Col span={16}>
   {detail && detail?.postal}
</Col>
</Row> 



<Row style={{marginBottom:'0.625rem'}}>
<Col span={8}>
	   <span style={{color:'#666', fontWeight:'700'}}>Store Address</span>
</Col>
<Col span={16}>
   {detail && detail?.address}
</Col>
</Row> 


<Row style={{marginBottom:'0.625rem'}} >
<Col span={8}>
	   <span  style={{color:'#666', fontWeight:'700'}} >Store Description</span>
</Col>
<Col span={16}>
{detail && detail?.description}
</Col>
</Row> 


<Row style={{marginBottom:'0.625rem'}} >
<Col span={8}>
	   <span  style={{color:'#666', fontWeight:'700'}} >Created At</span>
</Col>
<Col span={16}>
{detail && detail?.created_at}
</Col>
</Row> 

<Row style={{marginBottom:'0.625rem'}}>
<Col span={8}>
	   <span  style={{color:'#666', fontWeight:'700'}} >Status</span>
</Col>
<Col span={16}>
{ detail && (detail?.status ?<span style={{color : "green"}}>Publish</span>:<span style={{color : "red"}}>UnPublish</span>) || '-'  }
</Col>
</Row>

</Card>








</>
	)
};

export default connect(({ stores }) => ({
	stores,
}))(BusinessView);