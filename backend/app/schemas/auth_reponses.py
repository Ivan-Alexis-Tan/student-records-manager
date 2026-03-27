from pydantic import BaseModel
from typing import List

import app.schemas.teachers as teachers_schema
import app.schemas.users as users_schema

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    

class RegistrationRequestsResponse(BaseModel):
    id: str
    role: str
    username: str
    email: str
    student_id: str | None
    first_name: str | None
    last_name: str | None
    field_specialty: str | None

    class Config:
        from_attributes = True


class AdminInitPageResponse(BaseModel):
    users: List[users_schema.UserResponse]
    teachers: List[teachers_schema.TeacherResponse]

    class Config:
        from_attributes = True