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
export function mutationDeleteUserAcc({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (userId) => deleteUserAccount(userId),
        onSuccess: () => ifSuccess(),
        onError: (error) => ifError(error.response),
    })
}

// Students Mutations
export function mutationCreateStudent({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: createStudent,
        onSuccess: () => ifSuccess(),
        onError: (error) => ifError(error.response),
    })
}

export function mutationCreateStudentAcc({ ifSuccess = () => null, ifError = () => null, }) {
    return useMutation({
        mutationFn: (details) => createStudentAccount(details),
        onSuccess: () => ifSuccess(),
        onError: (error) => ifError(error.response),
    })
}

export function mutationRemoveStudents({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: removeStudents,
        onSuccess: () => ifSuccess(),
        onError: (error) => ifError(error.response),
    })
}

// Quiz Mutation
export function mutationCreateQuiz({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (newQuiz) => createQuizRecord(newQuiz),
        onSuccess: () => ifSuccess(),
        onError: (error) => ifError(error.response),
    })
}

export function mutationUpdateScore({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: updateQuizScore,
        onSuccess: () => ifSuccess(),
        onError: (error) => ifError(error.response),
    })
}

export function mutationDeleteQuiz({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (quizId) => deleteQuiz(quizId),
        onSuccess: () => ifSuccess(),
        onError: (error) => ifError(error.response),
    })
}


// Teacher
export function mutationCreateTeacherAcc({ ifSuccess = () => null, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (reqDetails) => createTeacherAccount(reqDetails),
        onSuccess: () => ifSuccess(),
        onError: (error) => ifError(error.response),
    })
}


export function mutationDeleteTeacher({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (teacherId) => removeTeacher(teacherId),
        onSuccess: () => ifSuccess(),
        onError: (error) => ifError(error.response),
    })
}


// Signup Registration Requests
export function mutationRemoveRegisRequest({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (requestId) => removeRegisRequest(requestId),
        onSuccess: () => ifSuccess(),
        onError: (error) => ifError(error.response),
    })
}

export function mutationGrantRegisRequest({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (requestId) => grantRegisRequest(requestId),
        onSuccess: () => ifSuccess(),
        onError: (error) => ifError(error.response),
    })
}