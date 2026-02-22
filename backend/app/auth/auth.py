from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Optional

import app.models.models as models
import app.core.config as config

pwd_context = CryptContext(schemes=['bcrypt'], deprecated="auto")

SECRET_KEY = config.SECRET_KEY
ALGORITHM = config.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = config.ACCESS_TOKEN_EXPIRE_MINUTES

oauth2_bearer = OAuth2PasswordBearer(tokenUrl='/auth/token')

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def create_access_token(*, user: models.User, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    payload = {
        "sub": user.username,
        "user_id": user.id,
        "role": user.role,
        "exp": expire
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> str:
    """
    Returns username (sub) if valid.
    Raises HTTPException if invalid.

    Docstring for decode_access_token
    
    :param token: Description
    :type token: str
    :return: Description
    :rtype: str
    """

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = Optional[str] = payload.get("sub")

        if not username:
            raise HTTPException(status_code=401, detail='Invalid token payload.')
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")