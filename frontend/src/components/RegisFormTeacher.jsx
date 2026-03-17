import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { schemaTeacherForm } from "../schemas/schemas"
import { capitalEveryWord } from "../services/helperFunctions";
import { subjects } from "../services/helperFunctions";

const configsDefault = {
    setFn: () => {},
    centerForm: false,
    emailsData: [''],
}

export default function RegisFormTeacher({ configs = configsDefault }) {
    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        getValues,
        setValue,
    } = useForm({
        resolver: zodResolver(schemaTeacherForm),
        defaultValues: { role: 'teacher' },
    });

    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const breakAttrib = configs.centerForm ? null : <br/>

    function handleAutoFill() {
        const { first_name, last_name } = getValues()

        if (first_name && last_name) {
            const generated = `${capitalEveryWord(first_name)} ${capitalEveryWord(last_name)}`
            setValue('username', generated)
        }
    }

    function handleOnSubmit(data) {
        if (!configs.emailsData) {
            console.error("Required to pass an array of emails data on 'configs.emailsData'.")
            return
        }

        if (data.password !== confirmPassword) {
            setErrorMessage('Confirm password does not match.')
            return
        }

        if (configs.emailsData.includes(data.email)) {
            setErrorMessage('Email already taken.')
            return
        }
        
        configs.setFn({
            ...data, 
            first_name: capitalEveryWord(data.first_name),
            last_name: capitalEveryWord(data.last_name),
        })
        setErrorMessage('')
    }

    const errorField = Object.keys(errors)
    const showConfirmPwError = (errorField.length == 0) && errorMessage 

    return (
        <div>
            {/* Zod Error Message */}
            {(errorField.length !== 0) && (
                <div style={errorMsgStyle}>
                    <p><strong>Invalid {capitalEveryWord(errorField[0], '_')}</strong></p>
                    <p>{errors[errorField[0]]?.message}</p>
                </div>
            )}
            
            {/* Registration Form */}
            <form className={configs.centerForm ? 'regis-form center' : "regis-form"}
                onSubmit={ handleSubmit(handleOnSubmit) }
            >   
                {showConfirmPwError && <p style={errorMsgStyle}>{errorMessage}</p>}

                <input placeholder="First Name" type="text" {...register('first_name')} />
                {breakAttrib}

                <input placeholder="Last Name" type="text" {...register('last_name')} />
                {breakAttrib}

                <div>
                    <label>Field Specialty: </label>
                    <select {...register("field_specialty")} >
                        <option value={''}>Select Subject</option>
                        {subjects.map(subj => <option key={subj} value={subj}>{subj}</option>)}
                    </select>
                </div>
                {breakAttrib}

                <div>
                    <input placeholder="Username" type="text" {...register('username')} />
                    <button onClick={handleAutoFill} type="button">Auto-fill</button>
                </div>
                {breakAttrib}

                <input placeholder="Email" type="email" {...register('email',)} />
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