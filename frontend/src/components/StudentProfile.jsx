import { 
    useParams, 
    Link, 
    Outlet,
    Navigate,
    useLocation,
} from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { findStudent } from '../services/studentsAPI'
import { useAuth } from '../hooks/authQuery'

const rolesAllowed = ["teacher", "admin"]

export default function StudentProfile() {
    const queryClient = useQueryClient()
    const {data: user} = useAuth();
    const { pathname } = useLocation()

    const params = useParams()
    const id = (user.role === "student") ? user.profile_id : params.id 

    const student = useQuery({
        queryKey: ['studentProfile', id],
        queryFn: () => findStudent('id', id)
    })

    if (student.isPending) return <h1>Loading...</h1>
    if (student.isError) return <Navigate to={'/not-found'} replace />

    const profileHeadUrl = (user.role === 'student') ? 'student' : 'student-profile'

    function test() {
        console.log(student.data)
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
                <h2><strong>{student.data.last_name}</strong>, {student.data.first_name}</h2>

                <div id='student-profile__profile-records' style={{display: 'flex', gap: '2em'}}>
                    <Link to={`/${profileHeadUrl}/${id}`}><strong>Profile</strong></Link>
                    <Link to={`records`}><strong>Records</strong></Link>
                    <Link to={'quizzes/1/Science'}><strong>Quizzes</strong></Link>
                    <Link to={`projects`}><strong>Projects</strong></Link>
                </div>
            </div>

            <h3>Grade {student.data.grade_lvl}</h3>
            <p><i>ID: {student.data.id}</i></p>
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