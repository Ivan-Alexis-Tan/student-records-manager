
import { Link } from 'react-router-dom'

import { useAuth } from '../hooks/authQuery'
import logoutCurrentUser from '../hooks/logoutUser'

export default function TeacherNavLayout() {
    const { data: user } = useAuth()
    const logoutMutation = logoutCurrentUser()

    return (
        <div className='nav-container'>
            <Link to={`teacher/${user.id}`}>Home</Link>

            <div>
                <Link to={`/teacher/${user.profile_id}`}>{user.username}</Link>
                <Link to={'/add_student'}>➕ Student</Link>
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