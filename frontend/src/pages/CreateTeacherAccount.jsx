import { useEffect, useState } from "react"

import { mutationCreateTeacherAcc } from "../hooks/mutateFuncs"
import RegisFormTeacher from "../components/RegisFormTeacher"

const messageDefault = {
    text: "",
    ok: false,
}

export default function CreateTeacherAccountPage() {
    const [newAccDetails, setNewAccDetails] = useState()
    const [message, setMessage] = useState(messageDefault)
    const [formError, setFormError] = useState()

    const createTeacherAccMutation = mutationCreateTeacherAcc({
        ifSuccess: _ => {
            setMessage({
                text: `Successfully created ${newAccDetails.username}'s account.`, 
                ok: true
            });
            setNewAccDetails()
        },
        ifError: (error) => setMessage({
            ok: false,
            text: error.data.detail
        }),
    })
    
    // Create Teacher Account Mutation
    useEffect(() => {
        if (!newAccDetails) return 

        createTeacherAccMutation.mutate(newAccDetails)
    }, [newAccDetails])

    // Error message updater
    useEffect(() => {
        if (formError) setMessage(messageDefault);
    }, [formError])

    return (
        <div>
            <h1>Create Teacher Account</h1>

            {message.text && <p style={message.ok
                ? {color: 'hsl(113, 100%, 50%)', textAlign: 'center'}
                : {color: 'hsl(9, 100%, 69%)', textAlign: 'center'}
            }>{message.text}</p>}

            <RegisFormTeacher configs={{ 
                setFn: setNewAccDetails, 
                centerErrMsg: true, 
                centerForm: true,
                errorsStateFn: setFormError,
            }} />
        </div>
    )
}
