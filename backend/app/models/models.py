from sqlalchemy import ForeignKey, String, Integer, Date
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from datetime import date as dt_date
import uuid

class BaseModel(DeclarativeBase):
    __abstract__ = True

    id: Mapped[str] = mapped_column(
        String(36), 
        primary_key=True, 
        default=lambda: str(uuid.uuid4()),
    )


class User(BaseModel):
    __tablename__ = 'users'

    username: Mapped[str] = mapped_column(String(50), index=True)
    email: Mapped[str] = mapped_column(String(50), unique=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(50), default='user')

    student_profile: Mapped["Student"] = relationship(back_populates='user')
    teacher_profile: Mapped["Teacher"] = relationship(
        back_populates='user',
        cascade="all, delete-orphan"
    )


class Student(BaseModel):
    __tablename__ = 'students'

    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    grade_lvl: Mapped[int]
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey('users.id'), nullable=True)
    
    user: Mapped['User'] = relationship(back_populates='student_profile')
    quizzes: Mapped[list['Quiz']] = relationship(
        back_populates='student',
        cascade="all, delete-orphan"
    )
    

class Quiz(BaseModel):
    __tablename__ = 'quizzes'

    date: Mapped[dt_date] = mapped_column(Date, default=dt_date.today)
    subject: Mapped[str] = mapped_column(String(50))
    quiz_num: Mapped[int]
    score: Mapped[int]
    total_items: Mapped[int] = mapped_column(nullable=True)
    quarter: Mapped[int]
    unit: Mapped[int] = mapped_column(nullable=True)
    topic: Mapped[str] = mapped_column(String(255), nullable=True)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey('students.id'))
    
    student: Mapped['Student'] = relationship(back_populates='quizzes')


class Teacher(BaseModel):
    __tablename__ = "teachers"

    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    field_specialty: Mapped[str] = mapped_column(String(50), nullable=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey('users.id'), nullable=True)

    user: Mapped["User"] = relationship(back_populates='teacher_profile')


class RegistrationRequest(BaseModel):
    __tablename__ = "registration_requests"

    role: Mapped[str] = mapped_column(String(50))
    username: Mapped[str] = mapped_column(String(50))
    email: Mapped[str] = mapped_column(String(50))
    hashed_password: Mapped[str] = mapped_column(String(255))
    student_id: Mapped[str] = mapped_column(String(36), nullable=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=True)
    last_name: Mapped[str] = mapped_column(String(50), nullable=True)
    field_specialty: Mapped[str] = mapped_column(String(100), nullable=True)
    