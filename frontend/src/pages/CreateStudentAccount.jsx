import { Navigate, useParams } from "react-router-dom"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getAPI, createStudentAccount } from "../services/studentsAPI"

const rolesAllowed = ['teacher', 'admin']

export default function CreateStudentAccountPage() {
    const queryClient = useQueryClient()
    const { id } = useParams()

    const createAccMutation = useMutation({
        mutationFn: (details) => createStudentAccount(details),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', {id, role}]});
            setNewAccDetails(newAccDefault)
            setMessage('')
        }
    })

    const selected = queryClient.getQueryData(['studentProfile', id])

    const newAccDefault = {
        username: selected ? `${selected.first_name} ${selected.last_name}` : "",
        email: "",
        role: selected ? `student` : "",
        password: "",
        confirmPassword: "",
        studentId: id ?? "",
    }
    const [newAccDetails, setNewAccDetails] = useState(newAccDefault)
    const [message, setMessage] = useState("")

    function handleCreateAccount() {
        console.log(`Account creation sent.`)
        const filled = Object.entries(newAccDetails).map(detail => detail[1] !== "")
        const userRole = queryClient.getQueryData(['auth', 'me'])

        if (!filled.every(f => f === true)) {
            setMessage("ERROR: All fields must be filled.")
            console.error("ERROR: All fields must be filled.")
            return null
        }
        if (newAccDetails.password !== newAccDetails.confirmPassword) {
            setMessage('ERROR: Password and confirm password does not match')
            console.error("ERROR: Password and confirm password does not match")
            return null
        }
        if (!rolesAllowed.some(allowed => allowed == userRole.role)) return <Navigate to={'/no-permision'} />
        
        console.log(`Account creation sent.`)
        createAccMutation.mutate(newAccDetails)
        // setNewAccDetails(newAccDefault)
        // setMessage('')
    }

    function test() {
        const curr_user = queryClient.getQueryData(["auth", "me"])
        console.log(id)
        console.log(curr_user)
        console.log(rolesAllowed.some(allowed => allowed == curr_user.role))
    }

    return (
        <div>
            <h1>Create Student Account</h1>
            {message && <p style={{color: "hsl(0, 100%, 60%)"}}><strong>{message}</strong></p>}

            <form onKeyUp={e => {
                if (e.key !== 'Enter') return null;
                handleCreateAccount()
            }}>
                <input type="text"
                    placeholder="username"
                    value={newAccDetails.username}
                    onChange={e => setNewAccDetails(prev => ({...prev, username: e.target.value}))}
                />
                <br />
                
                <input type="text"
                    placeholder="email"
                    value={newAccDetails.email}
                    onChange={e => setNewAccDetails(prev => ({...prev, email: e.target.value}))}
                />
                <br />

                <input type="text"
                    placeholder="role"
                    value={newAccDetails.role}
                    onChange={e => setNewAccDetails(prev => ({...prev, role: `${e.target.value}`.toLowerCase()}))}
                />
                <br />

                <input type="password"
                    placeholder="password"
                    value={newAccDetails.password}
                    onChange={e => setNewAccDetails(prev => ({...prev, password: e.target.value}))}
                />
                <br />

                <input type="password"
                    placeholder="confirm password"
                    value={newAccDetails.confirmPassword}
                    onChange={e => setNewAccDetails(prev => ({...prev, confirmPassword: e.target.value}))}
                />
                <br />
            </form>
            <button onClick={handleCreateAccount}>Create Account</button>
            <button onClick={test}>test</button>
        </div>
    )
}