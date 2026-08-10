import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { mutationDeleteQuiz, mutationUpdateScore } from "./mutateFuncs";
import { queryClient } from "../lib/queryClient";
import { queryKeys } from "../constants/index";
import { schemaEditQuizForm } from "../schemas/schemas";
import { useMessage } from "./useMessage";
import { capitalEveryWord } from "../utils/helperFunctions"

export function useQuizTable({ studentId = '', onUpdateSuccess = () => null } = {}) {
    const {message, setMessage, messageStyles, resetMessage} = useMessage()

    const { 
        register, 
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ resolver: zodResolver(schemaEditQuizForm) });

    const updateMutation = mutationUpdateScore({
        ifSuccess: (response) => {
            const data = response.data
            queryClient.invalidateQueries({queryKey: queryKeys.studentQuizzes(studentId)})
            setMessage({
                ok: true,
                header: "Successfully Edited",
                text: `Edited: ${data.subject} Quiz ${data.quiz_num}`
            })
            onUpdateSuccess()
        },
        ifError: (error) => {
            const errorDetail = error?.data?.detail ?? "Something wrong happened"
            setMessage({
                ok: false,
                header: "Failed to Edit",
                text: errorDetail,
            })
        },
    });

    const submitEdit = handleSubmit((data) => {
        console.log(`data =`, data)
        updateMutation.mutate(data)
    });

    const deleteMutation = mutationDeleteQuiz({
        ifSuccess: () => {
            queryClient.invalidateQueries({queryKey: queryKeys.studentQuizzes(studentId)})
        },
        ifError: (error) => {
            console.error(error?.data?.detail ?? "Something wrong happened")
        }
    });

    function deleteQuiz(quizId) {
        deleteMutation.mutate(quizId)
    }

    // Zod error message manager
    useEffect(() => {
        const errorFields = Object.keys(errors)

        if (errorFields.length == 0) return
        console.error(`Invalid ${capitalEveryWord(errorFields[0], "_")}:`,errors[errorFields[0]]?.message)
        setMessage({
            ok: false,
            header: `Invalid ${capitalEveryWord(errorFields[0], '_')}`,
            text: errors[errorFields[0]]?.message,
        })
    }, [errors])

    return { 
        editForm: { register, reset }, 
        quizHookProps: { 
            submitEdit, 
            editForm: { register, reset }, 
            message, 
            messageStyles, 
            resetMessage 
        },
        submitEdit, 
        deleteQuiz, 
        message,
        setMessage,
        messageStyles,
        resetMessage,
    }
}

export default function QuizzesDataTable({ quizData, quizHookProps, userPermissions }) {
    // Editing and Deleting Score
    const [isEditing, setIsEditing] = useState(null);
    const [editId, setEditId] = useState(null);

    function handleKeyUp(e) {
        if (e.key === "Escape") setEditId(null);

        if (e.key == "Enter") {
            quizHookProps.submitEdit()
            setEditId(null)
        };
    }
    
    if (quizData.length === 0) return <p>No quiz records to display.</p>

    return (
        <div>

            {/* Error Message Display */}
            {quizHookProps.message?.text && (
                <div style={quizHookProps.messageStyles}>
                    {quizHookProps.message?.header && <h4>{quizHookProps.message?.header}</h4>}
                    <p>{quizHookProps.message?.text}</p>
                </div>
            )}

            {/* Edit and Delete Quizzes Buttons */}
            <div className="quiz__edit-delete-field">
                {isEditing 
                    ? <div>
                        <button title="Cancel" onClick={_ => {
                            setIsEditing('');
                            setEditId(null)
                            userPermission.resetMessage()
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

            <div className="quiz-data-table-container">
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
                                                <button title="Save" 
                                                    onClick={_ => {
                                                        quizHookProps.submitEdit()
                                                        setEditId(null)
                                                    }} 
                                                >💾</button>
                                                <button title="Cancel"
                                                    onClick={_ => {
                                                        setEditId(null)
                                                        userPermission.resetMessage()
                                                    }}
                                                >❌</button>
                                            </>
                                            : <button 
                                                title="Edit quiz"
                                                onClick={_ => {
                                                    setEditId(qz.id)
                                                    quizHookProps.editForm?.reset(qz)
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
                                        {...quizHookProps.editForm?.register('score')}
                                    /></td>

                                    <td><input type="number" 
                                        min={5}
                                        onKeyUp={e => handleKeyUp(e)}
                                        {...quizHookProps.editForm?.register("total_items")}
                                        
                                    /></td>

                                    <td>{qz.total_items ? `${Math.round((qz.score / qz.total_items) * 100)}%` : null}</td>

                                    <td><input type="number" 
                                        min={1}
                                        onKeyUp={e => handleKeyUp(e)}
                                        {...quizHookProps.editForm?.register('unit')}
                                    /></td>

                                    <td><input type="text" 
                                        onKeyUp={e => handleKeyUp(e)}
                                        {...quizHookProps.editForm?.register('topic')}
                                    /></td>

                                    <td><input type="date" 
                                        onKeyUp={e => handleKeyUp(e)}
                                        {...quizHookProps.editForm?.register('date')}
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
        </div>
    )
}