import { Link, Navigate } from 'react-router-dom'

import { useAuth } from '../hooks/authQuery'
import logoutCurrentUser from '../hooks/logoutUser'

export default function NavigationLayout() {
    const { data: user, isLoading } = useAuth()
    const logoutMutation = logoutCurrentUser()

    if (isLoading) return <p>Loading...</p>
    if (!user) return <Navigate to={'/login'} />

    return (
        <div className='nav-container'>
            <Link to={'/'}>Home</Link>

            <div>
                <Link to={'/add_student'}>Add Student</Link>
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
