import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../lib/queryClient";
import { api } from "../api/axiosAPI";
import { queryKeys } from "../lib/queryKeys";

export default function logoutCurrentUser() {
    const logoutMutation = useMutation({
        mutationFn: () => api.post('/auth/logout'),
        onSuccess: () => {
            queryClient.setQueriesData(queryKeys.me, null)
            queryClient.clear()
        },
        retry: false
    })

    return logoutMutation
}