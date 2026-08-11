import { 
    useParams, 
    Link, 
    Outlet,
    Navigate,
    useLocation,
} from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { findStudent } from "../api/students"
import { getStudentSelfDetails } from '../api/auth' 
import { useAuth } from '../hooks/authQuery'
import { queryKeys } from '../constants/index'

const rolesAllowed = ["teacher", "admin"]

function mapProfileLinks(name, link, section) {
    if (section === undefined) section = link
    return { name, link, section }
}

export default function StudentProfile() {
    const {data: user} = useAuth();
    const params = useParams()
    const { pathname } = useLocation()
    
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
    const profileLinks = [
        mapProfileLinks("Profile", `/${profileHeadUrl}/${id}`, "profile"),
        mapProfileLinks("Records", "records"),
        mapProfileLinks("Quizzes", "quizzes/1/Science", "quizzes"),
        mapProfileLinks("Projects", "projects")
    ]
    const currSection = pathname.split("/")[3] ?? "profile"

    return (
        <div className='student-profile'>
            {/* Profile Sections */}
            <div id='student-profile__profile-records'>
                {profileLinks.map(item => (
                    <Link to={item.link}
                        key={item.name}
                        className={item.section === currSection ? "isActive" : ""}
                    >
                        <strong>{item.name}</strong>
                    </Link>
                ))}
            </div>

            <div className='student-profile__name'>
                <h2><strong>{studentData.last_name}</strong>, {studentData.first_name}</h2>

                {rolesAllowed.includes(user.role) 
                    && <Link 
                        className='student-profile__create-student-account'
                        to={`create-account`}
                    >
                        <p><strong>Create student account</strong></p>
                    </Link>
                }
            </div>

            <h3>Grade {studentData.grade_lvl}</h3>
            <p><i>ID: {studentData.id}</i></p>

            <Outlet />
        </div>
    )
}