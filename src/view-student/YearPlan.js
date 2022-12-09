import React, { useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Loading from "../shared-components/Loading";
import Notes from "../view-student/Notes";
import { tagPrinter } from "../shared-components/TagPrinter";

import CheckContext from "../contexts/CheckContext";
import SemesterContext from "../contexts/SemesterContext.js";
import AuthContext from "../auth/AuthContext.js";
import OtherDataContext from "../contexts/OtherDataContext";

import { yearConverter, displayCheck } from "../Utils";

import { Table, Button, Typography, Tooltip, Tag } from "antd";
import {
  DeleteTwoTone,
  CaretRightOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
const { Title } = Typography;
const semesterDimension = {
  width: "50%",
  marginBottom: "60px",
  marginTop: "30px",
};

const YearPlan = () => {
  const { setSemesterContext } = useContext(SemesterContext);
  const { auth, setAuth } = useContext(AuthContext);
  const { checkContext, setCheckContext } = useContext(CheckContext);
  const { otherDataContext } = useContext(OtherDataContext);

  const removeFromPlan = async (item, year, semester) => {
    try {
      const deleteRes = await axios.post(
        `${process.env.REACT_APP_COURSE_API}/user/remove/${item._id}`,
        {
          year: year,
          semester: semester,
          user: auth,
        }
      );
      updateSelection();
    } catch (error) {
      console.log(error);
    }
  };

  const updateSelection = async () => {
    try {
      const selectionRes = await axios.post(
        `${process.env.REACT_APP_COURSE_API}/user`,
        {
          user: auth,
        }
      );
      console.log(selectionRes, "SELECTION RES1");
      if (!selectionRes.data.errors) {
        setAuth((prev) => ({
          isAuth: true,
          user: { ...prev.user, courseData: selectionRes.data.courseData },
          loading: false,
          fetched: true,
        }));
      }
      setCheckContext(displayCheck(selectionRes.data.courseData.courses, 0));
    } catch (error) {
      console.log(error);
    }
  };

  const setColumns = (year, semester) => {
    return [
      {
        title: "No.",
        dataIndex: "",
        key: "x",
        align: "center",
        render: (value, item, index) => index + 1,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (value, item, index) => (
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link style={{ color: "#229aff" }} to={"/course/" + item.url}>
              {item.name} ({item.course_id})
            </Link>
          </motion.div>
        ),
      },
      {
        title: "Subject",
        key: "credit",
        dataIndex: "credit",
        render: (credits) => (
          <>{tagPrinter(credits, otherDataContext.creditData, true)}</>
        ),
      },
      {
        title: "Sem.",
        key: "semester",
        dataIndex: "semesters",
        align: "center",
      },
      {
        title: "",
        dataIndex: "",
        key: "x",
        align: "center",
        render: (value, item, index) => (
          <motion.div
            style={{ marginRight: "5px" }}
            whileHover={{ scale: 1.2 }}
            onClick={() => {
              removeFromPlan(item, year, semester);
            }}
          >
            <Tooltip
              placement="left"
              title={() => <div>Remove {item.name}</div>}
            >
              <DeleteTwoTone twoToneColor="#ff0044" />
            </Tooltip>
          </motion.div>
        ),
      },
    ];
  };
  const displaySemester = (year, semester) => (
    <div style={semesterDimension}>
      <Table
        columns={setColumns(year, semester)}
        dataSource={auth.user.courseData.courses[year][semester]}
        pagination={false}
        size={"small"}
      />

      <Tooltip placement="bottom" title="Add a course to this semester">
        <Link to="/search" onClick={() => setSemesterContext([year, semester])}>
          <Button
            style={{ borderRadius: "0 0 15px 15px" }}
            block={true}
            type={"primary"}
          >
            <PlusOutlined style={{ fontSize: "16px" }} />
          </Button>
        </Link>
      </Tooltip>
    </div>
  );

  return (
    <div>
      {auth.user && otherDataContext && auth.user?.courseData ? (
        <>
          {Object.keys(auth.user.courseData?.courses).map((year) => (
            <>
              <Title level={2} style={{ marginBottom: "0px" }}>
                {year === yearConverter(auth.user.grade) ? (
                  <div>
                    <Tooltip
                      placement="bottom"
                      title="This is the year that your counselor will be able to see. If this is not your next year, click on your profile and change your class year."
                    >
                      <CaretRightOutlined style={{ color: "gray" }} />
                    </Tooltip>
                    {year} (Next Year)
                  </div>
                ) : (
                  <div style={{ marginLeft: "5px" }}>{year}</div>
                )}
              </Title>

              <div style={{ display: "flex", justifyContent: "center" }}>
                {displaySemester(year, "semester1")}
                <div style={{ width: "50px" }}></div>
                {displaySemester(year, "semester2")}
              </div>
            </>
          ))}
          <Notes />
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default YearPlan;
