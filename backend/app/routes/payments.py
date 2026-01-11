from fastapi import APIRouter, HTTPException, status, Depends
from typing import Optional
from app.models.schemas import (
    PaymentCreate,
    PaymentUpdate,
    PaymentResponse,
    PaymentListResponse
)
from app.auth.dependencies import get_current_user
from app.database import db

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def create_payment(
    payment_data: PaymentCreate,
    current_user = Depends(get_current_user)
):
    """
    Create a new payment.
    
    Args:
        payment_data: Payment creation data
        current_user: Current authenticated user
        
    Returns:
        Created payment object
        
    Raises:
        HTTPException: If loan not found or unauthorized
    """
    # Verify loan exists
    loan = await db.loan.find_unique(where={"id": payment_data.loanId})
    if not loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found"
        )
    
    # Non-admin users can only create payments for their own loans
    if current_user.role != "admin" and loan.userId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create payment for this loan"
        )
    
    # Create payment
    payment = await db.payment.create(
        data={
            "loanId": payment_data.loanId,
            "amount": payment_data.amount,
            "date": payment_data.date,
            "status": payment_data.status
        }
    )
    
    return payment


@router.get("", response_model=PaymentListResponse)
async def get_payments(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    loan_id: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """
    Get list of payments with optional filters.
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        status: Optional filter by payment status
        loan_id: Optional filter by loan ID
        current_user: Current authenticated user
        
    Returns:
        List of payments and total count
    """
    # Build filter conditions
    where_conditions = {}
    
    if status:
        where_conditions["status"] = status
    
    if loan_id:
        where_conditions["loanId"] = loan_id
    
    # Non-admin users can only see payments for their own loans
    if current_user.role != "admin":
        # Get user's loan IDs
        user_loans = await db.loan.find_many(
            where={"userId": current_user.id},
            select={"id": True}
        )
        loan_ids = [loan.id for loan in user_loans]
        
        if loan_ids:
            where_conditions["loanId"] = {"in": loan_ids}
        else:
            # User has no loans, return empty list
            return PaymentListResponse(payments=[], total=0)
    
    payments = await db.payment.find_many(
        where=where_conditions if where_conditions else None,
        skip=skip,
        take=limit,
        order={"date": "desc"}
    )
    
    total = await db.payment.count(where=where_conditions if where_conditions else None)
    
    return PaymentListResponse(payments=payments, total=total)


@router.get("/loan/{loan_id}", response_model=PaymentListResponse)
async def get_payments_by_loan(
    loan_id: str,
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user)
):
    """
    Get all payments for a specific loan.
    
    Args:
        loan_id: Loan ID
        skip: Number of records to skip
        limit: Maximum number of records to return
        current_user: Current authenticated user
        
    Returns:
        List of payments for the loan
        
    Raises:
        HTTPException: If loan not found or unauthorized
    """
    # Verify loan exists
    loan = await db.loan.find_unique(where={"id": loan_id})
    if not loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found"
        )
    
    # Non-admin users can only view payments for their own loans
    if current_user.role != "admin" and loan.userId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view payments for this loan"
        )
    
    payments = await db.payment.find_many(
        where={"loanId": loan_id},
        skip=skip,
        take=limit,
        order={"date": "desc"}
    )
    
    total = await db.payment.count(where={"loanId": loan_id})
    
    return PaymentListResponse(payments=payments, total=total)


@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(
    payment_id: str,
    current_user = Depends(get_current_user)
):
    """
    Get payment by ID.
    
    Args:
        payment_id: Payment ID
        current_user: Current authenticated user
        
    Returns:
        Payment object
        
    Raises:
        HTTPException: If payment not found or unauthorized
    """
    payment = await db.payment.find_unique(
        where={"id": payment_id},
        include={"loan": True}
    )
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Non-admin users can only view payments for their own loans
    if current_user.role != "admin" and payment.loan.userId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this payment"
        )
    
    return payment


@router.put("/{payment_id}", response_model=PaymentResponse)
async def update_payment(
    payment_id: str,
    payment_data: PaymentUpdate,
    current_user = Depends(get_current_user)
):
    """
    Update payment information.
    
    Args:
        payment_id: Payment ID
        payment_data: Updated payment data
        current_user: Current authenticated user
        
    Returns:
        Updated payment object
        
    Raises:
        HTTPException: If payment not found or unauthorized
    """
    payment = await db.payment.find_unique(
        where={"id": payment_id},
        include={"loan": True}
    )
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Non-admin users can only update payments for their own loans
    if current_user.role != "admin" and payment.loan.userId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this payment"
        )
    
    # Prepare update data
    update_data = payment_data.model_dump(exclude_unset=True)
    
    # Update payment
    updated_payment = await db.payment.update(
        where={"id": payment_id},
        data=update_data
    )
    
    return updated_payment


@router.delete("/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_payment(
    payment_id: str,
    current_user = Depends(get_current_user)
):
    """
    Delete payment.
    
    Args:
        payment_id: Payment ID
        current_user: Current authenticated user
        
    Raises:
        HTTPException: If payment not found or unauthorized
    """
    payment = await db.payment.find_unique(
        where={"id": payment_id},
        include={"loan": True}
    )
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Non-admin users can only delete payments for their own loans
    if current_user.role != "admin" and payment.loan.userId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this payment"
        )
    
    await db.payment.delete(where={"id": payment_id})
