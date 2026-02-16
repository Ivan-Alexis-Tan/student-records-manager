import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '../hooks/authQuery'
import { hasPermision } from '../services/helperFunctions'

export default function HomePage() {
    const rolesAllowed = ['teacher', 'admin']
    const {data: user, isLoading, isError} = useAuth()

    function test() {
        console.log(`currentUser =`, user)
    }

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <Navigate to={"/login"} replace/>

    return(
        <div>
            <h1>Home Page</h1>
            <button onClick={test}>test</button>
            <Outlet />
        </div>
    )
}