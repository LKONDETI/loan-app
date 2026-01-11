from fastapi import APIRouter, HTTPException, status, Depends
from typing import Optional
from app.models.schemas import (
    LoanCreate,
    LoanUpdate,
    LoanResponse,
    LoanListResponse
)
from app.auth.dependencies import get_current_user
from app.database import db

router = APIRouter(prefix="/loans", tags=["Loans"])


@router.post("", response_model=LoanResponse, status_code=status.HTTP_201_CREATED)
async def create_loan(
    loan_data: LoanCreate,
    current_user = Depends(get_current_user)
):
    """
    Create a new loan.
    
    Args:
        loan_data: Loan creation data
        current_user: Current authenticated user
        
    Returns:
        Created loan object
        
    Raises:
        HTTPException: If user not found
    """
    # Verify user exists
    user = await db.user.find_unique(where={"id": loan_data.userId})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create loan
    loan = await db.loan.create(
        data={
            "borrowerName": loan_data.borrowerName,
            "amount": loan_data.amount,
            "interestRate": loan_data.interestRate,
            "loanTerm": loan_data.loanTerm,
            "startDate": loan_data.startDate,
            "status": loan_data.status,
            "monthlyPayment": loan_data.monthlyPayment,
            "userId": loan_data.userId
        }
    )
    
    return loan


@router.get("", response_model=LoanListResponse)
async def get_loans(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    user_id: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """
    Get list of loans with optional filters.
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        status: Optional filter by loan status
        user_id: Optional filter by user ID
        current_user: Current authenticated user
        
    Returns:
        List of loans and total count
    """
    # Build filter conditions
    where_conditions = {}
    
    if status:
        where_conditions["status"] = status
    
    if user_id:
        where_conditions["userId"] = user_id
    
    # Non-admin users can only see their own loans
    if current_user.role != "admin":
        where_conditions["userId"] = current_user.id
    
    loans = await db.loan.find_many(
        where=where_conditions if where_conditions else None,
        skip=skip,
        take=limit,
        order={"createdAt": "desc"}
    )
    
    total = await db.loan.count(where=where_conditions if where_conditions else None)
    
    return LoanListResponse(loans=loans, total=total)


@router.get("/{loan_id}", response_model=LoanResponse)
async def get_loan(
    loan_id: str,
    current_user = Depends(get_current_user)
):
    """
    Get loan by ID.
    
    Args:
        loan_id: Loan ID
        current_user: Current authenticated user
        
    Returns:
        Loan object
        
    Raises:
        HTTPException: If loan not found or unauthorized
    """
    loan = await db.loan.find_unique(where={"id": loan_id})
    
    if not loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found"
        )
    
    # Non-admin users can only view their own loans
    if current_user.role != "admin" and loan.userId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this loan"
        )
    
    return loan


@router.put("/{loan_id}", response_model=LoanResponse)
async def update_loan(
    loan_id: str,
    loan_data: LoanUpdate,
    current_user = Depends(get_current_user)
):
    """
    Update loan information.
    
    Args:
        loan_id: Loan ID
        loan_data: Updated loan data
        current_user: Current authenticated user
        
    Returns:
        Updated loan object
        
    Raises:
        HTTPException: If loan not found or unauthorized
    """
    loan = await db.loan.find_unique(where={"id": loan_id})
    
    if not loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found"
        )
    
    # Non-admin users can only update their own loans
    if current_user.role != "admin" and loan.userId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this loan"
        )
    
    # Prepare update data
    update_data = loan_data.model_dump(exclude_unset=True)
    
    # Update loan
    updated_loan = await db.loan.update(
        where={"id": loan_id},
        data=update_data
    )
    
    return updated_loan


@router.delete("/{loan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_loan(
    loan_id: str,
    current_user = Depends(get_current_user)
):
    """
    Delete loan.
    
    Args:
        loan_id: Loan ID
        current_user: Current authenticated user
        
    Raises:
        HTTPException: If loan not found or unauthorized
    """
    loan = await db.loan.find_unique(where={"id": loan_id})
    
    if not loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found"
        )
    
    # Non-admin users can only delete their own loans
    if current_user.role != "admin" and loan.userId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this loan"
        )
    
    await db.loan.delete(where={"id": loan_id})
