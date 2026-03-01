import { useQuery } from "@tanstack/react-query"
import { capitalEveryWord } from "../services/studentsAPI"
import UsersTable from "../components/UsersTable"
import TeachersTable from "../components/TeachersTable"

export default function AdminPage() {
    
    function test() {
        console.log(teachers)
    }
    
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