import { useState } from "react"

export default function RegisFormStudent({ setFn = () => {}, centerForm = false}) {
    const signUpDefault = {
        studentId: "",
        username: '',
        email: "",
        password: '',
        confirmPass: "",
    }

    const [regisDetails, setRegisDetails] = useState(signUpDefault)
    const breakAttrib = centerForm ? null : <br/>

    return (
        <div className={centerForm ? "regis-form center" : 'regis-form'}>
            <input placeholder="Student ID"
                type="text"
                value={regisDetails.studentId}
                onChange={e => setRegisDetails(prev => ({...prev, studentId: e.target.value}))}
            />
            {breakAttrib}

            <input placeholder="Username"
                type="text" 
                value={regisDetails.username}
                onChange={e => setRegisDetails(prev => ({...prev, username: e.target.value}))}
            />
            {breakAttrib}

            <input placeholder="Email"
                type="text" 
                value={regisDetails.email}
                onChange={e => setRegisDetails(prev => ({...prev, email: e.target.value}))}
            />
            {breakAttrib}

            <input placeholder="Password"
                type="password" 
                value={regisDetails.password}
                onChange={e => setRegisDetails(prev => ({...prev, password: e.target.value}))}
            />
            {breakAttrib}

            <input placeholder="Confirm Password"
                type="password" 
                value={regisDetails.confirmPass}
                onChange={e => setRegisDetails(prev => ({...prev, confirmPass: e.target.value}))}
            />
            {breakAttrib}

            <button onClick={_ => setFn(regisDetails)}>Submit</button>    
        </div>
    )
}