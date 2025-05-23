import React from 'react';
import { connect } from 'dva';
import Apploader from './../../../components/loader/loader'
import { Card, Typography, Input, Button, Table, Radio, Row, Col, Modal, notification } from 'antd';
import DownloadOutlined from "@ant-design/icons/DownloadOutlined";

// import { Link } from 'react-router-dom'; 
// import { UserOutlined, LockOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
// import jwt_decode from "jwt-decode";
import Moment from 'react-moment';
import PrintOrders from '../print-order/PrintOrders'
import axios from 'axios';
import './order-details.css';
import parse from 'html-react-parser';
import ReturnFormModal from './ReturnFormModal';

const { TextArea } = Input;

const baseUrl = process.env.REACT_APP_ApiUrl;
class OrderDetails extends React.Component {

    state = {
        role: '',
        CancelMessageInput: '',
        sortBy: 'asc',
        limit: 10,
        page: 1,
        printModel: false,
        detail: '',
        selectedProducts: [],
        isModalVisible: false,
        modalDescriptionText: "",
        modalPaymentIdText: "",
        modalAmountText: "",
        showError: "",
        isCancelOrderModalVisible: false,
        cancelModalDescriptionText: "",
        cancelModalShowError: "",
        viewItemDetailModal: false,
        orderItemData: {},
        orderItemVariants: [],
        updateOrderItemTrackStatusModal: false,
        orderItemTrackStatusUpdate: "",
        productSellerDetailModal: false,
        orderDetailSellerData: {},
        ecomExpressDetailShippingModal: false,
        ecomExpressDetailShippingData: {},
        modalStatus: false,
        modalData: {},
        modalTitle: "", 
        returnDaysModalStatus: false
    };

    componentDidMount() {
        this.getOrderDetails();
    }

    async download(orderId, product) {
        const res = await axios.post(`${process.env.REACT_APP_ApiUrl}/order-invoice-for-user-by-order-id`, { _id: orderId, product: product });

        if (res.data.status === true) {
            window.open(res.data.result, '_blank');
            this.setState({ printModel: false })
        }
    }


    selectProductWithCheckbox = (event, productId) => {
        if (event.target.checked) {
            var selectedProducts = [
                ...this.state.selectedProducts,
                productId
            ];
        } else {
            var selectedProducts = this.state.selectedProducts.filter((id) => id != productId);
        }

        this.setState({
            ...this.state,
            selectedProducts: selectedProducts,
        });
    }

    componentDidUpdate() { }

    refundProductClickHandler = () => {

        this.setState({
            ...this.state,
            isModalVisible: true,
        });

    }

    handleOk = () => {
        if (!this.state.modalDescriptionText) {

            this.setState({
                ...this.state,
                showError: "* Desctiption field is required."
            });

            setTimeout(() => {

                this.setState({
                    ...this.state,
                    showError: "",
                });

            }, 3000);

            return;
        }
        if (!this.state.modalPaymentIdText) {

            this.setState({
                ...this.state,
                showError: "* Payment ID field is required."
            });

            setTimeout(() => {

                this.setState({
                    ...this.state,
                    showError: "",
                });

            }, 3000);

            return;
        }
        if (!this.state.modalAmountText) {

            this.setState({
                ...this.state,
                showError: "* Amount field is required."
            });

            setTimeout(() => {
                this.setState({
                    ...this.state,
                    showError: "",
                });
            }, 3000);

            return;
        }
        const requestPayload = {
            description: this.state.modalDescriptionText,
            id: this.props.match.params.id,
            product_id: [...this.state.selectedProducts],
            payment_id: this.state.modalPaymentIdText,
            amount: this.state.modalAmountText
        };

        this.props.dispatch({ type: 'order/refundOrder', payload: { ...requestPayload } }).then(() => {

            this.handleCancel();
        })
    };

    handleCancel = () => {
        this.setState({
            ...this.state,
            isModalVisible: false,
        })
    };

    getOrderDetails() {
        let user = localStorage.getItem('user');
        let role = localStorage.getItem('role');
        this.setState({ role: role })
        const objUser = JSON.parse(user);
        this.props.dispatch({ type: 'order/orderDetail', payload: { 'order_id': this.props.match.params.id, userId: objUser._id, role: role } })
    }


    updateReturnDaysForOrderItem(paramData) {
       let data = this.state.modalData;
       data.return_days = paramData.return_days;
    
        this.setState({ returnDaysModalStatus: false ,modalData:data })
        this.props.dispatch({ type: 'order/updateReturnDaysForItem', payload: paramData })
        // this.getOrderDetails();
    }



    ShowSizeChange(current, size) { }



    disbleCancelButton(orderDetail) {
        if (orderDetail && orderDetail.status == 2) {
            return true;
        }
        return false;
    }

    openCancelOrderModal = () => {
        this.setState({
            ...this.state,
            isCancelOrderModalVisible: true,
        })
    }

    handleCancelModalOk = () => {
        if (!this.state.cancelModalDescriptionText) {
            this.setState({
                ...this.state,
                cancelModalShowError: "* This field is required."
            });
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    cancelModalShowError: "",
                });
            }, 3000);
            return;
        }

        let LoginCred = localStorage.getItem('user')
        const userDetail = JSON.parse(LoginCred);
        let userEmail = { username: userDetail.email }

        const requestPayload = {
            description: this.state.cancelModalDescriptionText === "others" ? this.state.CancelMessageInput : this.state.cancelModalDescriptionText,
            id: this.props.match.params.id,
            cancel_id: userEmail
        };

        this.props.dispatch({ type: 'order/cancelOrder', payload: { ...requestPayload } }).then(() => {
            this.handleCancelModalCancel();
            this.getOrderDetails();
        })

    }

    handleCancelModalCancel = () => {
        this.setState({
            ...this.state,
            isCancelOrderModalVisible: false,
        })
    }

    GetNoteForCancel = (event) => {
        this.setState({ cancelModalDescriptionText: event.target.value });
    }

    paymentStatusDesign = (payment_status) => {

        if (payment_status === "Paid") {
            return <span style={{ color: 'green', fontWeight: "bold" }}> PAID </span>
        } else {
            return <span style={{ color: 'red', fontWeight: "bold" }}> UNPAID </span>
        }
    }

    GetNoteForCancelInput = (event) => {
        this.setState({ CancelMessageInput: event.target.value });

    }

    print() {
        window.print();
    }







    orderItemStauts(item_status) {

        /*
        // 0 for order placed 1 for order delivered 2 for order cancelled 3 for order returned 4 for order refund
        */
        let statusReturned = null;
        switch (item_status) {
            case 0:
                statusReturned = <span className="status-message" style={{ 'color': 'green' }}>Placed</span>
                break;
            case 1:
                statusReturned = <span className="status-message" style={{ 'color': 'green' }}>Delivered</span>
                break;
            case 2:
                statusReturned = <span className="status-message" style={{ 'color': 'red' }}>Cancelled</span>
                break;
            case 3:
                statusReturned = <span className="status-message" style={{ 'color': 'red' }}>Returned</span>
                break;
            case 4:
                statusReturned = <span className="status-message" style={{ 'color': 'blue' }}>Refunded</span>
                break;
            case 5:
                statusReturned = <span className="status-message" style={{ 'color': 'blue' }}>Exchange</span>
                break;
            default:
                statusReturned = <span style={{ 'textAlign': 'center' }}>-</span>
                break;
        }

        return statusReturned;

    }



    viewItemDetailHandler = (item_data) => {
        let order_item_product_id = item_data.product_id._id;
        let variantData = [];

        this.props.orderDetail.product && this.props.orderDetail.product.map((item_product) => {
            if (order_item_product_id === item_product.product._id) {
                // variantData.push(item_product.variants);
                if(item_product.variants.length > 0) {
                    variantData.push(item_product.variants);
                }
            }
        })


        this.setState({ orderItemData: item_data, orderItemVariants: variantData, viewItemDetailModal: true })
    }

    updateOrderItemHandler = (item_data) => {
        this.setState({ orderItemData: item_data, updateOrderItemTrackStatusModal: true })
    }


    productSellerDetailHandler = (data) => {
        this.setState({ orderDetailSellerData: data, productSellerDetailModal: true })
    }


    handleReturnDaysModal = (data) => {

        // let order_item_product_id = item_data.product_id._id;
        // let variantData = [];

        // this.props.orderDetail.product && this.props.orderDetail.product.map((item_product) => {
        //     if (order_item_product_id === item_product.product._id) {
        //         variantData.push(item_product.variants);
        //     }
        // })


        this.setState({ modalData: data, returnDaysModalStatus: true })
    }

    updateItemTrackStatusHandler = async (item_data) => {


        let trackStatus = this.state.orderItemTrackStatusUpdate;
        if (trackStatus === undefined || trackStatus === "" || trackStatus === "") {
            notification.error({ message: "Please Select Order Item Track Status" });

            return;
        }

        let data = {
            track_status: trackStatus.replaceAll(' ', "_"),
            order_id: item_data.order_number,
            order_item_id: item_data._id,
        }

        if (trackStatus === "Return_Product_Picked" && item_data.track_status != "Returned") {
            notification.error({ message: "You can't choose this method because this product is not returned." })
            return;
        }

        let check = ["Return_Product_Picked", "Returned"];
        if (trackStatus === "Refund" && !check.includes(item_data.track_status)) {
            notification.error({ message: "You can't choose this refund method." })
            return;
        }


        if (trackStatus === "Exchange_Product_Picked" && item_data.track_status != "Exchange") {
            notification.error({ message: "You can't choose this method because this product is not exchange." })
            return;
        }

        let check2 = ["Exchange_Product_Picked", "Exchange"];
        if (trackStatus === "Exchange_Success" && !check2.includes(item_data.track_status)) {
            notification.error({ message: "You can't choose this exchange success." })
            return;
        }

        const res = await axios.post(`${baseUrl}/update/order/item/track/status`, data);

        notification.success({ message: res.data.message });

        this.setState({ updateOrderItemTrackStatusModal: false })
        this.getOrderDetails();

    }


    momentDateTimeFun = (date_time) => {
        return (
            <Moment format="DD-MMMM-YYYY   hh:mm:ss A" >{date_time}</Moment>
        )
    }

    ecomExpressDetailHandler = (data) => {
        this.setState({ ecomExpressDetailShippingData: data, ecomExpressDetailShippingModal: true })
    }


    exchangeProductData = (data, title) => {


        let param_data = {
            order_detail_id: data._id,
            order_id: data.order_number
        }


        this.props.dispatch({ type: 'order/exchangeData', payload: param_data }).then((res) => {


            if (res?.replaceOrderData) {
                this.setState({ modalData: res?.replaceOrderData, modalStatus: true, modalTitle: title })
            } else {
                // alert("No Exchange Data")
                notification.error({ message: "Product status is not exchange!" })
            }
        })

    }




    render() {
        const { page, limit, printModel, detail, orderItemData, modalData, orderItemVariants, orderDetailSellerData, ecomExpressDetailShippingData } = this.state;
        // const listData = [];
        // const total = 0;
        const { orderDetail } = this.props;

      
        

        let OrderTrackStatus = ['Shipped', 'Out_For_Delivery', 'Delivered', "Return_Product_Picked", "Refund", "Exchange_Product_Picked", "Exchange_Success"];

        // COLUMN ORDER ITEM CODE 
        const columns = [
            {
                title: <strong className="primary-text cursor" onClick={this.ChangeOrder}>Product Name</strong>,
                dataIndex: 'detail',
                render: (val, data) => <div className={data.isActive ? "" : 'danger-text'}>{data?.product_id?.title}</div>
            },
            {
                title: <strong>Price</strong>, dataIndex: 'price',
                render: (val, data) => {
                    return (
                        <div> {data?.amount + ' ₹'}</div>
                    )
                }
            },
            { title: <strong>Quantity</strong>, dataIndex: 'quantity' },
            {
                title: <strong>Item Status</strong>, dataIndex: 'item_status',
                render: (val, data) => {
                    return (
                        this.orderItemStauts(data.item_status)
                    )
                }
            },
            { title: <strong>Track Status</strong>, dataIndex: 'track_status' },


            {
                title: <strong>Action</strong>, dataIndex: '',
                render: (val, data) => {

                    // let order_item_product_id = data.product_id._id;
                    return (
                        <>
                            <Button type="primary" onClick={() => { this.viewItemDetailHandler(data) }}> View Item Detail </Button>
                            {/* <Button type="danger" onClick={() => { this.updateOrderItemHandler(data) }}> Update Track Status </Button> */}
                            {
                                data?.item_status != 2  &&
                                <Button type="danger" onClick={() => { this.updateOrderItemHandler(data) }}> Update Track Status </Button>
                            }

                            {
                                this.state.role === "ADMIN" ?
                                    <>
                                        <Button type="success" onClick={() => { this.productSellerDetailHandler(data.seller_id) }}> Product Seller Detail </Button>

{data.item_status   === 1 ? 
                                        <Button style={{ background: "skyblue" } }  onClick={() => { this.handleReturnDaysModal(data) }}> Add Return Days </Button>
:
<Button style={{ background: "skyblue" }} disabled> Add Return Days </Button>

}

                                    </>
                                    : ""
                            }
                            <Button type="success" onClick={() => { this.ecomExpressDetailHandler(data) }}> Logistics Price </Button>

                            <Button type="success" onClick={() => { this.exchangeProductData(data, "Exchange Product Details") }}> Exchange Details </Button>

                        </>
                    )
                }
            },
        ];



        let exchangeRows = "";

        if (Object.keys(modalData).length > 0) {
            for (let key in modalData) {
                if (typeof modalData[key] === "string") {
                    let keyData = key.replaceAll('_', " ");
                    exchangeRows += `<tr> <td> ${keyData} </td> <td> ${modalData[key]} </td> </tr>`
                }
            }
        }

        return (

            <div>
                {/* <ReactToPrint> */}
                <Apploader show={this.props.loading.global} />
                <Modal
                    title="Refund Confirmation"
                    visible={this.state.isModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel} >
                    <Input placeholder="Enter Description" onChange={(e) => this.setState({ ...this.state, modalDescriptionText: e.target.value })} />
                    <br /><br />
                    <Input placeholder="Enter Payment Id" onChange={(e) => this.setState({ ...this.state, modalPaymentIdText: e.target.value })} /><br /><br />
                    <Input placeholder="Enter Amount" onChange={(e) => this.setState({ ...this.state, modalAmountText: e.target.value })} /><br /><br />
                    <span style={{ color: 'red' }}>
                        <small>{this.state.showError ? this.state.showError : ""}</small>
                    </span>
                </Modal>



                <Modal
                    title="Select Cancellation Reason"
                    visible={this.state.isCancelOrderModalVisible}
                    onOk={this.handleCancelModalOk}
                    onCancel={this.handleCancelModalCancel} >
                    <Radio.Group onChange={this.GetNoteForCancel} value={this.state.cancelModalDescriptionText}>

                        <Radio value="Order Created by Mistake">Order Created by Mistake</Radio> <br />
                        <Radio value="Item(s) Would Not Arrive on Time">Item(s) Would Not Arrive on Time</Radio> <br />
                        <Radio value="Shipping Cost Too High">Shipping Cost Too High</Radio> <br />
                        <Radio value="Item Price Too High">Item Price Too High</Radio> <br />
                        <Radio value="Need to Change Payment Method">Need to Change Payment Method</Radio> <br />
                        <Radio value="others">
                            Others
                            {this.state.cancelModalDescriptionText === "others" ? <TextArea size="large" placeholder="Comments" onChange={(e) => this.GetNoteForCancelInput(e)} /> : ''}
                        </Radio>

                    </Radio.Group>

                </Modal>

                <div className="order-detail-heading">
                    <h2>Order details.</h2>&nbsp;
                    <span>ID: {orderDetail?._id}</span>
                </div>
                <div className="order-detail-actions" >
                    <Button type="primary" onClick={() => this.props.history.push('/orders')}>
                        Back to order list
                    </Button>
                    <div>
                        <Button type="primary" icon={<DownloadOutlined />} onClick={() => { this.download(orderDetail?._id, orderDetail?.product) }} style={{ background: "#1890FF", color: "#FFF", borderColor: "yellow" }}>Download Invoice</Button>
                        <Button type="primary" onClick={() => this.setState({ printModel: true })}>Print Invoice</Button>

                        &nbsp;
                        {/* {this.state.role === "ADMIN" ?    <Button type="danger" onClick={() => {this.openCancelOrderModal()}} disabled={this.disbleCancelButton(this.props.orderDetail)} >
                            Cancel order
                        </Button>
                        :
                        ''} 
                      */}
                    </div>
                </div>

                <Row gutter={5} style={{ marginBottom: '0.625rem' }} ref={el => (this.componentRef = el)} >
                    <Col span={14}>
                        <Card title="Order summary" bordered={false}>
                            <Row gutter={10}>
                                <Col span={24} >
                                    <div>
                                        <label className="order-detail-bold" >Order date:</label>&nbsp;<span className="order-detail-light">{orderDetail && orderDetail.create ? <Moment format="MM-DD-YYYY" >{orderDetail.create}</Moment> : '-'}</span><br />
                                        <label className="order-detail-bold" >Shipping service: </label>&nbsp;<span className="order-detail-light">--</span><br />
                                        <label className="order-detail-bold" >Fulfillment: </label>&nbsp;<span className="order-detail-light">--</span><br />
                                        <label className="order-detail-bold" >Payment Method: </label>&nbsp;<span className="order-detail-light">{orderDetail ? orderDetail.payment_method : '-'}</span><br />
                                        <label className="order-detail-bold" >Total Amount: </label>&nbsp;<span className="order-detail-light" style={{ fontWeight: "bold" }}> ₹{orderDetail?.totalAmount} </span><br />
                                        <label className="order-detail-bold" >Payment Status: </label>&nbsp;<span className="order-detail-light">

                                            {orderDetail ? this.paymentStatusDesign(orderDetail.payment_status) : ""}
                                            {/* {orderDetail?(orderDetail.payment_status ? <span style={{color:'green'}}>PAID</span> : <span style={{color:'red'}}>UNPAID</span>):'-'} */}

                                        </span><br />
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card title="Shipping Address" bordered={false} >

                            {orderDetail && orderDetail.address ? <span className="text-info text-bold mb-2">{orderDetail.address?.fname}</span> : null} {orderDetail && orderDetail.address ? <span className="text-info text-bold">{orderDetail.address?.lname}, <br /></span> : null}

                            <label className="" >Address 1:</label>&nbsp;<span className=""> {orderDetail && orderDetail?.address ? <span>{orderDetail.address?.add1}, </span> : null}</span><br />
                            <label className="" >Address 2:</label>&nbsp;<span className=""> {orderDetail && orderDetail?.address ? <span>{orderDetail.address?.add2}, </span> : null}</span><br />
                            <label className="" >City:</label>&nbsp;<span className=""> {orderDetail && orderDetail?.address ? <span>{orderDetail.address.city === undefined ? 'Jaipur' : orderDetail.address.city}, </span> : null}</span><br />

                            <label className="" >State:</label>&nbsp;<span className=""> {orderDetail && orderDetail?.address ? <span>{orderDetail.address?.state}, </span> : null}</span><br />
                            <label className="" >Country:</label>&nbsp;<span className=""> {orderDetail && orderDetail?.address ? <span>{orderDetail.address?.country}, </span> : null}</span><br />
                            {orderDetail && orderDetail?.address ? <span className="text-dark">({orderDetail.address?.postal}) </span> : null}




                            {/* {orderDetail && orderDetail?.address ?<div>{orderDetail.address?.add1}, </div>:null}
                            {orderDetail && orderDetail?.address ?<div>{orderDetail.address?.add2}, </div>:null}
                            {orderDetail && orderDetail?.address ?<span>{orderDetail.address?.postal}, </span>:null} {orderDetail && orderDetail.address?<span>{orderDetail.address?.state}, <br/></span> :null}
                            {orderDetail && orderDetail?.address ?orderDetail.address?.country:null} */}

                            {orderDetail && !orderDetail.address ? 'No address Found' : null}

                            <br /> <br />

                            {this.state.role === "ADMIN" ?
                                <>
                                    <b> Total Logistic Price: {orderDetail?.total_ecom_shipping_price} </b> <br />
                                    <b> Total Galinukkad Price: {orderDetail?.galinukkad_shipping_price} </b>
                                </>
                                :
                                ""}
                        </Card>
                    </Col>
                </Row>

                <Row gutter={5} style={{ marginBottom: '0.625rem' }} ref={el => (this.componentRef = el)} >
                    <Col span={14}>
                        <Card title="User Details" bordered={false}>
                            <Row gutter={10}>
                                <Col span={24} >
                                    <div>
                                        <label className="order-detail-bold" >
                                            Name:&nbsp;
                                        </label>
                                        <span className="order-detail-light">
                                            {orderDetail?.userInfo?.name ? orderDetail?.userInfo?.name : "N/A"}
                                        </span>
                                        <br />
                                        <label className="order-detail-bold">
                                            Email:&nbsp;
                                        </label>
                                        <span className="order-detail-light">
                                            {orderDetail?.userInfo?.email ? orderDetail?.userInfo?.email : "N/A"}
                                        </span>
                                        <br />
                                        <label className="order-detail-bold">
                                            Gender:&nbsp;
                                        </label>
                                        <span className="order-detail-light">
                                            {orderDetail?.userInfo?.gender ? orderDetail?.userInfo?.gender : "N/A"}
                                        </span>
                                        <br />
                                        <label className="order-detail-bold" >
                                            Phone:&nbsp;
                                        </label>
                                        <span className="order-detail-light">
                                            {orderDetail?.userInfo?.phone ? orderDetail?.userInfo?.phone : "N/A"}
                                        </span>
                                        <br />
                                        <label className="order-detail-bold" >
                                            Username:&nbsp;
                                        </label>
                                        <span className="order-detail-light">
                                            {orderDetail?.userInfo?.username ? orderDetail?.userInfo?.username : "N/A"}
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>


                </Row>


                {orderDetail?.payment_status === "Unpaid" ? <h5 style={{ color: "red", textAlign: "center" }}> Payment pending </h5> : null}
                <Table
                    style={{ marginBottom: "0.625rem" }}
                    columns={columns}
                    dataSource={orderDetail && orderDetail.orderDetail}
                    rowKey={record => record.id}
                    pagination={null}
                />

                {/* <Button type="danger" onClick={this.refundProductClickHandler}>Refund Selected Products</Button> */}
                <PrintOrders visible={printModel} closeModel={() => this.setState({ printModel: false, detail: '' })} />

                <br />
                <br />
                <br />

                {/* // VIEW ITEM DETAIL MODAL  */}
                <Modal
                    title="Order Item Detail"
                    visible={this.state.viewItemDetailModal}
                    onCancel={() => { this.setState({ viewItemDetailModal: false }) }}
                    onOk={() => { this.setState({ viewItemDetailModal: false }) }}

                >

                    <table style={{ width: "100%" }}>
                        <tr>
                            <td> ID </td>
                            <td> {orderItemData.order_number} </td>
                        </tr>
                        <tr>
                            <td> Item Status </td>
                            <td> {this.orderItemStauts(orderItemData.item_status)} </td>
                        </tr>
                        <tr>
                            <td> Track Status </td>
                            <td> {orderItemData.track_status} </td>
                        </tr>


                        {orderItemData.item_status === 2
                            ?
                            <>
                                <tr>
                                    <td> Cancelled Date </td>
                                    <td>

                                        {orderItemData && orderItemData.cancelled_date ? this.momentDateTimeFun(orderItemData.cancelled_date) : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td> Cancellation Message </td>
                                    <td style={{ 'color': 'red', 'fontWeight': "bold" }}> {orderItemData.cancel_desc} </td>
                                </tr>
                            </>
                            : ""
                        }


                        {orderItemData.item_status === 3
                            ?
                            <>
                                <tr>
                                    <td> Returned Date </td>
                                    <td>

                                        {orderItemData && orderItemData.returned_date ? this.momentDateTimeFun(orderItemData.returned_date) : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td> Return Message </td>
                                    <td style={{ 'color': 'red', 'fontWeight': "bold" }}> {orderItemData.return_desc} </td>
                                </tr>

                                <tr>
                                    <td> Return Product Images </td>
                                    <td>
                                        {orderItemData?.return_images.map((item) => {
                                            return (
                                                <a href={`${baseUrl}/return-images/${item.file}`} target="_blank">
                                                    <img src={`${baseUrl}/return-images/${item.file}`} style={{ width: "80px", height: "80px" }} />
                                                </a>
                                            )
                                        })}
                                    </td>
                                </tr>
                            </>
                            : ""
                        }





                        <tr>
                            <td> Order Item Tracking Number </td>
                            <td> {orderItemData.item_tracking_id && orderItemData.item_tracking_id} </td>
                        </tr>
                        <tr>
                            <td> Product Name </td>
                            <td> {orderItemData.product_id && orderItemData.product_id.title} </td>
                        </tr>

                        {
                            orderItemVariants && orderItemVariants.length > 0 &&
                            <tr>
                                <td> User Variants </td>
                                <td>

                                    {
                                        orderItemVariants.map((item, key) => {
                                            return (
                                                <div>
                                                    {JSON.stringify(item).replace(/[&\/\\#+()$~%.'"*?<>{}]/g, '')}
                                                    <br />
                                                </div>
                                            )
                                        })
                                    }

                                </td>
                            </tr>
                        }

                        <tr>
                            <td> Price </td>
                            <td> {orderItemData.product_id && orderItemData.amount} </td>
                        </tr>



                        <tr>
                            <td> Quantity </td>
                            <td> {orderItemData.product_id && orderItemData.quantity} </td>
                        </tr>
                        {
                            orderItemData?.item_status == 1 && 
                            <tr>
                                <td> Delivered Date </td>
                                <td> {orderItemData.product_id && this.momentDateTimeFun(orderItemData.delivered_date)} </td>
                            </tr>
                        }
                        <tr>
                            <td> Expected Delivered Date </td>
                            <td> {orderItemData.product_id && this.momentDateTimeFun(orderItemData.expected_delivered_date)} </td>
                        </tr>

                        <tr>
                            <td> Order Placed Date </td>
                            <td> {orderItemData.product_id && this.momentDateTimeFun(orderItemData.create)} </td>
                        </tr>

                    </table>

                    {/* <Input placeholder="Enter Description" onChange={(e) => this.setState({...this.state, modalDescriptionText: e.target.value })} />
                        <br/><br/>
                        <Input placeholder="Enter Payment Id" onChange={(e) => this.setState({...this.state, modalPaymentIdText: e.target.value })} /><br/><br/>
                        <Input placeholder="Enter Amount" onChange={(e) => this.setState({...this.state, modalAmountText: e.target.value })} /><br/><br/>
                        <span style={{color: 'red'}}>
                            <small>{this.state.showError ? this.state.showError : ""}</small>
                        </span> */}
                </Modal>




                <Modal
                    title="Update Order Item Track Status"
                    visible={this.state.updateOrderItemTrackStatusModal}
                    // onOk={() => {  this.updateItemTrackStatusHandler(this.state.orderItemData)  }}
                    onCancel={() => { this.setState({ updateOrderItemTrackStatusModal: false }) }}
                    footer={[
                        <Button key="submit" type="primary"
                            onClick={() => { this.updateItemTrackStatusHandler(this.state.orderItemData) }}
                        >
                            Update Track Status
                        </Button>
                    ]}
                >

                    <div>
                        <label> Please select product item track status   </label> <br />
                        <select name="order_item_track_status" className="form-control" onChange={(e) => { this.setState({ orderItemTrackStatusUpdate: e.target.value }) }}>
                            <option> Choose Track Status  </option>
                            {OrderTrackStatus.map((item, index) => <option value={item} key={index}>{item.replaceAll("_", " ")}</option>)}
                        </select>

                        {/* <button type="button" onClick={() => {  this.updateItemTrackStatusHandler(this.state.orderItemData) }}> Submit Track Status</button>
                             */}
                    </div>

                </Modal>


                <Modal
                    title="Product Seller Detail"
                    visible={this.state.productSellerDetailModal}
                    onOk={() => { this.setState({ productSellerDetailModal: false }) }}

                    onCancel={() => { this.setState({ productSellerDetailModal: false }) }}>

                    <table width="100%">
                        <tr>
                            <td> Seller ID </td>
                            <td> {orderDetailSellerData && orderDetailSellerData._id} </td>
                        </tr>
                        <tr>
                            <td> Username </td>
                            <td> {orderDetailSellerData && orderDetailSellerData.username} </td>
                        </tr>
                        <tr>
                            <td> Email </td>
                            <td> {orderDetailSellerData && orderDetailSellerData.email} </td>
                        </tr>


                    </table>

                </Modal>





                <Modal

                    title="Ecom Express Shipping Charges Detail"
                    visible={this.state.ecomExpressDetailShippingModal}
                    onCancel={() => { this.setState({ ecomExpressDetailShippingModal: false }) }}
                    onOk={() => { this.setState({ ecomExpressDetailShippingModal: false }) }}

                >


                    <table style={{ width: "100%" }}>
                        <tr>
                            <td> Seller PinCode </td>
                            <td> {ecomExpressDetailShippingData && ecomExpressDetailShippingData?.seller_pincode} </td>
                        </tr>
                        <tr>
                            <td> Customer PinCode </td>
                            <td>  {orderDetail && orderDetail?.address ? <span>{orderDetail.address?.postal} </span> : null} </td>
                        </tr>

                        {this.state.role === "ADMIN" ?
                            <tr>
                                <td> Ecom Express Price For This Product </td>
                                <td> {ecomExpressDetailShippingData && ecomExpressDetailShippingData?.ecom_shipping_price?.ecom_express_price} </td>
                            </tr>
                            : ""}
                        <tr>
                            <td> Logistics Price For This Product </td>
                            <td> {ecomExpressDetailShippingData && ecomExpressDetailShippingData?.galinukkad_shipping_price?.galinukkad_shipping_price} </td>
                        </tr>
                        <tr>
                            <td> Product Quantity </td>
                            <td> {ecomExpressDetailShippingData && ecomExpressDetailShippingData.quantity} </td>
                        </tr>

                        {this.state.role === "ADMIN" ?
                            <tr>
                                <td> Total Ecom Shipping Price  </td>
                                <td> {ecomExpressDetailShippingData && ecomExpressDetailShippingData?.ecom_shipping_price?.total_quantity_shipping_price} </td>
                            </tr>
                            : ""}
                        <tr>
                            <td> Total Logistics Price  </td>
                            <td> {ecomExpressDetailShippingData && ecomExpressDetailShippingData?.galinukkad_shipping_price?.total_quantity_galinukkad_price} </td>
                        </tr>

                        <tr>
                            <td> Zone </td>
                            <td> {ecomExpressDetailShippingData && ecomExpressDetailShippingData?.ecom_shipping_price?.zone} </td>
                        </tr>

                        <tr>
                            <td> Product Weight </td>
                            <td>
                                {ecomExpressDetailShippingData && ecomExpressDetailShippingData.product_weight} gms
                            </td>
                        </tr>


                        <tr>
                            <td> Frieght Rates For Apply Zone </td>
                            <td> {ecomExpressDetailShippingData && ecomExpressDetailShippingData?.ecom_shipping_price?.friegth_rates_for} </td>
                        </tr>
                    </table>

                </Modal>



                <Modal
                    title={this.state.modalTitle}
                    visible={this.state.modalStatus}
                    onCancel={() => { this.setState({ modalStatus: false }) }}
                >

                    <table style={{ width: "100%" }} >
                        <tbody dangerouslySetInnerHTML={{ __html: exchangeRows }}>

                        </tbody>
                        <tr>
                            <td> Exchange Images </td>
                            <td>
                                {modalData?.images?.map((item) => {
                                    return (
                                        <a href={`${baseUrl}/exchange-images/${item.file}`} target="_blank">
                                            <img src={`${baseUrl}/exchange-images/${item.file}`} style={{ width: "80px", height: "80px" }} />
                                        </a>
                                    )
                                })}
                            </td>
                        </tr>
                        <tr>
                            <td> Exchange Variants </td>
                            <td>
                                {JSON.stringify(modalData?.exchange_variants)}
                            </td>
                        </tr>



                    </table>

                </Modal>


                <ReturnFormModal 
                    data={this.state.modalData} 
                    status={this.state.returnDaysModalStatus}
                    handleStatus={() => { this.setState({ returnDaysModalStatus: false }) }}
                    updateReturnDaysForOrderItem={(data)=> this.updateReturnDaysForOrderItem(data)}
                    />

            </div>

        );
    }
};


const mapToProps = (state) => {
    return {
        orderDetail: state.order.detail,
        loading: state.loading,
        cancel: state.order.cancel
    }
};
export default connect(mapToProps)(OrderDetails);