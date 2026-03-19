from fastapi import APIRouter, HTTPException
from starlette import status
from typing import List

from app.auth.dependencies import db_dependency, user_dependency, credential_exception, permission_exception
from app.auth.auth import hash_password
from app.schemas.auth import CreateSignupRequest
from app.schemas.reponse import RegistrationRequestsResponse

import app.models.models as models 

signup_router = APIRouter(prefix="/signup", tags=['signup'])

@signup_router.get('/admin', )
def has_admin(db: db_dependency) -> bool:
    users = db.query(models.User).all()

    admins = []
    for user in users:
        if user.role == 'admin':
            admins.append(user.id)

    return True if len(admins) >= 1 else False


@signup_router.get('/request', response_model=List[RegistrationRequestsResponse])
def get_signup_requests(current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role != 'admin':
        raise permission_exception

    return db.query(models.RegistrationRequest).all()


@signup_router.post("/request", status_code=status.HTTP_201_CREATED)
def create_signup_request(payload: CreateSignupRequest, db: db_dependency):
    already_exists = db.query(models.RegistrationRequest).filter_by(email=payload.email).first()

    if already_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already sent a request."
        )
    
    students_id = set([student.id for student in db.query(models.Student.id).all()])
    user_emails = set([user.email for user in db.query(models.User.email).all()])

    if (payload.role == "student") & (payload.student_id not in students_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ID not found."
        )
    
    if payload.email in user_emails:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Account already exists."
        )
    
    refined = {}

    for key, val in payload.model_dump().items():
        if key == "password":
            refined['hashed_password'] = hash_password(val)
        
        if key in models.RegistrationRequest.__table__.columns.keys():
            refined[key] = val

    request = models.RegistrationRequest(**refined)

    if request.role == 'student':
        student = db.get(models.Student, request.student_id)
        request.first_name = student.first_name
        request.last_name = student.last_name
        
    db.add(request)
    db.commit()
    

@signup_router.post('/request/{id}', status_code=status.HTTP_201_CREATED)
def grant_signup_request(id: str, current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role != 'admin':
        raise permission_exception
    
    request = db.get(models.RegistrationRequest, id)

    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Request not found.'
        )

    new_user = models.User(
        username=request.username,
        email=request.email,
        hashed_password=request.hashed_password,
        role=request.role,
    )
    db.add(new_user)
    db.flush()
    
    match request.role:
        case "student":
            student = db.get(models.Student, request.student_id)

            if not student:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail='Student ID not found.'
                )
            
            student.user_id = new_user.id
            db.add(student)
            db.delete(request)
            db.commit()
                
        case "teacher":
            teacher = models.Teacher(
                first_name=request.first_name,
                last_name=request.last_name,
                field_specialty=request.field_specialty,
                user_id=new_user.id,
            )
            db.add(teacher)
            db.flush()

            if teacher.user_id:
                db.delete(request)
                db.commit()

        case "admin":
            db.delete(request)
            db.commit()
        case _:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail='Unsupported role request.'
            )


@signup_router.delete('/request/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_signup_request(id: str, current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role != 'admin':
        raise permission_exception
    
    request = db.get(models.RegistrationRequest, id)
    db.delete(request)
    db.commit()