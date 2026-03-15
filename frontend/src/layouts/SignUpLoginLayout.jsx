import { NavLink, Outlet, useLocation } from "react-router-dom"

export default function SignUpLoginLayout() {
    const { pathname } = useLocation()
    const currentPath = pathname.split('/')[1]

    return (
        <div>
            <div className="login-signup-page">
                <NavLink to={"/login"} 
                    className={({ isActive }) => isActive ? "login-link active" : "login-link"}
                    > <h2>Login</h2>
                </NavLink>

                <NavLink to={"/signup"}
                    className={({ isActive }) => isActive ? "singup-link active" : "sign-up-link"}
                    > <h2>Sign Up</h2>
                </NavLink>
            </div>

            <Outlet />
        </div>
    )
}