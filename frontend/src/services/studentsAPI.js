import { api } from "./axiosAPI"

// Auth
export async function submitLogin(loginDetails) {
    const refined = new URLSearchParams()
    refined.append("username", loginDetails.email)
    refined.append("password", loginDetails.password)

    const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        credentials: 'include',
        body: refined.toString(),
    })

    if (!res.ok) throw new Error(await res.text());
    return res.json()
}

// Me
export async function getStudentSelfDetails() {
    return api.get('/me/students').then(res => res.data)
}

// Signup
const signupBase = '/signup'
export async function createSignupRequest(payload) {
    return api.post(`${signupBase}/request`, payload)
}

export async function getRegisRequests() {
    return api.get(`${signupBase}/request`)
}

export async function removeRegisRequest(requestId) {
    return api.delete(`${signupBase}/request/${requestId}`)
}

export async function grantRegisRequest(requestId) {
    return api.post(`${signupBase}/request/${requestId}`)
}

export async function hasAdminFetch() {
    return api.get(`${signupBase}/admin`)
}

// Students
const studentsBase = '/students'

export async function createStudent(student_info) {
    return api.post(`${studentsBase}`, {...student_info})
}

export async function removeStudents(student_id) {
    return api.delete(`${studentsBase}/${student_id}`)
}

export async function findStudent(id) {
    return api.get(`${studentsBase}/${id}`).then(res => res.data)
}

export async function getQuizes(studentId) {
    return api.get(`${studentsBase}/${studentId}/quizzes`).then(res => res.data)
}

// Quizzes
const quizzesBase = '/quizzes'

export async function updateQuizScore(payload) {
    const submitted = {
        date: payload.date,
        score: payload.score,
        total_items: payload.total_items,
        unit: payload.unit,
        topic: payload.topic,
    }
    return api.patch(`${quizzesBase}/${payload.id}`, submitted)
}

export async function createQuizRecord(payload) {
    return api.post(`${quizzesBase}`, payload)
}

export async function deleteQuiz(quizId) {
    return api.delete(`${quizzesBase}/${quizId}`)
}

// Teachers
const teachersBase = '/teachers'

export async function createTeacherAccount(reqDetails) {
    return api.post(`${teachersBase}`, reqDetails)
}

export async function removeTeacher(teacherId) {
    return api.delete(`${teachersBase}/${teacherId}`)
}

export async function updateTeacherDetails(payload) {
    const submitted = {
        column: payload.column,
        value: payload.value,
    }
    return api.patch(`${teachersBase}/${payload.id}`, submitted)
}

// Users
const userBase = '/users'

export async function deleteUserAccount(id) {
    return api.delete(`${userBase}/${id}`)
}

export async function createFirstAdmin(payload) {
    return api.post(`${userBase}/admin`, payload)
}

export async function getAdminInitPageData() {
    return api.get(`${userBase}/admin`)
}

export async function updateUserDetails(payload) {
    const submitted = {
        column: payload.column,
        value: payload.value,
    }
    return api.patch(`${userBase}/${payload.id}`, submitted)
}

export async function createStudentAccount(reqDetails) {
    const new_user = {
        username: reqDetails.username,
        email: reqDetails.email,
        role: reqDetails.role,
        password: reqDetails.password,
        student_id: reqDetails.student_id,
    }
    return api.post(`/users`, new_user)
}