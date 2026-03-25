import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { schemaStudentForm, schemaTeacherForm, schemaUserForm } from "../schemas/schemas";
import { useMessage } from "./useMessage";
import { capitalEveryWord } from "../services/helperFunctions";

export function useRegistration({ regisType = 'admin', submitFn = () => null } = {}) {
    const { message, setMessage, messageStyles, resetMessage } = useMessage()
    const [confirmPassword, setConfirmPassword] = useState('')

    const forms = {
        admin: useForm({
            resolver: zodResolver(schemaUserForm),
            defaultValues: {role: 'admin'},
        }),
        teacher: useForm({
            resolver: zodResolver(schemaTeacherForm),
            defaultValues: {role: 'teacher'},
        }),
        student: useForm({
            resolver: zodResolver(schemaStudentForm),
            defaultValues: {role: 'student'}
        }),
    }

    /** @type {import('react-hook-form').UseFormReturn} */
    const activeForm = regisType ? forms[regisType] : forms.admin
    const errors = activeForm.formState.errors

    // Submit form Handler
    const handleSubmitRegis = activeForm.handleSubmit(data => {
        if (data.password !== confirmPassword) {
            setMessage({
                ok: false,
                header: "Error Submission",
                text: 'Confirmed password does not match.',
            })
            return
        }

        setMessage({
            ok: true,
            header: "Successfully Submitted",
            text: "Registration request sent.",
        })
        submitFn(data)
    })

    // Zod errors handler
    useEffect(() => {
        const errorFields = Object.keys(errors)
        
        if (errorFields.length >= 1) setMessage({
            ok: false,
            header: `Invalid ${capitalEveryWord(errorFields[0], "_")}`,
            text: errors[errorFields[0]].message,
        });
    }, [errors])

    return {
        regisForm: activeForm,
        handleSubmitRegis,
        errors,
        setConfirmPassword,
        messageState: { message, setMessage, resetMessage, messageStyles},
    }
}