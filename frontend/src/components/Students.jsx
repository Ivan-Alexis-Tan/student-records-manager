import { useState, useEffect } from "react"
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import SearchData from "./SearchData"

import { api } from "../api/axiosAPI"
import { mutationRemoveStudents } from "../hooks/mutateFuncs"
import { queryKeys } from "../lib/queryKeys"
import { queryClient } from "../lib/queryClient"

export default function Students() {
    const {data: students, isLoading, error} = useQuery({
        queryKey: queryKeys.students,
        queryFn: () => api.get('/students').then(res => res.data),
    });
    const navigate = useNavigate()
    const removeStudents = mutationRemoveStudents({
        ifSuccess: () => {
            queryClient.invalidateQueries({queryKey: queryKeys.students});
        }
    })

    const [isRemoving, setIsRemoving] = useState(false)
    const [searchedStudent, setSearchedStudent] = useState({})

    useEffect(() => {
        if (!searchedStudent.id) return;

        navigate(`/student-profile/${searchedStudent.id}`, {replace: true})
    }, [searchedStudent])

    if (isLoading) return <h1>Loading students' data...</h1>
    if (!students || error) return <Navigate to={'/not-found'} replace />

    function handlerRemoveStudent(student_id) {
        const student = students.find(student => student.id == student_id)
        const confirm = window.confirm(
            `Removing ${student.last_name}, ${student.first_name} (G-${student.grade_lvl}) also removes all records including his/her quizzes. Confirm delete?`
        )

        if (!confirm) return
        removeStudents.mutate(student_id)
    }

    return (
        <div>
            <h1>List of Students</h1>
            
            {/* Student Search Bar and Buttons */}
            <div className="students-page__search-and-buttons">
                <SearchData setStateFn={setSearchedStudent} data={students} />
                
                <div>
                    <Link to={'/add_student'}><button title="Add student">➕</button></Link>
                    {isRemoving 
                        ? <button 
                            title="Cancel"
                            onClick={_ => setIsRemoving(false)}
                        >❌</button> 
                        : <button
                            title="Remove student" 
                            onClick={_ => setIsRemoving(true)}
                        >🗑️</button>
                    }
                </div>
            </div>
            
            {/* List of Students Table */}
            {(students?.length >= 1)
                ? <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Last Name</th>
                            <th>First Name</th>
                            <th>Grade Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => <tr key={student.id}>
                            <td>
                                {isRemoving && <button title={`Remove ${student.last_name}, ${student.first_name}`}
                                    onClick={_ => handlerRemoveStudent(student.id)}
                                >🗑️</button>} 
                                <Link to={`/student-profile/${student.id}`}>{student.id}</Link>
                            </td>
                            <td><Link to={`/student-profile/${student.id}`}>{student.last_name}</Link></td>
                            <td><Link to={`/student-profile/${student.id}`}>{student.first_name}</Link></td>
                            <td><Link to={`/student-profile/${student.id}`}>{student.grade_lvl}</Link></td>
                        </tr>)}
                    </tbody>
                </table>
                : <p>No student record to show.</p>
            }
        </div>
    )
}
