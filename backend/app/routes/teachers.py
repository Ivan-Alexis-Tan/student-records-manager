from fastapi import APIRouter, HTTPException
from starlette import status

from app.auth.dependencies import (
    user_dependency,
    db_dependency,
    credential_exception,
    permission_exception,
)
from app.auth.auth import hash_password
from app.models.models import Teacher, User
from app.schemas.auth import CreateTeacherRequest

teachers_router = APIRouter(prefix='/teachers', tags=['teachers'])

@teachers_router.get("")
def get_teachers(current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {'teacher', 'admin'}:
        raise permission_exception

    return db.query(Teacher).all()


@teachers_router.post("", status_code=status.HTTP_201_CREATED)
def create_teacher(teacher: CreateTeacherRequest, db: db_dependency, current_user: user_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {"teacher", "admin"}:
        raise permission_exception

    user = db.query(User).filter(User.email == teacher.email).first()

    if user:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"User already exists."
        )

    new_user = User(
        username = f"{teacher.first_name.capitalize()} {teacher.last_name.capitalize()}",
        email = teacher.email,
        hashed_password = hash_password(teacher.password),
        role = "teacher",
    )
    db.add(new_user)
    db.flush()

    new_teacher = Teacher(
        first_name = teacher.first_name.capitalize(),
        last_name = teacher.last_name.capitalize(),
        field_specialty = teacher.field_specialty,
        user_id = new_user.id
    )
    
    db.add(new_teacher)
    db.commit()
    
    return {
        "teacher": new_teacher, 
        "user": {
            "username": new_user.username,
            "email": new_user.email,
            "role": new_user.role
        }
    }


@teachers_router.delete('/{id}')
def remove_teacher(id: str, current_user: user_dependency, db: db_dependency):
    if current_user.role != "admin":
        raise credential_exception
    
    teacher = db.get(Teacher, id)

    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Teacher does not exists.'
        )

    teacher_acc = db.get(User, teacher.user_id)
    db.delete(teacher_acc)
    db.commit()