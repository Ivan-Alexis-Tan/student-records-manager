import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "../services/queryKeys"
import { getAdminInitPageData } from "../services/studentsAPI"

import UsersTable from "../components/UsersTable"
import TeachersTable from "../components/TeachersTable"

export default function AdminPage() {
    const { id } = useParams()
    const { data, isLoading } = useQuery({
        queryKey: queryKeys.adminInitPageData(id),
        queryFn: getAdminInitPageData,
        retry: false,
        select: (res) => {
            return {
                users: res.data.users,
                teachers: res.data.teachers,
            }
        }
    })

    if (isLoading) return <h1>Loading admin data...</h1>

    return (
        <div>
            <div className="admin-header">
                <h1>Admin</h1>
                <Link to={'/registration-requests'}>Registration Requests</Link>
            </div>
            
            <UsersTable userData={data.users} adminId={id} />
            <br />

            <TeachersTable teachersData={data.teachers} adminId={id} />
        </div>
    )
}