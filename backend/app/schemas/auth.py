# Register/Login
# input/output

from pydantic import BaseModel
from typing import Optional, Union

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    profile_id: Union[str, None]


class CreateUserRequest(BaseModel):
    username: str
    email: str
    role: str
    password: str
    student_id: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CreateTeacherRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    field_specialty: Optional[str] = None


class CreateAdminRequest(BaseModel):
    username: str
    email: str
    role: str
    password: str
    confirm_pw: str


class CreateSignupRequest(BaseModel):
    role: str
    username: str
    email: str
    password: str
    student_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    field_specialty: Optional[str] = None