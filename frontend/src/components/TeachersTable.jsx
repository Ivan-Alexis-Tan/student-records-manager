import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { mutationDeleteTeacher, mutationUpdateTeacher } from "../hooks/mutateFuncs"
import { queryClient } from "../lib/queryClient"
import { queryKeys } from "../lib/queryKeys"
import { subjects } from "../utils/helperFunctions"
import { useMessage } from "../hooks/useMessage"

import EditableTableCell, { useCellState } from "./EditableTableCell"

export default function TeachersTable({ teachersData = [], adminId = "" }) {
    const teachers = teachersData ?? []
    const navigate = useNavigate()
    const { message, setMessage, messageStyles, resetMessage } = useMessage()

    const deleteTeacherAccMutation = mutationDeleteTeacher({
        ifSuccess: () => {
            if (queryClient.getQueryData(queryKeys.teachers)){
                queryClient.invalidateQueries({ queryKey: queryKeys.teachers })
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.adminInitPageData(adminId) })
            resetMessage()
        },
        ifError: (error) => {
            setMessage({
                ok: false,
                header: "Failed Deletion",
                text: error.data?.detail ?? "Something went wrong.",
            })
        },
    })

    const updateTeacherDetails = mutationUpdateTeacher({
        ifSuccess: () => {
            if (queryClient.getQueryData(queryKeys.teachers)){
                queryClient.invalidateQueries({ queryKey: queryKeys.teachers })
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.adminInitPageData(adminId) })
            resetMessage()
        },
        ifError: (error) => {
            setMessage({
                ok: false,
                header: "Failed Updating",
                text: error.data?.detail ?? "Something went wrong.",
            })
        },
    })

    const { cellStates, editDetails, coords, resetAll } = useCellState();
    const [isEditing, setIsEditing] = useState('')

    function handleKeyUp(event) {
        if (event.key === "Escape") {
            setIsEditing('')
        }
    }

    function saveEdit() {
        updateTeacherDetails.mutate({... editDetails, id: editDetails.rowId, column: editDetails.col})
    }

    return (
         <div className="teachers-table__container">

                {/* Status Message */}
                {message.text && <div style={messageStyles}>
                    <p><strong>{message.header}</strong></p>
                    <p>{message.text}</p>
                </div>}

                <div className="teachers-table__title-edit-delete-btn">
                    <h2>Teachers</h2>

                    <div>
                        {(coords.rowId !== "") 
                            ? <button title="Cancel edit" onClick={_ => {
                                resetAll()
                                resetMessage()
                            }}>❌</button>
                            : (isEditing === ""
                                ? <>
                                    <button title="Create new teacher account" 
                                        onClick={_ => navigate('/create-teacher-account')}
                                    >➕</button>
                                    <button title="Remove teacher account"
                                        onClick={_ => setIsEditing('delete')}
                                    >🗑️</button>
                                </>
                                : <>
                                    {(isEditing === 'edit') && <button
                                        title="Save"
                                    >💾</button>
                                    }
                                    <button
                                        title="Cancel"
                                        onClick={_ => {
                                            setIsEditing('')
                                            resetMessage()
                                        }}
                                    >❌</button>
                                </>
                            )
                        }
                    </div>
                </div>
                
                {/* Teachers Data Table */}
                {(teachers.length >= 1)
                    ? <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Last Name</th>
                                    <th>First Name</th>
                                    <th>Area of Specialization</th>
                                    <th>User ID (FK)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map(teacher => <tr key={teacher.id} onKeyUp={e => handleKeyUp(e)}>
                                    <td>{(isEditing === 'delete') && <button 
                                                title={`Delete ${teacher.first_name} ${teacher.last_name}`}
                                                onClick={_ => {
                                                    const confirmDel = window.confirm(`Delete ${teacher.first_name} ${teacher.last_name}'s account?`)
                                                    if (!confirmDel) return null;
                                                    deleteTeacherAccMutation.mutate(teacher.id) 
                                                }}
                                            >🗑️</button>
                                        } {teacher.id}
                                    </td>

                                    {/* Teacher's Last Name */}
                                    <EditableTableCell configs={{ 
                                            id: teacher.id,
                                            cellData: teacher.last_name,
                                            column: "last_name",
                                            saveEditFn: saveEdit,
                                        }}
                                        cellStates={cellStates} 
                                    />

                                    {/* Teacher's First Name */}
                                    <EditableTableCell configs={{ 
                                            id: teacher.id,
                                            cellData: teacher.first_name,
                                            column: "first_name",
                                            saveEditFn: saveEdit,
                                        }}
                                        cellStates={cellStates} 
                                    />
                                    
                                    {/* Teacher's Field Specialty */}
                                    <EditableTableCell type="select"
                                        configs={{ 
                                            id: teacher.id,
                                            cellData: teacher.field_specialty ?? "-",
                                            column: "field_specialty",
                                            saveEditFn: saveEdit,
                                        }} 
                                        cellStates={cellStates}
                                        selectType={{
                                            selectOptions: subjects,
                                            nullOption: 'Select Subject',
                                        }}
                                    />

                                    <td>{teacher.user_id}</td>
                                </tr>)}
                            </tbody>
                        </table>
                    : <p>No users to show</p>   
                }
            </div>
    )
}