from fastapi import APIRouter, HTTPException
from starlette import status

from app.models.models import Quiz
from app.auth.dependencies import (
    db_dependency,
    user_dependency,
    credential_exception,
    permission_exception,
)
from app.basemodels import UpdateQuiz, QuizModel

quizzes_router = APIRouter(prefix="/quizzes", tags=['quizzes'])

@quizzes_router.post('', status_code=status.HTTP_201_CREATED)
def add_quiz_record(payload: QuizModel, db: db_dependency, current_user: user_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {"teacher", "admin"}:
        raise permission_exception
    
    new_quiz = Quiz(**payload.model_dump())
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    return new_quiz


@quizzes_router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz(id: str, db: db_dependency, current_user: user_dependency) -> None:
    """
    - `id`
        - Student quiz id
        - `str` type
    """
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {"teacher", "admin"}:
        raise permission_exception
    
    quiz = db.get(Quiz, id)

    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Quiz not found."
        )
    
    db.delete(quiz)
    db.commit()

    return {"message": "Successfully deleted a quiz record."}


@quizzes_router.patch('/{id}', status_code=status.HTTP_200_OK)
def update_quiz_score(id: str, payload: UpdateQuiz, db: db_dependency, current_user: user_dependency) -> None:
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {"teacher", "admin"}:
        raise credential_exception

    allowed = {'date', 'score', 'total_items', 'unit', 'topic'}
    details = payload.model_dump(exclude_unset=True)

    if details['score'] > details['total_items']:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, 
            detail="Score must not be greater than highest possible score."
        )
    
    quiz = db.get(Quiz, id)
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found."
        )

    for col, val in details.items():
        if col in allowed:
            setattr(quiz, col, val)

    db.commit()
    db.refresh(quiz)
    return quiz