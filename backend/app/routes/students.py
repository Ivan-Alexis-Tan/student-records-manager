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
from app.schemas.students import NewStudentRequest, NewStudentResponse

student_router = APIRouter(prefix="/students", tags=['students'])

@student_router.get('')
def get_students(current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {'teacher', 'admin'}:
        raise permission_exception
    
    students = db.query(Student).all()
    
    return students


@student_router.get('/{id}')
def get_student_details(id: str, db: db_dependency, current_user: user_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {'teacher', 'admin'}:
        raise credential_exception

    return db.get(Student, id)


@student_router.get("/{id}/quizzes")
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


@student_router.post('', status_code=status.HTTP_201_CREATED, response_model=NewStudentResponse)
def add_student(student: NewStudentRequest, current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {'teacher', 'admin'}:
        raise permission_exception
    
    already_exists = db.query(Student).filter(
        Student.first_name == student.first_name, 
        Student.last_name == student.last_name,
        Student.grade_lvl == student.grade_lvl,
    ).first()

    if already_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student already exists."
        )
    
    new_student = Student(**student.model_dump())
    db.add(new_student)
    db.commit()
    return new_student


@student_router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
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