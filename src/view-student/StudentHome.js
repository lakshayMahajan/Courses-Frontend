import React, { useContext, useEffect } from "react";

import CheckContext from "../contexts/CheckContext";
import AuthContext from "../auth/AuthContext.js";

import CounselorEmail from "./CounselorEmail";
import Stats from "./Statistics";
import YearPlan from "./YearPlan";

import { displayCheck } from "../Utils";

import { Tabs, Tooltip } from "antd";
import { WarningTwoTone } from "@ant-design/icons";
import OtherDataContext from "../contexts/OtherDataContext";
const { TabPane } = Tabs;

const StudentHome = () => {
  const { auth } = useContext(AuthContext);
  const { checkContext, setCheckContext } = useContext(CheckContext);
  const { otherDataContext } = useContext(OtherDataContext);

  useEffect(() => {
    if (auth.user.courseData) {
      if (otherDataContext) {
        setCheckContext(
          displayCheck(
            auth.user.courseData.courses,
            otherDataContext.diplomaData[0]
          )
        );
      }
    }
  }, [auth, otherDataContext]);

  return (
    <div id="body" style={{ height: "120vh", marginTop: "60px" }}>
      <Tabs
        defaultActiveKey="1"
        tabBarStyle={{
          position: "unset",
          marginBottom: "50px",
          height: "50px",
        }}
      >
        <TabPane tab="Four Year Plan" key="1">
          <YearPlan />
        </TabPane>

        <TabPane
          tab={
            <div>
              {checkContext?.mScNError ? (
                <Tooltip
                  title={
                    <div style={{ fontSize: "12px" }}>
                      We have identified errors in your schedule.
                    </div>
                  }
                  placement="right"
                >
                  Errors and Statistics &nbsp;
                  <WarningTwoTone
                    twoToneColor="#ff0044"
                    style={{ margin: "0px" }}
                  />
                </Tooltip>
              ) : (
                <div>Errors and Statistics</div>
              )}
            </div>
          }
          key="2"
        >
          <Stats />
        </TabPane>

        <TabPane tab="Staff Emails" key="3">
          <CounselorEmail />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StudentHome;
