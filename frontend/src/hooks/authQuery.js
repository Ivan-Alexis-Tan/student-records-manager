import { useQuery } from "@tanstack/react-query"

import {api} from "../services/axiosAPI"
import { queryKeys } from "../services/queryKeys"

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