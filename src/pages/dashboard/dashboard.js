// import React, {useState, Component, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import React, { useState, Component, useEffect } from "react";
import Apploader from "./../../components/loader/loader";
import { connect } from "dva";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Avatar,
  Card,
  Descriptions,
  Statistic,
  Collapse,
  Alert,
} from "antd";
import moment from "moment";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { API_URL, MAP_API_KEY } from "./../../utils/constants";
import Geocode from "react-geocode";
import { ClockCircleOutlined  ,UserOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const Dashboard = (props) => {
  const { dispatch } = props;
  const [details, setDetails] = useState([{}]);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [countData, setCountData] = useState({});
  const [detailData, setDetailData] = useState({});
  const [verified, setVerified] = useState(false);
  const [storeVerified, setStoreVerified] = useState(false);

  const [flatpin, setFlatPin] = useState([]);
  const [lastpin, setLastPin] = useState([]);

  const [latLng, setLatLng] = useState({
    lat: 26.896593,
    lng: 75.770676,
  });

  useEffect(() => {
    let unmounted = false;
    setTimeout(() => (document.title = "Dashboard"), 100);
    getDashbordDetail(props.countData);
    setRole(localStorage.getItem("role"));
    setUserId(localStorage.getItem("userId"));
    return () => {
      unmounted = true;
    };
  }, [dispatch]);

  const getDashbordDetail = async (id) => {
    let user_id = localStorage.getItem("userId");
    let userId = localStorage.getItem("userId");

    dispatch({
      type: "account/getDashbordDetail",
      payload: { start_date: "", user_id: userId },
    });
  };

  useEffect(() => {
    let detail = props.account.dashborddetail;
    console.log("🚀 ~ file: dashboard.js:45 ~ useEffect ~ detail:", detail);
    setDetails(detail.countData);
    console.log(detail.countData);
    setDetailData(detail);
    setVerified(detail.countData && detail.countData.isStore);
    setStoreVerified(detail.countData && detail.countData.isStoreVerifed);

    let flat =
      detail.countData?.Pins_List &&
      detail?.countData?.Pins_List?.filter(
        (val) => val.categories === "FLAT_DISCOUNT_PIN"
      );
    let last =
      detail.countData?.Pins_List &&
      detail?.countData?.Pins_List?.filter(
        (val) => val.categories === "LAST_MINUTE_PIN"
      );

    let latLongs = {
      lat:
        detail.countData?.Pins_List &&
        detail?.countData?.Store_List[0] &&
        detail?.countData?.Store_List[0].latitude,
      lng:
        detail.countData?.Pins_List &&
        detail?.countData?.Store_List[0] &&
        detail?.countData?.Store_List[0].longitude,
    };
    setLatLng(latLongs);

    setFlatPin(flat);
    setLastPin(last);
  }, [props.account]);

  return (
    <div>
      <Apploader show={props.loading.global} />
      {role !== "ADMIN" ? (
        <>
          {role !== "ADMIN" && !storeVerified && verified && (
            <>
              <Alert
                // message="Please Add Your Store"
                description={
                  "Your request is received by Hunt verification team, our team is verifying your store details and you will notified as soon as your account will be verified."
                }
                type="error"
                className="mb-4"
              />
            </>
          )}

          <Row gutter={15} className="mobile_dashboard">
            {/* { verified && storeVerified */}

            {verified && (
              <>
                <Col xs={{ span: 12 }} sm={6} md={4}>
                  <Card
                    className="card_hover"
                    onClick={() => {
                      props.history.push("/pins");
                    }}
                  >
                    <Statistic
                      title="Total Pins"
                      value={details && details.Total_Pins}
                    />
                  </Card>
                  <br />
                </Col>

                <Col xs={{ span: 12 }} sm={6} md={4}>
                  <Card
                    className="card_hover"
                    onClick={() => {
                      props.history.push("/products");
                    }}
                  >
                    <Statistic
                      title="Total Products"
                      value={details && details.Total_Products}
                    />
                  </Card>
                  <br />
                </Col>

                <Col xs={{ span: 12 }} sm={6} md={4}>
                  <Card
                    className="card_hover"
                    onClick={() => {
                      props.history.push("/orders");
                    }}
                  >
                    <Statistic
                      title="Total Orders"
                      value={details && details.Total_Student}
                    />
                  </Card>
                  <br />
                </Col>

                <Col xs={{ span: 12 }} sm={6} md={4}>
                  <Card
                    className="card_hover"
                    onClick={() => {
                      props.history.push("/");
                    }}
                  >
                    <Statistic
                      title="Return Orders"
                      value={details && details.Total_Employee}
                    />
                  </Card>
                  <br />
                </Col>

                <div></div>

                <Col xs={{ span: 12 }} sm={12} md={12}>
                  <Card title={<span> Store Detail </span>} style={{}}>
                    {/* <div style={{ display: 'flex', justifyContent: "left", padding: "20px 10px" }}>
   <Avatar shape="square" size={160} src={ details && details.Store_List && details.Store_List[0]?.images && details.Store_List[0]?.images[0]?.url} style={{ marginBottom: '2px' }} />
</div> */}

                    <Row style={{ marginBottom: "0.625rem" }}>
                      <Col span={8}>
                        <span style={{ color: "#666", fontWeight: "700" }}>
                          Store Name
                        </span>
                      </Col>
                      <Col span={16}>
                        {details &&
                          details.Store_List &&
                          details.Store_List[0]?.title}
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: "0.625rem" }}>
                      <Col span={8}>
                        <span style={{ color: "#666", fontWeight: "700" }}>
                          Store Cuisine
                        </span>
                      </Col>
                      <Col span={16}>
                        {/* {details && details.Store_List && details.Store_List[0]?.cuisine} */}
                        {details &&
                          details.Store_List &&
                          details.Store_List[0]?.cuisine?.map((val) => (
                            <>{val} </>
                          ))}
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: "0.625rem" }}>
                      <Col span={8}>
                        <span style={{ color: "#666", fontWeight: "700" }}>
                          Store Category
                        </span>
                      </Col>
                      <Col span={16}>
                        {details &&
                          details.Store_List &&
                          details.Store_List[0]?.store_category}
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: "0.625rem" }}>
                      <Col span={8}>
                        <span style={{ color: "#666", fontWeight: "700" }}>
                          Store Open Time
                        </span>
                      </Col>
                      <Col span={16}>
                        {details &&
                          moment(
                            details.Store_List &&
                              details.Store_List[0]?.open_time
                          ).format("hh:mm a")}
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: "0.625rem" }}>
                      <Col span={8}>
                        <span style={{ color: "#666", fontWeight: "700" }}>
                          Store Close Time
                        </span>
                      </Col>
                      <Col span={16}>
                        {details &&
                          moment(
                            details.Store_List &&
                              details.Store_List[0]?.close_time
                          ).format("hh:mm a")}
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: "0.625rem" }}>
                      <Col span={8}>
                        <span style={{ color: "#666", fontWeight: "700" }}>
                          State
                        </span>
                      </Col>
                      <Col span={16}>
                        {details &&
                          details.Store_List &&
                          details.Store_List[0]?.state}
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: "0.625rem" }}>
                      <Col span={8}>
                        <span style={{ color: "#666", fontWeight: "700" }}>
                          City
                        </span>
                      </Col>
                      <Col span={16}>
                        {details &&
                          details.Store_List &&
                          details.Store_List[0]?.city}
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: "0.625rem" }}>
                      <Col span={8}>
                        <span style={{ color: "#666", fontWeight: "700" }}>
                          Postal
                        </span>
                      </Col>
                      <Col span={16}>
                        {details &&
                          details.Store_List &&
                          details.Store_List[0]?.postal}
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: "0.625rem" }}>
                      <Col span={8}>
                        <span style={{ color: "#666", fontWeight: "700" }}>
                          Store Address
                        </span>
                      </Col>
                      <Col span={16}>
                        {details &&
                          details.Store_List &&
                          details.Store_List[0]?.address}
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: "0.625rem" }}>
                      <Col span={8}>
                        <span style={{ color: "#666", fontWeight: "700" }}>
                          Created At
                        </span>
                      </Col>
                      <Col span={16}>
                        {/* {details && details.Store_List && details.Store_List[0]?.created_at} */}
                        {moment(
                          details &&
                            details.Store_List &&
                            details.Store_List[0]?.created_at
                        ).format("DD-MM-YYYY")}
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: "3.98rem" }}>
                      <Col span={8}>
                        <span style={{ color: "#666", fontWeight: "700" }}>
                          Status
                        </span>
                      </Col>
                      <Col span={16}>
                        {(details &&
                          (details.Store_List &&
                          details.Store_List[0]?.status ? (
                            <span style={{ color: "green" }}>Publish</span>
                          ) : (
                            <span style={{ color: "red" }}>UnPublish</span>
                          ))) ||
                          "-"}
                      </Col>
                    </Row>

                    <Col span={24}></Col>
                  </Card>
                </Col>
                <Col xs={{ span: 12 }} sm={12} md={12}>
                  <Card title={<span>Contact Info</span>} style={{}}>
                    <Row style={{ marginBottom: "0.625rem" }}>
                      <Col span={8}>
                        <span style={{ color: "#666", fontWeight: "700" }}>
                          Email
                        </span>
                      </Col>
                      <Col span={16}>
                        {(detailData.countData &&
                          detailData.countData.get_UserInfo.email) ||
                          ""}
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: "0.625rem" }}>
                      <Col span={8}>
                        <span style={{ color: "#666", fontWeight: "700" }}>
                          Mobile Number
                        </span>
                      </Col>
                      <Col span={16}>
                        {(detailData.countData &&
                          detailData.countData.get_UserInfo.mobile_number) ||
                          ""}
                      </Col>
                    </Row>

                    <Col span={24}></Col>
                  </Card>

                  <Card
                    title={
                      <div class="d-flex justify-content-between">
                        <span> FLAT DISCOUNT PIN </span>
                        {flatpin && flatpin.length === 0 && (
                          <span>
                            {" "}
                            <Button
                              type="primary"
                              onClick={() => {
                                props.history.push(
                                  "/pin/add/FLAT_DISCOUNT_PIN?redirect=dashboard"
                                );
                              }}
                            >
                              Add Flat Discount Pin
                            </Button>
                          </span>
                        )}
                      </div>
                    }
                    style={{ marginTop: "0rem" }}
                  >
                    {flatpin && flatpin.length === 0 ? (
                      <>
                        <Row style={{ marginBottom: "0.625rem" }}>
                          <Col span={16}>Please Add Pin</Col>

                          <Col span={16}>&nbsp;</Col>
                        </Row>
                      </>
                    ) : (
                      <>
                        <Row style={{ marginBottom: "0.625rem" }}>
                          <Col span={8}>
                            <span style={{ color: "#666", fontWeight: "700" }}>
                              Title
                            </span>
                          </Col>
                          <Col span={16}>
                            {flatpin && flatpin[0] && flatpin[0]?.title}
                          </Col>
                        </Row>

                        <Row style={{ marginBottom: "0.625rem" }}>
                          <Col span={8}>
                            <span style={{ color: "#666", fontWeight: "700" }}>
                              Status
                            </span>
                          </Col>
                          <Col span={16}>
                            {(flatpin &&
                              (flatpin &&
                              flatpin[0] &&
                              flatpin[0]?.is_published ? (
                                <span style={{ color: "green" }}>Publish</span>
                              ) : (
                                <span style={{ color: "red" }}>UnPublish</span>
                              ))) ||
                              "-"}
                          </Col>
                        </Row>
                      </>
                    )}
                  </Card>

                  <Card
                    title={
                      <div class="d-flex justify-content-between">
                        <span> LAST MINUTES PIN </span>
                        {lastpin && lastpin.length === 0 && (
                          <span>
                            {" "}
                            <Button
                              type="primary"
                              onClick={() => {
                                props.history.push(
                                  "/product/add?redirect=dashboard"
                                );
                              }}
                            >
                              Add Last Minute Pin
                            </Button>{" "}
                          </span>
                        )}
                      </div>
                    }
                    style={{ marginTop: "0rem" }}
                  >
                    {lastpin && lastpin.length === 0 ? (
                      <>
                        <Row style={{ marginBottom: "0.625rem" }}>
                          <Col span={16}>Please Add Pin</Col>

                          <Col span={16}>&nbsp;</Col>
                        </Row>
                      </>
                    ) : (
                      <>
                        <Row style={{ marginBottom: "0.625rem" }}>
                          <Col span={8}>
                            <span style={{ color: "#666", fontWeight: "700" }}>
                              Title
                            </span>
                          </Col>
                          <Col span={16}>
                            {lastpin && lastpin[0] && lastpin[0]?.title}
                          </Col>
                        </Row>

                        <Row style={{ marginBottom: "0.625rem" }}>
                          <Col span={8}>
                            <span style={{ color: "#666", fontWeight: "700" }}>
                              Status
                            </span>
                          </Col>
                          <Col span={16}>
                            {(lastpin &&
                              (lastpin &&
                              lastpin[0] &&
                              lastpin[0]?.is_published ? (
                                <span style={{ color: "green" }}>Publish</span>
                              ) : (
                                <span style={{ color: "red" }}>UnPublish</span>
                              ))) ||
                              "-"}
                          </Col>
                        </Row>
                      </>
                    )}
                  </Card>
                </Col>

                <Col className="mb-5"></Col>
              </>
            )}
          </Row>

          {role !== "ADMIN" && !verified && (
            <>
              <Button
                type="primary"
                className="mb-4"
                onClick={() => props.history.push("/store/add?verify=verify")}
              >
                Add Store
              </Button>
              <Alert
                message="Please Add Your Store"
                // description={"Your request is received by Hunt verification team, our team is verifying your details and you will notified as soon as your account will be verified."}
                type="error"
              />
            </>
          )}
        </>
      ) : (
        <>
          {/* <Row gutter={15}>
			<Col xs={{ span: 24 }} sm={24} md={24}>
			<Collapse defaultActiveKey={['']}>
				<Panel header={role === "ADMIN"?"Admin INFO":"STORE INFO"} key="1">
				  <Descriptions>
					<Descriptions.Item label="Name">{detailData.countData && detailData.countData.get_UserInfo.username || ''}</Descriptions.Item>
					<Descriptions.Item label="Mobile Number">{detailData.countData && detailData.countData.get_UserInfo.mobile_number || ''}</Descriptions.Item>
					<Descriptions.Item label="Email">{detailData.countData && detailData.countData.get_UserInfo.email || ''}</Descriptions.Item>
					<Descriptions.Item label="Roles">{detailData.countData && detailData.countData.get_UserInfo.roles || ''}</Descriptions.Item>
				  </Descriptions>
				</Panel>
			  </Collapse>
				<br/>
			</Col>
		</Row>
		 */}

          <Row gutter={15} className="mobile_dashboard">
            <Col xs={{ span: 12 }} sm={6} md={4}>
              <Card
                className="card_hover card-shadow "
                onClick={() => {
                  props.history.push("/approve");
                }}
              >
<Row style={{marginBottom:"5px"}}>

                {/* <ClockCircleOutlined   style={{ fontSize: 30, marginBottom: "4px" ,color: "#FF0854"}} /> */}
</Row>
                <Statistic
                  title="Pending Approvals"
                  value={details && details.Pending_Approval?.length}
                  
                />
              </Card>
              <br />
            </Col>

            <Col xs={{ span: 12 }} sm={6} md={4}>
              <Card
                className="card_hover card-shadow"
                onClick={() => {
                  props.history.push("/store-users");
                }}
              >
              <Row style={{marginBottom:"5px"}}>

{/* <UserOutlined   style={{ fontSize: 30, marginBottom: "4px" ,color: "#FF0854"}} /> */}
</Row>
                <Statistic
                  title="Total Users"
                  value={details && details.GetTotalUsers}
                />
              </Card>
              <br />
            </Col>
            <Col xs={{ span: 12 }} sm={6} md={4}>
              <Card
                className="card_hover card-shadow"
                onClick={() => {
                  props.history.push("/stores");
                }}
              >
                <Statistic
                  title="Total Stores"
                  value={details && details.Total_Store}
                />
              </Card>
              <br />
            </Col>

            <Col xs={{ span: 12 }} sm={6} md={4}>
              <Card
                className="card_hover card-shadow"
                onClick={() => {
                  props.history.push("/pins");
                }}
              >
                <Statistic
                  title="Total Pins"
                  value={details && details.Total_Pins}
                />
              </Card>
              <br />
            </Col>

            {/* <Col xs={{ span: 12 }} sm={6} md={4}>
			<Card className="card_hover card-shadow"  onClick={() => {props.history.push('/products' )	}}><Statistic title="Total Products" value={details && details.Total_Products} /></Card><br/>
		</Col> */}

            <Col xs={{ span: 12 }} sm={6} md={4}>
              <Card
                className="card_hover card-shadow"
                onClick={() => {
                  props.history.push("/orders");
                }}
              >
                <Statistic
                  title="Return Orders"
                  value={details && details.Total_Employee}
                />
              </Card>
              <br />
            </Col>
          </Row>

          {role === "ADMIN" &&
            details &&
            details.Pending_Approval.map((val) => {
              let msg = `${val?.userInfo?.username} add a new store ${val?.storeInfo?.title} and request to approve this store`;

              return (
                <>
                  <Alert
                    // message="Please Add Your Store"
                    description={msg}
                    type="error"
                    className="card_hover"
                    onClick={() => {
                      props.history.push(
                        `/store/view/${val.store_id}?redirect=approve`
                      );
                    }}
                  />
                </>
              );
            })}
        </>
      )}
    </div>
  );
};

export default connect(({ account, loading }) => ({
  loading,
  account,
}))(Dashboard);
