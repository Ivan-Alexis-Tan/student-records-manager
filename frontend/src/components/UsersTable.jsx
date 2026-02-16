import { useQuery } from "@tanstack/react-query"
import { useState } from "react";
import { Link } from "react-router-dom";

import { getAPI, capitalEveryWord } from "../services/studentsAPI"


export default function UsersTable() {
    const {data, isLoading, error} = useQuery({
        queryKey: ["users"],
        queryFn: () => getAPI(`http://localhost:8000/users`, {method: "GET"}),
        retry: false
    })

    const [isEditing, setIsEditing] = useState('')
    const [coords, setCoords] = useState({rowId: '', col:''})
    const [editTo, setEditTo] = useState('')
    const [isAddingNew, setIsAddingNew] = useState(false)

    if (isLoading) return <h1>Loading...</h1>
    if (error) {
        console.error(error);
        return <h1>Error loading 'Users'.</h1>
    }

    const users = data ?? []
    
    function handleSetCoord(rowId, col) {
        setCoords({rowId: rowId, col: col})
        setIsEditing('edit')
    }

    return (
        <div className="users-table__container">
            <div className="users-table__title-save-cancel-button">
                <h2>Users</h2>
                
                <div className="users-table__btn-options">
                    {(isEditing)
                        ? <>
                            {(isEditing === 'edit') && <button>💾</button>}
                            <button title="Exit editing or deleting"
                                onClick={_ => {
                                    setIsEditing('')
                                    setCoords({rowId: '', col: ''})
                            }}>❌</button>
                        </>
                        : <div className="users-table__add-and-delete-btn">
                            {isAddingNew 
                                ? <div className="users-table__in-add-btn-options">
                                    <Link to={'/create-teacher-account'}>Teacher</Link>
                                    <Link to={'/create-student-account'}>Student</Link>
                                    <button onClick={_ => setIsAddingNew(false)}>❌</button>
                                </div>
                                :<button title="Add new account" onClick={_ => setIsAddingNew(true)}>➕</button>}
                            <button onClick={_ => setIsEditing('delete')} title="Delete account">🗑️</button>
                        </div>
                    }
                </div>
            </div>
                {(users.length >= 1)
                    ? <table>
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
                                            title={`delete ${user.username}`}
                                            onClick={null}
                                            >🗑️</button>
                                        } {user.id}
                                    </td>
                                    
                                    {/* User Username */}
                                    {(coords.rowId === user.id && coords.col === 'username') 
                                        ? <td><input type="text"
                                            value={editTo}
                                            onChange={e => setEditTo(e.target.value)}
                                        /> </td>
                                        : <td onDoubleClick={_ => handleSetCoord(user.id, 'username')}>{user.username}</td>
                                    }

                                    {/* User Email */}
                                    {(coords.rowId === user.id && coords.col === 'email') 
                                        ? <td><input type="text"
                                            value={editTo}
                                            onChange={e => setEditTo(e.target.value)}
                                        /> </td>
                                        : <td onDoubleClick={_ => handleSetCoord(user.id, 'email')}>{user.username}</td>
                                    }

                                    {/* User Role */}
                                    {(coords.rowId === user.id && coords.col === 'role') 
                                        ? <td><input type="text"
                                            value={editTo}
                                            onChange={e => setEditTo(e.target.value)}
                                        /> </td>
                                        : <td onDoubleClick={_ => handleSetCoord(user.id, 'role')}>
                                            {capitalEveryWord(user.role)}
                                        </td>
                                    }
                                </tr>)}
                            </tbody>
                        </table>
                    : <p>No users to show</p>
                }
        </div>
    )
}