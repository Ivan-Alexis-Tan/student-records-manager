import { Outlet, Navigate } from "react-router-dom"

import { useAuth } from "../hooks/authQuery"
import { queryClient } from "../services/queryClient"

export default function ProtectedRoute() {
    const { data: user, isLoading} = useAuth()

    if (isLoading) return <h1>Loading...</h1>
    if (!user || !user?.id) return <Navigate to={"/login"} replace />

    return <Outlet />
}