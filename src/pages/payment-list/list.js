import React from 'react';
import { connect } from 'dva';
import { Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { UserOutlined, LockOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import jwt_decode from "jwt-decode";
import fetch from 'dva/fetch';
import Moment from 'react-moment';


const { Search } = Input;
const { Text } = Typography;

class PaymentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, Addcount: 0, limit: 25, current: 1, searchText: '', loader: false, detail: '', addModel: false, listData: [], data: [], pagination: { current: 1, pageSize: 10 }, loading: false, sortBy: 'asc', inactive: false }
    setTimeout(() => document.title = 'Subject List', 100);
  }
  componentDidMount() {
    this.ListFun();
  }

  ListFun = () => {
    const user = jwt_decode(localStorage.getItem('token'));


    let search = 'page=' + (this.state.current - 1) + "&limit=" + this.state.limit + "&inactive=" + this.state.inactive + "&searchText=" + this.state.searchText + "&sortBy=" + this.state.sortBy;
    localStorage.setItem('newsSearch', JSON.stringify(this.state));
    let searchval = { page: this.state.current - 1, limit: this.state.limit, inactive: this.state.inactive, searchText: this.state.searchText, sortBy: this.state.sortBy }
    this.props.dispatch({ type: 'plans/getStripePaymentList', payload: searchval, });


  }
  ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
  switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
  ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());
  paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

  searchVal = (val) => {
    this.state.searchText = val
    const resultAutos = this.props.plans.list.data.filter((auto) => auto.subject_name.toLowerCase().includes(val.toLowerCase()))

    this.setState({ listData: resultAutos })
  }


  render() {
    const { loading, addModel, detail, searchText } = this.state;
    const { plans } = this.props;

    let stripePayments = plans?.payment_list?.stripePayments;
    console.log('plans ---', stripePayments)

    const total = 0;
    const totalActive = 0;
    if (this.state.searchText == '') {
      this.state.listData = plans.list ? plans.list.data : [];
    }



    const list = [
      {
        title: <strong>Payment ID</strong>,
        dataIndex: '_id',
      },
      { title: <strong>Email</strong>, dataIndex: 'email' },
      { title: <strong>User ID</strong>, dataIndex: 'user_id' },
      { title: <strong>Payment Intent ID</strong>, dataIndex: 'payment_intent_id' },
      {
        title: <strong>Payment Status</strong>, dataIndex: 'payment_status',
        render: (val, data) => {
          if (data.payment_status === "SUCCESS") {
            return <span style={{ color: "green" }}> {data.payment_status} </span>
          }
          if (data.payment_status === "FAILED") {
            return <span style={{ color: "red" }}> {data.payment_status} </span>
          }

          return <span> {data.payment_status} </span>
        }
      },
      { title: <strong>Client Secret</strong>, dataIndex: 'client_secret' },
      {
        title: <strong>Created Date</strong>,
        dataIndex: 'created_at',
        render: (val, data) => {
          return (data.created_at ? <Moment format="MM- DD-YYYY" >{data.created_at}</Moment> : '-')
        }
      }
    ];

    return (
      <>
        <Card>
          <Row style={{ marginBottom: "0.625rem" }} className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
            <Col>
              <Search placeholder="Search..." loading={this.props.submitting} onChange={(e) => this.searchVal(e.target.value)} value={searchText} />
            </Col>
            <Col>
              <Button type="primary" onClick={() => this.setState({ addModel: true })}>Add</Button>
            </Col>
          </Row>
          <Table
            scroll={{ x: 400 }}
            columns={list}
            loading={this.props.loading.global}
            rowKey={record => record._id}
            dataSource={stripePayments}
            onChange={this.paginationFun}
            onRow={(record, rowIndex) => {
              return {
                onClick: plans => this.setState({ addModel: true, detail: record })
              };
            }}
            pagination={{
              position: ['bottomLeft'],
              showTotal: (total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger: true,
              responsive: true,
              onShowSizeChange: (current, size) => this.ShowSizeChange(current, size),
              pageSizeOptions: ['10', '25', '50', '100', '250', '500'],
            }}
          />
        </Card>

      </>

    );
  }
};


export default connect(({ plans, loading }) => ({
  plans,
  loading
}))(PaymentList);
