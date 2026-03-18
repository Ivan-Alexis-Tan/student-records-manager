import { useQuery } from "@tanstack/react-query"
import { getRegisRequests } from "../services/studentsAPI"

export default function RegistrationRequestTable() {
    const { data, isLoading } = useQuery({
        queryKey: ['regisRequests'],
        queryFn: getRegisRequests,
        select: (res) => {
            return res.data
        },
        retry: false,
    })

    if (isLoading) return <h1>Loading requests...</h1>

    return (
        <div>
            <h1>Registration Requests</h1>

            {(data.length >= 1) 
                ? <table>
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Student ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Field Specialty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(req => <tr key={req.id}>
                            <td>{req.role}</td>
                            <td>{req.email}</td>
                            <td>{req.username}</td>
                            <td>{req.student_id ?? "-"}</td>
                            <td>{req.first_name ?? "-"}</td>
                            <td>{req.last_name ?? "-"}</td>
                            <td>{req.field_specialty ?? "-"}</td>
                        </tr>)}
                    </tbody>
                </table>
                : <p>No request sent.</p>
            }
        </div>
    )
}