from fastapi import APIRouter, HTTPException
from starlette import status

from app.db import db_dependency
from app.auth.dependencies import user_dependency
import app.models.models as models 

me_router = APIRouter(prefix='/me', tags=["me"])

@me_router.get('/students')
def get_student_self_details(db: db_dependency, current_user: user_dependency):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='User must be a student.'
        )
    
    if not current_user.student_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User's student profile missing."
        )
    
    return db.get(models.Student, current_user.student_profile.id)