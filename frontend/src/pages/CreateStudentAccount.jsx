import { Navigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { mutationCreateStudentAcc } from "../hooks/mutateFuncs"
import { api } from "../services/axiosAPI"
import { useAuth } from "../hooks/authQuery"
import SearchData from "../components/SearchData"

const rolesAllowed = ['teacher', 'admin']

export default function CreateStudentAccountPage() {
    const queryClient = useQueryClient()
    const {data: user, isLoading} = useAuth()
    const { id } = useParams()

    const {data: students, isLoading: loadingStudents} = useQuery({
        queryKey: ['students'],
        queryFn: () => api.get('/students').then(res => res.data),
    });

    const {data: accounts, isLoading: loadingAccounts} = useQuery({
        queryKey: ["users"],
        queryFn: () => api.get('/users').then(res => res.data),
        retry: false
    })

    const createAccMutation = mutationCreateStudentAcc({
        ifSuccess: () => {
            setMessage({detail: `Successfully created ${selected.last_name}, ${selected.first_name}'s account.`, status: 'ok'})
            setNewAccDetails(newAccDefault)
        }
    })

    const [selected, setSelected] = useState(students?.find(student => student.id === id))

    const newAccDefault = {
        username: selected ? `${selected.first_name} ${selected.last_name}` : "",
        email: "",
        role: `student`,
        password: "",
        confirmPassword: "",
        studentId: id ?? "",
    }
    const [newAccDetails, setNewAccDetails] = useState(newAccDefault)
    const [message, setMessage] = useState({status: "", detail: ""})

    useEffect(() => {
        if (!selected) return
        setNewAccDetails(prev => ({
            ...prev, 
            studentId: selected.id,
            username: `${selected.first_name} ${selected.last_name}`,
        }))
    }, [selected])

    if (isLoading) return <h1>Loading current user..</h1>
    if (loadingStudents) return <h1>Loading Students...</h1>
    if (loadingAccounts) return <h1>Loading Accounts...</h1>
    if (!accounts || !students) return <h1>Failed to load data, please retry.</h1>

    function handleCreateAccount() {
        const filled = Object.entries(newAccDetails).map(detail => detail[1] !== "")

        if (!filled.every(f => f === true)) {
            setMessage({detail: "ERROR: All fields must be filled.", status: 'error'})
            console.error("ERROR: All fields must be filled.")
            return null
        }
        if (newAccDetails.password !== newAccDetails.confirmPassword) {
            setMessage({detail: 'ERROR: Password and confirm password does not match', status: 'error'})
            console.error("ERROR: Password and confirm password does not match")
            return null
        }
        
        const emailExists = accounts.some(account => account.email === newAccDetails.email)
        if (emailExists) {
            setMessage({detail: 'ERROR: Account already exists.', status: 'error'})
            console.error("ERROR: Account already exists.")
            return null
        }
        if (!rolesAllowed.includes(user.role)) return <Navigate to={'/no-permision'} />
        
        createAccMutation.mutate(newAccDetails)
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
            {message.detail !== "" && <p style={message.status === "ok" ? statusOkStyle : statusErrorStyle}><strong>{message.detail}</strong></p>}

            <form onKeyUp={e => {
                if (e.key !== 'Enter') return null;
                handleCreateAccount()
            }}>
                {!id && <SearchData setStateFn={setSelected} data={students ?? []} searchLabel="Create for: " />}
                <br />

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

const statusOkStyle = {
    color: "hsl(143, 100%, 60%)"
}

const statusErrorStyle = {
    color: "hsl(0, 100%, 60%)"
}
