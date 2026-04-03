// Dependency imports
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// Services and Helpers
import { capitalEveryWord } from "../utils/helperFunctions"
import { createFirstAdmin } from "../api/users"
import { createSignupRequest, hasAdminFetch } from "../api/signup"

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
    const navigate = useNavigate()

    const [regisDetails, setRegisDetails] = useState(null)
    const [roleIdx, setRoleIdx] = useState(0)
    const [currentRole, setCurrentRole] = useState(roles[roleIdx])
    const [message, setMessage] = useState(messageDefault)
    const [errorsState, setErrorsState] = useState()

    // Role Indexer
    useEffect(() => {
        setCurrentRole(roles[roleIdx])
        setMessage(messageDefault)
    }, [roleIdx])

    // Signup Return
    useEffect(() => {
        if (regisDetails === null) return

        const sendSignupRequest = async () => {
            try {
                const hasAdmin = await hasAdminFetch().then(res => res.data)

                if (!hasAdmin) {
                    await createFirstAdmin(regisDetails)
                    navigate('/login')
                }
                else {
                    await createSignupRequest(regisDetails)
                    setMessage({text: 'Registration request sent.', ok: true})
                }
            }
            catch(error) {
                const resErroMessage = error.response.data?.detail ?? error.response.statusText
                console.error(resErroMessage)
                setMessage({text: resErroMessage, ok: false})
            }
        }

        sendSignupRequest()
    }, [regisDetails])

    // Error message updater
    useEffect(() => {
        if (errorsState) setMessage(messageDefault);
    }, [errorsState])

    // Form Components Rendering
    let form;
    const componentConfigs = { 
        setFn: setRegisDetails, 
        centerForm: true,
        centerErrMsg: true,
        errorsStateFn: setErrorsState,
    }

    switch (currentRole) {
        case 'student':
            form = <RegisFormStudent configs={componentConfigs} />
            break;
        case 'teacher':
            form = <RegisFormTeacher configs={componentConfigs} />
            break;
        case 'admin':
            form = <RegisFormAdmin configs={componentConfigs} />
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