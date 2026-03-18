import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

import { schemaUserForm } from "../schemas/schemas"
import { capitalEveryWord } from "../services/helperFunctions";

const configsParams = {
    setFn: () => {}, 
    centerForm: false,
}

export default function RegisFormAdmin({ configs = configsParams }) {
    const { 
        register, 
        handleSubmit,
        formState: { errors }, 
    } = useForm({
        resolver: zodResolver(schemaUserForm),
        defaultValues: {role: 'admin'},
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const breakAttrib = configs.centerForm ? null : <br/>

    function onSubmit(data) {
        if (data.password !== confirmPassword) {
            setErrorMessage('Confirmed password does not match.')
            return
        }

        configs.setFn(data)
        setErrorMessage('')
    }

    const errorFields = Object.keys(errors)
    const showErrorMessage = (errorFields.length == 0) && errorMessage

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
            <form className={configs.centerForm ? 'regis-form center' : "regis-form"}
                onSubmit={ handleSubmit(onSubmit) }
            >
                {showErrorMessage && <p style={errorMsgStyle}>{errorMessage}</p>}

                <input placeholder="Username" type="text" {...register('username')} />
                {breakAttrib}

                <input placeholder="Email" type="email" {...register('email')} />
                {breakAttrib}

                <input placeholder="Password" type="password" {...register('password')} />
                {breakAttrib}

                <input placeholder="Confirm Password"
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                {breakAttrib}

                <button type="submit">Submit</button>
            </form>    
        </div>
    )
}

const errorMsgStyle = {
    textAlign: "center",
    color: 'hsl(9, 100%, 69%)',
}