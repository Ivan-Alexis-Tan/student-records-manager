import { useQueryClient, useMutation } from "@tanstack/react-query"
import { Navigate, Link } from "react-router-dom"

import { useAuth } from "../hooks/authQuery"
import { logoutUser } from "../services/studentsAPI"
import logoutCurrentUser from "../hooks/logoutUser"

export default function StudentNavLayout() {
    const {data: user} = useAuth()
    const logoutMutation = logoutCurrentUser()

    return (
        <div className='nav-container'>
            <Link to={`student/${user.id}`}>Home</Link>

            <div>
                <h3 className='nav__logout'
                    onClick={_ => {
                    const confirmLogout =  window.confirm('Confirm logout.')
                    
                    if (!confirmLogout) return null;
                    logoutMutation.mutate()
                }}>
                    Logout</h3>
            </div>
        </div>
    )
}