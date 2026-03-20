from fastapi import HTTPException, APIRouter, Response
from starlette import status

import app.models.models as models

from app.auth.dependencies import (
    user_dependency,
    db_dependency,
    credential_exception, 
    permission_exception,
    authenticate_user,
)
from app.auth.auth import hash_password, create_access_token
from app.routes.auth import COOKIE_KWARGS
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
            detail="Email already taken."
        )
    
    student = db.query(models.Student).filter(models.Student.id == payload.student_id).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student does not exists."
        )

    if student.user_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student already have an account."
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
def create_first_admin(payload: CreateAdminRequest, response: Response, db: db_dependency):
    hasAdmin = db.query(models.User).filter(models.User.role == 'admin').first()

    if hasAdmin:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='Already has an admin.'
        )

    user = models.User(
        username = payload.username,
        email = payload.email,
        hashed_password = hash_password(payload.password),
        role = payload.role
    )
    db.add(user)
    db.commit()

    token = create_access_token(user=user)
    response.set_cookie(
        key="access_token",
        value=token,
        **COOKIE_KWARGS,
    )

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