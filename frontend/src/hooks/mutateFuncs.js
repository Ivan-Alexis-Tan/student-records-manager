import { useMutation } from "@tanstack/react-query";

import { 
    createQuizRecord,
    createStudent,
    createStudentAccount,
    createTeacherAccount,
    deleteQuiz,
    deleteUserAccount,
    grantRegisRequest,
    removeRegisRequest,
    removeStudents,
    removeTeacher,
    updateQuizScore,
} from "../services/studentsAPI";

// User Mutations
export function mutationDeleteUserAcc({ ifSuccess = () => {} } = {}) {
    return useMutation({
        mutationFn: (userId) => deleteUserAccount(userId),
        onSuccess: () => {
            ifSuccess()
        }
    })
}

// Students Mutations
export function mutationCreateStudent({ ifSuccess = () => {} } = {}) {
    return useMutation({
        mutationFn: createStudent,
        onSuccess: () => {
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


// Teacher
export function mutationCreateTeacherAcc({ ifSuccess = () => {} } = {}) {
    return useMutation({
        mutationFn: (reqDetails) => createTeacherAccount(reqDetails),
        onSuccess: () => {
            ifSuccess()
        }
    })
}


export function mutationDeleteTeacher({ ifSuccess = () => {} } = {}) {
    return useMutation({
        mutationFn: (teacherId) => removeTeacher(teacherId),
        onSuccess: () => {
            ifSuccess()
        }
    })
}


// Signup Registration Requests
export function mutationRemoveRegisRequest({ ifSuccess = () => {} } = {}) {
    return useMutation({
        mutationFn: (requestId) => removeRegisRequest(requestId),
        onSuccess: () => {
            ifSuccess()
        }
    })
}

export function mutationGrantRegisRequest({ ifSuccess = () => {} } = {}) {
    return useMutation({
        mutationFn: (requestId) => grantRegisRequest(requestId),
        onSuccess: () => {
            ifSuccess()
        }
    })
}