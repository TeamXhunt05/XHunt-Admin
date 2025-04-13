import React, { useState, Component, useEffect } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Apploader from "../../components/loader/loader";
import { connect } from "dva";
import { Row, Col, Form, Input, Button, Checkbox, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import styles from "./login.less";
import Logo from "../../assets/img/logo.png";
import ForgotForm from "../../components/forgot/forgot"; 

const FormItem = Form.Item;

const AppLogin = (props) => {
  const [count, setCount] = useState(0);
  const [fcount, setFCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let logginValues = null;
  const handelPassword = () => {
    setShowPassword(!showPassword ,'sacncdskj   ');  
  };
  const forgotPass = (val) => {
    props.dispatch({ type: "auth/forgotFun", payload: val });
  };

  const onFinish = (values) => {
    logginValues = values;
    props.dispatch({ type: "auth/login", payload: { ...values, isOtp: "0" } });
  };

  useEffect(() => {
    let unmounted = false;
    const flow = localStorage.getItem("flow");
    let varify = props.auth.varify;
    if (flow && flow == "sin" && varify.status) {
      const LoginCred = localStorage.getItem("LoginCred");
    }
    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => {
    let unmounted = false;

    setTimeout(() => (document.title = "login"), 100);
    let login = props.auth.login;

    let varify_payment = props?.auth?.varify_payment;

    let stripe_screen = localStorage.getItem("stripe_screen");

    if (login && typeof login === "string" && login === "varify") {
      props.history.push("/verify");
      return;
    }

    if (Object.keys(varify_payment).length > 0 && stripe_screen == "true") {
      let status = varify_payment?.user_detail?.payment_status;
      if (!status) {
        props.history.push("/stripe-payment");
        return;
      }
    }

    if (login.user && login.user.isBussinessVerified == false) {
      console.log(login.user.isBussinessVerified);
      props.history.push("/business-verification");
      return;
    }

    if (
      !unmounted &&
      login.status === true &&
      login.count > count &&
      login.count !== 0
    ) {
      setCount(login.count);
      props.history.push("/");
    }
    return () => {
      unmounted = true;
    };
  }, [props]);

  useEffect(() => {
    let unmounted = false;
    let forgot = props.auth.forgot;
    if (!unmounted && forgot.count > fcount && forgot.status) {
      setFCount(forgot.count);
      props.history.push("/reset");
      setVisible(false);
    }
    return () => {
      unmounted = true;
    };
  }, [props.auth.forgot]);

  return (
    <div>
      <Apploader show={props.loading.global} />


      <Row
        type="flex"
        className="basicpage mobile_login"
        justify="space-around"
        align="middle"
      >
        <Col className="basicbox">
          <div className="mainimg"></div>
          <div className="mainform">
            <img
              className=" elevation-3 img-fluid mobile_login_logo"
              src={Logo}
            />
            <h1 class="login-box-msg">Login</h1>

            <div className="logo"></div>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email address!",
                  },
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                ]}
              >
                <Input
                  className="mobile-form-control"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  suffix={
                    showPassword ? (
                      <EyeTwoTone onClick={handelPassword} />
                    ) : (
                      <EyeInvisibleOutlined onClick={handelPassword} />
                    )
                  }
                />
              </Form.Item>

              <Form.Item>
                <a
                  className="login-form-forgot mobile-login-form-forgot"
                  onClick={() => setVisible(true)}
                >
                  Forgot password
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button mobile-login-form-button"
                >
                  Login
                </Button>{" "}
                <br /> <br />
               
                {/* {window.location.hostname == "seller.xhunt.co.in" && (
                    <Link to={"/register"} className="mobile-login-form-register">
                    Register now!
                  </Link>
                )} */}
                   <Link to={"/register"} className="mobile-login-form-register">
                    Register now!
                  </Link>

{/* 
                  <Link to={"/register"} className="mobile-login-form-register">
                    Register now!
                  </Link> */}
     
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
      <h4></h4>

      <ForgotForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onCreate={(val) => forgotPass(val)}
      />
    </div>
  );
};

export default connect(({ auth, loading }) => ({
  auth,
  loading,
}))(AppLogin);
