import { Link, Outlet, useParams} from 'react-router-dom'

import { subjects } from "../utils/helperFunctions"

export default function QuizzesViewLayout() {
    const { quarter, subject} = useParams()

    return (
        <div>
            <h1>Quizzes</h1>

            <div className='quiz-nav__quarter-nav' style={quarterNavStyles}>
                {[1, 2, 3, 4].map(num => <Link key={num} to={`${num}/${subject}`}>Quarter {num}</Link>)}
            </div>

            <div className='quiz-nav__subject-nav' style={subjectNavStyles}>
                {subjects.map(subj => <Link key={subj} to={`${quarter}/${subj}`}>{subj}</Link>)}
            </div>

            <h2>Q{quarter}, {subject}</h2>
            <Outlet />
        </div>
    )
}

const quarterNavStyles = {
    display: 'flex',
    gap: '2em',
}

const subjectNavStyles = {
    display: 'flex',
    gap: '1.5em'
}