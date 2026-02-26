# get_current_user

from fastapi import HTTPException, Depends, Request
from sqlalchemy.orm import Session
from typing import Optional, Annotated
from starlette import status
from jose import jwt, JWTError
from datetime import datetime, timezone

from app.db import db_dependency
import app.models.models as models
from app.auth.auth import verify_password, decode_access_token, SECRET_KEY, ALGORITHM

credential_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Failed to validate credentials."
)

permission_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Not enough permission."
)

def get_user_by_username(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def authenticate_user(db: Session, email: str, password: str) -> models.User:
    user = get_user_by_username(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    
    return user


def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp = payload.get('exp')

        is_expired = datetime.fromtimestamp(exp, tz=timezone.utc) < datetime.now(tz=timezone.utc)

        if is_expired:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="TOKEN_EXPIRED"
            )

        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="INVALID_TOKEN"
        )


async def get_current_user(
    request: Request,
    db: db_dependency,
) -> models.User:
    try:
        token = request.cookies.get('access_token')
        if not token:
            raise credential_exception

        payload = decode_token(token)
        user_id = payload.get("user_id")

        if user_id is None:
            raise credential_exception
        
    except JWTError:
        raise credential_exception
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise credential_exception
    
    return user


user_dependency = Annotated[models.User, Depends(get_current_user)]

def usual_permissions(role: str) -> dict:
    if role == "student":
        return {
            "can_create": False,
            "can_read": True,
            "can_update": False,
            "can_delete": False, 
        }
    if role == "teacher":
        return {
            "can_create": True,
            "can_read": True,
            "can_update": True,
            "can_delete": True, 
        }
    if role == "admin":
        return {
            "can_create": True,
            "can_read": True,
            "can_update": True,
            "can_delete": True, 
        }