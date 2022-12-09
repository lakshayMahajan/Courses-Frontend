import React, {useState, useEffect, useContext} from 'react';
import {useParams, Link} from 'react-router-dom';
import axios from 'axios'
import {CopyToClipboard} from 'react-copy-to-clipboard';

import Loading from '../shared-components/Loading';
import ClassContext from '../contexts/ClassContext';
import AuthContext from '../auth/AuthContext';
import SemesterContext from '../contexts/SemesterContext.js';
import OtherDataContext from '../contexts/OtherDataContext';

import {tagPrinter, gradeLevelPrinter} from '../shared-components/TagPrinter'

import {PageHeader, Modal, Typography, Card, Tooltip, Tag} from 'antd';
import {PlusSquareTwoTone, EditTwoTone, DeleteTwoTone, CopyOutlined, CheckOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import {motion} from 'framer-motion';

const {Title, Text} = Typography;


const Class = ({history}) => {
    const {otherDataContext, setOtherDataContext} = useContext(OtherDataContext);
    const {auth, setAuth} = useContext(AuthContext);
    const {classContext, setClassContext} = useContext(ClassContext);
    const {semesterContext} = useContext(SemesterContext);

    const [classShown, setClassShown] = useState();
    const [copied, setCopied] = useState(false);
    const classURL = useParams().course;
    
    useEffect (() => {
        window.scrollTo(0, 0)
        if (classContext) {
            setClassShown(classContext.find((item) => item.url === classURL))
        }
    }, [classContext, classURL])


    const deleteCourse = async() => {
        try {
            const deleteRes = await axios.delete(`${process.env.REACT_APP_COURSE_API}/course/delete/${classShown.url}`);
            console.log(deleteRes.data)
            getData()
        } catch (error) {
            console.log(error)
        }
    }
    const getData = async() => {
        try {
          const {data} = await axios.get(`${process.env.REACT_APP_COURSE_API}/course`);
          setClassContext(data);
        } catch (error) {
          console.log(error);
        }
    }

    const addToPlan = async (item) => {
        try {
            const addRes = await axios.post(`${process.env.REACT_APP_COURSE_API}/user/add/${item._id}/${item.semesters}`, {
                year: semesterContext[0], 
                semester: semesterContext[1]
            });
            updateSelection()
            console.log(addRes);
        } catch (error) {
            console.log(error);
        }
    }
    const updateSelection = async () => {
        try {
            const selectionRes = await axios.get(`${process.env.REACT_APP_COURSE_API}/user`)
            if (!selectionRes.data.errors) {    
                setAuth({isAuth: true, user: selectionRes.data, loading: false, fetched: true})
            }  
        } catch (error) {
            console.log(error)
        }
    }

    const determineButton = () => {
        if (!(!auth.user || !classShown)) {
            if (auth.user?.role === "teacher") {
                return (
                    <div style={{display:"flex", justifyContent:"space-between", fontSize: "25px"}}>
                        <motion.div whileHover={{scale: 1.3}}>
                            <Link to={'/edit/' + classShown.url}>
                                <EditTwoTone twoToneColor="#52c41a"/>
                            </Link>
                        </motion.div>
                        <div style={{width:"15px"}}></div>
                        <motion.div whileHover={{scale: 1.3}} onClick={() => {
                            Modal.confirm({
                                title: "Are you sure you want to delete this course?",
                                onOk: () => {
                                    deleteCourse(classShown) 
                                    window.location.replace('/search') 
                                }
                            });
                        }}>                   
                            <DeleteTwoTone twoToneColor="#ff0044"/>
                        </motion.div>
                    </div>
                )
            } else if (auth.user?.role === "student") {
                if (semesterContext) {
                    return (
                        <motion.div whileHover={{scale: 1.3}} onClick={() => addToPlan(classShown)}>
                            <Link to='/'>
                                <PlusSquareTwoTone style={{fontSize:"25px"}} twoToneColor="#52c41a"/>
                            </Link>
                        </motion.div>
                    )
                } else {
                    return (
                        <Tooltip placement="left" title={() => 
                            <div>A semester has not been selected.<Link to='/'> Click here</Link>, then "+" on a semester to add a course.</div>
                        }>
                            <PlusSquareTwoTone style={{fontSize:"25px"}} twoToneColor="gray"/>
                        </Tooltip>
                    )
                }
            }
        }
    }


    const infoText = {marginBottom: "5px"}
    const infoSpace = {marginBottom: "14px"}
    
    return (
        <div id="body" style={{paddingBottom: "30vw", marginTop:"50px"}}>
            {classShown?
                <>
                    <PageHeader
                        className="site-page-header"
                        style={{margin:"0 -25px"}}
                        title={
                            <div style={{display:"flex", alignItems:"center"}}>
                                <Title level={2} style={{marginBottom:"0px"}}>{classShown.name}</Title>
                            </div>
                        }
                        extra = {<div style={{display:"flex", alignItems:"center", height:"40px"}}>{determineButton()}</div>}
                    ></PageHeader>


                    <div id="infoBody" style={{display:"flex", justifyContent:"space-between", marginTop:"10px"}}>
                        
                        <div style={{width:"66%"}}>
                            <Card hoverable title="Description"style={{borderRadius:"20px", marginBottom:"20px"}}>
                                <Text>{classShown.description}</Text>
                            </Card>
                            <Card hoverable title="Requirements/Recommendations" style={{borderRadius:"20px", marginBottom:"20px"}}>
                                <Text>{classShown.requirements? `${classShown.requirements}` : "No requirements found."}</Text>
                            </Card>
                            {classShown.additional_info !== "none" &&
                                <Card hoverable="true" title="Additional Info" style={{borderRadius:"20px", marginBottom:"20px"}}>
                                    Link: <a href={classShown.additional_info} target="_blank">{classShown.additional_info}</a>
                                </Card>
                            }
                        </div>
                        
                        <div style={{width: "30%"}}>
                            <Card hoverable title="Information" style={{borderRadius:"20px", marginBottom:"20px"}}>
                                <div style={{display:"flex", flexDirection:"column"}}>
                                    
                                    <Text style={infoText}>COURSE ID: &nbsp;{classShown.course_id}</Text>
                                    <Text style={infoText}>GRADE LEVEL: &nbsp;
                                        {gradeLevelPrinter(classShown.grade_level)}
                                    </Text>
                                    
                                    <div style={infoSpace}/>

                                    {otherDataContext &&
                                        <>
                                            <Text style={infoText}>SUBJECTS: &nbsp;
                                                {tagPrinter(classShown.credit, otherDataContext.creditData, false)}
                                            </Text>
                                            <Text style={infoText}>TAGS: &nbsp;
                                                {tagPrinter(classShown.tags, otherDataContext.tagData, false)}
                                            </Text>
                                        </>
                                    }

                                    <div style={infoSpace}/>

                                    <Text style={infoText}>WEIGHTING: &nbsp;{classShown.weight}/semester</Text>
                                    <Text style={infoText}>SEMESTERS: &nbsp;{classShown.semesters} semester(s)</Text>
                                    <Text style={infoText}>MAX SEMESTERS: &nbsp;{classShown.max_semesters} semester(s)</Text>
                                    {classShown.contact !== "none" &&
                                        <>
                                            <div style={infoSpace}/>
                                            <Text style={{infoText}}>
                                                CONTACT: &nbsp;{classShown.contact} &nbsp;
                                                {copied?
                                                    <Tooltip title="Copied!">
                                                        <CheckOutlined style={{color:"#52c41a"}}/>
                                                        <div style={{color:"transparent", display:"inline", fontSize:"0px"}}>
                                                            {setTimeout(() => {setCopied(false)}, 1000)}
                                                        </div>
                                                    </Tooltip>
                                                :
                                                    <Tooltip title="Click to copy">  
                                                        <CopyToClipboard text={classShown.contact} style={{color:"#1890FF"}}>
                                                            <CopyOutlined onClick={() => {setCopied(true)}}/>
                                                        </CopyToClipboard>
                                                    </Tooltip>
                                                }
                                            </Text>
                                        </>
                                    }

                                </div>
                            </Card>
                        </div>

                    </div>   
                </>
            :
                <Loading/>
            }
        </div>
    )
}

export default Class
