import { useState, useMemo } from "react"
import { Link, Navigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { 
    removeStudents,
    capitalEveryWord,
    getAPI
} from '../services/studentsAPI'
import { hasPermision } from "../services/helperFunctions"
import { useAuth } from "../hooks/authQuery"

const attribs = ['last_name', 'first_name', 'id']
const rolesAllowed = ['teacher', 'admin']

export default function Students() {
    const user = useAuth()
    const queryClient = useQueryClient()

    const {data: students, isLoading, error } = useQuery({
        queryKey: ['students'],
        queryFn: () => getAPI('http://localhost:8000/students', {method: "GET"}),
        retry: false
    });
    
    const removeStudentsMutation = useMutation({
        mutationFn: removeStudents,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] })
        }
    })

    const [isRemoving, setIsRemoving] = useState(false)
    const [attribIdx, setAttribIdx] = useState(0)
    const [searchAttrib, setSearchAttrib] = useState(attribs[attribIdx])
    const [searchVal, setSearchVal] = useState('')

    const searchedStudent = useMemo( _ => {
        if (!students) return null;
        if (!searchVal) return null;
        
        return students.reduce((acc, student) => {
            if (`${student[searchAttrib]}`.startsWith(searchVal)) acc.push(student);
            return acc;
        }, [])
    }, [students, searchVal])

    // User Page Authorization
    if (user.isLoading) return <h1>Loading user data...</h1>
    if (user.isError) return <Navigate to={"/login"} />
    if (!hasPermision(user.data?.role, rolesAllowed)) return <Navigate to={"/no-permision"} />

    function toggleSearchAttrib() {
        setAttribIdx(prev => prev + 1);
        if (attribIdx == (attribs.length - 1)) setAttribIdx(0);
        setSearchAttrib(attribs[attribIdx])
    }

    function handlerRemoveStudent(student_id) {
        const student = students.find(student => student.id == student_id)
        const confirm = window.confirm(
            `Remove ${student.last_name}, ${student.first_name} (G-${student.grade_lvl}) from database?`
        )

        if (!confirm) return
        removeStudentsMutation.mutate(student_id)
    }

    if (isLoading) return <p>Loading students' data...</p>
    if (error) {
        console.log(error)
        return <Navigate to={'/not-found'} replace />
    }

    return (
        <div>
            <h1>List of Students</h1>
            
            {/* Student Search Bar and Buttons */}
            <div className="students-page__search-and-buttons">
                <form>
                    <label onClick={toggleSearchAttrib}
                        title="Click to toggle search."
                    >Search: </label>
                    <input type="text" 
                        title={`Search student`}
                        value={searchVal} 
                        onChange={e => setSearchVal(capitalEveryWord(e.target.value))} 
                        placeholder={capitalEveryWord(searchAttrib, '_')}
                        onKeyUp={e => {
                            if (e.key === 'Escape') setSearchVal('')
                        }}
                    />
                </form>
                
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
            
            {/* Search Result */}
            {(searchedStudent) && <ul>{
                    searchedStudent.map(student => <li key={student.id}>
                        <Link to={`/student-profile/${student.id}`}>
                            (G{student.grade_lvl}) {student.last_name} {student.first_name}
                        </Link>
                    </li>)
                }</ul>
            }
            
            {/* List of Students Table */}
            {(students.length >= 1)
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
