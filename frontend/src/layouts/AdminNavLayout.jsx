
import { Link, Navigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { logoutUser } from "../services/studentsAPI"
import { useAuth } from '../hooks/authQuery'

export default function AdminNavLayout() {
    const queryClient = useQueryClient()
    const { data: user } = useAuth()

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.setQueryData(["auth", "me"], null)
        }
    })

    return (
        <div className='nav-container'>
            <Link to={`${user.role}/${user.id}`}>Home</Link>

            <div>
                <Link to={`/create-teacher-account`}>Add Teacher</Link>
                <Link to={'/create-student-account'}>Add Student</Link>
                <h3 className='nav__logout'
                    onClick={_ => {
                    const confirmLogout =  window.confirm('Confirm logout.')
                    
                    if (!confirmLogout) return null;
                    logoutMutation.mutate()
                 }}>
                    Logout
                </h3>
            </div>
        </div>
    )
}