import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';

import AuthContext from '../auth/AuthContext.js';
import OtherDataContext from "../contexts/OtherDataContext";

import Loading from "../shared-components/Loading";

import {Typography, Tooltip, Descriptions, PageHeader, Modal, Button, Radio} from 'antd';
import {EditTwoTone} from '@ant-design/icons';
import {motion} from 'framer-motion';

const {Title} = Typography;



const Diplomas = () => {

    const {auth} = useContext(AuthContext)
    const {otherDataContext, setOtherDataContext} = useContext(OtherDataContext)
    const [visible, setVisible] = useState(null)
    const [diplomaShown, setDiplomaShown] = useState(0)

    
    const getCredit = (subject) => {
        const arr = otherDataContext.creditData.filter(credit => {
            if (credit.name == "Language Arts" && subject.name == "Arts") {
                return false
            } else if ((credit.name == "Computer Science" || credit.name == "Family and Consumer Science") && subject.name == "Science") {
                return false
            } else {
                return credit.name.toLowerCase().indexOf(subject.name.toLowerCase()) !== -1 || subject.name.toLowerCase().indexOf(credit.name.toLowerCase()) !== -1
            }
        })

        const ret = []
        arr.map(item => ret.push(item.name))
        return ret
    }
    const credLinks = (subject) => {
        var credFilters = getCredit(subject)
        if (credFilters.length>0) {
            return (
                <Link
                    style={{fontWeight:"600", fontSize:"16px"}} 
                    to='/search'
                    onClick={() => localStorage.setItem("filters", JSON.stringify({searchText: "", creditSelect: getCredit(subject), gradeLevelSelect: [], tagSelect: []}) )}
                >
                    {subject.name}
                </Link>
            )
        } else {
            return (<div style={{fontWeight:"600", fontSize:"16px"}}>{subject?.name}</div>)
        }
    }

    
    const displayDiploma = (diploma) => (
        <Descriptions bordered column={1} style={{marginBottom:"30px", borderRadius:"15px"}}>
            {diploma.subjects.map(subject => 
                <Descriptions.Item 
                    label={
                        <>
                            {credLinks(subject)}
                            <div style={{fontWeight:"650", marginTop:"5px"}}>{subject?.credits + " credits"}</div>
                        </>
                    }
                >
                    <div style={{display: "flex", justifyContent:"space-around", alignContent:"center", alignItems:"center", marginLeft:"-25px"}}>
                        {subject?.requirements.map(item => 
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", marginLeft:"25px", minWidth:"70px"}}>
                                {item?.name.length>70?
                                    <>
                                        <Button style={{border:"none", boxShadow:"none", color:"rgb(82, 196, 26)"}} onClick={() => setVisible(item)}>View Options</Button>
                                        <Modal visible={visible == item} onCancel={() => setVisible(null)} style={{borderRadius:"15px"}}>
                                            <div style={{marginRight:"25px"}}>
                                                {item?.name}
                                            </div>
                                        </Modal>
                                    </>
                                :
                                    <div style={{fontSize:"13px", display:"flex", textAlign:"center"}}>{item?.name}</div>
                                }
                                <div style={{fontWeight:"600", marginTop:"5px"}}>{item?.credits} credits</div>
                            </div>
                        )}
                    </div>
                </Descriptions.Item>
            )}
        </Descriptions>
    )

    return (
        <div id="body" style={{paddingBottom: "10%", marginTop:"50px"}}>
            {otherDataContext?.diplomaData?
                <>
                    <PageHeader
                        className="site-page-header"
                        style={{marginLeft:"-25px"}}
                        title={<Title level={2} style={{marginBottom:"15px"}}>Diplomas</Title>}
                        extra = {auth?.user?.role === "teacher" &&
                            <div style={{display:"flex", justifyContent:"space-between", fontSize: "25px", marginTop:"2px", marginRight:"-15px"}}>
                                <motion.div whileHover={{scale: 1.3}}>
                                    <Link to={'/diploma-edit'}>
                                        <EditTwoTone twoToneColor="#52c41a"/>
                                    </Link>
                                </motion.div>
                            </div>
                        }
                    ></PageHeader>

                    <Radio.Group value={diplomaShown} onChange={e => setDiplomaShown(e.target.value)} style={{marginBottom:"20px"}}>
                        {otherDataContext.diplomaData.map((diploma, index) =>
                            <Radio.Button value={index}>{diploma.name}</Radio.Button>
                        )}
                    </Radio.Group>

                    <div className="diplomaDisplay">{displayDiploma(otherDataContext?.diplomaData[diplomaShown])}</div>
                </>
            :
                <Loading style={{marginBottom:"80%"}}/>
            }
        </div>
    )
}

export default Diplomas