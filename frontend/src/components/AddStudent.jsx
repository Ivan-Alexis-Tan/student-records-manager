import { useEffect, useState } from "react"
import { mutationCreateStudent } from "../hooks/mutateFuncs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod" 

import { schemaNewStudentForm } from "../schemas/schemas"
import { capitalEveryWord } from "../services/helperFunctions"
import { queryClient } from "../services/queryClient"
import { queryKeys } from "../services/queryKeys"
import { useMessage } from "../hooks/useMessage"

export default function AddStudent() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schemaNewStudentForm),
        defaultValues: { grade_lvl: 12 },
    })

    const { message, setMessage, messageStyles } = useMessage()
    
    const createStudent = mutationCreateStudent({
        ifSuccess: (response) => {
            const newStudent = response.data
            queryClient.invalidateQueries({queryKey: queryKeys.students });
            setMessage({
                ok: true,
                header: `Successfully added new student.`,
                text: `Successfully added ${newStudent.last_name}, ${newStudent.first_name}`,
            });
        },
        ifError: (error) => {
            const errMsg = error.data?.detail ?? null
            const contingency = error.data?.detail ?? "Something went wrong."

            setMessage({
                ok: false,
                header: `Failed to add new student`,
                text: errMsg[0]?.msg ?? contingency
            })
        },
    })

    const errorFields = Object.keys(errors)

    // Error message organizer
    useEffect(() => {
        if (errorFields.length == 0) return

        setMessage({
            ok: false,
            header: `Invalid ${capitalEveryWord(errorFields[0], '_')}`,
            text: errors[errorFields[0]]?.message,
        })
    }, [errors, errorFields.length])

    return (
        <div>
            <h1>Add Student</h1>
            
            {/* Message */}
            {(message.text) && (
                <div style={messageStyles}>
                    <p><strong>{message.header}</strong></p>
                    <p>{message.text}</p>
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
                <input type="number" min={7} max={12} {...register('grade_lvl')} />
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