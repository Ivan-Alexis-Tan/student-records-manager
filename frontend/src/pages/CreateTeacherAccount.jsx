import { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"

import { capitalEveryWord, subjects } from "../services/helperFunctions"
import { createTeacherAccount } from "../services/studentsAPI"
import { mutationCreateTeacherAcc } from "../hooks/mutateFuncs"

export default function CreateTeacherAccountPage() {
    const newAccDefault = {
        first_name: "",
        last_name: "",
        field_specialty: subjects[0],
        username: "",
        email: "",
        password: "",
        role: "teacher"
    }
    const [newAccDetails, setNewAccDetails] = useState({...newAccDefault})
    const [confirmPw, setConfirmPw] = useState("")
    const [message, setMessage] = useState('')
    const [messageStatus, setMessageStatus] = useState(null)
    const [messageStyle, setMessageStyle] = useState({display: 'none'})

    useEffect(() => {
        if (messageStatus === "success") {
            setMessageStyle({color: "hsl(135, 100%, 50%)"})
        }
        else if (messageStatus === "fail") {
            setMessageStyle({color: "hsl(0, 100%, 69%)"})
        } 
        else {
            setMessageStyle({display: 'none'})
        }

        return () => setMessageStyle({display: 'none'})

    }, [messageStatus])

    const createTeacherAccMutation = mutationCreateTeacherAcc({
        ifSuccess: () => {
            setMessage(`Successfully created ${newAccDetails.username}'s account.`)
            setMessageStatus('success')
            setNewAccDetails({...newAccDefault})
            setConfirmPw("")
        }
    })
    
    function handleSubmit() {
        const emptyEntry = Object.entries({...newAccDetails, confirmPw: confirmPw}).reduce((acc, [key, value]) => {
            if (!value) acc.push(key);
            return acc
        }, [])

        if (emptyEntry.length >= 1) {
            setMessage('ERROR: Every field must be filled.')
            setMessageStatus('fail')
            return null
        }
        if (newAccDetails.password !== confirmPw) {
            setMessage('ERROR: Password confirmation does not match.')
            setMessageStatus('fail')
            console.error('failed desu')
            return null
        }

        console.log(newAccDetails)
        createTeacherAccMutation.mutate(newAccDetails)
    }

    return (
        <div>
            <h1>Create Teacher Account</h1>
            {message && <h3 style={messageStyle}>{message}</h3>}
            <form>
                <h3>Teacher Profile:</h3>
                <input type="text"
                    title="First Name"
                    placeholder="First Name"
                    value={newAccDetails.first_name}
                    onChange={e => setNewAccDetails(prev => ({...prev, first_name: capitalEveryWord(e.target.value)}))}
                />
                <br />
                
                <input type="text"
                    title="Last Name"
                    placeholder="Last Name"
                    value={newAccDetails.last_name}
                    onChange={e => setNewAccDetails(prev => ({...prev, last_name: capitalEveryWord(e.target.value)}))}
                />
                <br />

                <label>Area of Specialization: </label>
                <br />

                <select name="field-specialization"
                    title="Area of Specialization"
                    value={newAccDetails.field_specialty} 
                    onChange={e => setNewAccDetails(prev => ({...prev, field_specialty: e.target.value}))}
                    >
                    {subjects.map(subj => <option key={subj} value={subj}>{subj}</option>)}
                </select>
                <br />
                
                <h3>Teacher Account Details:</h3>
                <input type="text"
                    title="Username"
                    placeholder="Username"
                    value={newAccDetails.username}
                    onChange={e => setNewAccDetails(prev => ({...prev, username: e.target.value}))}
                />
                <button type="button" 
                    onClick={_ => {
                        setNewAccDetails(prev => ({...prev, username: `${newAccDetails.first_name} ${newAccDetails.last_name}`}))
                    }}
                    title="Set fullname as username."
                >Set Fullname</button>
                <br />
                
                <input type="text"
                    title="Email"
                    placeholder="Email"
                    value={newAccDetails.email}
                    onChange={e => setNewAccDetails(prev => ({...prev, email: e.target.value}))}
                />
                <br />

                <input type="password"
                    title="Password"
                    placeholder="Password"
                    value={newAccDetails.password}
                    onChange={e => setNewAccDetails(prev => ({...prev, password: e.target.value}))}
                />
                <br />

                <input type="password"
                    title="Confirm password"
                    placeholder="Confirm password"
                    value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                />
                <br />

                <button 
                    onClick={handleSubmit} 
                    type="button"
                    title={`Create account`}
                >Create</button>
            </form>

            {/* <button onClick={handleSubmit}>test</button> */}
        </div>
    )
}