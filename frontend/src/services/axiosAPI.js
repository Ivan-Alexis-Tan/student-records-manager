import axios from "axios"

let isLoggedIn = false
export const baseUrl = "https://student-records-manager-backend.onrender.com"

export const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        const loginCheck = {
            status: response.status === 200,
            loggedIn: isLoggedIn === false,
            method: response.config.method === 'get',
            url: response.config.url === '/auth/me'
        }

        const logoutCheck = {
            status: response.status === 204,
            loggedIn: isLoggedIn === true,
            method: response.config.method === 'post',
            url: response.config.url === '/auth/logout'
        }

        if (Object.values(loginCheck).every(req => req === true)) isLoggedIn = true;
        if (Object.values(logoutCheck).every(req => req === true)) isLoggedIn = false;

        return response
    },
    async (error) => {
        const status = error.response?.status
        const errorDetail = error.response?.data.detail ?? null
        const configs = error.response.config

        if (status === 401) {
            if (isLoggedIn) {
                isLoggedIn = false
                await axios.post(`/auth/logout`)
            }
        }
        
        console.error(status, `${errorDetail} (${configs.method.toUpperCase()} ${configs.url})`)
        return Promise.reject(error)
    }
)