export async function getAPI(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    })

    

    if (!res.ok) {
        const data = await res.json()
        const error = new Error(data.detail)

        console.log(`used getAPI`)
        console.log('status =', res.ok)
        console.log('detail =', data.detail)

        error.status = res.status
        error.detail = data.detail

        console.log(`error.status =`, error.status)
        console.log(`error.detail =`, error.detail)

        throw error
    };
    return res.json()
}

export async function fetchCurrentUser() {
    const res = await fetch("http://localhost:8000/auth/me", {
        method: "GET",
        credentials: "include",
    })

    if (!res.ok) {
        const data = await res.json()
        const error = new Error(data.detail)
        error.status = res.status
        console.log(`fetched the current user`)
        console.log(`error details =`, error)
        throw error
    };
    return res.json()
}

export async function submitLogin(loginDetails) {
    const refined = new URLSearchParams()
    refined.append("username", loginDetails.email)
    refined.append("password", loginDetails.password)

    const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        credentials: 'include',
        body: refined.toString(),
    })

    if (!res.ok) throw new Error(await res.text());
    return res.json()
}

export async function logoutUser() {
    const res = await fetch('http://localhost:8000/auth/logout', {
        method: "POST",
        credentials: "include"
    })

    if (!res.ok) throw new Error("Failed to logout user.");
    return 
}

export async function createStudent(student_info) {
    const res = await fetch('http://localhost:8000/students', 
        {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(student_info)
        }
    )

    if (!res.ok) throw new Error('Adding new student failed.');
    return res.json()
}

export async function removeStudents(student_id) {
    const res = await fetch(`http://localhost:8000/students/${student_id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) throw new Error('Removing student failed.');
    return res.json()
}

export async function findStudent(id) {
    const res = await fetch(`http://localhost:8000/students/${id}`, {
        method: "GET",
        credentials: "include",
    })
    if (!res.ok) throw new Error(`${searchVal} not found.`);
    return res.json()
}

export async function getStudentSelfDetails() {
    const res = await fetch('http://localhost:8000/me/students', {
        method: "GET",
        credentials: "include"
    })

    if (!res.ok) throw new Error(await res.text());
    return res.json()
}

export async function getQuizes(studentId) {
    const res = await fetch(`http://localhost:8000/students/${studentId}/quizzes`, {
        method: "GET",
        credentials: "include"
    });
    
    if (!res.ok) return null
    return await res.json()
}

export async function updateQuizScore(payload) {
    const submitted = {
        date: payload.date,
        score: payload.score,
        total_items: payload.total_items,
        unit: payload.unit,
        topic: payload.topic,
    }
    const res = await fetch(`http://localhost:8000/quizzes/${payload.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify((payload.id, submitted))
    })

    if (!res.ok) throw new Error(res.text())
    return await res.json()
}

export async function createQuizRecord(payload) {
    console.log(`payload =`, payload)
    const res = await fetch(`http://localhost:8000/quizzes`, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await res.text())
    return await res.json()
}

export async function deleteQuiz(quizId) {
    const res = await fetch(`http://localhost:8000/quizzes/${quizId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify(quizId)
    })

    if (!res.ok) throw new Error(res.text());
    return await res.json()
}

export async function createStudentAccount(reqDetails) {
    const new_user = {
        username: reqDetails.username,
        email: reqDetails.email,
        role: reqDetails.role,
        password: reqDetails.password,
        student_id: reqDetails.studentId
    }
    
    const res = await fetch(`http://localhost:8000/auth/user?email=${new_user.email}&role=${new_user.role}`, {
        method: "POST",
        credentials: "include",
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify(new_user)
    })

    if (!res.ok) throw new Error(await res.text());
    return res.json()
}

export async function createTeacherAccount(reqDetails) {
    const res = await fetch(`http://localhost:8000/teachers`, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(reqDetails)
    })

    if (!res.ok) throw new Error(await res.text());
    return res.json()
}

export async function deleteUserAccount(id) {
    const res = await fetch(`http://localhost:8000/user/${id}`, {
        method: "DELETE",
        credentials: 'include',
    })

    if (!res.ok) throw new Error(await res.text());
    return res.json()
}

export function capitalEveryWord(str, sep = ' ') {
    const strings = `${str}`.split(sep)
    const altered = strings.map(str => str.charAt(0).toUpperCase() + str.slice(1))
    return altered.join(' ')
}

export function userHomeUrl(userObj) {
    if (`${userObj.role}`.toLowerCase() === "student") {
        return `${userObj.role}/${userObj.id}`
    }

    return `${userObj.role}/home`
}