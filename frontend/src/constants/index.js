export const queryKeys = {
    //Regis Requests
    regisRequests: ['regisRequests'],


    // Users
    me: ['auth', "me"],
    users: ['users'],

    // Students
    students: ['students'],
    student: (studentId) => ['studentProfile', studentId],
    studentQuizzes: (studentId) => ['studentQuizzes', studentId],

    // Teachers
    teachers: ["teachers"],

    // Admin
    adminInitPageData: (adminId) => ['adminInitPageData', adminId],
}

export const subjects = [
    'Science', 
    "Math", 
    "English", 
    "Aral. Pan.", 
    "MAPEH",
    "Filipino",
    "ESP",
    "TLE",
].sort()