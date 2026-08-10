import { useQuery } from "@tanstack/react-query"
import { Outlet, useParams, Link } from "react-router-dom"
import { useState } from "react"

import { getQuizzes } from "../api/students"
import { useAuth } from "../hooks/authQuery"
import { queryKeys } from "../constants/index"
import QuizzesDataTable, { useQuizTable } from "../hooks/useQuizEditor"

export default function QuizzesPage() {
    const params = useParams()
    const {data: user} = useAuth()
    const studentId = (user.role === "student") ? user.profile_id : params.id

    // Fetch Student's Quiz Records
    const quizRecord = useQuery({
        queryKey: queryKeys.studentQuizzes(studentId),
        queryFn: () => getQuizzes(studentId),
        select: (response) => {
            return {
                quizzes: response.data,
                permissions: response.permissions,
            }
        }
    })

    const { quizHookProps, editForm, submitEdit, deleteQuiz, message, messageStyles, resetMessage } = useQuizTable({
        studentId: studentId,
        onUpdateSuccess: _ => setEditId(''),
    })

    // Editing and Deleting Score
    const [isEditing, setIsEditing] = useState(null);
    const [editId, setEditId] = useState(null);

    // Web Page View IF loading or error
    if (quizRecord.isLoading) return <h2>Loading...</h2>
    if (quizRecord.error) return <h2>{quizRecord.error.message}</h2>

    const studentQuizRec = quizRecord.data?.quizzes ?? []
    const userPermissions = quizRecord.data?.permissions ?? []

    function handleKeyUp(e) {
        if (e.key === "Escape") setEditId(null);
        if (e.key == "Enter") submitEdit();
    }

    const quizData = studentQuizRec.filter( quiz => 
        quiz.quarter === Number(params.quarter) 
            && quiz.subject === params.subject
    ) ?? []

    return (
        <div>
            {/* New Quiz Record Creation */}
            {userPermissions.can_create && <div>
                <Link to="add-new-quiz-record" title="Add new quiz record"><h3>+ New Quiz Record</h3></Link>
                <Outlet context={{ studentQuizRec, userPermissions }} />
            </div>}
            <br />

            {/* Quiz Records Viewer */}
            <QuizzesDataTable 
                quizData={quizData} 
                quizHookProps={quizHookProps}
                userPermissions={userPermissions}
            />
        </div>
    )
}