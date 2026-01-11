from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from app.models.schemas import (
    UserResponse,
    UserUpdate,
    UserListResponse
)
from app.auth.dependencies import get_current_user, require_admin
from app.database import db

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=UserListResponse)
async def get_users(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(require_admin)
):
    """
    Get list of all users (admin only).
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        current_user: Current authenticated admin user
        
    Returns:
        List of users and total count
    """
    users = await db.user.find_many(skip=skip, take=limit)
    total = await db.user.count()
    
    return UserListResponse(users=users, total=total)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user = Depends(get_current_user)
):
    """
    Get user by ID.
    
    Args:
        user_id: User ID
        current_user: Current authenticated user
        
    Returns:
        User object
        
    Raises:
        HTTPException: If user not found or unauthorized
    """
    # Users can only view their own profile unless they're admin
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this user"
        )
    
    user = await db.user.find_unique(where={"id": user_id})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_user = Depends(get_current_user)
):
    """
    Update user information.
    
    Args:
        user_id: User ID
        user_data: Updated user data
        current_user: Current authenticated user
        
    Returns:
        Updated user object
        
    Raises:
        HTTPException: If user not found or unauthorized
    """
    # Users can only update their own profile unless they're admin
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user"
        )
    
    # Check if user exists
    user = await db.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prepare update data (only include fields that are set)
    update_data = user_data.model_dump(exclude_unset=True)
    
    # Only admins can change roles
    if "role" in update_data and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can change user roles"
        )
    
    # Update user
    updated_user = await db.user.update(
        where={"id": user_id},
        data=update_data
    )
    
    return updated_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user = Depends(require_admin)
):
    """
    Delete user (admin only).
    
    Args:
        user_id: User ID
        current_user: Current authenticated admin user
        
    Raises:
        HTTPException: If user not found
    """
    user = await db.user.find_unique(where={"id": user_id})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    await db.user.delete(where={"id": user_id})
