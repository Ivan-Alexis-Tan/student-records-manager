import { Outlet } from "react-router-dom";

import StudentNavLayout from "./StudentNavLayout";

export default function StudentLayout() {
    return (
        <div>
            <StudentNavLayout />
            <Outlet />
        </div>
    )
}