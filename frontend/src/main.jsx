// JS Lib and frameworks
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter} from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

// Styles
import './index.css'

// Query Client
import { queryClient } from './services/queryClient'

// Layouts
import QuizzesViewLayout from './layouts/QuizzesViewLayout'
import RecordsLayout from './layouts/RecordsLayout'
import ProjectsViewLayout from './layouts/ProjectsViewLayout'
import TeacherLayout from './layouts/TeacherLayout'
import StudentLayout from './layouts/StudentLayout'
import AdminLayout from './layouts/AdminLayout'
import SignUpLoginLayout from './layouts/SignUpLoginLayout'

// Auth
import ProtectedRoute from './auth/ProtectedRoute'
import RoleGuard from './auth/RoleGuard'

// Components
import Students from './components/Students'
import AddStudent from './components/AddStudent'
import StudentProfile from './components/StudentProfile'
import QuizzesPage from './components/Quizzes'
import AddQuizRecord from './components/AddQuizRecord'

// Pages
import LoginPage from './pages/LoginPage'
import NoPermision from './pages/NoPermision'
import CookieExpired from './pages/CookieExpired'
import AdminPage from './pages/AdminPage'
import CreateStudentAccountPage from './pages/CreateStudentAccount'
import CreateTeacherAccountPage from './pages/CreateTeacherAccount'
import NotFoundPage from './pages/NotFound'
import SignUpPage from './pages/SignUp'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={'/login'} replace />
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleGuard rolesAllowed={["teacher"]}/>,
        children: [
          {
            element: <TeacherLayout />,
            children: [
              {
                path: 'teacher/:id',
                element: <Students />,
              },

              {
                path: 'student-profile/:id',
                element: <StudentProfile />,
                children: [
                  {
                    path: 'quizzes',
                    element: <QuizzesViewLayout />,
                    children: [
                      {
                        path: ':quarter/:subject',
                        element: <QuizzesPage />,
                        children: [
                          {
                            path: "add-new-quiz-record",
                            element: <AddQuizRecord />,
                          }
                        ]
                      },
                    ]
                  },

                  {
                    path: 'records',
                    element: <RecordsLayout />
                  },

                  {
                    path: 'projects',
                    element: <ProjectsViewLayout />
                  },

                  {
                    path: 'create-account',
                    element: <CreateStudentAccountPage />
                  }
                ]
              },

              {
                path: 'add_student',
                element: <AddStudent />
              },
            ]
          },
        ]
      }, 

      {
        element: <RoleGuard rolesAllowed={["student"]}/>,
        children: [
          {
            element: <StudentLayout />,
            children: [
              {
                path: 'student/:id',
                element: <StudentProfile />,
                children: [
                  {
                    path: 'quizzes',
                    element: <QuizzesViewLayout />,
                    children: [
                      {
                        path: ':quarter/:subject',
                        element: <QuizzesPage />
                      },
                    ]
                  },

                  {
                    path: 'records',
                    element: <RecordsLayout />
                  },

                  {
                    path: 'projects',
                    element: <ProjectsViewLayout />
                  },

                  {
                    path: 'create-account',
                    element: <CreateStudentAccountPage />
                  }
                ]
              },
            ]
          }
        ]
      },

      {
        element: <RoleGuard rolesAllowed={['admin']} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: 'admin/:id',
                element: <AdminPage />
              },

              {
                path: 'create-student-account',
                element: <CreateStudentAccountPage />
              },

              {
                path: 'create-teacher-account',
                element: <CreateTeacherAccountPage />
              },
            ]
          },
        ]
      },

      { path: '*', element: <NotFoundPage />}
    ]
  },

  {
    element: <SignUpLoginLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/signup",
        element: <SignUpPage />
      },
    ]
  },

  {
    path: '/no-permission',
    element: <NoPermision />
  },

  {
    path: "/cookie-expired",
    element: <CookieExpired />
  },

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
