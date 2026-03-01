import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../services/queryClient";
import { deleteUserAccount } from "../services/studentsAPI";

export function deleteUserAccMutation() {
    return useMutation({
        mutationFn: (userId) => deleteUserAccount(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })
}

