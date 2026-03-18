import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { getRegisRequests } from "../services/studentsAPI"

export default function RegistrationRequestTable() {
    const { data, isLoading } = useQuery({
        queryKey: ['regisRequests'],
        queryFn: getRegisRequests,
        select: (res) => {
            return res.data
        },
        retry: false,
    });

    const [isGranting, setIsGranting] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)

    if (isLoading) return <h1>Loading requests...</h1>

    function handleGrant(requestObj) {
        const grant = window.confirm(`Grant ${requestObj.username}'s requst?`)

        if (!grant) return null
        console.log(grant)
    }

    function handleReject(requestObj) {
        const reject = window.confirm(`Reject ${requestObj.username}'s requst?`)
    }

    return (
        <div>
            <h1>Registration Requests</h1>

            {(!isRejecting) && <button onClick={_ => setIsGranting(prev => !prev)}
                title={isGranting ? "Cancel granting requests" : "Grant request"}
                >{isGranting ? "❌" : "Grant"}
            </button>}

            {(!isGranting) && <button onClick={_ => setIsRejecting(prev => !prev)}
                title={isRejecting ? "Cancel rejecting requests" : "Reject request"}
                >{isRejecting? "❌" : "Reject"}
            </button>}
            
            {(data.length >= 1) 
                ? <table>
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Field Specialty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(req => <tr key={req.id}>
                            <td>{isGranting && <button 
                                    onClick={_ => handleGrant(req)} title="Grant request"
                                    >✔️</button>
                                } {isRejecting && <button 
                                    onClick={_ => handleReject(req)} 
                                    title="Reject request"
                                    >🗑️</button>
                                } {req.role}
                            </td>

                            <td>{req.email}</td>
                            <td>{req.username}</td>
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