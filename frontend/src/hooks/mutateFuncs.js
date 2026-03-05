import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../services/queryClient";
import { 
    createQuizRecord,
    createStudent,
    createStudentAccount,
    createTeacherAccount,
    deleteQuiz,
    deleteUserAccount,
    removeStudents,
    updateQuizScore,
} from "../services/studentsAPI";

// User Mutations
export function mutationDeleteUserAcc({ ifSuccess = () => {} } = {}) {
    return useMutation({
        mutationFn: (userId) => deleteUserAccount(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            ifSuccess()
        }
    })
}

// Students Mutations
export function mutationCreateStudent({ ifSuccess = () => {} } = {}) {
    return useMutation({
        mutationFn: createStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['students']});
            ifSuccess()
        },
    })
}

export function mutationCreateStudentAcc({ ifSuccess = () => {} }) {
    return useMutation({
        mutationFn: (details) => createStudentAccount(details),
        onSuccess: () => {
            ifSuccess()
        }
    })
}

export function mutationRemoveStudents({ ifSuccess = () => {} } = {}) {
    return useMutation({
        mutationFn: removeStudents,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            ifSuccess()
        }
    })
}

// Quiz Mutation
export function mutationCreateQuiz({ ifSuccess = () => {} } = {}) {
    return useMutation({
        mutationFn: (newQuiz) => createQuizRecord(newQuiz),
        onSuccess: () => {
            ifSuccess()
        }
    })
}

export function mutationUpdateScore({ ifSuccess = () => {} } = {}) {
    return useMutation({
        mutationFn: updateQuizScore,
        onSuccess: () => {
            ifSuccess()
        }
    })
}

export function mutationDeleteQuiz({ ifSuccess = () => {} } = {}) {
    return useMutation({
        mutationFn: (quizId) => deleteQuiz(quizId),
        onSuccess: () => {
            ifSuccess()
        }
    })
}

export function mutationCreateTeacherAcc({ ifSuccess = () => {} } = {}) {
    return useMutation({
        mutationFn: (reqDetails) => createTeacherAccount(reqDetails),
        onSuccess: () => {
            ifSuccess()
        }
    })
}