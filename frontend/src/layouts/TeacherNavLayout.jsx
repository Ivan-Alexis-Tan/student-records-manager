
import { Link, Navigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { logoutUser } from "../services/studentsAPI"
import { useAuth } from '../hooks/authQuery'

export default function TeacherNavLayout() {
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
            <Link to={`teacher/${user.id}`}>Home</Link>

            <div>
                <Link to={`/teacher/${user.profile_id}`}>{user.username}</Link>
                <Link to={'/add_student'}>Add Student</Link>
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