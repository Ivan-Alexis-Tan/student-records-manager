from fastapi import HTTPException, APIRouter
from starlette import status

import app.models.models as models

from app.auth.dependencies import (
    user_dependency, 
    credential_exception, 
    permission_exception,
)
from app.db import db_dependency
from app.models.models import Quiz
from app.basemodels import QuizModel, UpdateQuiz


router = APIRouter()

# API Endpoints
@router.get("/users")
def get_users(current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role != 'admin':
        raise permission_exception

    return db.query(models.User).all()


@router.patch('/quizzes/{id}', status_code=status.HTTP_200_OK)
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


@router.post('/quizzes', status_code=status.HTTP_201_CREATED)
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


@router.delete('/quizzes/{id}', status_code=status.HTTP_204_NO_CONTENT)
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


@router.delete('/user/{id}', status_code=status.HTTP_204_NO_CONTENT)
def remove_user(id: str, db: db_dependency, current_user: user_dependency):
    if current_user.role != "admin":
        raise credential_exception
    
    user = db.get(models.User, id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Account does not exists.'
        )

    db.delete(user)
    db.commit()

    