import { useState } from "react";
import { Link } from "react-router-dom";

import { mutationDeleteUserAcc, mutationUpdateUserDetails } from "../hooks/mutateFuncs";
import { capitalEveryWord } from "../utils/helperFunctions";
import { queryClient } from "../lib/queryClient";
import { queryKeys } from "../constants/index";
import { useMessage } from "../hooks/useMessage"

import EditableTableCell, { useCellState } from "./EditableTableCell";


export default function UsersTable({ userData = [], adminId = "" }) {
    const users = userData ?? []
    const { message, setMessage, messageStyles, resetMessage } = useMessage()
    
    const delUserMutation = mutationDeleteUserAcc({
        ifSuccess: () => {
            if (queryClient.getQueryData(queryKeys.teachers)) {
                queryClient.invalidateQueries(queryKeys.teachers)
            };

            if (queryClient.getQueryData(queryKeys.users)) {
                queryClient.invalidateQueries({ queryKey: queryKeys.users });
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
        }
    })

    const updateUserMutation = mutationUpdateUserDetails({
        ifSuccess: () => {
            if (queryClient.getQueryData(queryKeys.users)) {
                queryClient.invalidateQueries({ queryKey: queryKeys.users })
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

    const { cellStates, editDetails, coords, resetAll } = useCellState()
    const [isEditing, setIsEditing] = useState('')
    const [isAddingNew, setIsAddingNew] = useState(false)

    function handleCancelKey(event) {
        if (event.key === "Escape") setIsEditing('');
    }

    function saveEdit() {
        updateUserMutation.mutate({
            id: editDetails.rowId,
            column: editDetails.col,
            value: editDetails.value,
        })
    }

    return (
        <div className="users-table__container">

            {/* Status Message */}
            {message.text && <div style={messageStyles}>
                <p><strong>{message.header}</strong></p>
                <p>{message.text}</p>
            </div>}

            <div className="users-table__title-save-cancel-button">
                <h2>Users</h2>
                
                <div className="users-table__btn-options">
                    {(coords.rowId === "")
                        ? ((isEditing)
                            ? <>
                                {(isEditing === 'edit') && <button>💾</button>}
                                <button title="Cancel"
                                    onClick={_ => {
                                        setIsEditing('')
                                        resetMessage()
                                }}>❌</button>
                            </>
                            : <div className="users-table__add-and-delete-btn">
                                {isAddingNew 
                                    ? <div className="users-table__in-add-btn-options">
                                        <Link to={'/create-teacher-account'}>Teacher</Link>
                                        <Link to={'/create-student-account'}>Student</Link>
                                        <button 
                                            title="Cancel"
                                            onClick={_ => {
                                                setIsAddingNew(false)
                                                resetMessage()
                                            }}
                                        >❌</button>
                                    </div>
                                    :<button title="Add new account" onClick={_ => setIsAddingNew(true)}>➕</button>
                                }
                                
                                <button onClick={_ => setIsEditing('delete')} title="Delete account">🗑️</button>
                            </div>
                        ) : <button onClick={_ => resetAll()} title="Cancel edit">❌</button>
                    }
                </div>
            </div>
                {(users.length >= 1)
                    ? <table onKeyUp={e => handleCancelKey(e)}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => <tr key={user.id}>
                                    {/* User ID */}
                                    <td>{
                                        (isEditing === 'delete') && <button 
                                            title={`Delete ${user.username}`}
                                            onClick={_ => {
                                                const confirmDel = window.confirm(`Confirm delete ${user.username}`)
                                                if (!confirmDel) return null
                                                delUserMutation.mutate(user.id)
                                            }}
                                            >🗑️</button>
                                        } {user.id}
                                    </td>
                                    
                                    {/* User Username */}
                                    <EditableTableCell type="input"
                                        configs={{
                                            id: user.id,
                                            cellData: user.username,
                                            column: 'username',
                                            saveEditFn: saveEdit,
                                        }}
                                        cellStates={cellStates}
                                    />

                                    {/* User Email */}
                                    <EditableTableCell type="input"
                                        configs={{
                                            id: user.id,
                                            cellData: user.email,
                                            column: 'email',
                                            saveEditFn: saveEdit,
                                        }}
                                        cellStates={cellStates}
                                    />

                                    {/* User Role */}
                                    <td>{capitalEveryWord(user.role)}</td>

                                </tr>)}
                            </tbody>
                        </table>
                    : <p>No users to show</p>
                }
        </div>
    )
}