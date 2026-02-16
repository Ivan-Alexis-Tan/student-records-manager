import { Outlet } from "react-router-dom";
import TeacherNavLayout from "./TeacherNavLayout";

export default function TeacherLayout() {
    return (
        <div>
            <TeacherNavLayout />
            <Outlet />
        </div>
    )
}