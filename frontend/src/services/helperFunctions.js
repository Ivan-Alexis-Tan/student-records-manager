export function hasPermision(role, rolesAllowed = []) {
    return rolesAllowed.some(allowed => allowed === `${role}`)
}

export function getPrevUrl(path) {
    const splitted = path.split('/') ?? []
    return splitted.slice(1, splitted.length - 1).join('/')
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
]

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