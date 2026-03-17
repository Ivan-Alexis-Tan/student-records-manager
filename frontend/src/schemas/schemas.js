import { z } from "zod"

export const schemaStudentForm = z.object({
    student_id: z.string().trim().min(1),
    username: z.string().trim().min(1),
    email: z.email(),
    password: z.string().min(8),
});

export const schemaUserForm = z.object({
    username: z.string().trim().min(1),
    email: z.email(),
    password: z.string().min(8),
})

export const schemaTeacherForm = z.object({
    first_name: z.string().trim().min(1),
    last_name: z.string().trim().min(1),
    field_specialty: z.string().optional(),
    username: z.string().trim().min(1),
    email: z.email(),
    password: z.string().min(8),
    role: z.enum(["admin", "teacher", "student"]),
})