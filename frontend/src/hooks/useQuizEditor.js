import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { mutationDeleteQuiz, mutationUpdateScore } from "./mutateFuncs";
import { queryClient } from "../services/queryClient";
import { queryKeys } from "../services/queryKeys";
import { schemaEditQuizForm } from "../schemas/schemas";
import { useMessage } from "./useMessage";
import { capitalEveryWord } from "../services/helperFunctions";

export function useQuizEditor({ studentId = '', onUpdateSuccess = () => null } = {}) {
    const {message, setMessage, messageStyles, resetMessage} = useMessage()

    const { 
        register, 
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ resolver: zodResolver(schemaEditQuizForm) });

    const updateMutation = mutationUpdateScore({
        ifSuccess: (response) => {
            const data = response.data
            queryClient.invalidateQueries({queryKey: queryKeys.studentQuizzes(studentId)})
            setMessage({
                ok: true,
                header: "Successfully Edited",
                text: `Edited: ${data.subject} Quiz ${data.quiz_num}`
            })
            onUpdateSuccess()
        },
        ifError: (error) => {
            const errorDetail = error?.data?.detail ?? "Something wrong happened"
            setMessage({
                ok: false,
                header: "Failed to Edit",
                text: errorDetail,
            })
        },
    });

    const submitEdit = handleSubmit((data) => {
        console.log(`data =`, data)
        updateMutation.mutate(data)
    });

    const deleteMutation = mutationDeleteQuiz({
        ifSuccess: () => {
            queryClient.invalidateQueries({queryKey: queryKeys.studentQuizzes(studentId)})
        },
        ifError: (error) => {
            console.error(error?.data?.detail ?? "Something wrong happened")
        }
    });

    function deleteQuiz(quizId) {
        deleteMutation.mutate(quizId)
    }

    // Zod error message manager
    useEffect(() => {
        const errorFields = Object.keys(errors)

        if (errorFields.length == 0) return
        console.error(`Invalid ${capitalEveryWord(errorFields[0], "_")}:`,errors[errorFields[0]]?.message)
        setMessage({
            ok: false,
            header: `Invalid ${capitalEveryWord(errorFields[0], '_')}`,
            text: errors[errorFields[0]]?.message,
        })
    }, [errors])

    return { 
        editForm: { register, reset }, 
        submitEdit, 
        deleteQuiz, 
        message,
        setMessage,
        messageStyles,
        resetMessage,
    }
}