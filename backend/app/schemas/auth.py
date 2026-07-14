from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "Operations Engineer"
    department: str = "Operations"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"