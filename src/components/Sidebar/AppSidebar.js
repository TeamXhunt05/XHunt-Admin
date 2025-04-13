import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./AppSidebar.less";
import {
  DashboardOutlined,
  BarsOutlined,
  CoffeeOutlined,
  ControlOutlined,
  TeamOutlined,
  SketchOutlined,
  MoneyCollectOutlined,
  BankOutlined,
  NotificationOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  ContactsOutlined,
  AppstoreOutlined,
  UserAddOutlined,
  SnippetsOutlined,
  BookOutlined,
  InboxOutlined,
  MessageOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import axios from "axios";
import { Modal } from "antd";
const { SubMenu } = Menu;
const baseUrl = process.env.REACT_APP_ApiUrl;
const menu = [
  {
    path: "/",
    name: "Dashboard",
    icon: <DashboardOutlined />,
    auth: ["ADMIN", "STORE"],
  },
  {
    path: "#",
    name: "User Managment",
    icon: <TeamOutlined />,
    auth: ["ADMIN"],
    children: [
      {
        path: "/store-users",
        name: "Reatailer",
        icon: <TeamOutlined />,
        auth: ["ADMIN"],
      },
      // { path: '/customers', name: 'Customer List', icon: <TeamOutlined />, auth: ['ADMIN'] },
    ],
  },

  {
    path: "/stores",
    name: "Store",
    icon: <AppstoreOutlined />,
    auth: ["STORE"],
  },
  {
    path: "/pins",
    name: "Flat Discount Pin",
    icon: <SketchOutlined />,
    auth: ["STORE"],
  },
  {
    path: "/products",
    name: "Last Minute Pin",
    icon: <SketchOutlined />,
    auth: ["STORE"],
  },
  {
    path: "/orders",
    name: "Order",
    icon: <CalendarOutlined />,
    auth: ["STORE"],
  },

  {
    path: "#",
    name: "Store Managment",
    icon: <TeamOutlined />,
    auth: ["ADMIN"],
    children: [
      {
        path: "/stores",
        name: "Store List",
        icon: <AppstoreOutlined />,
        auth: ["ADMIN"],
      },
    ],
  },
  {
    path: "#",
    name: "Pin Managment",
    icon: <SketchOutlined />,
    auth: ["ADMIN"],
    children: [
      {
        path: "/pins",
        name: "Pin List",
        icon: <SketchOutlined />,
        auth: ["ADMIN"],
      },
    ],
  },
  // {
  // 	path: '#', name: 'Product Managment', icon: <TeamOutlined />, auth: ['STORE'], children: [
  // 		{ path: '/products', name: 'Product List', icon: <TeamOutlined />, auth: ['STORE'] },
  // 	]
  // },
  {
    path: "#",
    name: "Account Management",
    icon: <TeamOutlined />,
    auth: ["ADMIN"],
    children: [
      {
        path: "/approve",
        name: "Approve Business",
        icon: <BankOutlined />,
        auth: ["ADMIN"],
      },
    ],
  },

  // 	{
  // 	 path: '/orderssss', name: 'Order', icon: <UserOutlined />, auth: [ 'STORE'  ,'ADMIN']
  // },

  {
    path: "#",
    name: "CMS Management",
    icon: <TeamOutlined />,
    auth: ["ADMIN"],
    children: [
      {
        path: "/pages",
        name: "Pages",
        icon: <ControlOutlined />,
        auth: ["ADMIN"],
      },
    ],
  },

  {
    path: "#",
    name: "Order Management",
    icon: <TeamOutlined />,
    auth: ["ADMIN"],
    children: [
      {
        path: "/orders",
        name: "Order",
        icon: <CalendarOutlined />,
        auth: ["ADMIN"],
      },
    ],
  },
];

class AppSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maintenanceModeModal: false,
      isVerify: false,
      isAddStore: false,
    };
  }

  componentDidMount() {
    this.getSiteSettingData();
  }

  getSingleSettingData = (cards, id) => {
    let result;
    if (cards != undefined) {
      cards.map((item, key) => {
        if (item.option === id) {
          result = item.value;
        }
      });
    }
    return result;
  };

  getSiteSettingData = async () => {
    try {
      let user_id = localStorage.getItem("userId");
      const res = await axios.post(`${baseUrl}/api/list/setting`, {
        _id: user_id,
      });
      let settings = res?.data?.settings;
      console.log(
        "🚀 ~ file: AppSidebar.js:194 ~ AppSidebar ~ getSiteSettingData= ~ res:",
        res
      );
      let userStatus = this.getSingleSettingData(settings, "userStatus");
      let maintenanceMode = this.getSingleSettingData(
        settings,
        "SELLER_WEB_UNDER_MAINTENANCE"
      );
      let user_detail = res?.data?.user_detail;
      let user_status = res?.data?.user_detail?.user_status;

      this.setState({ isVerify: user_status });
      let user_role = localStorage.getItem("role");
      if (user_role === "ADMIN") {
        this.setState({ isAddStore: true });
      } else {
        this.setState({ isAddStore: res?.data?.isAddStore });
      }
    } catch (e) {
      console.log(e);
    }
  };
  handleRedirect = (path) => {
    let user_role = localStorage.getItem("role");
    if (user_role != "ADMIN") {
      this.getSiteSettingData();
    }
    this.props.history.push(path);
  };

  render() {
    const { location } = this.props;
    const pathSnippets = location.pathname.split("/").filter((i) => i);
    const pathval = pathSnippets[pathSnippets.length - 1] || "";
    const routepath = pathval ? "/" + pathval : "/";
    return (
      <>
        <Menu
          mode="inline"
          defaultSelectedKeys={[routepath]}
          defaultOpenKeys={[""]}
          selectedKeys={[routepath]}
          theme="dark"
        >
          {menu.map((item) => {
            if (
              item.auth.find((val) => val === localStorage.getItem("role")) &&
              this.state.isVerify &&
              this.state.isAddStore
            ) {
              if (item.children) {
                return (
                  <SubMenu
                    className="submenu"
                    key={item.name}
                    title={item.name}
                  >
                    {item.children.map((itemd, index) => {
                      if (
                        itemd.auth.find(
                          (val) => val === localStorage.getItem("role")
                        )
                      ) {
                        return (
                          <Menu.Item key={itemd.path}>
                            <a
                              onClick={() => {
                                this.handleRedirect(itemd.path);
                              }}
                            >
                              {itemd.img ? (
                                <img src={itemd.img} alt={itemd.name} />
                              ) : (
                                itemd.icon
                              )}
                              <span style={{ marginLeft: "5" }}>
                                {itemd.name}
                              </span>
                            </a>
                          </Menu.Item>
                        );
                      }
                    })}
                  </SubMenu>
                );
              } else {
                return (
                  <Menu.Item key={item.path}>
                    <a
                      // to={item.path}
                      onClick={() => {
                        this.handleRedirect(item.path);
                      }}
                    >
                      {item.img ? (
                        <img src={item.img} alt={item.name} />
                      ) : (
                        item.icon
                      )}
                      <span style={{ marginLeft: "5" }}>{item.name}</span>
                    </a>
                  </Menu.Item>
                );
              }
            }
          })}
        </Menu>
      </>
    );
  }
}
export default AppSidebar;
