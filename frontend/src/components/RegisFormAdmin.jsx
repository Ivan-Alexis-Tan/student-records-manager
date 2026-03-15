import { useState } from "react"

export default function RegisFormAdmin({ setFn = () => {}, centerForm = false}) {
    const signUpDefault = {
        username: '',
        email: "",
        password: '',
        confirmPass: "",
    }

    const [regisDetails, setRegisDetails] = useState(signUpDefault)
    const centerAttrib = centerForm ? null : <br/>

    return (
        <div className={centerForm ? 'regis-form center' : "regis-form"}>
            <input placeholder="Username"
                type="text" 
                value={regisDetails.username}
                onChange={e => setRegisDetails(prev => ({...prev, username: e.target.value}))}
            />
            {centerAttrib}

            <input placeholder="Email"
                type="text" 
                value={regisDetails.email}
                onChange={e => setRegisDetails(prev => ({...prev, email: e.target.value}))}
            />
            {centerAttrib}

            <input placeholder="Password"
                type="password" 
                value={regisDetails.password}
                onChange={e => setRegisDetails(prev => ({...prev, password: e.target.value}))}
            />
            {centerAttrib}

            <input placeholder="Confirm Password"
                type="password" 
                value={regisDetails.confirmPass}
                onChange={e => setRegisDetails(prev => ({...prev, confirmPass: e.target.value}))}
            />
            {centerAttrib}

            <button onClick={_ => setFn(regisDetails)}>Submit</button>    
        </div>
    )
}