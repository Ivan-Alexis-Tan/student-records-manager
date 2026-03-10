import axios from "axios"

import { queryClient } from "./queryClient";

const baseUrl = "http://localhost:8000"

export const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        const errorDetail = error.response?.data.detail ?? null
        const configs = error.response.config
        console.log(`request =`, configs.method.toUpperCase(), configs.url)

        if (status === 401) {
            if (isLoggedIn) {
                isLoggedIn = false
                await axios.post(`http://localhost:8000/auth/logout`)
                console.log(`User logged out. ${configs.method.toUpperCase()} ${configs.url}`)
                // queryClient.setQueryData(['auth', 'me'], null)
                // queryClient.cancelQueries()
            }
        }
        
        console.error(status, `${errorDetail} (${configs.method.toUpperCase()} ${configs.url})`)
        return Promise.reject(error)
    }
)