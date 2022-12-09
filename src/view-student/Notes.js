import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import AuthContext from "../auth/AuthContext.js";

import { Button, Typography, Input, Tooltip } from "antd";
const { Title } = Typography;
const { TextArea } = Input;

const Notes = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [notes, setNotes] = useState();
  useEffect(() => {
    if (!notes) {
      getNotes();
    }
  }, []);

  const getNotes = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_COURSE_API}/user/notes`,
        { user: auth }
      );
      setNotes(res.data);
      setAuth({
        ...auth,
        user: {
          ...auth.user,
          courseData: { ...auth.user.courseData, note: res.data },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const saveNotes = async () => {
    try {
      console.log(notes, "notes");
      const res = await axios.post(
        `${process.env.REACT_APP_COURSE_API}/user/savenotes`,
        { notes: notes, user: auth }
      );
      setNotes(res.data);
      setAuth({
        ...auth,
        user: {
          ...auth.user,
          courseData: { ...auth.user.courseData, note: res.data },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div style={{ width: "100%", margin: "40px 0 150px 0" }}>
        <Title
          level={3}
          style={{
            marginLeft: "5px",
            textAlign: "center",
            marginBottom: "15px",
            color: "GrayText",
          }}
        >
          Notes
        </Title>
        <Tooltip
          placement="right"
          title={
            <div style={{ fontSize: "12px" }}>
              Notes can include any concerns, alternatives, or planned summer
              coursework. If none of these apply to you, then feel free to leave
              this as is.
            </div>
          }
        >
          <TextArea
            maxLength={1000}
            className="notesarea"
            style={{
              minHeight: "200px",
              maxHeight: "300px",
              padding: "10px 15px 0 15px",
              borderRadius: "15px 15px 0 0",
              zIndex: "1",
            }}
            defaultValue={auth.user.courseData.note}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
          />
        </Tooltip>
        {auth.user.courseData.note === notes ? (
          <Button
            className="savenote"
            style={{
              background: "white",
              fontWeight: "500",
              borderColor: "lightgray",
              borderRadius: "0 0 15px 15px",
              color: "GrayText",
              marginTop: "-1px",
            }}
            block={true}
            type="ghost"
          >
            Save
          </Button>
        ) : (
          <Button
            style={{ fontWeight: "500", borderRadius: "0 0 15px 15px" }}
            block={true}
            type="primary"
            onClick={() => saveNotes()}
          >
            Save
          </Button>
        )}
      </div>
    </>
  );
};

export default Notes;
