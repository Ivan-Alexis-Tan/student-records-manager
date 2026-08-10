import { Link, Outlet, useParams} from 'react-router-dom'

import { subjects } from "../constants/index"

export default function QuizzesViewLayout() {
    const { quarter, subject} = useParams()

    return (
        <div>
            <h1>Quizzes</h1>

            <h2 style={{ textAlign: "center" }}>Q{quarter} &ndash; {subject}</h2>

            <div className='quiz-nav'>
                <div className='quiz-quarter-nav' >
                    <span>Quarter:</span>

                    <div>
                        {[1, 2, 3, 4].map(num => (
                            <Link key={num} 
                                to={`${num}/${subject}`}
                                className={quarter === String(num) ? "isActive" : ""}
                            >
                                {num}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className='quiz-subject-nav' >
                    <span>Subject:</span>
                    
                    <div>
                        {subjects.map(subj => (
                            <Link key={subj} 
                                to={`${quarter}/${subj}`}
                                className={subject === subj ? "isActive" : ""}
                            >
                                {subj}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <Outlet />
        </div>
    )
}