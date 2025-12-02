"""
DealFlow Backend - Startup Routes
"""
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from beanie import PydanticObjectId
from app.models.startup import (
    Startup,
    StartupCreate,
    StartupUpdate,
    StartupResponse
)
from app.models.user import User
from app.api.deps import get_current_user, get_optional_user
from app.services.scoring import ScoringService

router = APIRouter(prefix="/startups", tags=["Startups"])


def startup_to_response(startup: Startup) -> StartupResponse:
    """Convert Startup document to response model"""
    return StartupResponse(
        id=str(startup.id),
        name=startup.name,
        tagline=startup.tagline,
        sector=startup.sector,
        stage=startup.stage,
        location=startup.location,
        score=startup.score,
        score_breakdown=startup.score_breakdown,
        unicorn_probability=startup.unicorn_probability,
        founders=startup.founders,
        metrics=startup.metrics,
        signals=startup.signals,
        sources=startup.sources,
        description=startup.description,
        investor_fit=startup.investor_fit,
        deal_status=startup.deal_status,
        mutual_connections=startup.mutual_connections,
        last_updated=startup.last_updated,
        website=startup.website,
        yc_batch=startup.yc_batch
    )


@router.get("", response_model=List[StartupResponse])
async def get_startups(
    current_user: User = Depends(get_optional_user),
    sector: Optional[str] = Query(None, description="Filter by sector"),
    stage: Optional[str] = Query(None, description="Filter by stage"),
    min_score: Optional[float] = Query(None, ge=0, le=100, description="Minimum AI score"),
    status: Optional[str] = Query(None, description="Filter by deal status"),
    search: Optional[str] = Query(None, description="Search by name or description"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
    sort_by: str = Query("score", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)")
):
    """Get all startups with filtering and pagination"""
    # Build query
    query = {}
    
    if sector:
        query["sector"] = sector
    if stage:
        query["stage"] = stage
    if min_score is not None:
        query["score"] = {"$gte": min_score}
    if status:
        query["deal_status"] = status
    
    # Build aggregation pipeline for search
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tagline": {"$regex": search, "$options": "i"}}
        ]
    
    # Determine sort direction
    sort_direction = -1 if sort_order == "desc" else 1
    
    # Execute query
    startups = await Startup.find(query).sort(
        [(sort_by, sort_direction)]
    ).skip(skip).limit(limit).to_list()
    
    return [startup_to_response(s) for s in startups]


@router.get("/stats")
async def get_startup_stats(current_user: User = Depends(get_optional_user)):
    """Get startup statistics"""
    total = await Startup.count()
    
    # Count by status
    status_counts = {}
    for status in ["new", "contacted", "meeting", "diligence", "passed", "invested"]:
        count = await Startup.find(Startup.deal_status == status).count()
        status_counts[status] = count
    
    # Count by sector
    sector_pipeline = [
        {"$group": {"_id": "$sector", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    sector_counts = await Startup.aggregate(sector_pipeline).to_list()
    
    # Average score
    avg_pipeline = [
        {"$group": {"_id": None, "avg_score": {"$avg": "$score"}}}
    ]
    avg_result = await Startup.aggregate(avg_pipeline).to_list()
    avg_score = avg_result[0]["avg_score"] if avg_result else 0
    
    return {
        "total": total,
        "by_status": status_counts,
        "by_sector": {item["_id"]: item["count"] for item in sector_counts},
        "average_score": round(avg_score, 1)
    }


@router.get("/{startup_id}", response_model=StartupResponse)
async def get_startup(
    startup_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific startup by ID"""
    try:
        startup = await Startup.get(PydanticObjectId(startup_id))
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found"
        )
    
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found"
        )
    
    return startup_to_response(startup)


@router.post("", response_model=StartupResponse, status_code=status.HTTP_201_CREATED)
async def create_startup(
    startup_data: StartupCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new startup"""
    startup = Startup(
        name=startup_data.name,
        tagline=startup_data.tagline,
        sector=startup_data.sector,
        stage=startup_data.stage,
        location=startup_data.location,
        description=startup_data.description,
        website=startup_data.website,
        founders=startup_data.founders,
        metrics=startup_data.metrics,
        sources=["Manual"],
        last_updated="Just now"
    )
    
    # Calculate initial AI score
    scoring_service = ScoringService()
    score_result = await scoring_service.calculate_score(startup, current_user.thesis)
    startup.score = score_result["overall_score"]
    startup.score_breakdown = score_result["breakdown"]
    startup.unicorn_probability = score_result.get("unicorn_probability")
    startup.investor_fit = score_result.get("investor_fit")
    
    await startup.insert()
    
    return startup_to_response(startup)


@router.put("/{startup_id}", response_model=StartupResponse)
async def update_startup(
    startup_id: str,
    startup_data: StartupUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a startup"""
    try:
        startup = await Startup.get(PydanticObjectId(startup_id))
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found"
        )
    
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found"
        )
    
    # Update fields
    update_dict = startup_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(startup, key, value)
    
    startup.updated_at = datetime.utcnow()
    startup.last_updated = "Just now"
    
    await startup.save()
    
    return startup_to_response(startup)


@router.delete("/{startup_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_startup(
    startup_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a startup"""
    try:
        startup = await Startup.get(PydanticObjectId(startup_id))
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found"
        )
    
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found"
        )
    
    await startup.delete()


@router.post("/{startup_id}/score", response_model=StartupResponse)
async def rescore_startup(
    startup_id: str,
    current_user: User = Depends(get_current_user)
):
    """Re-calculate AI score for a startup"""
    try:
        startup = await Startup.get(PydanticObjectId(startup_id))
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found"
        )
    
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found"
        )
    
    # Re-calculate score
    scoring_service = ScoringService()
    score_result = await scoring_service.calculate_score(startup, current_user.thesis)
    
    startup.score = score_result["overall_score"]
    startup.score_breakdown = score_result["breakdown"]
    startup.unicorn_probability = score_result.get("unicorn_probability")
    startup.investor_fit = score_result.get("investor_fit")
    startup.updated_at = datetime.utcnow()
    startup.last_updated = "Just now"
    
    await startup.save()
    
    return startup_to_response(startup)
