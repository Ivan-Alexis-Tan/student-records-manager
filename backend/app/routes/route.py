from fastapi import HTTPException, APIRouter
from starlette import status

import app.models.models as models

from app.auth.dependencies import (
    user_dependency, 
    credential_exception, 
    permission_exception,
)
from app.db import db_dependency

router = APIRouter()

# API Endpoints
@router.get("/users")
def get_users(current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role != 'admin':
        raise permission_exception

    return db.query(models.User).all()


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

    