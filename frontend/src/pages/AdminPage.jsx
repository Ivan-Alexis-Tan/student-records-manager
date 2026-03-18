import UsersTable from "../components/UsersTable"
import TeachersTable from "../components/TeachersTable"
import { Link } from "react-router-dom"

export default function AdminPage() {
    return (
        <div>
            <div className="admin-header">
                <h1>Admin</h1>
                <Link to={'/registration-requests'}>Registration Requests</Link>
            </div>
            <UsersTable />
            <br />

            <TeachersTable />
        </div>
    )
}