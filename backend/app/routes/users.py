from fastapi import HTTPException, APIRouter
from starlette import status

import app.models.models as models

from app.auth.dependencies import (
    user_dependency,
    db_dependency,
    credential_exception, 
    permission_exception,
)
from app.auth.auth import hash_password
from app.schemas.auth import CreateUserRequest, CreateAdminRequest

users_router = APIRouter(prefix='/users', tags=['users'])

# API Endpoints
@users_router.get("")
def get_users(current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role != 'admin':
        raise permission_exception

    return db.query(models.User).all()


@users_router.post('', status_code=status.HTTP_201_CREATED)
def create_user(payload: CreateUserRequest, current_user: user_dependency, db: db_dependency):

    if not current_user:
        raise credential_exception
    
    if db.query(models.User).filter(models.User.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists."
        )
    
    student = db.query(models.Student).filter(models.Student.id == payload.student_id).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student does not exists."
        )
    
    student.user = models.User(
        username = payload.username,
        email = payload.email,
        hashed_password = hash_password(payload.password),
        role = payload.role
    )

    db.add(student.user)
    db.commit()
    db.refresh(student)

    return {"message": "Successfully created new user account."}


@users_router.post("/admin", status_code=status.HTTP_201_CREATED)
def create_admin(payload: CreateAdminRequest, db: db_dependency):
    if payload.password != payload.confirm_pw:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Password does not match."
        )

    user = models.User(
        username = payload.username,
        email = payload.email,
        hashed_password = hash_password(payload.password),
        role = payload.role
    )

    db.add(user)
    db.commit()

    return {"message": "Successfully created a new admin."}


@users_router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
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