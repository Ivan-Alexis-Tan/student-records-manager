import { useQuery } from "@tanstack/react-query"

import { api } from "../api/axiosAPI"
import { queryKeys } from "../lib/queryKeys"

export function useAuth() {
    return useQuery({
        queryKey: queryKeys.me,
        queryFn: () => api.get('/auth/me').then(res => res.data),

        retry: false,
        staleTime: 1000 * 30,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
    })
}