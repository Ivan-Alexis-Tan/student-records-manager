import UsersTable from "../components/UsersTable"
import TeachersTable from "../components/TeachersTable"

export default function AdminPage() {
    return (
        <div>
            <h1>Admin</h1>
            <UsersTable />
            <br />

            <TeachersTable />
            <button onClick={test}>test</button>
        </div>
    )
}