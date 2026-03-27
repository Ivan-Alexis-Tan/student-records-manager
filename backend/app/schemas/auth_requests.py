# Register/Login
# input/output

from pydantic import BaseModel
from typing import Optional

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class CreateAdminRequest(BaseModel):
    username: str
    email: str
    role: str
    password: str


class CreateSignupRequest(BaseModel):
    role: str
    username: str
    email: str
    password: str
    student_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    field_specialty: Optional[str] = None
