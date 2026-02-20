import { Link } from "react-router-dom"

export default function NotFoundPage() {
    return (
        <div>
            <h1>404 Not Found</h1>
            <p>{`Oh no! Something went wrong. =(`}</p>
            <Link to={'/login'}>Back to home</Link>
        </div>
    )
}