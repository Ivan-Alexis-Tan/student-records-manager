import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'

import { schemaStudentForm } from "../schemas/schemas"
import { capitalEveryWord } from "../services/helperFunctions"

const configsDefault = {
    setFn: () => {}, 
    studentIds: [''],
    emailsData: [''], 
    centerForm: false,
}

export default function RegisFormStudent({ configs = configsDefault}) {
    const { 
        register, 
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaStudentForm),
    });
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const breakAttrib = configs.centerForm ? null : <br/>

    function onSubmit(data) {
        if (!configs.studentIds) {
            console.error("Required to pass an array of student ID data on 'configs.studentIds'.")
            return
        }

        if (!configs.emailsData) {
            console.error("Required to pass an array of emails data on 'configs.emailsData'.")
            return
        }

        if (data.password !== confirmPassword) {
            setErrorMessage('Confirmed password does not match.')
            return
        }

        if (!configs.studentIds.includes(data.student_id)) {
            setErrorMessage('Student ID does not exists.')
            return
        }

        if (configs.emailsData.includes(data.email)) {
            setErrorMessage('Email already taken.')
            return
        }

        configs.setFn(data)
        setErrorMessage('')
    }

    const errorFields = Object.keys(errors)
    const showErrorMessage = (errorFields.length == 0) && errorMessage;

    return (
        <div>
            {/* Zod Error Message */}
            {(errorFields.length !== 0) && (
                <div style={errorMsgStyle}>
                    <p><strong>Invalid {capitalEveryWord(errorFields[0], '_')}</strong></p>
                    <p>{errors[errorFields[0]]?.message}</p>
                </div>
            )}

            {/* Registration Form */}
            <form className={configs.centerForm ? "regis-form center" : 'regis-form'}
                onSubmit={ handleSubmit(onSubmit) }
            >
                {showErrorMessage && <p style={errorMsgStyle}>{errorMessage}</p>}

                <input placeholder="Student ID" type="text" {...register('student_id')} />
                {breakAttrib}

                <input placeholder="Username" type="text" {...register('username')} />
                {breakAttrib}

                <input placeholder="Email" type="text" {...register('email')} />
                {breakAttrib}

                <input placeholder="Password" type="password" {...register('password')} />
                {breakAttrib}

                <input placeholder="Confirm Password"
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                {breakAttrib}

                <button onClick={handleSubmit}>Submit</button>  
            </form>  
        </div>
    )
}

const errorMsgStyle = {
    textAlign: "center",
    color: 'hsl(9, 100%, 69%)',
}