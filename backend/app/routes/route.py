from fastapi import HTTPException, Response, APIRouter
from starlette import status

from app.db import db_dependency
from app.models.models import Student, Quiz
import app.models.models as models
from app.basemodels import NewStudent, QuizModel, UpdateQuiz
from app.schemas.auth import CreateTeacherRequest, CreateUserRequest
from app.auth.auth import hash_password
from app.auth.dependencies import user_dependency, credential_exception, usual_permissions

router = APIRouter()

# API Endpoints
@router.get('/students')
def get_students(current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {'teacher', 'admin'}:
        raise credential_exception
    
    students = db.query(Student).all()
    
    return students


@router.get("/teachers")
def get_teachers(current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {'teacher', 'admin'}:
        raise credential_exception

    return db.query(models.Teacher).all()


@router.get("/users")
def get_users(current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role != 'admin':
        raise credential_exception

    return db.query(models.User).all()


@router.post('/students')
def add_student(student: NewStudent, current_user: user_dependency, db: db_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {'teacher', 'admin'}:
        raise credential_exception
    
    new_student = Student(**student.model_dump())
    db.add(new_student)
    db.commit()
    return student


@router.delete('/students/{id}')
def remove_student(id: str, db: db_dependency, current_user: user_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {"teacher", "admin"}:
        raise credential_exception
    
    student = db.query(Student).get(id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Student does not exists.'
        )

    db.delete(student)
    db.commit()


@router.get('/students/{id}')
def get_student_details(id: str, db: db_dependency, current_user: user_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role  == "student":
        if not current_user.student_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='User has no student profile.'
            )
        return db.get(models.Student, current_user.student_profile.id)

    return db.get(models.Student, id)


@router.get("/students/{id}/quizzes")
def get_student_quizzes(id: str, db: db_dependency, current_user: user_dependency):
    if not current_user:
        raise credential_exception

    if current_user.role == "student":
        id = current_user.student_profile.id
    elif current_user.role not in {'teacher', 'admin'}:
        raise credential_exception

    return {
        "data": db.query(Quiz).filter(Quiz.student_id == id).all(), 
        "permissions": usual_permissions(current_user.role)
    }


@router.patch('/quizzes/{id}')
def update_quiz_score(id: str, payload: UpdateQuiz, db: db_dependency, current_user: user_dependency) -> None:
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {"teacher", "admin"}:
        raise credential_exception

    allowed = {'date', 'score', 'total_items', 'unit', 'topic'}
    details = payload.model_dump(exclude_unset=True)

    if details['score'] > details['total_items']:
        raise HTTPException(
            status_code=400, 
            detail="Score must not be greater than highest possible score."
        )
    
    quiz = db.get(Quiz, id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found.")

    for col, val in details.items():
        if col in allowed:
            setattr(quiz, col, val)

    db.commit()
    db.refresh(quiz)
    return quiz


@router.post('/quizzes')
def add_quiz_record(payload: QuizModel, db: db_dependency, current_user: user_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {"teacher", "admin"}:
        raise credential_exception
    
    new_quiz = Quiz(**payload.model_dump())
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    return new_quiz


@router.delete('/quizzes/{id}')
def delete_quiz(id: str, db: db_dependency, current_user: user_dependency) -> None:
    """
    - `id`
        - Student quiz id
        - `str` type
    """
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {"teacher", "admin"}:
        raise credential_exception
    
    quiz = db.get(Quiz, id)

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found.")
    
    db.delete(quiz)
    db.commit()

    return {"message": "Successfully deleted a quiz record."}


@router.post("/teachers")
def create_teacher(teacher: CreateTeacherRequest, db: db_dependency, current_user: user_dependency):
    if not current_user:
        raise credential_exception
    
    if current_user.role not in {"teacher", "admin"}:
        raise credential_exception

    user = db.query(models.User).filter(models.User.email == teacher.email).first()

    if user:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"User already exists."
        )

    new_user = models.User(
        username = f"{teacher.first_name.capitalize()} {teacher.last_name.capitalize()}",
        email = teacher.email,
        hashed_password = hash_password(teacher.password),
        role = "teacher",
    )
    db.add(new_user)
    db.flush()

    new_teacher = models.Teacher(
        first_name = teacher.first_name.capitalize(),
        last_name = teacher.last_name.capitalize(),
        field_specialty = teacher.field_specialty,
        user_id = new_user.id
    )
    
    db.add(new_teacher)
    db.commit()
    
    return {
        "teacher": new_teacher, 
        "user": {
            "username": new_user.username,
            "email": new_user.email,
            "role": new_user.role
        }
    }


@router.delete('/user/{id}')
def remove_user(id: str, db: db_dependency, current_user: user_dependency):
    if current_user.role != "admin":
        raise credential_exception
    
    user = db.get(models.User, id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Account does not exists.'
        )

    db.delete(user)
    db.commit()