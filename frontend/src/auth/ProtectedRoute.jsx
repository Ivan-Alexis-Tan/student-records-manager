import { Outlet, Navigate } from "react-router-dom"

import { useAuth } from "../hooks/authQuery"

export default function ProtectedRoute() {
    const { data: user, isLoading, isError} = useAuth()

    if (isLoading) return <h1>Loading...</h1>
    if (!user) return <Navigate to={"/login"} replace />

    return <Outlet />
}