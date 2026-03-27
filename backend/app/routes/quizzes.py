from fastapi import APIRouter, HTTPException
from starlette import status

from app.models.models import Quiz, Student
from app.auth.dependencies import (
    db_dependency,
    user_dependency,
    credential_exception,
    permission_exception,
)
import app.schemas.quizzes as quizzes_schema

quizzes_router = APIRouter(prefix="/quizzes", tags=['quizzes'])

@quizzes_router.post('', status_code=status.HTTP_201_CREATED)
def add_quiz_record(payload: quizzes_schema.CreateQuizRequest, db: db_dependency, current_user: user_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {"teacher", "admin"}:
        raise permission_exception
    
    student = db.get(Student, payload.student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student ID does not exists."
        )
    
    # Check: If quiz already exists
    for quiz in student.quizzes:
        subject_exists = quiz.subject == payload.subject
        quarter_exists = quiz.quarter == payload.quarter
        quiz_num_exists = quiz.quiz_num == payload.quiz_num
        
        if subject_exists & quarter_exists & quiz_num_exists:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Quiz already exists."
            )
    
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
def update_quiz_score(id: str, payload: quizzes_schema.UpdateQuizRequest, db: db_dependency, current_user: user_dependency) -> None:
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {"teacher", "admin"}:
        raise credential_exception

    allowed = {'date', 'score', 'total_items', 'unit', 'topic'}
    details = payload.model_dump(exclude_unset=True)

    if details['score'] > details['total_items']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
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