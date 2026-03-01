
import { Link } from 'react-router-dom'

import { useAuth } from '../hooks/authQuery'
import logoutCurrentUser from '../hooks/logoutUser'

export default function AdminNavLayout() {
    const { data: user } = useAuth()
    const logoutMutation = logoutCurrentUser()

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