import { Link } from "react-router-dom"

export default function NotFoundPage() {
    return (
        <div>
            <h1>404 Page not found</h1>
            <p>{`Oh no! Something went wrong. =(`}</p>
            <Link to={'/login'}>Back to home</Link>
        </div>
    )
}