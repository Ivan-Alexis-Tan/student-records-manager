from pydantic import BaseModel
from typing import Union

class TeacherEditRequest(BaseModel):
    column: str
    value: Union[str, int, bool]


# Responses
class TeacherResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    field_specialty: Union[str | None]
    user_id: str

    class Config:
        from_attributes = True