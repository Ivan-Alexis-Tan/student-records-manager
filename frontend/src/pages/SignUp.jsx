// Dependency imports
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

// Services and Helpers
import { capitalEveryWord } from "../services/helperFunctions"
import { createSignupRequest, getSignupCheck } from "../services/studentsAPI"

// Components
import RegisFormStudent from "../components/RegisFormStudent"
import RegisFormTeacher from "../components/RegisFormTeacher"
import RegisFormAdmin from "../components/RegisFormAdmin"

const roles = ['student', 'teacher', 'admin']
const messageDefault = {
    text: "",
    ok: false,
}

export default function SignUpPage() {
    const {data: signupCheck, isLoading} = useQuery({
        queryKey: ['signupCheck'],
        queryFn: getSignupCheck,
        select: (res) => res.data
    })

    const [regisDetails, setRegisDetails] = useState(null)
    const [roleIdx, setRoleIdx] = useState(0)
    const [currentRole, setCurrentRole] = useState(roles[roleIdx])
    const [message, setMessage] = useState(messageDefault)

    // Role Indexer
    useEffect(() => {
        setCurrentRole(roles[roleIdx])
    }, [roleIdx])

    // Signup Return
    useEffect(() => {
        if (regisDetails === null) return

        const sendSignupRequest = async () => {
            try {
                const res = await createSignupRequest(regisDetails)
                setMessage({text: 'Registration request sent.', ok: true})
            }
            catch(error) {
                const resErroMessage = error.response.data?.detail ?? error.response.statusText
                console.error(resErroMessage)
                setMessage({text: resErroMessage, ok: false})
            }
        }

        sendSignupRequest()
    }, [regisDetails])

    if (isLoading) return <h1>Loading...</h1>

    const studentIds = signupCheck?.student_ids ?? []
    const userEmails = signupCheck?.user_emails ?? []

    // Form Components Rendering
    let form;

    switch (currentRole) {
        case 'student':
            form = <RegisFormStudent configs={{ 
                setFn: setRegisDetails, 
                centerForm: true,
                studentIds: studentIds,
                emailsData: userEmails,
            }} />
            break;
        case 'teacher':
            form = <RegisFormTeacher configs={{ 
                setFn: setRegisDetails, 
                centerForm: true,
                emailsData: userEmails,
            }} />
            break;
        case 'admin':
            form = <RegisFormAdmin configs={{
                setFn: setRegisDetails,
                centerForm: true,
                emailsData: userEmails,
            }} />
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
            
            {message.text && <p style={ message.ok 
                ? {color: 'hsl(113, 100%, 50%)'}
                : {color: 'hsl(9, 100%, 69%)'}
            }>{message.text}</p>}

            {form}
        </div>
    )
}