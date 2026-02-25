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

        if (status === 401 && (errorDetail === 'INVALID_TOKEN' || errorDetail === "TOKEN_EXPIRED")) {
            try {
                api.post(`${baseUrl}/auth/logout`)
            }
            catch(_) {}
        }
        
        if (status == 401) {
            queryClient.setQueriesData(['auth', 'me'], null)
            console.error(status, `(${error.response.statusText}) ${errorDetail}`)
            console.log(`Response =`, error.response)
         
            queryClient.setQueriesData(['auth', 'error'], errorDetail)
        }
        
        return Promise.reject(error)
    }
)