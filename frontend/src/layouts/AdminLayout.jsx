import { Outlet } from "react-router-dom";

import AdminNavLayout from "./AdminNavLayout";

export default function AdminLayout() {
    return (
        <div>
            <AdminNavLayout />
            <Outlet />
        </div>
    )
}