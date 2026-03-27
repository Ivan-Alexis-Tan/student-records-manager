from pydantic import BaseModel
from typing import Union

# Requests
class CreateUserRequest(BaseModel):
    username: str
    email: str
    role: str
    password: str
    student_id: str


class UpdateUserRequest(BaseModel):
    column: str
    value: Union[str, int, bool]


# Responses
class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    profile_id: Union[str, None] = None

    class Config:
        from_attributes = True