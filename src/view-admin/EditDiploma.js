import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios'

import OtherDataContext from "../contexts/OtherDataContext";
import Loading from "../shared-components/Loading";

import {Typography, Tooltip, Descriptions, PageHeader, Button, InputNumber, Input, Select, Radio} from 'antd';
import {SaveTwoTone, DeleteTwoTone, LoadingOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import {motion} from 'framer-motion';

const {Title, Paragraph} = Typography;
const {TextArea} = Input
const {Option} = Select


const EditDiploma = () => {

    const {otherDataContext, setOtherDataContext} = useContext(OtherDataContext)
    const [diplomaForm, setDiplomaForm] = useState(null)
    const [diplomaIndex, setDiplomaIndex] = useState(0)
    const [loading, setLoading] = useState({})

    useEffect(() => { 
        if (otherDataContext?.diplomaData && !diplomaForm) {
            setDiplomaForm(otherDataContext.diplomaData)
        }
    }, [otherDataContext])
   
    
    const saveDiploma = async(oldName, newDiploma) => {
        try {
            const saveRes = await axios.put(`${process.env.REACT_APP_COURSE_API}/other/diploma-edit/${oldName}`, newDiploma);
            getDiplomaData()
        } catch (error) {
            console.log(error)
        }
    }
    const getDiplomaData = async() => {
        try {
            const diplomaRes = await axios.get(`${process.env.REACT_APP_COURSE_API}/other`);
            setOtherDataContext({...otherDataContext, diplomaData: diplomaRes.data.diplomas});
            console.log(diplomaRes.data)
            setLoading({...loading, [diplomaIndex]: false})
        } catch (error) {
            console.log(error);
        }
    }

    const displayDiploma = (diploma) => (
        <div>
            <PageHeader
                className="site-page-header"
                style={{marginLeft:"-15px"}}
                title={
                    <div style={{display:"flex", height: "40px", alignItems:"center"}}>
                        <Paragraph
                            style={{display:"flex", fontWeight:"600", fontSize:"24px", margin:"0px"}}
                            editable={{
                                tooltip: 'click to edit text',
                                onChange: (e) => {
                                    const newDiploma = [...diplomaForm]
                                    newDiploma[diplomaIndex].name = e
                                    setDiplomaForm(newDiploma)
                                }
                            }}
                        >
                            {diploma.name}
                        </Paragraph> &nbsp; &nbsp;

                        <div style={{fontSize:"24px"}}> (</div>

                        <InputNumber
                            style={{width:"50px", fontSize:"24px"}}
                            size="large"
                            value={diploma.credits}
                            onChange={(e) => {
                                const newDiploma = [...diplomaForm]
                                newDiploma[diplomaIndex].credits = e
                                setDiplomaForm(newDiploma)
                            }}
                        /> &nbsp;

                        <div style={{fontSize:"24px"}}> credits)</div>
                    </div>
                }
                extra = { 
                    <div style={{display:"flex", justifyContent:"space-between", fontSize: "25px", marginTop:"2px", marginRight:"-15px"}}>
                        <motion.div
                            whileHover={{scale: 1.3}}
                            onClick={() => {
                                setLoading({...loading, [diplomaIndex]: true})
                                saveDiploma(otherDataContext.diplomaData[diplomaIndex].name, diplomaForm[diplomaIndex])
                            }}
                        >
                            {loading[diplomaIndex]?
                                <LoadingOutlined style={{color:"#8f8f8f"}}/>
                            :
                                <SaveTwoTone/>
                            }
                        </motion.div>
                    </div>
                }
            ></PageHeader>
            

            
            <Descriptions bordered column={1}>
                {diploma.subjects.map((subject, subjectIndex) => 
                    <Descriptions.Item 
                        label={
                            <div style={{width:"150px"}}>
                                <Input
                                    value={subject.name}
                                    style={{margin: "15px 15px 15px 0px", width:"150px"}}
                                    onChange = {(e) => {
                                        const newDiploma = [...diplomaForm]
                                        newDiploma[diplomaIndex].subjects[subjectIndex].name = e.target.value
                                        setDiplomaForm(newDiploma)
                                    }}
                                >
                                </Input>
                                
                                <div style={{display:"flex", marginTop:"-5px"}}>
                                    <InputNumber
                                        style={{width:"35px"}}
                                        size="small"
                                        value={subject?.credits}
                                        onChange={(e) => {
                                            const newDiploma = [...diplomaForm]
                                            newDiploma[diplomaIndex].subjects[subjectIndex].credits = e
                                            setDiplomaForm(newDiploma)
                                        }}
                                    /> &nbsp;
                                    <div style={{fontWeight:"650"}}> credits</div>
                                </div>
                                
                                <Button 
                                    danger 
                                    type={'primary'} 
                                    block={true} 
                                    style={{marginTop:"15px", borderRadius:"10px"}}
                                    onClick={() => {
                                        const newDiploma = [...diplomaForm]
                                        newDiploma[diplomaIndex].subjects.splice(subjectIndex, 1)
                                        setDiplomaForm(newDiploma)
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        }
                    >
                        <div style={{display:"flex", justifyContent:"space-between", minWidth:"90%"}}>
                            <div style={{width: "100%", display: "flex", justifyContent:"space-evenly", alignContent:"center", alignItems:"center", marginLeft:"-25px"}}>
                                {subject?.requirements.map((item, requirementIndex) => 
                                    <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between", marginLeft:"25px", height:"100%", minWidth:"100px"}}>
                                        <div style={{width:"100%", display:"flex", justifyContent:"flex-end", marginBottom:"10px"}}>
                                            <DeleteTwoTone
                                                twoToneColor="#ff0044"
                                                style={{fontSize:"16px"}}
                                                onClick={() => {
                                                    const newDiploma = [...diplomaForm]
                                                    newDiploma[diplomaIndex].subjects[subjectIndex].requirements.splice(requirementIndex, 1)
                                                    setDiplomaForm(newDiploma)
                                                }}
                                            />
                                        </div>
                                        <TextArea
                                            style={{borderRadius:"5px", fontSize:"13px", marginBottom:"10px"}} 
                                            value={item?.name} 
                                            onChange={(e) => {
                                                const newDiploma = [...diplomaForm]
                                                newDiploma[diplomaIndex].subjects[subjectIndex].requirements[requirementIndex].name = e.target.value
                                                setDiplomaForm(newDiploma)
                                            }}
                                        />
                                        <div style={{width:"100%", display:"flex", justifyContent:"flex-start"}}>
                                            <InputNumber
                                                style={{width:"35px"}}
                                                size="small"
                                                value={item?.credits}
                                                onChange={(e) => {
                                                    const newDiploma = [...diplomaForm]
                                                    newDiploma[diplomaIndex].subjects[subjectIndex].requirements[requirementIndex].credits = e
                                                    setDiplomaForm(newDiploma)
                                                }}
                                            />&nbsp;credits
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{width:"60px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", marginLeft:"25px"}}>
                                <Button 
                                    type={'primary'}
                                    ghost={true}
                                    style={{borderRadius: '10px', minHeight:"100px", height:"100px", width:"50px"}}
                                    block={true}
                                    onClick={() => {
                                        const newDiploma = [...diplomaForm]
                                        newDiploma[diplomaIndex].subjects[subjectIndex].requirements.push({
                                            credits: 2,
                                            name: "hi there",
                                        })
                                        setDiplomaForm(newDiploma)
                                    }}
                                >
                                    <div style={{fontSize:"25px", marginTop:"-5px"}}>+</div>
                                </Button>
                            </div>
                        </div>
                    </Descriptions.Item>
                )}
            </Descriptions>

            <Button
                type={'primary'}
                style={{borderRadius: '0 0 15px 15px', height:"36px", marginBottom:"20px"}}
                block={true}
                onClick={() => {
                    const newDiploma = [...diplomaForm]
                    newDiploma[diplomaIndex].subjects.push({
                        credits: 2,
                        name: "hi there",
                        requirements: []
                    })
                    setDiplomaForm(newDiploma)
                }}
            >
                <div style={{fontSize:"30px", marginTop:"-12px"}}>+</div>
            </Button>

        </div>
    )


    return (<>
        <div id="body" style={{paddingBottom: "10%", marginTop:"50px"}}>
            {otherDataContext && diplomaForm?
                <>
                    <PageHeader
                        className="site-page-header"
                        style={{marginLeft:"-25px"}}
                        title={<Title level={2} style={{marginBottom:"15px"}}>Diplomas</Title>}
                    ></PageHeader>

                    <Radio.Group value={diplomaIndex} onChange={e => setDiplomaIndex(e.target.value)} style={{marginBottom:"20px"}}>
                        {otherDataContext.diplomaData.map((diploma, index) =>
                            <Radio.Button value={index}>{diploma.name}</Radio.Button>
                        )}
                    </Radio.Group>

                    <div className="diplomaDisplay">{displayDiploma(diplomaForm[diplomaIndex])}</div>
                </>
            :
                <Loading style={{marginBottom:"80%"}}/>
            }
        </div>
    </>)
}

export default EditDiploma