import React, {useState, useContext} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {counselorData} from '../Utils';
import AuthContext from '../auth/AuthContext.js';

import {Typography, Input, Tooltip, List, Tag} from 'antd';
import {CheckOutlined, CopyOutlined, CaretRightOutlined} from '@ant-design/icons';
const {Title} = Typography;
const {TextArea} = Input;



const CounselorEmail = () => {

    const [copied, setCopied] = useState({})
    const {auth, setAuth} = useContext(AuthContext)

    const isCounselor = (name, counselor) => {
        if (name.indexOf(" ") === -1 || counselor.role !== "Counselor") {return false}

        name = name.substring(name.indexOf(" ") + 1)
        var rangeStart = counselor.name.substring(counselor.name.indexOf("(")+1, counselor.name.indexOf("-")-1)
        var rangeEnd = counselor.name.substring(counselor.name.indexOf("-")+2, counselor.name.indexOf(")"))

        return (name.localeCompare(rangeStart) == 1 || name.indexOf(rangeStart) == 0) && (name.localeCompare(rangeEnd) == -1 || name.indexOf(rangeEnd) == 0)
    }

    return (
        <>
            <Title level={2} style={{marginLeft:"5px"}}>Need to Email?</Title>
        
            <List
                bordered
                style={{borderRadius:"15px", marginTop:"30px", backgroundColor:"white"}}
                dataSource={counselorData}
                renderItem={(counselor, index) => (
                    <List.Item style={{display:"flex", justifyContent:"space-between"}}>
                        
                        <div style={{display:"flex", alignItems:"center"}}>
                            {(isCounselor(auth.user.name, counselor)) &&
                                <Tooltip title="Probable counselor">
                                    <CaretRightOutlined style={{margin:"0 5px 0 -5px", color:"gray", fontSize:"20px"}}/>
                                </Tooltip>
                            }
                            <div style={{fontWeight:"550", marginRight:"15px"}}>{counselor.name}</div>
                            <Tag color={"blue"} key={counselor.role}>{counselor.role}</Tag>
                        </div>
                        
                        <div>
                            {counselor.email}
                            &nbsp;&nbsp;
                            {copied[index] === true?
                                <Tooltip title="Copied!">
                                    <CheckOutlined style={{color: "#52c41a"}}/>
                                    <div style={{color:"transparent", display:"inline", fontSize:"0px"}}>
                                        {setTimeout(() => {
                                            setCopied({...copied, [index]: false})
                                        }, 1000)}
                                    </div>
                                </Tooltip>
                            :
                                <Tooltip title="Click to copy">  
                                    <CopyToClipboard text={counselor.email}>
                                        <CopyOutlined style={{color:"#1890FF"}} onClick={() => {
                                            setCopied({...copied, [index]: true})
                                        }}/>
                                    </CopyToClipboard>  
                                </Tooltip>
                            }
                        </div>  
                        
                    </List.Item>
                )}
            />
        </>
    )
}

export default CounselorEmail
