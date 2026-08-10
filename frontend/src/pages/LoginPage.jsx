import { useMutation } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'
import { useState } from 'react'

import { useAuth } from '../hooks/authQuery'
import { submitLogin } from '../api/auth'
import { queryClient } from '../lib/queryClient'
import { capitalEveryWord } from "../utils/helperFunctions"
import { queryKeys } from '../constants/index'

export default function LoginPage() {
    const [loginAs, setLoginAs] = useState("teacher")

    const loginRequestDefault = {email: "", password: ""}
    const [loginRequest, setLoginRequest] = useState(loginRequestDefault)
    const [message, setMessage] = useState("")

    const {data: user, isLoading} = useAuth()

    const loginRequestMutation = useMutation({
        mutationFn: (loginRequest) => submitLogin(loginRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: queryKeys.me})
            setLoginRequest(loginRequestDefault)
            setMessage('')
        },
        onError: (err) => {
            setMessage("Invalid email or password.")
        }
    })

    if (isLoading) return (
        <>
            <h1>Loading...</h1>
            <p>The app is in idle mode if unused for a while; loading may take a minute...</p>
        </>
    )

    if (user?.id) return <Navigate to={`/${user.role}/${user.id}`} replace/>

    // Login Submit Function
    function handleSubmit() {
        if (!loginRequest.email || !loginRequest.password) {
            setMessage('ERROR: Email and password are required.')
            return null
        }

        loginRequestMutation.mutate(loginRequest)
    }

    return (
        <div className='login__login-request-form'>
            <h2 
                onClick={_ => setLoginAs(prev => (prev === 'teacher') ? "student" : "teacher")}
                >{capitalEveryWord(loginAs)}
            </h2>
            {message && <p style={{color: 'hsl(0, 100%, 69%)'}}><strong>{message}</strong></p>}
            
            <form onSubmit={e => {
                e.preventDefault();
                handleSubmit()
            }}>
                <input type="text"
                    placeholder={`Email`}
                    value={loginRequest.email}
                    onChange={e => setLoginRequest(prev => ({...prev, email: e.target.value}))}
                />
                <br />

                <input type="password"
                    placeholder={`Password`}
                    value={loginRequest.password}
                    onChange={e => setLoginRequest(prev => ({...prev, password: e.target.value}))}
                />
                <button type='submit'>Submit</button>
            </form>
            
            <p>Forgot password?</p>
        </div>
    )
}