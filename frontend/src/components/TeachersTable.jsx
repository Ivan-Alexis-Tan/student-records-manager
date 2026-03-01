import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { capitalEveryWord } from "../services/helperFunctions" 
import { api } from "../services/axiosAPI"

export default function TeachersTable() {
    const {data, isLoading, error} = useQuery({
        queryKey: ["teachers"],
        queryFn: () => api.get('/teachers').then(res => res.data),
        retry: false
    })

    const queryClient = useQueryClient()
    const deleteTeacherAccMutation = useMutation({
        mutationFn: (teacherId) => deleteUserAccount(teacherId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['teachers']})
        }
    })

    const navigate = useNavigate()

    const nullCoords = {rowId: '', col: ''}
    const [isEditing, setIsEditing] = useState('')
    const [coords, setCoords] = useState(nullCoords)
    const [editDetails, setEditDetails] = useState({
        value: '', colName: '', teacherId: ''
    })

    if (isLoading) return <h1>Loading...</h1>
    if (error) {
        console.error(error);
        return <h1>Error loading 'Teachers'</h1>
    }

    const teachers = data ?? []

    function handleSetCoord(rowId, col, initVal) {
        setCoords({rowId, col});
        setIsEditing('edit')
        setEditDetails({value: initVal, colName: col, teacherId: rowId})
    }

    function handleWriteEdit(value, colName, teacherId) {
        setEditDetails({value, colName, teacherId})
    }

    function handleEscKey(event) {
        if (event.key === "Escape") {
            setCoords(nullCoords)
            setIsEditing('')
        }
        
        if (event.key === "Enter") {
            console.log(event.key)
        }
    }

    return (
         <div className="teachers-table__container">
                <div className="teachers-table__title-edit-delete-btn">
                    <h2>Teachers</h2>

                    <div>
                        {(isEditing)
                            ? <>
                                {(isEditing === 'edit') && <button
                                    title="Save"
                                >💾</button>
                                }
                                <button
                                    title="Cancel"
                                    onClick={_ => {
                                        setCoords(nullCoords);
                                        setIsEditing('')
                                    }}
                                >❌</button>
                            </>
                            : <>
                                <button title="Create new teacher account" 
                                    onClick={_ => navigate('/create-teacher-account')}
                                >➕</button>
                                <button title="Remove teacher account"
                                    onClick={_ => setIsEditing('delete')}
                                >🗑️</button>
                            </>
                        }
                    </div>
                </div>

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
                                {teachers.map(teacher => <tr key={teacher.id} onKeyUp={e => handleEscKey(e)}>
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

                                    {(coords.rowId === teacher.id && coords.col === 'last_name')
                                        ? <td><input type="text" 
                                            value={editDetails.value}
                                            onChange={e => setEditDetails(e.target.value)}
                                        /></td>
                                        : <td onDoubleClick={_ => handleSetCoord(teacher.id, 'last_name', teacher.last_name)}>
                                            {teacher.last_name}
                                        </td>
                                    }
                                    
                                    {(coords.rowId === teacher.id && coords.col === 'first_name')
                                        ? <td><input type="text" 
                                            value={editDetails.value}
                                            onChange={e => handleWriteEdit(e.target.value, 'first_name', teacher.id)}
                                        /></td>
                                        : <td onDoubleClick={_ => handleSetCoord(teacher.id, 'first_name', teacher.first_name)}>
                                            {teacher.first_name}
                                        </td>
                                    }

                                    {(coords.rowId === teacher.id && coords.col === 'field_specialty')
                                        ? <td><input type="text" 
                                            value={editDetails.value}
                                            onChange={e => setEditDetails(capitalEveryWord(e.target.value))}
                                        /></td>
                                        : <td onDoubleClick={_ => handleSetCoord(teacher.id, 'field_specialty', teacher.field_speciality)}>
                                            {capitalEveryWord(teacher.field_specialty ?? "")}
                                        </td>
                                    }

                                    <td>{teacher.user_id}</td>
                                </tr>)}
                            </tbody>
                        </table>
                    : <p>No users to show</p>   
                }
            </div>
    )
}