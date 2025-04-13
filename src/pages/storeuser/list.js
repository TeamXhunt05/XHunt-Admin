// import React from 'react';
// import Apploader from '../../components/loader/loader'
// import { connect } from 'dva';
// import { Card, Typography, Input, Button, Table,  Row, Col, Popconfirm, Modal, message, Upload ,Select} from 'antd';
// import { DeleteOutlined, EyeOutlined  , EditOutlined} from '@ant-design/icons';
// // import AddEdit from './action/addEdit'
// import axios from 'axios';
// const { Search } = Input;
// const { Text } = Typography;
// const { Option } = Select;


// const baseUrl = process.env.REACT_APP_ApiUrl;

// class EmployeeList extends React.Component { 
//   constructor(props) {
//     super(props); 
// 	this.state = { limit:10, current:1, sortBy:'asc', addModel:false, inactive:false, searchText:'', loader:false, detail:'', count:0, listData: []}
// 	setTimeout(()=>document.title = 'Store User List', 100);
//   }
// 	componentDidMount(){
// 		this.ListFun();
// 	}
	
// 	ListFun=()=>{
// 		let search = 'page='+(this.state.current-1)+"&limit="+this.state.limit+"&inactive="+this.state.inactive+"&searchText="+this.state.searchText+"&sortBy="+this.state.sortBy;
// 		localStorage.setItem('serviceSearch', JSON.stringify(this.state))
//         let user_id = localStorage.getItem('userId');
 
// 		let searchval = {limit:this.state.limit, role:"STORE" ,user_id}
// 		this.props.dispatch({type: 'users/getList',  payload: searchval,});
		

// 	  } 

// 	  handleChange(value , data) {
// 		let val = {	 
// 			val :value,
// 			_id : data._id
// 		}

// this.props.dispatch({type: 'users/updateLunchHall', payload:val});
// this.ListFun();




//    }
  
// 	ShowSizeChange=(current, size)  => this.setState({limit:size},()=>this.ListFun());
// 	switchFun=(val)  => this.setState({inactive:val},()=>this.ListFun());	
// 	ChangeOrder=(val)  =>this.setState({sortBy: this.state.sortBy === 'asc' ? 'desc':'asc'},()=>this.ListFun());
// 	paginationFun=(val)=> this.setState({current: val.current},()=>this.ListFun());
	
// 	searchVal=(val)=>{
// 		this.state.searchText = val
// 		const resultAutos = this.props.users.list.data.filter((auto) => auto.username.toLowerCase().includes(val.toLowerCase()) || auto.email.toLowerCase().includes(val.toLowerCase()))
		
// 		this.setState({ listData: resultAutos })
// 	}
	
	
// 	deleteItem=(id)=>{
		
// 		let val = {_id:id}
// 		this.props.dispatch({type: 'users/deleteItem', payload: val});
// 	} 
	
// 	getSnapshotBeforeUpdate(prevProps, prevState) {
		
// 		let del = this.props.users.del;
//         if ( del.count > this.state.count && del.status) {
//             this.setState({count:del.count, btndis:false})
// 			return true
//         }else if ( del.count > this.state.count && !del.status) {
// 			this.setState({count:del.count, btndis:false})
// 		}
//         return null;
//     }

//     componentDidUpdate(prevProps, prevState, snapshot) {
//         if (snapshot) {
//             this.ListFun();
//         }
//     }
	
// 	handleDeactiveUser = async (data) => {
// 		let list = this.state.listData;
// 		let list_update = list.map((item) => {
// 			if(item._id === data) {
// 				item.user_status = !item.user_status;
// 			}
// 			return item;	
// 		})
// 		this.setState({ listData: list_update })
// 		await axios.post(`${baseUrl}/api/user/status`, {id: data});
// 	}

	
// 	render(){
// 	const { searchText, } = this.state;
// 	const {users , lunches} = this.props;
// 	let lunchList = lunches?.list?.data;

	
// 	if(this. state.searchText == '') {
// 	 this.state.listData = users.list ? users.list.data:[];
// 	}

// 	const columns = [
// 	  {
// 		title: <strong className="primary-text cursor" onClick={this.ChangeOrder}>User Name <i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
// 		dataIndex: 'username',
	
// 		render:(val,data)=> <div className={data.isActive ?"":'danger-text'}>{val}</div>
// 	  },

// 	  { title:<strong>Store Name</strong>, dataIndex: 'StoreData', render:(val,data)=> val?.title?val?.title  :  "--"},


  


// 	  { title:<strong>Email</strong>, dataIndex: 'email',},
// 	  { title:<strong>Mobile Number</strong>, dataIndex: 'mobile_number',},
// 	  { title:<strong>Email Verified</strong>, dataIndex: 'isEmailVerified', render:(val,data)=> val?'Yes':'No'},

//      { title:<strong> Status </strong>, dataIndex: 'user_status', render:(val,data)=> 

// <div>

//    <Popconfirm title={`Are you sure you want to ${data.user_status ? "Deactivate" : "Activate"} this user?`} onConfirm={e=> {this.handleDeactiveUser(data._id)}} okText="Yes" cancelText="No" >
// 	   <Button type="default" className={data.user_status ? "bg-success" : "bg-danger"} > {data.user_status && data.user_status  ? `Activated` : `Deactivated`}  </Button>
//    </Popconfirm>
// </div>
// },
// 	  { title:<strong>Action</strong>, width:150, //align:'center',
// 		render:(val,data)=> 
// 		<div>

// <Button className="submitbutton_edit" type="default" onClick={()=>{
// 			this.props.history.push('/store-user/edit/'+data._id)}}>EDIT USER</Button>&nbsp;


// 			{!data.isStoreAdd ? 
// 			<>
// 			<Button className="submitbutton" type="default" onClick={()=>{
// 			this.props.history.push('/admin/store/add/'+data._id)}}>Add Store</Button>&nbsp;</>
// 		:
// 		<>
// 		<Button className="submitbutton_edit" type="default" onClick={()=>{
// 			sessionStorage.setItem("storesData", JSON.stringify(data.StoreData));
// 			this.props.history.push('/admin/store/edit/'+data.StoreData._id+"/"+data._id)}}>Edit Store</Button>&nbsp;</>
// 			}


			
// {!data.isLastPinAdd ? 
// 			<>
// 			<Button className="submitbutton" type="default" onClick={()=>{
// 			this.props.history.push(`/product/admin/add/${data._id}/LAST_MINUTE_PIN`)}}>Add Last Minute Pin</Button>&nbsp;</>
// 		:
// 		<>
// 		<Button className="submitbutton_edit" type="default" onClick={()=>{

	
			
// 			this.props.history.push(`/products/${data._id}`)}}>Edit Last Minute Pin</Button>
// 			&nbsp;
// 			</>
// 			}

// {!data.isDiscountPinAdd ? 
// 			<>
// 			<Button className="submitbutton" type="default" onClick={()=>{
// 			this.props.history.push(`/pin/admin/add/${data._id}/FLAT_DISCOUNT_PIN`)}}>Add  Discount Pin</Button>&nbsp;</>
// 		:
// 		<>
// 		<Button className="submitbutton_edit" type="default" onClick={()=>{
// 			sessionStorage.setItem("pinsData", JSON.stringify(data.DiscountPinData));
// 			this.props.history.push(`/pin/admin/edit/${data.DiscountPinData._id}/${data._id}/FLAT_DISCOUNT_PIN`)}}>Edit  Discount Pin</Button>&nbsp;</>
// 			}



			
// 	 {/* <Button className="eye_btn" type="default" onClick={()=>{
// 			this.props.history.push('/store-user/view/'+data._id)}}><EyeOutlined /></Button>&nbsp; */}


// 		{/* <Popconfirm title="Are you sure delete this user?" onConfirm={e=> {this.deleteItem(data._id)}} okText="Yes" cancelText="No" >
// 		<Button type="danger" className="mt-2"><DeleteOutlined /></Button>
// 	  </Popconfirm>  */}
// 	  </div>
// 	  },
// 	];
//   return (
// 	<div>
// 		{/* <Apploader show={this.props.loading.global}/> */}
// 		<Row className="TopActionBar" gutter={[16,0]} justify="space-between" align="middle">
// 			<Col>
// 				<Search placeholder="Search..." onChange={(e)=>this.searchVal(e.target.value)} value={searchText}
// 				loading={this.props.submitting}	/>
// 			</Col>
// 			<Col>
// 			<Button type="primary" onClick={() => this.props.history.push('/store-user/add')}>Create New Retailer</Button>
// 			</Col>

		
// 		</Row>
		
// 		<div className="innerContainer">
// 				<Card style={{marginTop:"0"}} bodyStyle={{padding:'0 15px 15px'}}>
// 				  <Table columns={columns} dataSource={this.state.listData} 
// 				   loading={this.props.loading.global}
// 					onChange={this.paginationFun}
// 					rowKey={record => record._id}
// 					pagination={{position: ['bottomLeft'], 
// 						showTotal:(total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger:true,
// 						responsive:true,
// 						onShowSizeChange:(current, size)=> this.ShowSizeChange(current, size),
// 						pageSizeOptions:['10','25','50','100','250','500'],
// 					}}
// 				  />
// 				</Card>
// 			</div>
// 	</div>
//   );
// 	}
// };

// export default connect(({users, lunches,loading}) => ({
// 	users, loading ,lunches
// }))(EmployeeList);


//change in 31 jan 2024 (button)



import React from 'react';
import { connect } from 'dva';
import { Card, Typography, Input, Button, Table, Row, Col, Popconfirm, Tooltip, message } from 'antd';
import { DeleteOutlined, EyeOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Search } = Input;
const { Text } = Typography;

const baseUrl = process.env.REACT_APP_ApiUrl;

class EmployeeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 10,
            current: 1,
            sortBy: 'asc',
            addModel: false,
            inactive: false,
            searchText: '',
            loader: false,
            detail: '',
            count: 0,
            listData: []
        };
        setTimeout(() => (document.title = 'Store User List'), 100);
    }

    componentDidMount() {
        this.ListFun();
    }

    ListFun = () => {
        let search =
            'page=' +
            (this.state.current - 1) +
            '&limit=' +
            this.state.limit +
            '&inactive=' +
            this.state.inactive +
            '&searchText=' +
            this.state.searchText +
            '&sortBy=' +
            this.state.sortBy;
        localStorage.setItem('serviceSearch', JSON.stringify(this.state));
        let user_id = localStorage.getItem('userId');

        let searchval = { limit: this.state.limit, role: 'STORE', user_id };
        this.props.dispatch({ type: 'users/getList', payload: searchval });
    };

    handleChange(value, data) {
        let val = {
            val: value,
            _id: data._id
        };

        this.props.dispatch({ type: 'users/updateLunchHall', payload: val });
        this.ListFun();
    }

    ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
    switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
    ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());
    paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

    searchVal = (val) => {
        this.setState({ searchText: val });
        const resultAutos = this.props.users.list.data.filter(
            (auto) =>
                auto.username.toLowerCase().includes(val.toLowerCase()) || auto.email.toLowerCase().includes(val.toLowerCase())
        );

        this.setState({ listData: resultAutos });
    };

    deleteItem = (id) => {
        let val = { _id: id };
        this.props.dispatch({ type: 'users/deleteItem', payload: val });
    };

    getSnapshotBeforeUpdate(prevProps, prevState) {
        let del = this.props.users.del;
        if (del.count > this.state.count && del.status) {
            this.setState({ count: del.count, btndis: false });
            return true;
        } else if (del.count > this.state.count && !del.status) {
            this.setState({ count: del.count, btndis: false });
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            this.ListFun();
        }
    }

    handleDeactiveUser = async (data) => {
        let list = this.state.listData;
        let list_update = list.map((item) => {
            if (item._id === data) {
                item.user_status = !item.user_status;
            }
            return item;
        });
        this.setState({ listData: list_update });
        await axios.post(`${baseUrl}/api/user/status`, { id: data });
    };

    render() {
        const { searchText } = this.state;
        const { users, lunches } = this.props;
        let lunchList = lunches?.list?.data;

        if (this.state.searchText === '') {
            this.state.listData = users.list ? users.list.data : [];
        }

        const columns = [
            {
                title: (
                    <Tooltip title="Sort">
                        <strong className="primary-text cursor" onClick={this.ChangeOrder}>
                            User Name <i className={' fal fa-sm ' + (this.state.sortBy === 'asc' ? 'fa-long-arrow-up' : 'fa-long-arrow-down')}></i>
                        </strong>
                    </Tooltip>
                ),
                dataIndex: 'username',
                render: (val, data) => <div className={data.isActive ? '' : 'danger-text'}>{val}</div>
            },
            { title: <strong>Store Name</strong>, dataIndex: 'StoreData', render: (val, data) => (val?.title ? val?.title : '--') },
            { title: <strong>Email</strong>, dataIndex: 'email' },
            { title: <strong>Mobile Number</strong>, dataIndex: 'mobile_number' },
            { title: <strong>Email Verified</strong>, dataIndex: 'isEmailVerified', render: (val, data) => (val ? 'Yes' : 'No') },
            {
                title: <strong>Status</strong>,
                dataIndex: 'user_status',
                render: (val, data) => (
                    <Popconfirm
                        title={`Are you sure you want to ${data.user_status ? 'Deactivate' : 'Activate'} this user?`}
                        onConfirm={(e) => {
                            this.handleDeactiveUser(data._id);
                        }}
                        okText="Yes"
                        cancelText="No">
                        <Button type="default" className={data.user_status ? 'bg-success' : 'bg-danger'}>
                            {data.user_status && data.user_status ? `Activated` : `Deactivated`}
                        </Button>
                    </Popconfirm>
                )
            },
            {
                title: <strong>Action</strong>,
                width: 150,
                render: (val, data) => (
                    <div>
                        <Button.Group>
                            <Tooltip title="Edit User">
                                <Button className="submitbutton_edit" type="default" onClick={() => this.props.history.push('/store-user/edit/' + data._id)}>
                                    <EditOutlined />
                                </Button>
                            </Tooltip>
                            {!data.isStoreAdd ? (
                                <Tooltip title="Add Store">
                                    <Button className="submitbutton" type="default" onClick={() => this.props.history.push('/admin/store/add/' + data._id)}>
                                        <PlusOutlined />
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Edit Store">
                                    <Button
                                        className="submitbutton_edit"
                                        type="default"
                                        onClick={() => {
                                            sessionStorage.setItem('storesData', JSON.stringify(data.StoreData));
                                            this.props.history.push('/admin/store/edit/' + data.StoreData._id + '/' + data._id);
                                        }}>
                                        <EditOutlined />
                                    </Button>
                                </Tooltip>
                            )}
                            {!data.isLastPinAdd ? (
                                <Tooltip title="Add Last Minute Pin">
                                    <Button
                                        className="submitbutton"
                                        type="default"
                                        onClick={() => {
                                            this.props.history.push(`/product/admin/add/${data._id}/LAST_MINUTE_PIN`);
                                        }}>
                                        <PlusOutlined />
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Edit Last Minute Pin">
                                    <Button
                                        className="submitbutton_edit"
                                        type="default"
                                        onClick={() => {
                                            this.props.history.push(`/products/${data._id}`);
                                        }}>
                                        <EditOutlined />
                                    </Button>
                                </Tooltip>
                            )}
                            {!data.isDiscountPinAdd ? (
                                <Tooltip title="Add Discount Pin">
                                    <Button
                                        className="submitbutton"
                                        type="default"
                                        onClick={() => {
                                            this.props.history.push(`/pin/admin/add/${data._id}/FLAT_DISCOUNT_PIN`);
                                        }}>
                                        <PlusOutlined />
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Edit Discount Pin">
                                    <Button
                                        className="submitbutton_edit"
                                        type="default"
                                        onClick={() => {
                                            sessionStorage.setItem('pinsData', JSON.stringify(data.DiscountPinData));
                                            this.props.history.push(`/pin/admin/edit/${data.DiscountPinData._id}/${data._id}/FLAT_DISCOUNT_PIN`);
                                        }}>
                                        <EditOutlined />
                                    </Button>
                                </Tooltip>
                            )}
                        </Button.Group>
                    </div>
                )
            }
        ];

        return (
            <div>
                <Row className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
                    <Col>
                        <Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText} loading={this.props.submitting} />
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => this.props.history.push('/store-user/add')}>
                            Create New Retailer
                        </Button>
                    </Col>
                </Row>

                <div className="innerContainer">
                    <Card style={{ marginTop: '0' }} bodyStyle={{ padding: '0 15px 15px' }}>
                        <Table
                            columns={columns}
                            dataSource={this.state.listData}
                            loading={this.props.loading.global}
                            onChange={this.paginationFun}
                            rowKey={(record) => record._id}
                            pagination={{
                                position: ['bottomLeft'],
                                showTotal: (total, range) => (
                                    <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>
                                ),
                                showSizeChanger: true,
                                responsive: true,
                                onShowSizeChange: (current, size) => this.ShowSizeChange(current, size),
                                pageSizeOptions: ['10', '25', '50', '100', '250', '500']
                            }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default connect(({ users, lunches, loading }) => ({
    users,
    loading,
    lunches
}))(EmployeeList);
