import { Link, Navigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { logoutUser, userHomeUrl } from "../services/studentsAPI"
import { useAuth } from '../hooks/authQuery'

export default function NavigationLayout() {
    const queryClient = useQueryClient()
    const { data: user, isLoading } = useAuth()

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.setQueryData(["auth", "me"], null)
        }
    })

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

// const router = [
//     {
//         element: <AuthGuard />,
//         children: [
//             {
//                 element: <RoleGuard allowed={["teacher", "admin"]} />,
//                 children: [
//                     {
//                         element: <TeacherLayout />,
//                         children: [
//                             { path: "/", element: <HomePage /> },
//                             { path: "/add_student", element: <AddStudent /> },
//                             { path: "teacher/:id", element: <Students /> },
//                         ]
//                     }
//                 ]
//             },

//             {
//                 element: <RoleGuard allowed={["student"]} />,
//                 children: [
//                     {
//                         element: <StudentLayout />,
//                         children: [
//                             {
//                                 path: "student/:id",
//                                 element: <StudentProfile />,
//                                 children: [
//                                     { path: "quizzes/:quarter/:subject", element: <QuizzesPage /> },
//                                     { path: "records/:id", element: <RecordsLayout /> },
//                                     { path: "projects/:id", element: <ProjectsViewLayout /> },
//                                 ]
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },

//     { path: "/login", element: <LoginPage /> },
//     { path: "/cookie-expired", element: <CookieExpired /> },
//     { path: "*", element: <NotFoundPage /> },
// ]
