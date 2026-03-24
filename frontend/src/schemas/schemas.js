import { z } from "zod"

const roles = ["admin", "teacher", "student"]

export const schemaStudentForm = z.object({
    student_id: z.string().trim().min(1),
    username: z.string().trim().min(1),
    email: z.email(),
    password: z.string().min(8),
    role: z.enum(roles),
});

export const schemaUserForm = z.object({
    username: z.string().trim().min(1),
    email: z.email(),
    password: z.string().min(8),
    role: z.enum(roles),
})

export const schemaTeacherForm = z.object({
    first_name: z.string().trim().min(1),
    last_name: z.string().trim().min(1),
    field_specialty: z.string().optional(),
    username: z.string().trim().min(1),
    email: z.email(),
    password: z.string().min(8),
    role: z.enum(roles),
})

export const schemaQuizForm = z.object({
    student_id: z.string().trim().min(1),
    date: z.string(),
    subject: z.string().trim().min(1),
    quiz_num: z.coerce.number().min(1),
    score: z.coerce.number(),
    total_items: z.coerce.number().min(5),
    quarter: z.coerce.number().min(1).max(4),
    unit: z.coerce.number().min(1).nullable(),
    topic: z.string().nullable(),
})

export const schemaEditQuizForm = z.object({
    id: z.string().trim().min(1),
    score: z.coerce.number().nullable(),
    total_items: z.coerce.number().min(5).nullable(),
    unit: z.coerce.number().min(1).nullable(),
    topic: z.string().nullable(),
    date: z.string().nullable(),
})

export const schemaNewStudentForm = z.object({
    first_name: z.string().trim().min(1),
    last_name: z.string().trim().min(1),
    grade_lvl: z.coerce.number().min(7).max(12),
})