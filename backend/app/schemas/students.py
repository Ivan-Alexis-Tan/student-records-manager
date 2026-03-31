from pydantic import BaseModel, field_validator

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