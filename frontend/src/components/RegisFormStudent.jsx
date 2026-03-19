import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'

import { schemaStudentForm } from "../schemas/schemas"
import { capitalEveryWord } from "../services/helperFunctions"

const configsDefault = {
    setFn: () => {}, 
    centerForm: false,
    centerErrMsg: false,
    errrorStateFn: () => null,
}

export default function RegisFormStudent({ configs = configsDefault}) {
    const { 
        register, 
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaStudentForm),
        defaultValues: {role: 'student'},
    });
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const breakAttrib = configs.centerForm ? null : <br/>
    const errorMsgStyle = configs.centerErrMsg ? centerErrMsgStyle : defaultErrMgsStyle

    function onSubmit(data) {
        if (data.password !== confirmPassword) {
            setErrorMessage('Confirmed password does not match.')
            return
        }

        configs.setFn(data)
        setErrorMessage('')
    }

    const errorFields = Object.keys(errors)
    const showErrorMessage = (errorFields.length == 0) && errorMessage;

    // Error message updater
    useEffect(() => {
        if (!configs.errrorStateFn) return

        if (errorFields.length >= 1) configs.errrorStateFn(errors);
        if (errorMessage) configs.errrorStateFn(errorMessage);
    }, [errors, errorMessage, errorFields])

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

const centerErrMsgStyle = {
    textAlign: "center",
    color: 'hsl(9, 100%, 69%)',
}

const defaultErrMgsStyle = {color: 'hsl(9, 100%, 69%)'}