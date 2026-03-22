import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import SearchData from "../components/SearchData"

import { mutationCreateStudentAcc } from "../hooks/mutateFuncs"
import { schemaStudentForm } from "../schemas/schemas"
import { api } from "../services/axiosAPI"
import { capitalEveryWord } from "../services/helperFunctions"
import { queryKeys } from "../services/queryKeys"

export default function CreateStudentAccountPage() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schemaStudentForm),
        defaultValues: { role: 'student' },
    })
    const { id } = useParams()

    const {data: students, isLoading: loadingStudents} = useQuery({
        queryKey: queryKeys.students,
        queryFn: () => api.get('/students').then(res => res.data),
    });

    const createAccMutation = mutationCreateStudentAcc({
        ifSuccess: () => setMessage({
            detail: `Successfully created ${selected.last_name}, ${selected.first_name}'s account.`, 
            ok: true
        }),
        ifError: (error) => setMessage({
            ok: false,
            detail: error.data.detail,
        }),
    })

    const [selected, setSelected] = useState(students?.find(student => student.id === id))
    const [message, setMessage] = useState({ok: false, detail: ""})
    const [confirmPassword, setConfirmPassword] = useState('')

    const errorFields = Object.keys(errors);
    const showConfirmPwError = (errorFields.length == 0) && message.detail

    // Student ID setter
    useEffect(() => {
        if (!selected) return
        
        setValue('student_id', selected.id)
        setValue('username', `${selected.first_name} ${selected.last_name}`)
    }, [selected])

    if (loadingStudents) return <h1>Loading Students...</h1>
    if (!students) return <h1>Failed to load data, please retry.</h1>

    function handleCreateAccount(data) {
        if (data.password !== confirmPassword) {
            setMessage({ok: false, detail: 'Confirm password does not match.'})
            return
        }
        createAccMutation.mutate(data)
    }
    
    return (
        <div>
            <h1>Create Student Account</h1>
            {showConfirmPwError && <p style={message.ok ? statusOkStyle : statusErrorStyle}><strong>{message.detail}</strong></p>}
            {errorFields.length >= 1 && (
                <div style={ statusErrorStyle }>
                    <h4>Invalid {capitalEveryWord(errorFields[0], '_')}</h4>
                    <p>{errors[errorFields[0]].message}</p>
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

const statusOkStyle = {
    color: "hsl(143, 100%, 60%)",
    textAlign: 'center',
}

const statusErrorStyle = {
    color: "hsl(0, 100%, 60%)",
    textAlign: 'center',
}
