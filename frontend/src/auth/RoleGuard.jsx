import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/authQuery"

export default function RoleGuard({ rolesAllowed = [] }) {
    const { data: user, isLoading } = useAuth();

    if (isLoading) return <h1>Loading...</h1>
    if (!rolesAllowed.includes(user?.role)) return <Navigate to={'/no-permission'} replace />

    return <Outlet />
}