import { api, baseUrl } from "./axiosAPI"

// Auth
export async function submitLogin(loginDetails) {
    const refined = new URLSearchParams()
    refined.append("username", loginDetails.email)
    refined.append("password", loginDetails.password)

    const res = await fetch(`${baseUrl}/auth/login`, {
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