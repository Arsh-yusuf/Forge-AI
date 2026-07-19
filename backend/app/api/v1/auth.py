from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse, RegisterRequest
from app.services.auth_service import authenticate_user
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_refresh_token,
)
from app.models.user import User
from app.models.role import Role
from app.models.department import Department
from pydantic import BaseModel


class RefreshRequest(BaseModel):
    refresh_token: str

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    user = authenticate_user(
        db,
        request.email,
        request.password
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access = create_access_token(
        {
            "sub": user.email,
            "role": user.role.name
        }
    )

    refresh = create_refresh_token(
        {
            "sub": user.email,
            "role": user.role.name
        }
    )

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    request: RefreshRequest,
    db: Session = Depends(get_db),
):

    payload = verify_refresh_token(request.refresh_token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token",
        )

    email = payload.get("sub")

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    new_access = create_access_token(
        {
            "sub": user.email,
            "role": user.role.name,
        }
    )

    new_refresh = create_refresh_token(
        {
            "sub": user.email,
            "role": user.role.name,
        }
    )

    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer",
    }


@router.post(
    "/register",
    response_model=TokenResponse
)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    role_name = request.role or "Operations Engineer"
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        role = Role(name=role_name)
        db.add(role)
        db.commit()
        db.refresh(role)

    dept_name = request.department or "Operations"
    dept = db.query(Department).filter(Department.name == dept_name).first()
    if not dept:
        dept = Department(name=dept_name)
        db.add(dept)
        db.commit()
        db.refresh(dept)

    new_user = User(
        full_name=request.full_name,
        email=request.email,
        password_hash=hash_password(request.password),
        role_id=role.id,
        department_id=dept.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access = create_access_token(
        {
            "sub": new_user.email,
            "role": role.name
        }
    )

    refresh = create_refresh_token(
        {
            "sub": new_user.email,
            "role": role.name
        }
    )

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer"
    }