import { Link } from "react-router-dom"

export default function NoPermision() {
    return (
        <div className="no-permission">
            <h1>Not Enough Permission</h1>
            <Link to={`/`} className="no-permission__link-home">Home</Link>
        </div>
    )
}