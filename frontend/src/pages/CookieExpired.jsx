import { Link } from "react-router-dom"
import { queryClient } from "../lib/queryClient"

export default function CookieExpired() {
    return (
        <div className="session-cookie-expired">
            <h1>Session expired.</h1>
            <p>Login again to access.</p>

            <Link className="session-cookie-expired__login-again" 
                    to={'/login'}
                    onClick={_ => queryClient.clear()}
                >
                <h2>Login</h2>
            </Link>
        </div>
    )
}