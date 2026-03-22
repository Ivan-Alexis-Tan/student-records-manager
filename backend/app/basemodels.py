from pydantic import BaseModel, field_validator, model_validator
from typing import Optional
import datetime

VALID_SUBJECTS = {'Science', 'Math', 'English', 'Aral. Pan.', 'MAPEH', 'Filipino', 'ESP', 'TLE'}

class NewStudent(BaseModel):
    first_name: str
    last_name: str
    grade_lvl: int

    @field_validator('grade_lvl')
    @classmethod
    def validate_grade_lvl(cls, val):
        if not 7 <= val <= 12:
            raise ValueError('Grade level must be 7 through 12.')
        return val


class QuizModel(BaseModel):
    date: datetime.date
    subject: str
    quiz_num: int
    score: int
    total_items: int
    quarter: int
    unit: Optional[int] = None
    topic: Optional[str] = None
    student_id: str

    @field_validator('subject')
    @classmethod
    def validate_subject(cls, val):
        if val not in VALID_SUBJECTS:
            raise ValueError('Invalid subject.')
        return val

    @field_validator('quarter')
    @classmethod
    def validate_quarter(cls, val):
        if not 1 <= val <= 4:
            raise ValueError("Quarter should be 1 through 4.")
        return val
    
    @field_validator('unit', 'quiz_num')
    @classmethod
    def validate_non_negative(cls, val):
        if val < 0:
            raise ValueError("Must not be negative")
        return val
    
    @model_validator(mode='after')
    def validate_score_vs_total_items(self):
        if self.score > self.total_items:
            raise ValueError("Score cannot exceed total items.")
        return self
        

class UpdateQuiz(BaseModel):
    date: datetime.date
    score: int
    total_items: Optional[int] = None
    unit: Optional[int] = None
    topic: Optional[str] = None