import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/authQuery"

export default function RoleGuard({ rolesAllowed = [] }) {
    const {data: user, isLoading, isError} = useAuth();

    if (isLoading) return <h1>Loading...</h1>
    if (!user) return <Navigate to={"/login"} replace />
    if (!rolesAllowed.includes(user.role)) return <Navigate to={'/no-permision'} replace />

    return <Outlet />
}