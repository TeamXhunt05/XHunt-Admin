import React, { useState, Component, useEffect } from "react";
import Apploader from "./../../components/loader/loader";
import { Redirect, Route } from "react-router";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { connect } from "dva";
import Logo from "../../assets/img/logo.png";
import UploadImages from "./../../components/upload-images/index";

//import styles from './login.less';

import {
  Modal,
  Row,
  Col,
  Form,
  Input,
  Button,
  message,
  Select,

} from "antd";

const formRef = React.createRef();

const AppRegister = (props) => {
  const [count, setCount] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const handelPassword = () => {
    setShowPassword(!showPassword);
  };


  const onFinish = (values) => {

    values.roleType = "STORE";
    localStorage.setItem("flow", "reg");
    localStorage.setItem("user_email", values.email);
    const formData = new FormData();
    formData.append("password", values.password);
    formData.append("user_name", values.user_name);
    formData.append("mobile_number", values.mobile_number);
    formData.append("email", values.email);
    formData.append("roleType", values.roleType);




    props.dispatch({ type: "auth/register", payload: formData });
  };

  useEffect(() => {
    let unmounted = false;
    setTimeout(() => (document.title = "register"), 100);
    let register = props.auth.reg;
    if (
      !unmounted &&
      register.action &&
      register.action.status === true &&
      register.action.count > count
    ) {
      setCount(register.action.count);
      props.dispatch({ type: "auth/registerSuccess" });
      formRef.current.setFieldsValue({
        ["email"]: "",
        ["mobile_number"]: "",
        ["user_name"]: "",
        ["password"]: "",

      });

      
      // setTimeout(() => {
      //   Modal.success({
      //     content:
      //       "Registered Successfully! Hunt team will contact you soon",
      //     onOk() {
      //       props.history.push("/verify");
      //     },
      //   });
      // }, 300);

      props.history.push("/verify");
      // setTimeout(() => {
      //   Modal.success({
      //     content:
      //       "Registered Successfully! Hunt team will contact you soon",
      //     onOk() {
      //       props.history.push("/verify");
      //     },
      //   });
      // }, 300);
    }
    return () => {
      unmounted = true;
    };
  }, [props.auth.reg]);

  useEffect(() => {
    let unmounted = false;
    let response = [];
    let alrdreg = props.auth.alrdreg;
    if (alrdreg.action && alrdreg.action.status === false) {
      props.dispatch({ type: "auth/alrdregisterSuccess" });
      props.dispatch({ type: "auth/alrdreg", ...response });
      props.history.push("/login");
    }
    return () => {
      unmounted = true;
    };
  }, [props.auth.alrdreg]);

  return (
    <div>
      <Apploader show={props.loading.global} />
      <Row
        type="flex"
        className={"basicpage"}
        justify="space-around"
        align="middle"
        style={{ minHeight: "100vh" }}
      >
        <Col className="basicbox ">
          <div className="mainimg registerimg basicbox_height"></div>
          <div className="mainform mobile_mainform">
          <img
              className=" elevation-3 img-fluid mobile_login_logo"
              src={Logo}
            />
         <h1>Store Signup</h1>
					<div className="logo">
					</div>
            <Form
              ref={formRef}
              layout={"vertical"}
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="user_name"
                rules={[
                  {
                    required: true,
                    message: "Please input user name!",
                  },
                  {
                    pattern: /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/,
                    message:
                      "letters and digits, with hyphens, underscores and spaces as internal separator",
                  },
                  {
                    max: 25,
                    message:
                      "user name must not be greater than 25 characters.",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Enter user name"
                />
              </Form.Item>
   
 
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email!",
                  },
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                name="mobile_number"
                rules={[
                  {
                    required: true,
                    message: "Please input your Phone Number!",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Need to enter number",
                  },
                  {
                    len: 10,
                    message: "Phone number should be 10 digits long.",
                  },
                ]}
              >
                <Input
                  type="tel"
                  prefix={<MobileOutlined className="site-form-item-icon" />}
                  placeholder="Phone Number"
                />
              </Form.Item>
  

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                  {
                    pattern:
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    message:
                      "Minimum eight characters, at least one letter, one number and one special character:",
                  },
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
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button mobile-register-form-button"
                >
                  {" "}
                  Sign Up{" "}
                </Button>{" "}
                <br />
                <br />
                Or{" "}
                <span onClick={() => props.history.push("/")}>
                  <a href="#" className="mobile-register-already">
                    Already have a account!
                  </a>
                </span>
              </Form.Item>
            </Form>

          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ auth, loading }) => ({
  auth,
  loading,
}))(AppRegister);
