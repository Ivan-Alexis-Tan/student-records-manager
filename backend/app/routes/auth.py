# `/register`, `/login`
# /routes/users.py  -> `/me`

from fastapi import Depends, HTTPException, APIRouter, Response
from fastapi.security import OAuth2PasswordRequestForm
from starlette import status
from typing import Annotated

from app.db import db_dependency
from app.models.models import User, Student, Teacher
from app.schemas.auth import UserResponse, RegisterRequest
from app.auth.dependencies import get_user_by_username, authenticate_user, user_dependency
from app.auth.auth import hash_password, create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["auth"])

COOKIE_KWARGS = dict(
    httponly=True,
    secure=False,
    samesite='lax'
)

credential_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Failed to authorize user."
)

@router.get("/me", response_model=UserResponse)
def me(current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    is_student = db.query(Student).filter(Student.user_id == current_user.id).first()
    is_teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()

    for role in [is_student, is_teacher]:
        if role:
            user_profile_id = role.id
            break
        else:
            user_profile_id = None
    
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        role=current_user.role,
        profile_id=user_profile_id
    )


@router.post("/register", response_model=UserResponse, status_code=201)
def register(payload: RegisterRequest, db: db_dependency):
    existing = get_user_by_username(db, payload.username)

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Username already taken."
        )
    
    user = User(
        username=payload.username,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        role=user.role
    )


@router.post("/login")
async def login(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
    db: db_dependency
):
    """
    IMPORTANT:
    OAuth2PasswordRequestForm expects:
    - username
    - password
    sent as form-data (not JSON)
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        raise credential_exception

    token = create_access_token(user=user)
    response.set_cookie(
        key="access_token",
        value=token,
        **COOKIE_KWARGS,
    )

    return {"message": "Successfully logged-in."}


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(respose: Response):
    respose.delete_cookie(
        key="access_token",
        **COOKIE_KWARGS,
    )