import { useState, useMemo, useEffect } from "react"
import { Link, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { capitalEveryWord } from "../services/helperFunctions"
import { api } from "../services/axiosAPI"
import { mutationRemoveStudents } from "../hooks/mutateFuncs"

const attribs = ['last_name', 'first_name', 'id']

export default function Students() {
    const {data: students, isLoading} = useQuery({
        queryKey: ['students'],
        queryFn: () => api.get('/students').then(res => res.data),
    });
    
    const removeStudents = mutationRemoveStudents()

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

    useEffect(() => {
        setSearchAttrib(attribs[attribIdx % attribs.length])
    }, [attribIdx])

    if (isLoading) return <h1>Loading students' data...</h1>
    if (!students) return <Navigate to={'/not-found'} replace />

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
                <form>
                    <label onClick={_ => setAttribIdx(prev => prev + 1)}
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
