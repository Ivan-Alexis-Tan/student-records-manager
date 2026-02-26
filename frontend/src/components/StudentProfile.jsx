import { 
    useParams, 
    Link, 
    Outlet,
    Navigate,
    useLocation,
} from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { queryClient } from '../services/queryClient'
import { findStudent, getStudentSelfDetails } from '../services/studentsAPI'
import { useAuth } from '../hooks/authQuery'

const rolesAllowed = ["teacher", "admin"]

export default function StudentProfile() {
    const {data: user} = useAuth();
    const { pathname } = useLocation()

    const params = useParams()
    const isStudent = user.role === "student"
    const id = isStudent ? user.profile_id : params.id 

    const {data: studentData, isLoading, isError} = useQuery({
        queryKey: ['studentProfile', id],
        queryFn: isStudent 
            ? getStudentSelfDetails
            : () => findStudent(id),
    })

    if (isLoading) return <h1>Loading student's data...</h1>
    if (isError) return <Navigate to={'/not-found'} replace />
    
    const profileHeadUrl = isStudent ? 'student' : 'student-profile'

    function test() {
        const test = queryClient.getQueryData(["auth", "me"])
        console.log(`test =`, test)
        console.log(`useId=${user.id} | ${id}`)
        console.log(`pathname =`, pathname)
        console.log(`prevUrl =`, `/${profileHeadUrl}/${id}`)
        console.log("==================")
    }

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
            
            {/* <button onClick={test}>test</button> */}
            <Outlet />
        </div>
    )
}