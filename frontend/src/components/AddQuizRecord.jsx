import { useEffect, useState } from "react"
import { useParams, useNavigate, useOutletContext } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { schemaQuizForm } from "../schemas/schemas"
import { useAuth } from "../hooks/authQuery"
import { mutationCreateQuiz } from "../hooks/mutateFuncs"
import { capitalEveryWord, subjects } from "../services/helperFunctions"
import { queryClient } from "../services/queryClient"
import { queryKeys } from "../services/queryKeys"

const messageDefault = {text: '', ok: false}
const subjectSelection = subjects.sort()

const today = new Date()
const monthToday = `${today.getMonth() + 1}`.padStart(2, 0)
const dayToday = `${today.getDate()}`.padStart(2, 0)
const defaultQuizObj = {
    date: `${today.getFullYear()}-${monthToday}-${dayToday}`,
    quiz_num: 1,
    score: 0,
    total_items: 15,
    unit: 1,
    topic: '',
}

export default function AddQuizRecord() {
    const user = useAuth()
    const params = useParams()
    const navigate = useNavigate()
    const { userPermissions } = useOutletContext()

    const studentId = (user.role === "student") ? user.profile_id : params.id
    const [message, setMessage] = useState(messageDefault)

    const { register, handleSubmit, formState: { errors }} = useForm({
        resolver: zodResolver(schemaQuizForm),
        defaultValues: {
            ...defaultQuizObj,
            student_id: studentId,
            subject: params.subject,
            quarter: Number(params.quarter),
        },
    })
    
    const createQuizRecordMutation = mutationCreateQuiz({
        ifSuccess: (res) => {
            const newQuiz = res.data ?? {}
            queryClient.invalidateQueries({ queryKey: queryKeys.studentQuizzes(studentId) })
            
            setMessage({
                ok: true,
                text: `Successfully added "${newQuiz.subject} Q${newQuiz.quarter} Quiz ${newQuiz.quiz_num}".`,
            })
        },
        ifError: (error) => {
            const errMsg = error.data?.detail
            const contingency = error.data?.detail ?? "Something went wrong."

            setMessage({
                ok: false,
                text: errMsg[0].msg ?? contingency
            })
        }
    })
    
    function saveNewQuiz(data) {
        if (!userPermissions.can_create) {
            setMessage({
                ok: false,
                text: 'ERROR: Not enough permission to create a quiz record.',
            })
            return null
        }

        createQuizRecordMutation.mutate(data)       
    }

    const errorFields = Object.keys(errors)
    const messageStyle = (message.ok 
        ? {color: 'hsl(113, 100%, 50%)', textAlign: 'center'}
        : {color: 'hsl(9, 100%, 69%)', textAlign: 'center'}
    )

    // Error message organizer
    useEffect(() => {
        if (errorFields.length == 0) return
        setMessage(messageDefault)
    }, [errors, errorFields])

    return (
        <div className="add-new-quiz-record">
            {message && <p className="add-new-quiz-record__message" style={messageStyle}>{message.text}</p>}

            {/* Zod Error Message */}
            {(errorFields.length !== 0) && (
                <div style={{color: "hsl(9, 100%, 69%)", textAlign: 'center'}}>
                    <p><strong>Invalid {capitalEveryWord(errorFields[0], '_')}</strong></p>
                    <p>{errors[errorFields[0]]?.message}</p>
                </div>
            )}

            <form onSubmit={ handleSubmit(saveNewQuiz) }>
                <label>Date: </label>
                <input type="date" {...register('date')}  />
                <br />

                <label>Quarter: </label>
                <input type="number" min={1} max={4} {...register('quarter')} />
                <br />
                
                <label>Subject: </label>
                <select {...register('subject')}>
                    {subjectSelection.map(subj => <option key={subj} value={subj}>
                        {subj}
                    </option>)} 
                </select>
                <br />

                <label>Quiz Number: </label>
                <input type="number" min={1} {...register('quiz_num')} />
                <br />

                <label>Score: </label>
                <input type="number" {...register('score')} />
                <br />

                <label>Highest Possible Score: </label>
                <input type="number" min={5} {...register('total_items')} />
                <br />

                <label>Unit: </label>
                <input type="number" min={1} {...register('unit')} />
                <br />

                <label>Topic: </label>
                <input type="text" placeholder="Topic" {...register('topic')} />
                <br />

                <button type="submit" title="Save">💾</button>
                <button type="button" title="Cancel" onClick={_ => {
                    navigate(-1)
                    setMessage('')
                }}>❌</button>
            </form>
            <hr />
        </div>
    )
}