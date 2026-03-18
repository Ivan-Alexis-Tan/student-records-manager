from fastapi import APIRouter, HTTPException
from starlette import status
from typing import List

from app.auth.dependencies import db_dependency, user_dependency, credential_exception, permission_exception
from app.auth.auth import hash_password
from app.schemas.auth import CreateSignupRequest
from app.schemas.reponse import RegistrationRequestsResponse

import app.models.models as models 

signup_router = APIRouter(tags=['signup'])

@signup_router.get('/signup')
def get_signup_check(db: db_dependency):
    students = db.query(models.Student).all()
    users = db.query(models.User).all()

    return {
        'student_ids': [student.id for student in students],
        "user_emails": [user.email for user in users]
    }


@signup_router.get('/signup/request', response_model=List[RegistrationRequestsResponse])
def get_signup_requests(current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role != 'admin':
        raise permission_exception

    return db.query(models.RegistrationRequest).all()


@signup_router.post("/signup/request", status_code=status.HTTP_201_CREATED)
def create_signup_request(payload: CreateSignupRequest, db: db_dependency):
    already_exists = db.query(models.RegistrationRequest).filter_by(email=payload.email).first()

    if already_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already sent a request."
        )
    
    refined = {}

    for key, val in payload.model_dump().items():
        if key == "password":
            refined['hashed_password'] = hash_password(val)
        
        if key in models.RegistrationRequest.__table__.columns.keys():
            refined[key] = val

    request = models.RegistrationRequest(**refined)
    db.add(request)
    db.commit()