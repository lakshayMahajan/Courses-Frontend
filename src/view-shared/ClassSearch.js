/* eslint-disable */
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Loading from "../shared-components/Loading";

import ClassContext from "../contexts/ClassContext";
import SemesterContext from "../contexts/SemesterContext.js";
import AuthContext from "../auth/AuthContext";
import OtherDataContext from "../contexts/OtherDataContext";

import { filterGrades } from "../Utils";
import { tagPrinter, gradeLevelPrinter } from "../shared-components/TagPrinter";

import {
  Table,
  Button,
  Tag,
  Input,
  Select,
  Typography,
  PageHeader,
  Tooltip,
} from "antd";
import {
  PlusSquareTwoTone,
  SearchOutlined,
  EditTwoTone,
  PlusOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
const { Option } = Select;
const { Title } = Typography;

const ClassSearch = ({ history }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const { classContext } = useContext(ClassContext);
  const { otherDataContext } = useContext(OtherDataContext);
  const { semesterContext } = useContext(SemesterContext);

  const [searchText, setSearchText] = useState("");
  const [creditSelect, setCreditSelect] = useState([]);
  const [gradeLevelSelect, setGradeLevelSelect] = useState([]);
  const [tagSelect, setTagSelect] = useState([]);

  const [width, setWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    if (localStorage.filters) {
      var storedFilters = JSON.parse(localStorage.filters);
      setSearchText(storedFilters.searchText);
      setCreditSelect(storedFilters.creditSelect);
      setGradeLevelSelect(storedFilters.gradeLevelSelect);
      setTagSelect(storedFilters.tagSelect);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "filters",
      JSON.stringify({ searchText, creditSelect, gradeLevelSelect, tagSelect })
    );
  }, [searchText, creditSelect, gradeLevelSelect, tagSelect]);

  const addToPlan = async (item) => {
    try {
      const addRes = await axios.post(
        `${process.env.REACT_APP_COURSE_API}/user/add/${item._id}/${item.semesters}`,
        {
          user: auth,
          year: semesterContext[0],
          semester: semesterContext[1],
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

  const columns = [
    {
      title: "",
      dataIndex: "",
      key: "x",
      width: 1,
    },
    {
      title: "Name (click for more info)",
      dataIndex: "name",
      key: "name",
      width: "26%",
      render: (value, item, index) => (
        <motion.div whileHover={{ scale: 1.02 }}>
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
      width: "20%",
      render: (credits) => (
        <>{tagPrinter(credits, otherDataContext.creditData, false)}</>
      ),
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      width: "15%",
      render: (tags) => (
        <>{tagPrinter(tags, otherDataContext.tagData, false)}</>
      ),
    },
    {
      title: "Semesters",
      dataIndex: "semesters",
      key: "semesters",
      width: "14%",
      sorter: (a, b) => a.semesters - b.semesters,
    },
    {
      title: "Grade Levels",
      key: "grade_level",
      dataIndex: "grade_level",
      width: "20%",
      render: (grades) => <>{gradeLevelPrinter(grades)}</>,
    },
    {
      title: "",
      dataIndex: "",
      key: "+",
      render: (value, item, index) => (
        <>
          {auth.user?.role == "teacher" ? (
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to={"/edit/" + item.url}>
                <Tooltip placement="left" title={"Edit " + item.name}>
                  <EditTwoTone
                    style={{ fontSize: "17px" }}
                    twoToneColor="#52c41a"
                  />
                </Tooltip>
              </Link>
            </motion.div>
          ) : auth.user?.role === "student" && semesterContext ? (
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={() => addToPlan(item)}
            >
              <Link to="/">
                <Tooltip
                  placement="right"
                  title={() => {
                    return (
                      <div>
                        <div>
                          Add {item.name} to{" "}
                          {semesterContext[1]
                            .replace("1", " 1")
                            .replace("2", " 2")}
                        </div>
                        <div>of {semesterContext[0]} year.</div>
                      </div>
                    );
                  }}
                >
                  <PlusSquareTwoTone
                    style={{ fontSize: "17px" }}
                    twoToneColor="#52c41a"
                  />
                </Tooltip>
              </Link>
            </motion.div>
          ) : (
            <div />
          )}
        </>
      ),
    },
  ];

  const displayFilterComps = () => {
    return (
      <div style={{ display: "flex", alignItems: "center", margin: "15px 0" }}>
        <div style={{ marginRight: "15px", width: "25%", minWidth: "150px" }}>
          <Input
            placeholder={`Search Course`}
            suffix={<SearchOutlined style={{ color: "#BFBFBF" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Select
          style={{ marginRight: "15px", width: "30%", minWidth: "230px" }}
          mode="multiple"
          showArrow
          tagRender={({ label, value, closable, onClose }) => (
            <Tag
              closable={closable}
              onClose={onClose}
              style={{ marginRight: 3 }}
            >
              {" "}
              {label}{" "}
            </Tag>
          )}
          placeholder="Filter by Subject"
          value={creditSelect ? creditSelect : []}
          onChange={(value) => {
            setCreditSelect(value);
          }}
        >
          {otherDataContext.creditData
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((credit) => (
              <Option key={credit.name}> {credit.name} </Option>
            ))}
        </Select>
        <Select
          style={{ marginRight: "15px", width: "25%", minWidth: "183px" }}
          mode="multiple"
          showArrow
          tagRender={({ label, value, closable, onClose }) => (
            <Tag
              closable={closable}
              onClose={onClose}
              style={{ marginRight: 3 }}
            >
              {" "}
              {label}{" "}
            </Tag>
          )}
          placeholder="Filter by Tags"
          value={tagSelect ? tagSelect : []}
          onChange={(value) => {
            setTagSelect(value);
          }}
        >
          {otherDataContext.tagData
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((tag) => (
              <Option key={tag.name}> {tag.name} </Option>
            ))}
        </Select>
        <Select
          style={{ width: "20%", minWidth: "135px" }}
          mode="multiple"
          showArrow
          tagRender={({ label, value, closable, onClose }) => (
            <Tag
              closable={closable}
              onClose={onClose}
              style={{ marginRight: 3 }}
            >
              {" "}
              {label}{" "}
            </Tag>
          )}
          placeholder="Filter by Grade"
          value={gradeLevelSelect ? gradeLevelSelect : []}
          onChange={(value) => {
            setGradeLevelSelect(value);
          }}
        >
          {filterGrades.map((grade) => (
            <Option key={grade}> {grade} </Option>
          ))}
        </Select>

        {auth.user?.role !== "teacher" && width > 1000 && (
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              style={{ width: "120px", marginLeft: "15px" }}
              danger
              onClick={() => {
                setSearchText("");
                setCreditSelect([]);
                setTagSelect([]);
                setGradeLevelSelect([]);
              }}
            >
              Reset Filters
            </Button>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div id="body" style={{ paddingBottom: "20vw", marginTop: "50px" }}>
      {classContext && otherDataContext ? (
        <>
          <PageHeader
            className="site-page-header"
            style={{ marginLeft: "-25px" }}
            title={
              <Title level={2} style={{ marginBottom: "0px" }}>
                Search Courses
              </Title>
            }
          />
          <div
            style={{
              fontSize: "13px",
              color: "#ccc",
              margin: "-10px 0 25px 0",
            }}
          >
            Brought to you by &nbsp;
            <a
              href="https://hsecourses.netlify.app/course/computer-science-iii:-software-development"
              target="_blank"
              style={{ opacity: ".6" }}
            >
              Software Development's
            </a>
            &nbsp; Bazonkey Donkeys Mehra, Sully&#8482;, and Alec The Diamond
            Minecart
          </div>

          {displayFilterComps()}

          {auth.user?.role === "teacher" && (
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{ marginRight: "15px" }}
              >
                <Link to="/create">
                  <Button type="primary" ghost>
                    <PlusOutlined style={{ fontSize: "11px" }} />
                    Create Course
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  style={{ width: "120px" }}
                  danger
                  onClick={() => {
                    setSearchText("");
                    setCreditSelect([]);
                    setTagSelect([]);
                    setGradeLevelSelect([]);
                  }}
                >
                  Reset Filters
                </Button>
              </motion.div>
            </div>
          )}

          <Table
            rowClassName="row"
            columns={columns}
            dataSource={classContext.filter((clas) => {
              var oneTagsThere = false;
              var oneCreditsThere = false;
              var oneGradeLevelThere = false;

              tagSelect.forEach((item) => {
                if (clas.tags.indexOf(item) !== -1) {
                  oneTagsThere = true;
                }
              });
              if (tagSelect.length === 0) {
                oneTagsThere = true;
              }
              creditSelect.forEach((item) => {
                if (clas.credit.indexOf(item) !== -1) {
                  oneCreditsThere = true;
                }
              });
              if (creditSelect.length === 0) {
                oneCreditsThere = true;
              }
              gradeLevelSelect.forEach((item) => {
                if (clas.grade_level.indexOf(item) !== -1) {
                  oneGradeLevelThere = true;
                }
              });
              if (gradeLevelSelect.length === 0) {
                oneGradeLevelThere = true;
              }

              return (
                oneGradeLevelThere &&
                oneTagsThere &&
                oneCreditsThere &&
                `${clas.name} (${clas.course_id})`
                  .toLowerCase()
                  .indexOf(searchText.toLowerCase()) !== -1
              );
            })}
            size={"small"}
          />
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ClassSearch;
