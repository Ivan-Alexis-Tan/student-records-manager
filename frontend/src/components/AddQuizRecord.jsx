import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useParams, useLocation, Link, useNavigate } from "react-router-dom"

import { createQuizRecord } from "../services/studentsAPI"

export default function AddQuizRecord() {
    const queryClient = useQueryClient()
    const user = queryClient.getQueryData(["auth", "me"]) 
    const params = useParams()
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const studentId = (user.role === "student") ? user.profile_id : params.id
    
    const quizRecord = queryClient.getQueryData(['studentQuizzes', studentId])
    const studentQuizRec = quizRecord.data
    const userPermissions = quizRecord.permissions

    const subjectSelection = [
        'Science', "Math", "English", "Aral. Pan.", "MAPEH", "Filipino", "ESP"
    ].sort()

    const [newQuizMessage, setNewQuizMessage] = useState('')
    const today = new Date()
    const monthToday = `${today.getMonth() + 1}`.padStart(2, 0)
    const dayToday = `${today.getDate()}`.padStart(2, 0)
    const deafultQuizObj = {
        student_id: studentId,
        date: `${today.getFullYear()}-${monthToday}-${dayToday}`,
        subject: params.subject,
        quiz_num: 1,
        score: 0,
        total_items: 15,
        quarter: Number(params.quarter),
        unit: 1,
        topic: '',
    }
    const [isCreating, setIsCreating] = useState(false)
    const [newQuiz, setNewQuiz] = useState(deafultQuizObj)
    

    const createQuizRecordMutation = useMutation({
        mutationFn: (newQuiz) => createQuizRecord(newQuiz),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentQuizzes', studentId]})
            console.log('successfully added.')
        }
    })

    function saveNewQuiz() {
        const alreadyExists = studentQuizRec.filter(q => 
            q.student_id === newQuiz.student_id
            && q.quarter === newQuiz.quarter
            && q.subject === newQuiz.subject
            && q.quiz_num === newQuiz.quiz_num
        )
        console.log(`newQuiz =`, newQuiz)
        console.log(`alreadyExists =`, alreadyExists.length >= 1, alreadyExists)
        
        if (newQuiz.quiz_num <= 0) {
            setNewQuizMessage('ERROR: Quiz number must be greater or equal to 1.')
            return null
        }
        if (newQuiz.score > newQuiz.total_items) {
            setNewQuizMessage('ERROR: Score must not be greater than to highest possible score.')
            return null
        }
        if (alreadyExists.length >= 1) {
            setNewQuizMessage(`ERROR: "Q${newQuiz.quarter} ${newQuiz.subject} Quiz ${newQuiz.quiz_num}" already exists.`)
            return null
        }
        
        createQuizRecordMutation.mutate(newQuiz)
        console.log(newQuiz)
        setNewQuiz(deafultQuizObj)
        setNewQuizMessage(`Successfully added "${newQuiz.subject} Q${newQuiz.quarter} Quiz ${newQuiz.quiz_num}".`)
    }

    function handleCancelAdding() {
        const path = pathname.split('/')
        return path.slice(0, path.length - 1).join('/')
    }
    const backPath = handleCancelAdding()

    function test() {
        console.log(studentQuizRec)
        console.log(pathname)
    }

    return (
        <div className="add-new-quiz-record">
            {newQuizMessage && <p className="add-new-quiz-record__message">{newQuizMessage}</p>}
            <form className="add-new-quiz-record__form">
                <label>Date: </label>
                <input type="date" 
                    value={newQuiz.date} 
                    onChange={e => setNewQuiz(prev => ({...prev, date: e.target.value}))}
                    placeholder="date created"
                />
                <br />

                <label>Quarter: </label>
                <input type="number" min='1' max='4'
                    value={newQuiz.quarter}
                    onChange={e => setNewQuiz(prev => ({...prev, quarter: Number(e.target.value)}))}
                    placeholder="1"
                    required
                />
                <br />

                <label>Subject: </label>
                <select name="quiz-subjects" value={newQuiz.subject} onChange={e => setNewQuiz(prev => ({...prev, subject: e.target.value}))}>
                    {subjectSelection.map(subj => <option key={subj} value={subj}>
                        {subj}
                    </option>)}
                </select>
                <br />

                <label>Quiz Number: </label>
                <input type="number" min='1'
                    value={newQuiz.quiz_num} 
                    onChange={e => setNewQuiz(prev => ({...prev, quiz_num: Number(e.target.value)}))}
                    placeholder={newQuiz.quiz_num}
                    required
                />
                <br />
                
                <label>Score: </label>
                <input type="number" 
                    value={newQuiz.score}
                    onChange={e => setNewQuiz(prev => ({...prev, score: Number(e.target.value)}))}
                    placeholder="15"
                    required
                />
                <br />

                <label>Highest Possible Score: </label>
                <input type="number"
                    value={newQuiz.total_items}
                    onChange={e => setNewQuiz(prev => ({...prev, total_items: Number(e.target.value)}))}
                    placeholder="15"
                    required
                />
                <br />

                <label>Unit: </label>
                <input type="number" min={'1'}
                    value={newQuiz.unit}
                    onChange={e => setNewQuiz(prev => ({...prev, unit: Number(e.target.value)}))}
                    placeholder="1"
                />
                <br />

                <label>Topic: </label>
                <input type="text" 
                    value={newQuiz.topic}
                    onChange={e => setNewQuiz(prev => ({...prev, topic: e.target.value}))}
                    placeholder="Topic"
                />
                <br />
            </form>
            <button title="Save" 
                onClick={_ => {
                    saveNewQuiz()
                    console.log('saving...')
                }}
                >💾</button>
            <button title="Cancel" onClick={_ => {
                navigate(-1)
                setNewQuizMessage('')
            }}>❌</button>
        </div>
    )
}