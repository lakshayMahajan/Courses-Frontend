import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import OtherDataContext from "../contexts/OtherDataContext";
import Loading from "../shared-components/Loading";

import { Typography, PageHeader, List, Button, Input } from "antd";
import { DeleteTwoTone, LoadingOutlined, SaveTwoTone } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const OtherEdits = () => {
  const { otherDataContext, setOtherDataContext } =
    useContext(OtherDataContext);
  const [creditForm, setCreditForm] = useState(null);
  const [tagForm, setTagForm] = useState(null);
  const [creditLoading, setCreditLoading] = useState(false);
  const [tagLoading, setTagLoading] = useState(false);

  useEffect(() => {
    if (otherDataContext?.creditData && !creditForm) {
      setCreditForm(otherDataContext.creditData);
    }
    if (otherDataContext?.tagData && !tagForm) {
      setTagForm(otherDataContext.tagData);
    }
  }, [otherDataContext]);

  const saveCredits = async () => {
    try {
      const saveRes = await axios.put(
        `${process.env.REACT_APP_COURSE_API}/other/list-edit/credits`,
        creditForm
      );
      getCreditTagData();
      setCreditLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const saveTags = async () => {
    try {
      const saveRes = await axios.put(
        `${process.env.REACT_APP_COURSE_API}/other/list-edit/tags`,
        tagForm
      );
      getCreditTagData();
      setTagLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const getCreditTagData = async () => {
    try {
      setOtherDataContext({
        ...otherDataContext,
        creditData: null,
        tagData: null,
      });
      const creditTagRes = await axios.get(
        `${process.env.REACT_APP_COURSE_API}/other`
      );
      setOtherDataContext({
        ...otherDataContext,
        creditData: creditTagRes.data.credits,
        tagData: creditTagRes.data.tags,
      });
      console.log("updated!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="body" style={{ paddingBottom: "20%", marginTop: "50px" }}>
      <PageHeader
        className="site-page-header"
        style={{ marginLeft: "-20px" }}
        title={
          <Title level={2} style={{ marginBottom: "0px" }}>
            Subjects
          </Title>
        }
        extra={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "25px",
              marginTop: "2px",
              marginRight: "-15px",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.3 }}
              onClick={() => {
                setCreditLoading(true);
                saveCredits();
              }}
            >
              {creditLoading === true ? (
                <LoadingOutlined style={{ color: "#8f8f8f" }} />
              ) : (
                <SaveTwoTone />
              )}
            </motion.div>
          </div>
        }
      ></PageHeader>

      {creditForm ? (
        <>
          <List
            bordered
            style={{ background: "white", borderRadius: "15px 15px 0 0" }}
            dataSource={creditForm}
            renderItem={(credit, index) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div
                      style={{
                        margin: "4px 0 14px 0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Paragraph
                        style={{ fontSize: "20px", margin: "0px" }}
                        editable={{
                          onChange: (e) => {
                            const newCredits = [...creditForm];
                            newCredits[index].name = e;
                            setCreditForm(newCredits);
                          },
                        }}
                      >
                        {credit.name}
                      </Paragraph>
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        onClick={() => {
                          const newCredits = creditForm.filter(
                            (item, i) => i != index
                          );
                          setCreditForm(newCredits);
                        }}
                      >
                        <DeleteTwoTone
                          twoToneColor="#ff0044"
                          style={{ fontSize: "20px", marginTop: "7px" }}
                        />
                      </motion.div>
                    </div>
                  }
                  description={
                    <TextArea
                      style={{ height: "32px", marginBottom: "4px" }}
                      value={credit.tip}
                      onChange={(e) => {
                        const newCredits = [...creditForm];
                        newCredits[index].tip = e.target.value;
                        setCreditForm(newCredits);
                      }}
                    />
                  }
                ></List.Item.Meta>
              </List.Item>
            )}
          ></List>
          <Button
            type="primary"
            style={{ width: "100%", borderRadius: "0 0 15px 15px" }}
            onClick={() => {
              const newCredits = [...creditForm];
              newCredits.push({
                name: "hi there",
                tip: "here is the tip",
              });
              setCreditForm(newCredits);
            }}
          >
            <div style={{ fontSize: "24px", marginTop: "-9px" }}>+</div>
          </Button>
        </>
      ) : (
        <Loading />
      )}

      <PageHeader
        className="site-page-header"
        style={{ marginLeft: "-20px", marginTop: "40px" }}
        title={
          <Title level={2} style={{ marginBottom: "0px" }}>
            Tags
          </Title>
        }
        extra={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "25px",
              marginTop: "2px",
              marginRight: "-15px",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.3 }}
              onClick={() => {
                setTagLoading(true);
                saveTags();
              }}
            >
              {tagLoading === true ? (
                <LoadingOutlined style={{ color: "#8f8f8f" }} />
              ) : (
                <SaveTwoTone />
              )}
            </motion.div>
          </div>
        }
      ></PageHeader>

      {tagForm ? (
        <>
          <List
            bordered
            style={{ background: "white", borderRadius: "15px 15px 0 0" }}
            dataSource={tagForm}
            renderItem={(tag, index) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div
                      style={{
                        margin: "4px 0 14px 0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Paragraph
                        style={{ fontSize: "20px", margin: "0px" }}
                        editable={{
                          onChange: (e) => {
                            const newTags = [...tagForm];
                            newTags[index].name = e;
                            setTagForm(newTags);
                          },
                        }}
                      >
                        {tag.name}
                      </Paragraph>

                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        onClick={() => {
                          const newTags = tagForm.filter(
                            (item, i) => i != index
                          );
                          setTagForm(newTags);
                        }}
                      >
                        <DeleteTwoTone
                          twoToneColor="#ff0044"
                          style={{ fontSize: "20px", marginTop: "7px" }}
                        />
                      </motion.div>
                    </div>
                  }
                  description={
                    <TextArea
                      style={{ height: "32px", marginBottom: "4px" }}
                      value={tag.tip}
                      onChange={(e) => {
                        const newTags = [...tagForm];
                        newTags[index].tip = e.target.value;
                        setTagForm(newTags);
                      }}
                    />
                  }
                ></List.Item.Meta>
              </List.Item>
            )}
          ></List>
          <Button
            type="primary"
            style={{ width: "100%", borderRadius: "0 0 15px 15px" }}
            onClick={() => {
              const newTags = [...tagForm];
              newTags.push({
                name: "hi there",
                tip: " ",
              });
              setTagForm(newTags);
            }}
          >
            <div style={{ fontSize: "24px", marginTop: "-9px" }}>+</div>
          </Button>
        </>
      ) : (
        <Loading style={{ marginBottom: "80%" }} />
      )}
    </div>
  );
};

export default OtherEdits;
