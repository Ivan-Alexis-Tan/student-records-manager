from pydantic import BaseModel, field_validator, ConfigDict

class NewStudentRequest(BaseModel):
    first_name: str
    last_name: str
    grade_lvl: int

    @field_validator('grade_lvl')
    @classmethod
    def validate_grade_lvl(cls, val):
        if not 7 <= val <= 12:
            raise ValueError('Grade level must be 7 through 12.')
        return val
    

class NewStudentResponse(BaseModel):
    first_name: str
    last_name: str
    grade_lvl: int


class StudentAccountResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    username: str
    email: str
    role: str