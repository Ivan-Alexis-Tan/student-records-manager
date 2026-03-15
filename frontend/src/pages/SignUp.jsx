import { useEffect, useState } from "react"

import { capitalEveryWord } from "../services/helperFunctions"

import RegisFormStudent from "../components/RegisFormStudent"
import RegisFormTeacher from "../components/RegisFormTeacher"
import RegisFormAdmin from "../components/RegisFormAdmin"

const roles = ['student', 'teacher', 'admin']

export default function SignUpPage() {
    const [regisDetails, setRegisDetails] = useState(null)
    const [roleIdx, setRoleIdx] = useState(0)
    const [currentRole, setCurrentRole] = useState(roles[roleIdx])

    useEffect(() => {
        setCurrentRole(roles[roleIdx])
    }, [roleIdx])

    useEffect(() => {
        if (regisDetails === null) return

        console.log(regisDetails)
    }, [regisDetails])

    let form;

    switch (currentRole) {
        case 'student':
            form = <RegisFormStudent setFn={setRegisDetails} centerForm={true} />
            break;
        case 'teacher':
            form = <RegisFormTeacher setFn={setRegisDetails} configs={{ centerForm: true}} />
            break;
        case 'admin':
            form = <RegisFormAdmin setFn={setRegisDetails} centerForm={true} />
            break;
        default:
            break;
    }

    return (
        <div className="signup-request-page">
            <h2 className="signup-request-page__role"
                onClick={_ => {
                    setRoleIdx(prev => (prev + 1) % roles.length)
                }}
                title="Change role"
                >{capitalEveryWord(currentRole)}
            </h2>

            {form}
        </div>
    )
}