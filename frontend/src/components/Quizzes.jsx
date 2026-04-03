import { useQuery } from "@tanstack/react-query"
import { Outlet, useParams, Link } from "react-router-dom"
import { useState } from "react"

import { getQuizzes } from "../api/students"
import { useAuth } from "../hooks/authQuery"
import { queryKeys } from "../constants/index"
import { useQuizEditor } from "../hooks/useQuizEditor"

export default function QuizzesPage() {
    const params = useParams()
    const {data: user} = useAuth()
    const studentId = (user.role === "student") ? user.profile_id : params.id

    // Fetch Student's Quiz Records
    const quizRecord = useQuery({
        queryKey: queryKeys.studentQuizzes(studentId),
        queryFn: () => getQuizzes(studentId),
        select: (response) => {
            return {
                quizzes: response.data,
                permissions: response.permissions,
            }
        }
    })

    const { editForm, submitEdit, deleteQuiz, message, messageStyles, resetMessage } = useQuizEditor({
        studentId: studentId,
        onUpdateSuccess: _ => setEditId(''),
    })

    // Editing and Deleting Score
    const [isEditing, setIsEditing] = useState(null);
    const [editId, setEditId] = useState(null);

    // Web Page View IF loading or error
    if (quizRecord.isLoading) return <h2>Loading...</h2>
    if (quizRecord.error) return <h2>{quizRecord.error.message}</h2>

    const studentQuizRec = quizRecord.data?.quizzes ?? []
    const userPermissions = quizRecord.data?.permissions ?? []

    function handleKeyUp(e) {
        if (e.key === "Escape") setEditId(null);
        if (e.key == "Enter") submitEdit();
    }

    const quizData = studentQuizRec.filter( quiz => 
        quiz.quarter === Number(params.quarter) 
            && quiz.subject === params.subject
    ) ?? []

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

                    {/* Error Message Display */}
                    {message.text && (
                        <div style={messageStyles}>
                            {message.header && <h4>{message.header}</h4>}
                            <p>{message.text}</p>
                        </div>
                    )}

                    {/* Edit and Delete Quizzes Buttons */}
                    <div className="quiz__edit-delete-field">
                        {isEditing 
                            ? <div>
                                <button title="Cancel" onClick={_ => {
                                    setIsEditing('');
                                    setEditId(null)
                                    resetMessage()
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
                                                    <button onClick={ submitEdit } title="Save">💾</button>
                                                    <button title="Cancel"
                                                        onClick={_ => {
                                                            setEditId(null)
                                                            resetMessage()
                                                        }}
                                                    >❌</button>
                                                </>
                                                : <button 
                                                    title="Edit quiz"
                                                    onClick={_ => {
                                                        setEditId(qz.id)
                                                        editForm.reset(qz)
                                                    }}
                                                >✏️</button>
                                        )
                                    } { qz.quiz_num } {
                                        isEditing === 'delete' && (
                                            <button title="Delete quiz"
                                                onClick={_ => deleteQuiz(qz.id)}
                                            >🗑️</button>
                                        )
                                    }
                                </td>

                                {/* Editing Field */}
                                {editId === qz.id && 
                                    <>
                                        <td><input type="number" 
                                            onKeyUp={e => handleKeyUp(e)}
                                            {...editForm.register('score')}
                                        /></td>

                                        <td><input type="number" 
                                            min={5}
                                            onKeyUp={e => handleKeyUp(e)}
                                            {...editForm.register("total_items")}
                                            
                                        /></td>

                                        <td>{qz.total_items ? `${Math.round((qz.score / qz.total_items) * 100)}%` : null}</td>

                                        <td><input type="number" 
                                            min={1}
                                            onKeyUp={e => handleKeyUp(e)}
                                            {...editForm.register('unit')}
                                        /></td>

                                        <td><input type="text" 
                                            onKeyUp={e => handleKeyUp(e)}
                                            {...editForm.register('topic')}
                                        /></td>

                                        <td><input type="date" 
                                            onKeyUp={e => handleKeyUp(e)}
                                            {...editForm.register('date')}
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
        </div>
    )
}