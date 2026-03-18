from pydantic import BaseModel

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