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

// Me
export async function getStudentSelfDetails() {
    return api.get('/me/students').then(res => res.data)
}

// Signup
export async function createSignupRequest(payload) {
    return api.post(`/signup/request`, payload)
}

export async function getRegisRequests() {
    return api.get(`signup/request`)
}

export async function removeRegisRequest(requestId) {
    return api.delete(`/signup/request/${requestId}`)
}

export async function grantRegisRequest(requestId) {
    return api.post(`/signup/request/${requestId}`)
}

export async function hasAdminFetch() {
    return api.get(`/signup/admin`)
}

// Students
export async function createStudent(student_info) {
    return api.post('/students', {...student_info})
}

export async function removeStudents(student_id) {
    return api.delete(`/students/${student_id}`)
}

export async function findStudent(id) {
    return api.get(`/students/${id}`).then(res => res.data)
}

export async function getQuizes(studentId) {
    return api.get(`/students/${studentId}/quizzes`).then(res => res.data)
}

// Quizzes
export async function updateQuizScore(payload) {
    const submitted = {
        date: payload.date,
        score: payload.score,
        total_items: payload.total_items,
        unit: payload.unit,
        topic: payload.topic,
    }
    return api.patch(`/quizzes/${payload.id}`, submitted)
}

export async function createQuizRecord(payload) {
    return api.post(`/quizzes`, payload)
}

export async function deleteQuiz(quizId) {
    return api.delete(`quizzes/${quizId}`)
}

// Teachers
export async function createTeacherAccount(reqDetails) {
    return api.post(`/teachers`, reqDetails)
}

export async function removeTeacher(teacherId) {
    return api.delete(`/teachers/${teacherId}`)
}

export async function updateTeacherDetails(payload) {
    const submitted = {
        column: payload.column,
        value: payload.value,
    }
    return api.patch(`/teachers/${payload.id}`, submitted)
}

// Users
export async function deleteUserAccount(id) {
    return api.delete(`/users/${id}`)
}

export async function createFirstAdmin(payload) {
    return api.post(`/users/admin`, payload)
}

export async function getAdminInitPageData() {
    return api.get(`/users/admin`)
}