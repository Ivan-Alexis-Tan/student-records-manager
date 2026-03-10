import { Outlet, Navigate } from "react-router-dom"

import { useAuth } from "../hooks/authQuery"
import { queryClient } from "../services/queryClient"

export default function ProtectedRoute() {
    const { data: user, isLoading, error} = useAuth()

    if (isLoading) return <h1>Loading...</h1>

    const errMessage = error?.response?.data?.detail
    const errStatus = error?.response?.status

    if (!user || !user?.id) return <Navigate to={"/login"} replace />
    else if (errMessage === "INVALID_TOKEN" || errMessage === "TOKEN_EXPIRED" || errStatus === 401) return <Navigate to={"/cookie-expired"} replace />

    return <Outlet />
}