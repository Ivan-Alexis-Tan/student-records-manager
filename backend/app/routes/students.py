from fastapi import APIRouter, HTTPException
from starlette import status

from app.auth.dependencies import (
    user_dependency, 
    db_dependency, 
    credential_exception, 
    permission_exception,
    usual_permissions,
)
from app.models.models import Student, Quiz
from app.basemodels import NewStudent

student_router = APIRouter(tags=['students'])

@student_router.get('/students')
def get_students(current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {'teacher', 'admin'}:
        raise permission_exception
    
    students = db.query(Student).all()
    
    return students


@student_router.post('/students', status_code=status.HTTP_201_CREATED)
def add_student(student: NewStudent, current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {'teacher', 'admin'}:
        raise permission_exception
    
    new_student = Student(**student.model_dump())
    db.add(new_student)
    db.commit()
    return student


@student_router.delete('/students/{id}', status_code=status.HTTP_204_NO_CONTENT)
def remove_student(id: str, db: db_dependency, current_user: user_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {"teacher", "admin"}:
        raise permission_exception
    
    student = db.query(Student).get(id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Student does not exists.'
        )

    db.delete(student)
    db.commit()


@student_router.get('/students/{id}')
def get_student_details(id: str, db: db_dependency, current_user: user_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {'teacher', 'admin'}:
        raise credential_exception

    return db.get(Student, id)


@student_router.get("/students/{id}/quizzes")
def get_student_quizzes(id: str, db: db_dependency, current_user: user_dependency):
    if not current_user:
        raise credential_exception

    if current_user.role == "student":
        id = current_user.student_profile.id
    elif current_user.role not in {'teacher', 'admin'}:
        raise permission_exception

    return {
        "data": db.query(Quiz).filter(Quiz.student_id == id).all(), 
        "permissions": usual_permissions(current_user.role)
    }