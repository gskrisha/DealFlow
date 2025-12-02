"""
DealFlow Backend - Authentication Routes
"""
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import (
    User,
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    ThesisUpdate
)
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await User.find_one(User.email == user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        company=user_data.company,
        role=user_data.role
    )
    await user.insert()
    
    return UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        company=user.company,
        role=user.role,
        thesis=user.thesis,
        onboarding_complete=user.onboarding_complete,
        is_active=user.is_active,
        created_at=user.created_at
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login and get access token"""
    user = await User.find_one(User.email == credentials.email)
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    await user.save()
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str):
    """Refresh access token"""
    payload = decode_token(refresh_token)
    
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("sub")
    user = await User.get(user_id)
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Create new tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        company=current_user.company,
        role=current_user.role,
        avatar_url=current_user.avatar_url,
        thesis=current_user.thesis,
        onboarding_complete=current_user.onboarding_complete,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )


@router.put("/thesis", response_model=UserResponse)
async def update_thesis(
    thesis_data: ThesisUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update user's fund thesis (for personalized discovery)"""
    from app.models.user import FundThesis
    import logging
    logger = logging.getLogger(__name__)
    
    logger.info(f"Updating thesis for user {current_user.email}")
    logger.info(f"Received thesis data: {thesis_data.model_dump()}")
    
    # Update thesis
    if current_user.thesis is None:
        current_user.thesis = FundThesis()
    
    thesis_dict = thesis_data.model_dump(exclude_unset=True)
    
    # Handle all fields, mapping frontend camelCase to backend snake_case where needed
    # Process stages/investment_stage
    if 'investmentStage' in thesis_dict and thesis_dict['investmentStage']:
        current_user.thesis.investment_stage = thesis_dict['investmentStage']
        current_user.thesis.stages = thesis_dict['investmentStage']
    elif 'stages' in thesis_dict and thesis_dict['stages']:
        current_user.thesis.stages = thesis_dict['stages']
        current_user.thesis.investment_stage = thesis_dict['stages']
    elif 'investment_stage' in thesis_dict and thesis_dict['investment_stage']:
        current_user.thesis.investment_stage = thesis_dict['investment_stage']
        current_user.thesis.stages = thesis_dict['investment_stage']
    
    # Process geography/geographies
    if 'geography' in thesis_dict and thesis_dict['geography']:
        current_user.thesis.geography = thesis_dict['geography']
        current_user.thesis.geographies = thesis_dict['geography']
    elif 'geographies' in thesis_dict and thesis_dict['geographies']:
        current_user.thesis.geographies = thesis_dict['geographies']
        current_user.thesis.geography = thesis_dict['geographies']
    
    # Process sectors
    if 'sectors' in thesis_dict and thesis_dict['sectors']:
        current_user.thesis.sectors = thesis_dict['sectors']
    
    # Process check size
    if 'checkSize' in thesis_dict and thesis_dict['checkSize']:
        current_user.thesis.check_size = thesis_dict['checkSize']
    elif 'check_size' in thesis_dict and thesis_dict['check_size']:
        current_user.thesis.check_size = thesis_dict['check_size']
    
    # Process fund size
    if 'fundSize' in thesis_dict and thesis_dict['fundSize']:
        current_user.thesis.fund_size = thesis_dict['fundSize']
    elif 'fund_size' in thesis_dict and thesis_dict['fund_size']:
        current_user.thesis.fund_size = thesis_dict['fund_size']
    
    # Process portfolio size
    if 'portfolioSize' in thesis_dict and thesis_dict['portfolioSize']:
        current_user.thesis.portfolio_size = thesis_dict['portfolioSize']
    elif 'portfolio_size' in thesis_dict and thesis_dict['portfolio_size']:
        current_user.thesis.portfolio_size = thesis_dict['portfolio_size']
    
    # Process key metrics
    if 'keyMetrics' in thesis_dict and thesis_dict['keyMetrics']:
        current_user.thesis.key_metrics = thesis_dict['keyMetrics']
    elif 'key_metrics' in thesis_dict and thesis_dict['key_metrics']:
        current_user.thesis.key_metrics = thesis_dict['key_metrics']
    
    # Process deal breakers
    if 'dealBreakers' in thesis_dict and thesis_dict['dealBreakers']:
        current_user.thesis.deal_breakers = thesis_dict['dealBreakers']
        current_user.thesis.anti_portfolio = thesis_dict['dealBreakers']
    elif 'deal_breakers' in thesis_dict and thesis_dict['deal_breakers']:
        current_user.thesis.deal_breakers = thesis_dict['deal_breakers']
        current_user.thesis.anti_portfolio = thesis_dict['deal_breakers']
    elif 'anti_portfolio' in thesis_dict and thesis_dict['anti_portfolio']:
        current_user.thesis.anti_portfolio = thesis_dict['anti_portfolio']
        current_user.thesis.deal_breakers = thesis_dict['anti_portfolio']
    
    # Process other legacy fields
    if 'fund_name' in thesis_dict and thesis_dict['fund_name']:
        current_user.thesis.fund_name = thesis_dict['fund_name']
    if 'thesis_description' in thesis_dict and thesis_dict['thesis_description']:
        current_user.thesis.thesis_description = thesis_dict['thesis_description']
    if 'check_size_min' in thesis_dict and thesis_dict['check_size_min']:
        current_user.thesis.check_size_min = thesis_dict['check_size_min']
    if 'check_size_max' in thesis_dict and thesis_dict['check_size_max']:
        current_user.thesis.check_size_max = thesis_dict['check_size_max']
    
    current_user.onboarding_complete = True
    current_user.updated_at = datetime.utcnow()
    await current_user.save()
    
    logger.info(f"Thesis saved successfully for user {current_user.email}")
    logger.info(f"Saved thesis: sectors={current_user.thesis.sectors}, stages={current_user.thesis.stages}")
    
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        company=current_user.company,
        role=current_user.role,
        thesis=current_user.thesis,
        onboarding_complete=current_user.onboarding_complete,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )
