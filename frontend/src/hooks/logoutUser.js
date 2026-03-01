import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../services/queryClient";
import { api } from "../services/axiosAPI";

export default function logoutCurrentUser() {
    const logoutMutation = useMutation({
        mutationFn: () => api.post('/auth/logout'),
        onSuccess: () => {
            queryClient.setQueriesData(["auth", "me"], null)
            queryClient.clear()
        },
        retry: false
    })

    return logoutMutation
}