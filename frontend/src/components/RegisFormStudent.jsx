import { useEffect } from "react"

import { useRegistration } from "../hooks/useRegistration"

const configsDefault = {
    setFn: () => {}, 
    centerForm: false,
    centerErrMsg: false,
    errorsStateFn: () => null,
}

export default function RegisFormStudent({ configs = configsDefault}) {
    const {
        regisForm,
        handleSubmitRegis,
        messageState: { message, messageStyles },
        setConfirmPassword,
    } = useRegistration({ regisType: 'student', submitFn: configs.setFn, })

    const breakAttrib = configs.centerForm ? null : <br/>

    // Message state relayer
    useEffect(() => {
        if (!configs.errorsStateFn) return;

        if (!message.ok) {
            configs.errorsStateFn(message)
        }
    }, [message.text])

    return (
        <div>
            {/* Registration Message */}
            {message.text && (!message.ok) && (
                <div style={messageStyles}>
                    {message.header && <p><strong>{message.header}</strong></p>}
                    <p>{message.text}</p>
                </div>
            )}

            {/* Registration Form */}
            <form className={configs.centerForm ? "regis-form center" : 'regis-form'}
                onSubmit={ handleSubmitRegis }
            >
                <input placeholder="Student ID" type="text" {...regisForm.register('student_id')} />
                {breakAttrib}

                <input placeholder="Username" type="text" {...regisForm.register('username')} />
                {breakAttrib}

                <input placeholder="Email" type="text" {...regisForm.register('email')} />
                {breakAttrib}

                <input placeholder="Password" type="password" {...regisForm.register('password')} />
                {breakAttrib}

                <input placeholder="Confirm Password"
                    type="password" 
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                {breakAttrib}

                <button type="submit">Submit</button>  
            </form>  
        </div>
    )
}