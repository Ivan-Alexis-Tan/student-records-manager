import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../services/queryClient";
import { 
    createStudent,
    deleteUserAccount,
    removeStudents,
} from "../services/studentsAPI";

// User Mutations
export function deleteUserAccMutation() {
    return useMutation({
        mutationFn: (userId) => deleteUserAccount(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })
}

// Students Mutations
export function createStudentMutation({ ifSuccess = () => {} }) {
    return useMutation({
        mutationFn: createStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['students']});
            ifSuccess()
        },
    })
}

export function removeStudentsMutation() {
    return useMutation({
        mutationFn: removeStudents,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] })
        }
    })
}