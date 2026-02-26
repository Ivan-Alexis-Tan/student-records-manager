import { Link } from "react-router-dom"

import { useAuth } from "../hooks/authQuery"

export default function NoPermision() {
    const {data: user, isLoading} = useAuth()    

    if (isLoading) return <h1>Loading...</h1>

    return (
        <div className="no-permission">
            <h1>Not Enough Permission</h1>
            <Link to={`/`} className="no-permission__link-home">Home</Link>
        </div>
    )
}