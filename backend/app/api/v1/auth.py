from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse, RegisterRequest
from app.services.auth_service import authenticate_user
from app.core.security import create_access_token, hash_password
from app.models.user import User
from app.models.role import Role
from app.models.department import Department

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

    token = create_access_token(
        {
            "sub": user.email,
            "role": user.role.name
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
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

    token = create_access_token(
        {
            "sub": new_user.email,
            "role": role.name
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }