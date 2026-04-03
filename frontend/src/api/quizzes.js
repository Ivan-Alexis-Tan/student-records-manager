import { api } from "../api/axiosAPI"

const quizzesBase = '/quizzes'

export async function updateQuizScore(payload) {
    const submitted = {
        date: payload.date,
        score: payload.score,
        total_items: payload.total_items,
        unit: payload.unit,
        topic: payload.topic,
    }
    return api.patch(`${quizzesBase}/${payload.id}`, submitted)
}

export async function createQuizRecord(payload) {
    return api.post(`${quizzesBase}`, payload)
}

export async function deleteQuiz(quizId) {
    return api.delete(`${quizzesBase}/${quizId}`)
}