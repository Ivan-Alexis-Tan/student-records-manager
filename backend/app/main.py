from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.route import router 
from app.routes.auth import router as auth_router
from app.routes.me import me_router

app = FastAPI()
app.include_router(auth_router)
app.include_router(me_router)
app.include_router(router)

# CORS Configs
origins = [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)