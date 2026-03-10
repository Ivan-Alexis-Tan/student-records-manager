import axios from "axios"

let isLoggedIn = false

export const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        const checked = {
            status: response.status === 200,
            loggedIn: isLoggedIn === false,
            method: response.config.method === 'get',
            url: response.config.url === '/auth/me'
        }

        if (Object.values(checked).every(req => req === true)) {
            isLoggedIn = true;
            console.log(`User logged in`)
        }

        return response
    },
    async (error) => {
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