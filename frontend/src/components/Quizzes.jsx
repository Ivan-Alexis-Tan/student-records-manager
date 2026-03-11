import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Outlet, useParams, Link } from "react-router-dom"
import { useState } from "react"

import { getQuizes } from "../services/studentsAPI"
import { useAuth } from "../hooks/authQuery"
import { mutationDeleteQuiz, mutationUpdateScore } from "../hooks/mutateFuncs"

export default function QuizzesPage() {
    const params = useParams()
    const queryClient = useQueryClient()
    const {data: user} = useAuth()
    const studentId = (user.role === "student") ? user.profile_id : params.id

    // Fetch Student's Quiz Records
    const quizRecord = useQuery({
        queryKey: ['studentQuizzes', studentId],
        queryFn: () => getQuizes(studentId),
        select: (response) => {
            return {
                quizzes: response.data,
                permissions: response.permissions,
            }
        }
    })

    const updateQuizScoreMutation = mutationUpdateScore({
        ifSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['studentQuizzes', studentId]})
            console.log(`Successfully sent a PATCH request.`)
            setEditId(null);
            setEditTo(defaultEdit)
        }
    })

    const deleteQuizMutation = mutationDeleteQuiz({
        ifSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['studentQuizzes', studentId]})
        }
    })

    // Editing and Deleting Score
    const defaultEdit = {score: null, total_items: null, unit: null, topic: null}
    const [isEditing, setIsEditing] = useState(null);
    const [editTo, setEditTo] = useState(defaultEdit);
    const [editId, setEditId] = useState(null);

    // Web Page View IF loading or error
    if (quizRecord.isLoading) return <h2>Loading...</h2>
    if (quizRecord.error) return <h2>{quizRecord.error.message}</h2>

    const studentQuizRec = quizRecord.data?.quizzes
    const userPermissions = quizRecord.data?.permissions

    function handleKeyUp(e, quizId) {
        if (e.key === "Escape") {
            setEditId(null);
            setEditTo(defaultEdit)
        }

        if (e.key !== "Enter") return null
        handleSaveEdit(quizId)
    }

    function handleDelete(quizId) {
        const quizDelObj = quizData.find(q => q.id === quizId)
        console.log(`quizDelObj =`, quizDelObj)
        const confirm = window.confirm(`Confirm delete quiz "${quizDelObj.subject} Quarter ${quizDelObj.quarter} Quiz ${quizDelObj.quiz_num}"?`)
        if (!confirm) return null;

        deleteQuizMutation.mutate(quizDelObj.id)
        console.log(`confirm delete =`, confirm)
    }

    function handleSaveEdit(qzId) {
        const staged = {
            ...editTo,
            total_items: editTo.total_items === 0 ? null : editTo.total_items,
            unit: editTo.unit === 0 ? null : editTo.unit,
            topic: editTo.topic === `topic` ? null : editTo.topic,
        }

        if (staged.score > staged.total_items) {
            console.error(`ERROR: Score must be not greater than the highest possible score.`)
            setEditId(null);
            setEditTo(defaultEdit)
            return null
        }

        const quizInDb = studentQuizRec.find(q => q.id === qzId)
        const alreadyExists = [
            staged.score === quizInDb.score,
            staged.total_items === quizInDb.total_items,
            staged.unit === quizInDb.unit,
            staged.topic === quizInDb.topic,
            staged.date === quizInDb.date,
        ]

        if (alreadyExists.every(elem => elem === true)) {
            console.error(`ERROR: The edit details already exists.`)
            setEditId(null);
            setEditTo(defaultEdit)
            return null
        }
        console.log(staged)
        updateQuizScoreMutation.mutate(staged)
    }

    const quizData = studentQuizRec.filter( quiz => 
        quiz.quarter === Number(params.quarter) 
            && quiz.subject === params.subject
    ) ?? []

    const quizNumbs = quizData.reduce((acc, quiz) => {
        acc.push([quiz.quiz_num, quiz.id])
        return acc
    }, [])

    function test() {
        console.log(`params =`, params)
        // console.log(`data =`, data)
        console.log(`quizzes =`, quizData)
        console.log(user)
        console.log(studentQuizRec)
        console.log(quizData)
        console.log(userPermissions)
        console.log('=================')
    }

    return (
        <div>
            {/* New Quiz Record Creation */}
            {userPermissions.can_create && <div>
                <Link to="add-new-quiz-record" title="Add new quiz record"><h3>+ New Quiz Record</h3></Link>
                <Outlet context={{ studentQuizRec, userPermissions }} />
            </div>}
            <br />

            {/* Quiz Records Viewer */}
            {(quizData.length >= 1)
                ? <div>
                    {/* Edit and Delete Quizzes Button */}
                    <div className="quiz__edit-delete-field">
                        {isEditing 
                            ? <div>
                                <button title="Cancel" onClick={_ => {
                                    setIsEditing('');
                                    setEditId(null)
                                }}>❌</button>
                            </div>
                            : (userPermissions.can_update && userPermissions.can_delete 
                                && <div>
                                    <button onClick={_ => setIsEditing('edit')} title="Edit">✏️</button>
                                    <button onClick={_ => setIsEditing('delete')} title="Delete">🗑️</button>
                                </div>
                            )
                        }
                    </div>

                    <table className="quiz__show-quiz-record">
                        <thead>
                            <tr>
                                <th>Quiz #</th>
                                <th>Score</th>
                                <th>Highest Possible Score</th>
                                <th>Percentage</th>
                                <th>Unit</th>
                                <th>Topic</th>
                                <th>Date (y/m/d)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizData.map(qz => <tr key={qz.id}>
                                {/* Quiz number, Edit and Delete Button */}
                                <td>
                                    {
                                        isEditing === 'edit' && (
                                            editId === qz.id
                                                ? <>
                                                    <button onClick={_ => handleSaveEdit(qz.id)} title="Save">💾</button>
                                                    <button 
                                                        title="Cancel"
                                                        onClick={_ => {
                                                            setEditId(null);
                                                            setEditTo(defaultEdit)
                                                        }}
                                                    >❌</button>
                                                </>
                                                : <button 
                                                    title="Edit quiz"
                                                    onClick={_ => {
                                                        setEditId(qz.id)
                                                        setEditTo(_ => getQuizData(studentQuizRec, qz.id, true))
                                                    }}
                                                >✏️</button>
                                        )
                                    } { qz.quiz_num } {
                                        isEditing === 'delete' && <button title="Delete quiz"
                                            onClick={_ => handleDelete(qz.id)}>
                                                🗑️
                                        </button>
                                    }
                                </td>

                                {/* Editing Field */}
                                {editId === qz.id && 
                                    <>
                                        <td><input type="number" 
                                            value={editTo.score} 
                                            placeholder={qz.score}
                                            onChange={e => setEditTo(prev => ({...prev, score: Number(e.target.value)}))}
                                            onKeyUp={e => handleKeyUp(e, qz.id)}
                                        /></td>

                                        <td><input type="number" 
                                            value={editTo.total_items} 
                                            placeholder={qz.total_items}
                                            onChange={e => setEditTo(prev => ({...prev, total_items: Number(e.target.value)}))}
                                            onKeyUp={e => handleKeyUp(e, qz.id)}
                                        /></td>

                                        <td>{qz.total_items ? `${Math.round((qz.score / qz.total_items) * 100)}%` : null}</td>

                                        <td><input type="number" 
                                            value={editTo.unit}
                                            placeholder={qz.unit}
                                            onChange={e => setEditTo(prev => ({...prev, unit: Number(e.target.value)}))}
                                            onKeyUp={e => handleKeyUp(e, qz.id)}
                                        /></td>

                                        <td><input type="text" 
                                            value={editTo.topic}
                                            placeholder={editTo.topic}
                                            onChange={e => setEditTo(prev => ({...prev, topic: e.target.value}))}
                                            onKeyUp={e => handleKeyUp(e, qz.id)}
                                        /></td>

                                        <td><input type="date" 
                                            value={editTo.date}
                                            placeholder={editTo.date}
                                            onChange={e => setEditTo(prev => ({...prev, date: e.target.value}))}
                                            onKeyUp={e => handleKeyUp(e, qz.id)}
                                        /></td>
                                    </>
                                }
                                {editId !== qz.id && 
                                    <>
                                        <td>{qz.score}</td>
                                        <td>{qz.total_items}</td>

                                        <td>{qz.total_items 
                                            ? `${Math.round((qz.score / qz.total_items) * 100)}%` 
                                            : null
                                        }</td>

                                        <td>{qz.unit}</td>
                                        <td>{qz.topic}</td>
                                        <td>{qz.date}</td>
                                    </>
                                }
                            </tr>)}
                        </tbody>
                    </table>
                </div>
                : <p>No quiz records to display.</p>
            }
            {/* <button onClick={test}>test</button> */}
        </div>
    )
}

function getQuizData(quizzesData, quizId, fillNull = true) {
    const before = quizzesData.find(q => q.id === quizId)

    if (fillNull) {
        const nulls = Object.keys(before).reduce((acc, k) => {
            if (before[k] === null) acc[k] = k;
            return acc
        }, {})

        return {...before, 
            ...nulls, 
            unit: before.unit ?? 0,
            total_items: before.total_items ?? 0
        }
    }
    
    return {...before}
}