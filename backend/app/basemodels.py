from pydantic import BaseModel
from typing import Optional
import datetime

class NewStudent(BaseModel):
    first_name: str
    last_name: str
    grade_lvl: int


class QuizModel(BaseModel):
    date: datetime.date
    subject: str
    quiz_num: int
    score: int
    total_items: Optional[int] = None
    quarter: int
    unit: Optional[int] = None
    topic: Optional[str] = None
    student_id: str


class UpdateQuiz(BaseModel):
    date: datetime.date
    score: int
    total_items: Optional[int] = None
    unit: Optional[int] = None
    topic: Optional[str] = None