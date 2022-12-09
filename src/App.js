import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

import Navbar from "./shared-components/Navbar";

import UseComputer from "./view-shared/UseComputer";
import StudentHome from "./view-student/StudentHome";
import Search from "./view-shared/ClassSearch";
import StudentList from "./view-admin/StudentList";
import Class from "./view-shared/Class";
import EditClass from "./view-admin/EditClass";
import CreateClass from "./view-admin/CreateClass";
import EditDiploma from "./view-admin/EditDiploma";
import Diplomas from "./view-shared/Diplomas";
import OtherEdits from "./view-admin/EditOther";

import ClassContext from "./contexts/ClassContext";
import SemesterContext from "./contexts/SemesterContext.js";
import CheckContext from "./contexts/CheckContext.js";
import OtherDataContext from "./contexts/OtherDataContext.js";

import AuthContext from "./auth/AuthContext";

import "./App.css";
import { notification } from "antd";

const App = () => {
  const [auth, setAuth] = useState({
    isAuth: false,
    loading: true,
    fetched: false,
  });
  const [semesterContext, setSemesterContext] = useState();
  const [classContext, setClassContext] = useState();
  const [checkContext, setCheckContext] = useState();
  const [otherDataContext, setOtherDataContext] = useState();

  const { instance, accounts } = useMsal();

  function signOutClickHandler(instance) {
    const logoutRequest = {
      account: instance.getAccountByHomeId(auth.user.homeAccountId),
      postLogoutRedirectUri: "https://google.com",
    };
    instance.logoutRedirect(logoutRequest);
  }

  const [width, setWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  useEffect(() => {
    if (accounts[0]) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          setAuth((prev) => ({
            ...prev,
            token: response.accessToken,
            user: response.account,
          }));

          testToken(response.accessToken);
        });
    }
  }, [accounts]);

  useEffect(() => {
    document.title = "HSE Courses";
    if (!classContext) {
      getAllData();
    }
  }, [classContext]);

  const getAllData = async () => {
    try {
      const courseRes = await axios.get(
        `${process.env.REACT_APP_COURSE_API}/course`
      );
      setClassContext(courseRes.data);
      const otherRes = await axios.get(
        `${process.env.REACT_APP_COURSE_API}/other`
      );
      setOtherDataContext({
        diplomaData: otherRes.data.diplomas,
        creditData: otherRes.data.credits,
        tagData: otherRes.data.tags,
      });
    } catch (error) {}
  };

  const testToken = async (token) => {
    const res = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (
      res.data.jobTitle == "12" ||
      res.data.jobTitle == "11" ||
      res.data.jobTitle == "10" ||
      res.data.jobTitle == "9"
    ) {
      setAuth((prev) => ({
        ...prev,
        isAuth: true,
        loading: false,
        fetched: false,
        user: {
          ...prev.user,
          role: "student",
          displayName: `${res.data.givenName} ${res.data.surname}`,
          grade: res.data.jobTitle,
        },
      }));
    }
  };

  useEffect(async () => {
    if (auth.user && !auth.fetched) {
      const selectionRes = await axios.post(
        `${process.env.REACT_APP_COURSE_API}/user`,
        {
          user: auth,
        }
      );
      console.log(selectionRes, "SELECTION RES");
      if (!selectionRes.data.errors) {
        setAuth((prev) => ({
          isAuth: true,
          user: { ...prev.user, courseData: selectionRes.data.courseData },
          loading: false,
          fetched: true,
        }));
      }
    }
  }, [auth]);

  console.log(auth);
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <SemesterContext.Provider value={{ semesterContext, setSemesterContext }}>
        <ClassContext.Provider value={{ classContext, setClassContext }}>
          <OtherDataContext.Provider
            value={{ otherDataContext, setOtherDataContext }}
          >
            <CheckContext.Provider value={{ checkContext, setCheckContext }}>
              <BrowserRouter>
                <Switch>
                  <div className="App">
                    {width > 800 ? (
                      <>
                        <Navbar
                          instance={instance}
                          signOutClickHandler={signOutClickHandler}
                          tabbed={true}
                        />
                        <Route exact path="/search" component={Search} />
                        <Route exact path="/course/:course" component={Class} />
                        <Route exact path="/diplomas" component={Diplomas} />

                        {auth.user?.role === "teacher" ? (
                          <>
                            <Route exact path="/" component={StudentList} />
                            <Route
                              exact
                              path="/edit/:course"
                              component={EditClass}
                            />
                            <Route
                              exact
                              path="/create"
                              component={CreateClass}
                            />
                            <Route
                              exact
                              path="/diploma-edit"
                              component={EditDiploma}
                            />
                            <Route
                              exact
                              path="/other-edits"
                              component={OtherEdits}
                            />
                          </>
                        ) : auth.user?.role === "student" ? (
                          <Route exact path="/" component={StudentHome} />
                        ) : (
                          <Route exact path="/" component={Search} />
                        )}
                      </>
                    ) : (
                      <>
                        <Navbar tabbed={false} />
                        <UseComputer />
                      </>
                    )}
                  </div>
                </Switch>
              </BrowserRouter>
            </CheckContext.Provider>
          </OtherDataContext.Provider>
        </ClassContext.Provider>
      </SemesterContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
