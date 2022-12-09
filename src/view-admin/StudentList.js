import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Loading from "../shared-components/Loading";
import ClassContext from "../contexts/ClassContext";

import { filterGrades } from "../Utils";

import {
  Table,
  Button,
  Input,
  Select,
  Collapse,
  Typography,
  PageHeader,
  Tag,
} from "antd";
import {
  SearchOutlined,
  RightOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Option } = Select;
const { Panel } = Collapse;
const { Title, Text } = Typography;

const StudentList = ({ history }) => {
  const [list, setList] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [gradeSelect, setGradeSelect] = useState([]);
  const { classContext } = useContext(ClassContext);

  useEffect(() => {
    if (!list) {
      getStudentList();
    }
  }, [list]);

  const getStudentList = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_COURSE_API}/user/list`
      );
      setList(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getUserCourses = async (id, grade) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_COURSE_API}/user/getbyid`,
        { id: id, grade: grade }
      );
      const newUserList = list.map((item) =>
        item._id == id
          ? { ...item, submitted_year: data.submitted_year, note: data.note }
          : item
      );
      setList(newUserList);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "13%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      width: "10%",
    },
    {
      width: "67%",
      title: "Course Selection",
      dataIndex: "",
      key: "",
      render: (value, item, index) => (
        <div>
          <Collapse
            ghost={true}
            expandIcon={({ isActive }) => (
              <RightOutlined
                style={{ marginTop: "-10px" }}
                rotate={isActive ? 90 : 0}
              />
            )}
            onChange={() => getUserCourses(item._id, item.grade)}
          >
            <Panel>
              {item.submitted_year ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingBottom: "8px",
                    }}
                  >
                    <div style={{ width: "50%" }}>
                      <Table
                        size={"small"}
                        columns={semCol}
                        dataSource={item.submitted_year.semester1}
                        pagination={false}
                      ></Table>
                    </div>
                    <div style={{ width: "20px" }}></div>
                    <div style={{ width: "50%" }}>
                      <Table
                        size={"small"}
                        columns={semCol}
                        dataSource={item.submitted_year.semester2}
                        pagination={false}
                      ></Table>
                    </div>
                  </div>
                  <div
                    style={{
                      marginBottom: "3px",
                      marginTop: "10px",
                      marginLeft: "5px",
                    }}
                  >
                    <Text strong style={{ fontSize: "12px" }}>
                      NOTES
                    </Text>
                  </div>
                  <div style={{ marginTop: "10px", marginLeft: "5px" }}>
                    {item.note}
                  </div>
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "20px 0 30px 0",
                  }}
                >
                  <LoadingOutlined
                    style={{ fontSize: "40px", color: "#afafaf" }}
                  />
                </div>
              )}
            </Panel>
          </Collapse>
        </div>
      ),
    },
  ];
  const semCol = [
    {
      title: "No.",
      dataIndex: "",
      align: "center",
      key: "x",
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
      title: "Subjects",
      key: "credit",
      dataIndex: "credit",
      render: (credit) =>
        credit.map((cred) => (
          <Tag color={"blue"} key={cred}>
            {cred.toUpperCase()}
          </Tag>
        )),
    },
  ];

  const displayFilterComps = () => {
    return (
      <div style={{ display: "flex", width: "87%", alignItems: "center" }}>
        <div style={{ width: "32%", marginRight: "15px" }}>
          <Input
            placeholder={`Search by Name`}
            suffix={<SearchOutlined style={{ color: "#BFBFBF" }} />}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          ></Input>
        </div>
        <Select
          style={{ margin: "15px", width: "25%" }}
          placeholder="Filter by Grade"
          value={gradeSelect ? gradeSelect : []}
          onChange={(value) => setGradeSelect(value)}
        >
          <Option key=""> </Option>
          {filterGrades.map((grade) => (
            <Option key={grade}> {grade} </Option>
          ))}
        </Select>
      </div>
    );
  };

  return (
    <div id="body" style={{ paddingBottom: "80%", marginTop: "50px" }}>
      <PageHeader
        className="site-page-header"
        style={{ marginLeft: "-25px" }}
        title={
          <Title level={2} style={{ marginBottom: "0px" }}>
            Search Students
          </Title>
        }
      ></PageHeader>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "100%" }}>{displayFilterComps()}</div>
        <Button
          danger
          onClick={() => {
            setSearchName("");
            setGradeSelect([]);
          }}
        >
          Reset Filters
        </Button>
      </div>
      {list ? (
        <Table
          bordered={true}
          rowClassName="row"
          columns={columns}
          pagination={true}
          dataSource={list.filter((stud) => {
            return (
              stud.grade.indexOf(gradeSelect) !== -1 &&
              (stud.name.toLowerCase().indexOf(searchName.toLowerCase()) !==
                -1 ||
                !searchName)
            );
          })}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default StudentList;
