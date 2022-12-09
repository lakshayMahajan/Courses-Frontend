import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';

import AuthContext from '../auth/AuthContext.js';
import CheckContext from '../contexts/CheckContext';
import OtherDataContext from '../contexts/OtherDataContext';

import Loading from "../shared-components/Loading";

import {displayCheck, filterGrades} from "../Utils";
import {creditShortener} from '../shared-components/TagPrinter';

import {Card, Typography, Input, Radio, Statistic, Tooltip} from 'antd';
import {CheckCircleTwoTone, CloseCircleTwoTone} from '@ant-design/icons';
const {Title} = Typography;



const Statistics = () => {
    const {auth} = useContext(AuthContext)
    const [diplomaIndex, setDiplomaIndex] = useState(0)
    const {checkContext, setCheckContext} = useContext(CheckContext)
    const {otherDataContext} = useContext(OtherDataContext)


    useEffect(() => {
        setCheckContext(displayCheck(auth.user.courseData.courses, otherDataContext.diplomaData[diplomaIndex]))
    }, [diplomaIndex])



    const periodCheckColumn = (evenOdd, semStr) => (
        <>{checkContext.courseNumCheck.map((item, index) => 
            <>{index%2 === evenOdd &&
                <div style={{display:"flex", justifyContent:"space-between", margin:"10px 5px", alignItems:"center"}}>
                    <div>{semStr}</div>
                    {item <= 7?
                        <div>{item}/7 &nbsp; <CheckCircleTwoTone style={{paddingTop:"5px"}} twoToneColor="#52c41a"/></div>
                    :
                        <div>{item}/7 &nbsp; <CloseCircleTwoTone style={{paddingTop:"5px"}} twoToneColor="#ff0044"/></div>
                    }
                </div>
            }</>
        )}</>
    )
    const creditCheckColumn = (evenOdd) => (
        <>{checkContext.out.map((item, index) =>
            <>{index%2 === evenOdd &&
                <div style={{display:"flex", justifyContent:"space-between", margin:"5px", alignItems:"center"}}>
                    <div>{creditShortener(item[0])}</div>
                    {item[1] >= item[2]?
                        <div>{item[1]}/{item[2]} &nbsp; <CheckCircleTwoTone style={{paddingTop:"5px"}} twoToneColor="#52c41a"/></div>
                    :
                        <div>{item[1]}/{item[2]} &nbsp; <CloseCircleTwoTone style={{paddingTop:"5px"}} twoToneColor="#ff0044"/></div>
                    }
                </div>
            }</>
        )}</>
    )

    const cardStyle = {width: "100%", borderRadius: "15px", minHeight:"200px"}
    const radioStyle = {display: 'block', height: '30px', lineHeight: '30px'}

    return (
        <div>
            {checkContext?
                <div>
                
                    <Title level={2} style={{marginLeft:"5px"}}>Statistics</Title>
                    
                    <div style={{marginTop:"30px", display:"flex", width:"100%", justifyContent:"space-between"}}>
                        <div style={{width:"43.5%"}}>
                            <Card style={cardStyle} title="Semesters Allowed Errors" size="small">
                                
                                {Object.keys(checkContext.maxSemesterCheck).length !== 0?
                                    <>
                                        {Object.keys(checkContext.maxSemesterCheck).map(course => {
                                            var data = checkContext.maxSemesterCheck[course]
                                            return (
                                                <div style={{margin:"5px 10px 0 10px"}}>- {course}: {data[0]} semesters / {data[1]} semesters allowed</div>
                                            )
                                        })}
                                    </> 
                                :
                                    <div style={{margin:"5px 10px 0 10px"}}>No Errors Were Caught!</div>
                                }

                            </Card>
                        </div>
                        <div style={{width:"52.9%"}}>
                            <Card hoverable={false} title=">7 Period Errors" size="small" style={{...cardStyle, height:"200px"}}>
                                <div style={{width:"100%", borderRadius:"0 0 0 15px", display:"flex", justifyContent: "center", alignItems:"center"}}>  
                                    <Tooltip 
                                        style={{marginTop:"0px"}} 
                                        placement="bottom" 
                                        title={() => 
                                            <div style={{fontSize: "12px"}}>
                                                Note: If you somehow plan to take over 7 periods, discuss this with your counselor. 
                                            </div>
                                        }
                                    >
                                        <div style={{display:"flex", justifyContent:"space-between", width:"97%"}}>
                                            
                                            <div style={{width:"15%"}}>
                                                {filterGrades.map(item => 
                                                    <div style={{display:"flex", justifyContent:"space-between", margin:"10px 0"}}>{item}</div>)
                                                }
                                            </div>
                                            
                                            <div style={{width:"35%"}}>
                                                {periodCheckColumn(0, "Semester 1")}
                                            </div>
                                            
                                            <div style={{width:"35%"}}>
                                                {periodCheckColumn(1, "Semester 2")}
                                            </div> 

                                        </div>
                                    </Tooltip>
                                </div> 
                            </Card>
                        </div>
                    </div>

                    <div style={{marginTop:"35px", width: "100%", display: "flex", justifyContent: "space-between"}}>
                        <div style={{width: "24%", minWidth:"230px"}}>
                            <Card style={cardStyle} size="small" title="Choose a Diploma">
                                <Radio.Group 
                                    onChange={(e) => {
                                        setDiplomaIndex(e.target.value)
                                    }}
                                    style={{padding:"5px", width:"100%"}}
                                    value={diplomaIndex}
                                >
                                    <div>
                                        {otherDataContext.diplomaData.map((item, index) => 
                                            <Radio style={radioStyle} value={index}>{item.name}</Radio>
                                        )}
                                    </div>
                                    
                                </Radio.Group>
                            </Card>
                        </div>
                        <div style={{width: "52.9%"}}>
                            <Card size="small" style={{...cardStyle, height:"200px"}} title="UNOFFICIAL Credit Check">
                                
                                <Card.Grid hoverable={false} style={{width: '80%', borderRadius:"0 0 0 15px", display:"flex", justifyContent: "center", alignItems:"center", padding:"12px", height:"162px"}}>
                                    <Tooltip 
                                        style={{marginTop:"0px"}} 
                                        placement="bottom" 
                                        title={() => 
                                            <div style={{fontSize: "12px"}}>
                                                Note: this does not check individual requirements or electives,&nbsp;
                                                <Link to="/diplomas">click here</Link>
                                                &nbsp;for specifics.
                                            </div>
                                        }
                                    >
                                        <div style={{display:"flex", justifyContent:"space-between", width:"97%"}}>
                                            <div style={{width:"46.5%"}}>
                                                {creditCheckColumn(0)}
                                            </div>
                                            <div style={{width:"46.5%"}}>
                                                {creditCheckColumn(1)}
                                            </div> 
                                        </div>
                                    </Tooltip>
                                </Card.Grid>
                                
                                <Card.Grid hoverable={false} style={{width: '20%', borderRadius:"0 0 15px 0", textAlign:"center", minHeight:"162px", padding:"12px", display:"flex", alignItems:"center", height:"100%", justifyContent:"center"}}>
                                    <Statistic title="Fulfilled Credits" valueStyle={{fontSize:"30px"}} value={checkContext.credits} suffix={"/" + otherDataContext.diplomaData[diplomaIndex].credits}/>
                                </Card.Grid>

                            </Card>
                        </div>
                        <div style={{width: "16.1%"}}>
                            <Card size="small" style={cardStyle} title="GPA Info">
                                <Tooltip placement="bottom" title={() => 
                                    <div style={{fontSize: "12px"}}>
                                        Weighted GPA = Unweighted GPA + Weight Boost. Weight Boost = sum of credit weights / semesters of high school taken. Unweighted GPA = sum of grades on a 4.0 scale / credits received. 
                                    </div>
                                }>
                                    <div style={{display:"flex", alignContent: "space-between", flexDirection:"column", textAlign:"center"}}>
                                        <Statistic style={{marginTop:"5px"}}
                                            title="Weight Boost"
                                            value={(checkContext.weight/checkContext.semesters) || "0"}
                                            formatter={value => <div>{Math.round(value*1000)/1000.0}</div>}
                                            valueStyle={{marginTop:"-5px", fontSize:"30px", color: "#52c41a" }}
                                            prefix={<div>+ </div>} 
                                        />
                                        <Statistic style={{marginTop:"10px"}}
                                            title={<div style={{fontSize: "12px"}}>Weight/Semesters</div>}
                                            formatter={value => <div>{Math.round(value*1000)/1000.0}</div>}
                                            valueStyle={{marginTop:"-5px", fontSize:"20px"}}
                                            value={checkContext.weight} 
                                            suffix={"/" + checkContext.semesters} 
                                        />
                                    </div>
                                </Tooltip>
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

export default Statistics
