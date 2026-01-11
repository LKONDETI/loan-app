from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ============ Auth Schemas ============

class RegisterRequest(BaseModel):
    """Request model for user registration."""
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(..., min_length=6)
    role: str = Field(default="user", pattern="^(user|admin)$")


class LoginRequest(BaseModel):
    """Request model for user login."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Response model for authentication tokens."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    """Request model for refreshing access token."""
    refresh_token: str


# ============ User Schemas ============

class UserBase(BaseModel):
    """Base user model with common fields."""
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: str = "user"


class UserCreate(UserBase):
    """Model for creating a new user."""
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    """Model for updating user information."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: Optional[str] = None


class UserResponse(UserBase):
    """Response model for user data (excludes password)."""
    id: str
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """Response model for list of users."""
    users: List[UserResponse]
    total: int


# ============ Loan Schemas ============

class LoanBase(BaseModel):
    """Base loan model with common fields."""
    borrowerName: str = Field(..., min_length=1, max_length=100)
    amount: float = Field(..., gt=0)
    interestRate: float = Field(..., ge=0, le=100)
    loanTerm: int = Field(..., gt=0)
    startDate: datetime
    status: str = Field(default="pending", pattern="^(pending|active|completed|defaulted)$")
    monthlyPayment: float = Field(..., gt=0)


class LoanCreate(LoanBase):
    """Model for creating a new loan."""
    userId: str


class LoanUpdate(BaseModel):
    """Model for updating loan information."""
    borrowerName: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    interestRate: Optional[float] = Field(None, ge=0, le=100)
    loanTerm: Optional[int] = Field(None, gt=0)
    startDate: Optional[datetime] = None
    status: Optional[str] = Field(None, pattern="^(pending|active|completed|defaulted)$")
    monthlyPayment: Optional[float] = Field(None, gt=0)


class LoanResponse(LoanBase):
    """Response model for loan data."""
    id: str
    userId: str
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True


class LoanListResponse(BaseModel):
    """Response model for list of loans."""
    loans: List[LoanResponse]
    total: int


# ============ Payment Schemas ============

class PaymentBase(BaseModel):
    """Base payment model with common fields."""
    amount: float = Field(..., gt=0)
    date: datetime
    status: str = Field(default="pending", pattern="^(pending|completed|failed)$")


class PaymentCreate(PaymentBase):
    """Model for creating a new payment."""
    loanId: str


class PaymentUpdate(BaseModel):
    """Model for updating payment information."""
    amount: Optional[float] = Field(None, gt=0)
    date: Optional[datetime] = None
    status: Optional[str] = Field(None, pattern="^(pending|completed|failed)$")


class PaymentResponse(PaymentBase):
    """Response model for payment data."""
    id: str
    loanId: str
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True


class PaymentListResponse(BaseModel):
    """Response model for list of payments."""
    payments: List[PaymentResponse]
    total: int
