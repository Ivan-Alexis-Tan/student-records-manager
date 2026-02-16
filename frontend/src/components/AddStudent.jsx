import { useState } from "react"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createStudent } from '../services/studentsAPI'

export default function AddStudent() {
    const queryClient = useQueryClient();
    const createStudentMutation = useMutation({
        mutationFn: createStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['students']})
        },
    })

    const defaultStudent = {first_name: 'First Name', last_name: 'Last Name', grade_lvl: 12}
    
    const [newStudent, setNewStudent] = useState(
        {id: crypto.randomUUID(), ...defaultStudent}
    )
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    
    function addStudent() {
        const isDeafult = [
            newStudent.first_name === defaultStudent.first_name,
            newStudent.last_name === defaultStudent.last_name,
        ].some(check => check === true)

        if (isDeafult) {
            setError('ERROR: Student details must not be the default values.')
            return null;
        }

        setError('')
        createStudentMutation.mutate(newStudent)

        setMessage(`Successfully added ${newStudent.last_name}, ${newStudent.first_name}`)
        setNewStudent(defaultStudent)
    }

    function test() {
        console.log({...newStudent, id: crypto.randomUUID()})
        const checked = [
            newStudent.first_name === defaultStudent.first_name,
            newStudent.last_name === defaultStudent.last_name,
            newStudent.grade_lvl === defaultStudent.grade_lvl
        ]
        console.log(checked)
        console.log(`checking =`, checked.every(check => check === true))
        console.log(capitalizeStr('all things'))
    }

    return (
        <div>
            <h1>Add Student</h1>
            {error && <h2>{error}</h2>}
            {message && <p><strong>{message}</strong></p>}
            <form>
                <input 
                    type="text" 
                    value={newStudent.first_name} 
                    onChange={e => setNewStudent(prev => ({
                        ...prev, 
                        first_name: capitalizeStr(e.target.value),
                        id: crypto.randomUUID()
                    }))}
                    placeholder="First Name"
                />
                <br />
                
                <input 
                    type="text" 
                    value={newStudent.last_name} 
                    onChange={e => setNewStudent(prev => ({
                        ...prev, 
                        last_name: capitalizeStr(e.target.value),
                        id: crypto.randomUUID()
                    }))} 
                    placeholder="Last Name"
                />
                <br />

                <label>Grade: </label>
                <input 
                    type="number" 
                    value={newStudent.grade_lvl} 
                    onChange={e => setNewStudent(prev => ({
                        ...prev, 
                        grade_lvl: Number(e.target.value)
                    }))} 
                    min={7} max={12}
                    placeholder="12"
                />
                <br />
            </form>
            <br />

            <button onClick={addStudent}>Add new student</button>
        </div>
    )
}

function capitalizeStr(str) {
    const strings = `${str}`.split(' ')
    const altered = strings.map(str => str.charAt(0).toUpperCase() + str.slice(1))
    return altered.join(' ')
}