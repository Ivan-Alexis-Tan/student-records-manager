import { useEffect } from "react";

import { capitalEveryWord } from "../utils/helperFunctions";
import { subjects } from "../constants/index"
import { useRegistration } from "../hooks/useRegistration";

const configsDefault = {
    setFn: () => {},
    centerForm: false,
    centerErrMsg: false,
    errorsStateFn: () => null,
}

export default function RegisFormTeacher({ configs = configsDefault }) {
    const {
        regisForm,
        handleSubmitRegis,
        setConfirmPassword,
        messageState: { message, messageStyles },
    } = useRegistration({ regisType: 'teacher', submitFn: configs.setFn })

    const breakAttrib = configs.centerForm ? null : <br/>
    
    function handleAutoFill() {
        const { first_name, last_name } = regisForm.getValues()

        if (first_name && last_name) {
            const generated = `${capitalEveryWord(first_name)} ${capitalEveryWord(last_name)}`
            regisForm.setValue('username', generated)
        }
    }

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
            <form className={configs.centerForm ? 'regis-form center' : "regis-form"}
                onSubmit={ handleSubmitRegis }
            >   
                <input placeholder="First Name" type="text" {...regisForm.register('first_name')} />
                {breakAttrib}

                <input placeholder="Last Name" type="text" {...regisForm.register('last_name')} />
                {breakAttrib}

                <div>
                    <label>Field Specialty: </label>
                    <select {...regisForm.register("field_specialty")} >
                        <option value={''}>Select Subject</option>
                        {subjects.map(subj => <option key={subj} value={subj}>{subj}</option>)}
                    </select>
                </div>
                {breakAttrib}

                <div>
                    <input placeholder="Username" type="text" {...regisForm.register('username')} />
                    <button onClick={handleAutoFill} type="button">Auto-fill</button>
                </div>
                {breakAttrib}

                <input placeholder="Email" type="email" {...regisForm.register('email',)} />
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