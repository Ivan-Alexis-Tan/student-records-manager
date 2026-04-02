from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.users import users_router 
from app.routes.auth import router as auth_router
from app.routes.me import me_router
from app.routes.signup import signup_router
from app.routes.students import student_router
from app.routes.teachers import teachers_router
from app.routes.quizzes import quizzes_router

app = FastAPI()
app.include_router(auth_router)
app.include_router(me_router)
app.include_router(signup_router)
app.include_router(student_router)
app.include_router(teachers_router)
app.include_router(quizzes_router)
app.include_router(users_router)


# CORS Configs
origins = [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8000",
    "https://student-records-manager-frontend.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)