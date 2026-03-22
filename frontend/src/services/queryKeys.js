export const queryKeys = {
    // Users
    me: ['auth', "me"],
    users: ['users'],

    // Students
    students: ['students'],
    student: (studentId) => ['studentProfile', studentId],
    studentQuizzes: (studentId) => ['studentQuizzes', studentId],

    // Teachers
    teachers: ["teachers"],

    //Regis Requests
    regisRequests: ['regisRequests'],
}