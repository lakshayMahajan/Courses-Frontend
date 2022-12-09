import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { Typography, Button, Avatar, Tooltip } from "antd";
import {
  UserOutlined,
  CompassOutlined,
  ContactsOutlined,
  EditOutlined,
  DatabaseOutlined,
  BookOutlined,
  BugTwoTone,
  LogoutOutlined,
} from "@ant-design/icons";

import { loginRequest } from "../authConfig";

import logo from "../img/hseapps.png";
import AuthContext from "../auth/AuthContext.js";

import { motion } from "framer-motion";

const { Title, Text } = Typography;

const Navbar = ({ tabbed, instance, signOutClickHandler }) => {
  const { auth } = useContext(AuthContext);
  const [width, setWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  const tab = (path, Component, name) => (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Link style={{ color: "black" }} to={path}>
        <Component style={{ marginRight: "10px", color: "#1890ff" }} />
        {name}
      </Link>
    </motion.div>
  );
  const tabLink = (path, Component, name) => (
    <motion.div whileHover={{ scale: 1.05 }}>
      <a href={path} target="_blank" style={{ color: "black" }}>
        <Component style={{ marginRight: "10px", color: "#1890ff" }} />
        {name}
      </a>
    </motion.div>
  );

  return (
    <div
      style={{
        padding: "12px 18px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        borderBottom: "solid 1px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "calc(175px + .3vw)",
        }}
      >
        <img src={logo} style={{ height: "calc(34px + .1vw)" }} />
        <div
          style={{
            margin: "0 0 0 10px",
            fontSize: "calc(20px + .1vw)",
            fontWeight: "500",
          }}
        >
          HSE Courses
        </div>
      </div>

      {tabbed && (
        <>
          {auth?.user?.role === "teacher" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "17px",
                width: "550px",
              }}
            >
              {tab("/", ContactsOutlined, "Student List")}
              {tab("/diplomas", BookOutlined, "Diplomas")}
              {tab("/search", CompassOutlined, "Course Search")}
              {tab("/other-edits", EditOutlined, "Other Edits")}
            </div>
          ) : auth?.user?.role === "student" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "17px",
                width: "400px",
              }}
            >
              {tab("/", DatabaseOutlined, "Planner")}
              {tab("/search", CompassOutlined, "Course Search")}
              {tab("/diplomas", BookOutlined, "Diplomas")}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "17px",
                width: "300px",
              }}
            >
              {tab("/search", CompassOutlined, "Course Search")}
              {tab("/diplomas", BookOutlined, "Diplomas")}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "calc(170px + .3vw)",
              justifyContent: "flex-end",
            }}
          >
            {auth?.user ? (
              <>
                <Text style={{ marginRight: "10px", fontSize: "16px" }}>
                  {auth.user.displayName}
                </Text>
                <Tooltip title="Logout">
                  <Button
                    onClick={() => {
                      signOutClickHandler(instance);
                    }}
                    style={{ color: "#1890ff", borderColor: "#1890ff" }}
                  >
                    <LogoutOutlined />
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    instance.loginPopup(loginRequest).catch((e) => {
                      console.log(e + "login error");
                    });
                  }}
                  style={{ color: "#1890ff", borderColor: "#1890ff" }}
                >
                  Student Login
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
