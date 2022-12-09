import {Tooltip, Tag} from 'antd';



export const tagPrinter = (credits, creditData, shorten) => (
    <>{credits.length == 0?
        <Tag color={"red"} key="none">NONE</Tag>
    :
        <>{credits.map(cred => {
            var creditObject = creditData.find(credit => credit.name.toLowerCase() === cred.toLowerCase())
            if (shorten) {cred = creditShortener(cred)} 
            if (creditObject?.tip.length>1 && creditObject?.tip !== "here is the tip") {
                return (
                    <Tooltip title={creditObject.tip}>
                        <Tag color={"blue"} key={cred}>{cred.toUpperCase()}</Tag>
                    </Tooltip>
                )
            } else {
                return (
                    <Tag color={"blue"} key={cred}>
                        {cred.toUpperCase()}
                    </Tag>
                )
            }
        })}</>
    }</>
)
export const creditShortener = (cred) => {
    if (cred.toUpperCase() == "ENGINEERING AND TECHNOLOGY") { return "Eng and Tech" }
    else if (cred.toUpperCase() == "PERFORMING ARTS") { return "Perf Arts" }
    else if (cred.toUpperCase() == "WORLD LANGUAGES") { return "World Lang" }
    else if (cred.toUpperCase() == "COMPUTER SCIENCE") { return "CS" }
    else if (cred.toUpperCase() == "MATHEMATICS") { return "Math" }
    else if (cred.toUpperCase() == "FAMILY AND CONSUMER SCIENCE") { return "Fam and Consumer Sci" }
    else if (cred.toUpperCase() == "J. EVERETT LIGHT CAREER CENTER") { return "JEL Career Center" }
    else if (cred.toUpperCase() == "PE, HEALTH, AND NUTRITION") { return "PE/Health" }
    else if (cred.toUpperCase() == ("Career-Technical Program").toUpperCase()) { return "Career-Tech Program" }
    else if (cred.toUpperCase() == ("Career Academic Sequence").toUpperCase()) { return "Career Acad Seq" }
    else { return cred }
}



export const gradeLevelPrinter = (grades) => {
    if (grades.length==4) {
        return (
            <Tag color={"green"}>ALL GRADES</Tag>
        )
    } else {
        return (
            grades.map(grade => 
                <Tag color={"blue"} key={grade}>{grade.toUpperCase()}</Tag>
            )
        )
    }
}
    