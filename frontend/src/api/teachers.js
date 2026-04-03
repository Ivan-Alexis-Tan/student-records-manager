import { api } from "./axiosAPI"

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