import { api } from "../api/axiosAPI"

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
    return api.post(`/users/students`, new_user)
}