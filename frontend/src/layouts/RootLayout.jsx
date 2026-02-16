import { Outlet } from 'react-router-dom'

import NavigationLayout from './NavigationLayout'

export default function RootLayout() {
    return (
        <div>
            <NavigationLayout />
            <h1>Student Database</h1>
            <Outlet />
        </div>
    )
}