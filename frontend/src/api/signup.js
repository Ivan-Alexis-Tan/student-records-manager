import { api } from "./axiosAPI";

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