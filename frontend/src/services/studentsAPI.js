import { api } from "./axiosAPI"

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

export async function createStudent(student_info) {
    return api.post('/students', {...student_info})
}

export async function removeStudents(student_id) {
    const res = await fetch(`http://localhost:8000/students/${student_id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) throw new Error('Removing student failed.');
    return res.json()
}

export async function findStudent(id) {
    return api.get(`/students/${id}`).then(res => res.data)
}

export async function getStudentSelfDetails() {
    return api.get('/me/students').then(res => res.data)
}

export async function getQuizes(studentId) {
    const res = await fetch(`http://localhost:8000/students/${studentId}/quizzes`, {
        method: "GET",
        credentials: "include"
    });
    
    if (!res.ok) return null
    return await res.json()
}

export async function updateQuizScore(payload) {
    const submitted = {
        date: payload.date,
        score: payload.score,
        total_items: payload.total_items,
        unit: payload.unit,
        topic: payload.topic,
    }
    const res = await fetch(`http://localhost:8000/quizzes/${payload.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify((payload.id, submitted))
    })

    if (!res.ok) throw new Error(res.text())
    return await res.json()
}

export async function createQuizRecord(payload) {
    console.log(`payload =`, payload)
    const res = await fetch(`http://localhost:8000/quizzes`, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await res.text())
    return await res.json()
}

export async function deleteQuiz(quizId) {
    const res = await fetch(`http://localhost:8000/quizzes/${quizId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify(quizId)
    })

    if (!res.ok) throw new Error(res.text());
    return await res.json()
}

export async function createStudentAccount(reqDetails) {
    const new_user = {
        username: reqDetails.username,
        email: reqDetails.email,
        role: reqDetails.role,
        password: reqDetails.password,
        student_id: reqDetails.studentId
    }
    
    const res = await fetch(`http://localhost:8000/auth/user?email=${new_user.email}&role=${new_user.role}`, {
        method: "POST",
        credentials: "include",
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify(new_user)
    })

    if (!res.ok) throw new Error(await res.text());
    return res.json()
}

export async function createTeacherAccount(reqDetails) {
    const res = await fetch(`http://localhost:8000/teachers`, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(reqDetails)
    })

    if (!res.ok) throw new Error(await res.text());
    return res.json()
}

export async function deleteUserAccount(id) {
    const res = await fetch(`http://localhost:8000/user/${id}`, {
        method: "DELETE",
        credentials: 'include',
    })

    if (!res.ok) throw new Error(await res.text());
    return res.json()
}

export function capitalEveryWord(str, sep = ' ') {
    const strings = `${str}`.split(sep)
    const altered = strings.map(str => str.charAt(0).toUpperCase() + str.slice(1))
    return altered.join(' ')
}

export function userHomeUrl(userObj) {
    if (`${userObj.role}`.toLowerCase() === "student") {
        return `${userObj.role}/${userObj.id}`
    }

    return `${userObj.role}/home`
}