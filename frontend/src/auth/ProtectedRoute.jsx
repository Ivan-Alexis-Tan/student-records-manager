import { Outlet, Navigate } from "react-router-dom"

import { useAuth } from "../hooks/authQuery"

export default function ProtectedRoute() {
    const { data: user, isLoading} = useAuth()

    if (isLoading) return <h1>Loading...</h1>
    
    const isError = (user === 'TOKEN_EXPIRED') || (user === 'INVALID_TOKEN')

    if (isError) return <Navigate to={'/cookie-expired'} replace /> 
    if (!user || !user.id) return <Navigate to={"/login"} replace />

    return <Outlet />
}