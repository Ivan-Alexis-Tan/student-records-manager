import { useQuery } from "@tanstack/react-query"

import { getAPI } from "../services/studentsAPI"

export function useAuth() {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: () => getAPI('http://localhost:8000/auth/me', {method: "GET"}),

        retry: false,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    })
}