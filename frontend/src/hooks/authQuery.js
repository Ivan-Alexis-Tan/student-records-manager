import { useQuery } from "@tanstack/react-query"

import {api} from "../services/axiosAPI"

export function useAuth() {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: () => api.get('/auth/me').then(res => res.data),

        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
    })
}