import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import SearchData from "../components/SearchData"

import { mutationCreateStudentAcc } from "../hooks/mutateFuncs"
import { schemaStudentForm } from "../schemas/schemas"
import { api } from "../api/axiosAPI"
import { capitalEveryWord } from "../utils/helperFunctions"
import { queryKeys } from "../constants/index"
import { useMessage } from "../hooks/useMessage"

export default function CreateStudentAccountPage() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schemaStudentForm),
        defaultValues: { role: 'student' },
    })

    const { id } = useParams()
    const { message, setMessage, messageStyles } = useMessage()

    const {data: students, isLoading: loadingStudents} = useQuery({
        queryKey: queryKeys.students,
        queryFn: () => api.get('/students').then(res => res.data),
    });

    const createAccMutation = mutationCreateStudentAcc({
        ifSuccess: () => {
            setMessage({
                ok: true,
                header: `Successfully Created`,
                text: `Successfully created ${selected.last_name}, ${selected.first_name}'s account.`,
            })
        },
        ifError: (error) => {
            setMessage({
                ok: false,
                header: `Failed to Create`,
                text: error?.data?.detail,
            })
        },
    })

    const [selected, setSelected] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const errorFields = Object.keys(errors);

    useEffect(() => {
        const toSelect = students?.find(student => student.id === id)
        
        if (!toSelect) return
        setSelected(toSelect)
    }, [students])

    // Student ID setter
    useEffect(() => {
        if (!selected) return
        
        setValue('student_id', selected.id)
        setValue('username', `${selected.first_name} ${selected.last_name}`)
    }, [selected])

    // Zod Message organizer
    useEffect(() => {
        if (errorFields.length == 0) return

        setMessage({
            ok: false,
            header: `Invalid ${capitalEveryWord(errorFields[0], '_')}`,
            text: errors[errorFields[0]]?.message,
        })
    }, [errors, errorFields.length])

    if (loadingStudents) return <h1>Loading Students...</h1>
    if (!students) return <h1>Failed to load data, please retry.</h1>

    function handleCreateAccount(data) {
        if (data.password !== confirmPassword) {
            setMessage({
                ok: false,
                header: `Failed to Submit`, 
                text: 'Confirm password does not match.'
            })
            return
        }
        createAccMutation.mutate(data)
    }
    
    return (
        <div>
            <h1>Create Student Account</h1>
            {message.text && (
                <div style={ messageStyles }>
                    <h4>{message.header}</h4>
                    <p>{message.text}</p>
                </div>
            )}

            {!id && <SearchData setStateFn={setSelected} data={students ?? []} searchLabel="Create for: " />}
            <br />

            <form onSubmit={ handleSubmit(handleCreateAccount) } style={{ textAlign: 'center' }}>
                <input type="text" placeholder="Username" {...register("username")} />
                <br />

                <input type="email" placeholder="Email" {...register('email')} />
                <br />

                <input type="password" placeholder="Password" {...register("password")} />
                <br />

                <input type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                <br />

                <button type="submit">Create Account</button>
            </form>
        </div>
    )
}