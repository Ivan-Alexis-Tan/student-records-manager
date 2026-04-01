from dotenv import load_dotenv
from pathlib import Path
import os

curr_path = Path(__file__).resolve().parents[2]
env_path = curr_path / ".env"

load_dotenv(env_path)

SECRET_KEY: str = os.getenv("SECRET_KEY")
ALGORITHM: str = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
DATABASE_URL: str = os.getenv("DATABASE_URL")
IS_PRODUCTION: bool = os.getenv("ENVIRONMENT") == 'production'