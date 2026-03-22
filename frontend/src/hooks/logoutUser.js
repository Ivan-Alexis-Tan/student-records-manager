import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../services/queryClient";
import { api } from "../services/axiosAPI";
import { queryKeys } from "../services/queryKeys";

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