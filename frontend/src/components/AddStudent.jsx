import { useEffect, useState } from "react"
import { mutationCreateStudent } from "../hooks/mutateFuncs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod" 

import { schemaNewStudentForm } from "../schemas/schemas"
import { capitalEveryWord } from "../services/helperFunctions"
import { queryClient } from "../services/queryClient"

const messageDefault = {text: "", ok: false}

export default function AddStudent() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schemaNewStudentForm),
        defaultValues: { grade_lvl: 12 },
    })

    const [message, setMessage] = useState(messageDefault)
    
    const createStudent = mutationCreateStudent({
        ifSuccess: (response) => {
            const newStudent = response.data
            queryClient.invalidateQueries({queryKey: ['students']});
            setMessage({
                ok: true,
                text: `Successfully added ${newStudent.last_name}, ${newStudent.first_name}`,
            });
        },
        ifError: (error) => {
            const errMsg = error.data?.detail ?? null
            const contingency = error.data?.detail ?? "Something went wrong."

            setMessage({
                ok: false,
                text: errMsg[0]?.msg ?? contingency
            })
        },
    })

    const errorFields = Object.keys(errors)
    const messageStyle = (message.ok 
        ? {color: 'hsl(113, 100%, 50%)', textAlign: 'center'}
        : {color: 'hsl(9, 100%, 69%)', textAlign: 'center'}
    )

    // Error message organizer
    useEffect(() => {
        if (errorFields.length == 0) return

        setMessage(messageDefault)
    }, [errors, errorFields])

    return (
        <div>
            <h1>Add Student</h1>
            {message.text && <p style={messageStyle}><strong>{message.text}</strong></p>}
            
            {/* Zod Error Message */}
            {(errorFields.length !== 0) && (
                <div style={{color: "hsl(9, 100%, 69%)", textAlign: 'center'}}>
                    <p><strong>Invalid {capitalEveryWord(errorFields[0], '_')}</strong></p>
                    <p>{errors[errorFields[0]]?.message}</p>
                </div>
            )}

            <form onSubmit={ handleSubmit(
                (data) => createStudent.mutate(data)
                )}>
                <input type="text" placeholder="First Name" {...register('first_name')} />
                <br />

                <input type="text" placeholder="Last Name" {...register('last_name')} />
                <br />
                
                <label>Grade: </label>
                <input type="number" {...register('grade_lvl')} />
                <br />

                <button type="submit" title="Add new student">Add New Student</button>
            </form>
        </div>
    )
}

function capitalizeStr(str) {
    const strings = `${str}`.split(' ')
    const altered = strings.map(str => str.charAt(0).toUpperCase() + str.slice(1))
    return altered.join(' ')
}