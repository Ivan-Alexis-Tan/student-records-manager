import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../services/queryClient";
import { logoutUser } from "../services/studentsAPI";

export default function logoutCurrentUser() {
    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.setQueriesData(["auth", "me"], null)
        },
        retry: false
    })

    return logoutMutation
}