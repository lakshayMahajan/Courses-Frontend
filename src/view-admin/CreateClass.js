import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import Loading from '../shared-components/Loading';
import ClassContext from '../contexts/ClassContext';
import {errorCheck, filterGrades} from "../Utils";

import {PageHeader, Card, Input, Select, Tag, Tooltip, Typography, Radio} from 'antd';
import {WarningTwoTone, SaveTwoTone, ArrowLeftOutlined} from '@ant-design/icons';
import {motion} from 'framer-motion';
import OtherDataContext from '../contexts/OtherDataContext.js';

const {TextArea} = Input;
const {Option} = Select;
const {Text} = Typography;



const CreateClass = ({history}) => {
    const {classContext, setClassContext} = useContext(ClassContext);
    const {otherDataContext} = useContext(OtherDataContext)
    const [form, setForm] = useState();

    useEffect (() => {
        if (classContext) {
            setForm({
                name: "",
                course_id: "",
                url: "",
                tags: [],
                credit: [],
                grade_level: [],
                semesters: 1,
                max_semesters: 1,
                weight: 0,
                contact: "",
                description: "",
                requirements: "none",
                additional_info: ""
            })
        }  
    }, [classContext])


    const addForm = async() => {
        try {
            
            const addRes = await axios.post(`${process.env.REACT_APP_COURSE_API}/course/create`, form);
            console.log(addRes.data) 
               
            getData()
            history.push(`/course/${addRes.data.url}`)
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



    return (
        <div id="body" style={{paddingBottom: "80%", marginTop:"42px"}}>
            {form && otherDataContext?.creditData && otherDataContext?.tagData?
                <div>
                    <PageHeader
                        className="site-page-header"
                        style={{marginLeft:"-55px"}}
                        title={
                            <div style={{display:"flex", alignItems:"center"}}>         
                                <Link to="/search" style={{marginRight: "10px"}}>
                                    <Tooltip title="Back (unsaved changes are canceled)">
                                        <ArrowLeftOutlined style={{color: "black"}}/>
                                    </Tooltip>
                                </Link>
                                <Input 
                                    style={{fontSize: "30px", fontWeight:"600", marginBottom:"0px"}}
                                    defaultValue={form.name}
                                    placeholder="Name"
                                    onChange={(e) => setForm({...form, name: e.target.value, url: e.target.value.replaceAll(" ","-").replaceAll("/","-").toLowerCase()}) }
                                ></Input>
                                <div style={{fontSize: "30px"}}>
                                    &nbsp;*
                                </div>
                            </div>
                        }
                        extra = {
                            <div style={{display:"flex", fontSize: "25px", marginTop:"9px", marginRight:"-15px"}}>
                                {errorCheck(null, form, classContext)? 
                                    <motion.div whileHover={{scale: 1.3}} onClick={() => {
                                        addForm()
                                    }}>
                                        <SaveTwoTone />
                                    </motion.div>
                                :
                                    <div style={{display: "flex", marginTop:"8px"}}>
                                        <div style={{display: "flex", marginRight: "20px", marginTop: "5px", fontSize:"14px"}}>
                                            <WarningTwoTone twoToneColor="#ff0044"/>
                                            <div style={{marginLeft: "8px", marginTop: "-3px",color: "#ff0044"}}> Error: either a bad url or a required area was left blank </div>
                                        </div>
                                        <SaveTwoTone twoToneColor="gray"/>
                                    </div>
                                }                                
                            </div>                                     
                        }
                    ></PageHeader>


                    <div id="infoBody" style={{display:"flex", justifyContent:"space-between", marginTop:"1px"}}>
                        <div style={{width:"60%"}}>
                            <Card hoverable="true" title="Description *" style={{borderRadius:"20px", marginBottom:"20px"}}>
                                <TextArea defaultValue={form.description} onChange={(e) => {setForm({...form, description: e.target.value})}}></TextArea>
                            </Card>
                            <Card hoverable="true" title="Requirements/Recommendations *" style={{borderRadius:"20px", marginBottom:"20px"}}>
                                <TextArea defaultValue={form.requirements} onChange={(e) => {setForm({...form, requirements: e.target.value})}}></TextArea>
                            </Card>        
                            <Card hoverable="true" title="Additional Info (Link)" style={{borderRadius:"20px", marginBottom:"20px"}}>
                                <TextArea defaultValue={form.additional_info} onChange={(e) => {setForm({...form, additional_info: e.target.value})}}></TextArea>
                            </Card>
                        </div>
                        <div style={{width: "36%"}}>
                            <Card hoverable="true" title="Information" style={{borderRadius:"20px", marginBottom:"20px"}}>

                                <div style={{display:"flex", flexDirection:"column"}}>
                                    <div style={{marginBottom:"3px"}}>
                                        <Text strong style={{fontSize: "10px"}}>COURSE URL *</Text>
                                    </div>
                                    <Input
                                        addonBefore="/course/"
                                        style={{marginBottom: "10px"}}
                                        value={form.url}
                                    >
                                    </Input> 
                                </div>
                                    
                                <div style={{marginBottom: "10px"}}>
                                    <div style={{marginBottom:"3px"}}>
                                        <Text strong style={{fontSize: "10px"}}>COURSE ID *</Text>
                                    </div>
                                    <Input
                                        defaultValue={form.course_id}
                                        onChange={(e) => setForm({...form, course_id: e.target.value})}
                                    >
                                    </Input>     
                                </div>

                                <div style={{marginBottom: "10px", width:'100%'}}>
                                    <div style={{marginBottom:"3px"}}>
                                        <Text strong style={{fontSize: "10px"}}>GRADE LEVEL</Text>
                                    </div>
                                    <Select
                                        style={{marginTop:"5px", width:'100%'}}
                                        mode="multiple"
                                        showArrow
                                        tagRender={(props) => {
                                            const { label, value, closable, onClose} = props;
                                            return (<Tag color="blue" closable={closable} onClose={onClose}> {label} </Tag>)
                                        }}
                                        defaultValue={form.grade_level}
                                        onChange={(e) => setForm({...form, grade_level: e})}
                                    >
                                        {filterGrades.map(grade => 
                                            <Option key={grade}> {grade} </Option>
                                        )}
                                    </Select>   
                                </div>

                                <div style={{marginBottom: "10px", width:'100%'}}>
                                    <div style={{marginBottom:"3px"}}>
                                        <Text strong style={{fontSize: "10px"}}>SUBJECT TYPE</Text>
                                    </div>
                                    <Select
                                        style={{marginTop:"5px", width:'100%'}}
                                        mode="multiple"
                                        showArrow
                                        tagRender={(props) => {
                                            const { label, value, closable, onClose} = props;
                                            return (<Tag color="blue" closable={closable} onClose={onClose}> {label} </Tag>)
                                        }}
                                        defaultValue={form.credit}
                                        onChange={(e) => setForm({...form, credit: e})}
                                    >
                                        {otherDataContext.creditData.map(credit =>
                                            <Option key={credit.name}> {credit.name} </Option>
                                        )}
                                    </Select>   
                                </div>

                                <div style={{marginBottom: "10px", width:'100%'}}>
                                    <div style={{marginBottom:"3px"}}>
                                        <Text strong style={{fontSize: "10px"}}>COURSE TAGS</Text>
                                    </div>
                                    <Select
                                        style={{marginTop:"5px", width: '100%'}}
                                        mode="multiple"
                                        showArrow
                                        tagRender={(props) => {
                                            const { label, value, closable, onClose} = props;
                                            return (<Tag closable={closable} onClose={onClose} color="blue" > {label} </Tag>)
                                        }}
                                        defaultValue={form.tags}
                                        onChange={(e) => setForm({...form, tags: e})}
                                    >
                                        {otherDataContext.tagData.map(tag =>
                                            <Option key={tag.name}> {tag.name} </Option>
                                        )}
                                    </Select> 
                                </div>

                                <div style={{marginBottom: "10px"}}>
                                    <div style={{marginBottom:"3px"}}>
                                        <Text strong style={{fontSize: "10px"}}>SEMESTERS</Text>
                                    </div>
                                    <Radio.Group value={form.semesters}  onChange={(e) => setForm({...form, semesters: e.target.value})}>
                                        {[1,2].map(num => 
                                            <Radio.Button value={num}>{num}</Radio.Button>
                                        )}
                                    </Radio.Group>   
                                </div>

                                <div style={{marginBottom: "10px"}}>
                                    <div style={{marginBottom:"3px"}}>
                                        <Text strong style={{fontSize: "10px"}}>MAX SEMESTERS</Text>
                                    </div>
                                    <Radio.Group value={form.max_semesters}  onChange={(e) => setForm({...form, max_semesters: e.target.value})}>
                                        {[1,2,3,4,5,6,7,8].map(num => 
                                            <Radio.Button value={num}>{num}</Radio.Button>
                                        )}
                                    </Radio.Group>   
                                </div>

                                <div style={{marginBottom: "10px"}}>
                                    <div style={{marginBottom:"3px"}}>
                                        <Text strong style={{fontSize: "10px"}}>WEIGHT</Text>
                                    </div>
                                    <Radio.Group value={form.weight}  onChange={(e) => setForm({...form, weight: e.target.value})}>
                                        {[0,0.096,0.143].map(num => 
                                            <Radio.Button value={num}>{num}</Radio.Button>
                                        )}
                                    </Radio.Group>   
                                </div>

                                <div style={{marginBottom: "10px"}}>
                                    <div style={{marginBottom:"3px"}}>
                                        <Text strong style={{fontSize: "10px"}}>CONTACT</Text>
                                    </div>
                                    <Input
                                        style={{marginBottom:"5px"}}
                                        defaultValue={form.contact}
                                        onChange={(e) => {setForm({...form, contact: e.target.value})}}
                                    >
                                    </Input>   
                                </div>

                            </Card>
                        </div>
                    </div> 
                </div>
            :
                <Loading/>
            } 
        </div>
    )
}

export default CreateClass