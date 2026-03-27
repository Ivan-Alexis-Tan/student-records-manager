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
    updateTeacherDetails,
} from "../services/studentsAPI";

// User Mutations
export function mutationDeleteUserAcc({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (userId) => deleteUserAccount(userId),
        onSuccess: (response) => ifSuccess(response),
        onError: (error) => ifError(error.response),
    })
}

// Students Mutations
export function mutationCreateStudent({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (student_info) => createStudent(student_info),
        onSuccess: (response) => ifSuccess(response),
        onError: (error) => ifError(error.response),
    })
}

export function mutationCreateStudentAcc({ ifSuccess = () => null, ifError = () => null, }) {
    return useMutation({
        mutationFn: (details) => createStudentAccount(details),
        onSuccess: (response) => ifSuccess(response),
        onError: (error) => ifError(error.response),
    })
}

export function mutationRemoveStudents({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: removeStudents,
        onSuccess: (response) => ifSuccess(response),
        onError: (error) => ifError(error.response),
    })
}

// Quiz Mutation
export function mutationCreateQuiz({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (newQuiz) => createQuizRecord(newQuiz),
        onSuccess: (response) => ifSuccess(response),
        onError: (error) => ifError(error.response),
    })
}

export function mutationUpdateScore({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: updateQuizScore,
        onSuccess: (response) => ifSuccess(response),
        onError: (error) => ifError(error.response),
    })
}

export function mutationDeleteQuiz({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (quizId) => deleteQuiz(quizId),
        onSuccess: (response) => ifSuccess(response),
        onError: (error) => ifError(error.response),
    })
}


// Teacher
export function mutationCreateTeacherAcc({ ifSuccess = () => null, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (reqDetails) => createTeacherAccount(reqDetails),
        onSuccess: (response) => ifSuccess(response),
        onError: (error) => ifError(error.response),
    })
}


export function mutationDeleteTeacher({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (teacherId) => removeTeacher(teacherId),
        onSuccess: (response) => ifSuccess(response),
        onError: (error) => ifError(error.response),
    })
}

export function mutationUpdateTeacher({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (payload) => updateTeacherDetails(payload),
        onSuccess: (response) => ifSuccess(response),
        onError: (error) => ifError(error.response),
    })
}

// Signup Registration Requests
export function mutationRemoveRegisRequest({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (requestId) => removeRegisRequest(requestId),
        onSuccess: (response) => ifSuccess(response),
        onError: (error) => ifError(error.response),
    })
}

export function mutationGrantRegisRequest({ ifSuccess = () => {}, ifError = () => null } = {}) {
    return useMutation({
        mutationFn: (requestId) => grantRegisRequest(requestId),
        onSuccess: (response) => ifSuccess(response),
        onError: (error) => ifError(error.response),
    })
}