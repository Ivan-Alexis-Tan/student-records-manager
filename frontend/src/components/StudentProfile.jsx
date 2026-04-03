import { 
    useParams, 
    Link, 
    Outlet,
    Navigate,
} from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { findStudent } from "../api/students"
import { getStudentSelfDetails } from '../api/auth' 
import { useAuth } from '../hooks/authQuery'
import { queryKeys } from '../lib/queryKeys'

const rolesAllowed = ["teacher", "admin"]

export default function StudentProfile() {
    const {data: user} = useAuth();
    const params = useParams()
    
    const isStudent = user.role === "student"
    const id = isStudent ? user.profile_id : params.id 
    const {data: studentData, isLoading} = useQuery({
        queryKey: queryKeys.student(id),
        queryFn: isStudent 
            ? getStudentSelfDetails
            : () => findStudent(id),
        enabled: !!id,
    })

    if (isLoading) return <h1>Loading student's data...</h1>
    if (!studentData) return <Navigate to={'/not-found'} replace />
    
    const profileHeadUrl = isStudent ? 'student' : 'student-profile'

    return (
        <div className='student-profile'>
            <div className='student-profile__name'>
                <h2><strong>{studentData.last_name}</strong>, {studentData.first_name}</h2>

                <div id='student-profile__profile-records' style={{display: 'flex', gap: '2em'}}>
                    <Link to={`/${profileHeadUrl}/${id}`}><strong>Profile</strong></Link>
                    <Link to={`records`}><strong>Records</strong></Link>
                    <Link to={'quizzes/1/Science'}><strong>Quizzes</strong></Link>
                    <Link to={`projects`}><strong>Projects</strong></Link>
                </div>
            </div>

            <h3>Grade {studentData.grade_lvl}</h3>
            <p><i>ID: {studentData.id}</i></p>
            {rolesAllowed.includes(user.role) && <Link 
                className='student-profile__create-student-account'
                to={`create-account`}
                >
                <p><strong>Create student account</strong></p>
            </Link>
            }

            <Outlet />
        </div>
    )
}