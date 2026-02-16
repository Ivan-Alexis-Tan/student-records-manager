import { Link } from "react-router-dom"

export default function NotFoundPage(message) {
    return (
        <div>
            <h1>{message ?? `Oh no! Something went wrong. =(`}</h1>
            <Link to={'/'}>Back to home</Link>
        </div>
    )
}