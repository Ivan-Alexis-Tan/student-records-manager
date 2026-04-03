import { api } from "./axiosAPI";

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

export async function getQuizzes(studentId) {
    return api.get(`${studentsBase}/${studentId}/quizzes`).then(res => res.data)
}