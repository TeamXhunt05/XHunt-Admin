import React, { useEffect, useMemo } from 'react';
import { Card, Typography, Form, Input, DatePicker, Avatar, message, Descriptions, Table } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import getObjectIteratedValues from '../../../utils/functions';


const StoreView = props => {

	const { church } = props;
	console.log('props ::=')
	console.log(church)

	useEffect(() => {
		DetailFun(props.match.params.id)
	}, [])

	const DetailFun = (id) => {
		props.dispatch({ type: 'church/getDetail', payload: { id } });
	}


	const columns = [
		{ title: 'id', dataIndex: 'id' },
		{ title: 'Name', dataIndex: 'first_name' },
		{ title: 'Email', dataIndex: 'email' },
		{ title: 'Mobile Number', dataIndex: 'mobile_no' },
	];

	let locale = {
		emptyText: 'No Members found',
	};

	const memoizedObjectValues = useMemo(() => getObjectIteratedValues(church.detail), [church.detail])

	return (
		<>
			<Card title={<span><LeftOutlined onClick={() => props.history.push('/church')} /> Church Detail</span>} style={{ marginTop: "0" }}>
				<div style={{ display: 'flex', justifyContent: "center", padding: "20px 10px" }}>
					<Avatar shape="round" size={160} src={church?.detail.church_image} style={{ marginBottom: '2px' }} />
				</div>
				<Descriptions size={'middle'} bordered>
					{memoizedObjectValues}
				</Descriptions>


				<h3 style={{ marginTop: '20px' }}> Members </h3>
				<Table locale={locale} dataSource={church.churchMembers} columns={columns} />;
			</Card>
		</>
	)
};

export default connect(({ church }) => ({
	church,
}))(StoreView);