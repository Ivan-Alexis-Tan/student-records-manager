import { Outlet } from "react-router-dom";
import TeacherNavLayout from "./TeacherNavLayout";
import AdminPage from "../pages/AdminPage";
import AdminNavLayout from "./AdminNavLayout";

export default function AdminLayout() {
    return (
        <div>
            <AdminNavLayout />
            <Outlet />
        </div>
    )
}