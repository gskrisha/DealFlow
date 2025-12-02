"""
DealFlow Backend - Deals Routes
"""
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from beanie import PydanticObjectId
from pydantic import BaseModel
from app.models.deal import Deal, DealCreate, DealUpdate, DealResponse, Note, Activity
from app.models.startup import Startup
from app.models.user import User
from app.api.deps import get_current_user, get_optional_user

router = APIRouter(prefix="/deals", tags=["Deals"])


def deal_to_response(deal: Deal) -> DealResponse:
    """Convert Deal document to response model"""
    return DealResponse(
        id=str(deal.id),
        startup_id=deal.startup_id,
        startup_name=deal.startup_name,
        startup_sector=deal.startup_sector,
        startup_stage=deal.startup_stage,
        startup_score=deal.startup_score,
        status=deal.status,
        priority=deal.priority,
        assigned_to=deal.assigned_to,
        assigned_name=deal.assigned_name,
        notes_count=len(deal.notes),
        tags=deal.tags,
        next_meeting_date=deal.next_meeting_date,
        created_at=deal.created_at,
        updated_at=deal.updated_at
    )


@router.get("", response_model=List[DealResponse])
async def get_deals(
    current_user: User = Depends(get_current_user),
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = None,
    assigned_to: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    """Get all deals for the current user"""
    query = {"user_id": str(current_user.id)}
    
    if status_filter:
        query["status"] = status_filter
    if priority:
        query["priority"] = priority
    if assigned_to:
        query["assigned_to"] = assigned_to
    
    deals = await Deal.find(query).sort(
        [("updated_at", -1)]
    ).skip(skip).limit(limit).to_list()
    
    return [deal_to_response(d) for d in deals]


@router.get("/pipeline")
async def get_pipeline_view(current_user: User = Depends(get_optional_user)):
    """Get deals organized by pipeline stage"""
    # If no user, return empty pipeline or demo data
    if current_user is None:
        pipeline_data = {}
        for stage in ["new", "contacted", "meeting", "diligence", "passed", "invested"]:
            pipeline_data[stage] = []
        return pipeline_data
    
    user_id = str(current_user.id)
    
    pipeline_data = {}
    for stage in ["new", "contacted", "meeting", "diligence", "passed", "invested"]:
        deals = await Deal.find({
            "user_id": user_id,
            "status": stage
        }).sort([("priority", -1), ("updated_at", -1)]).to_list()
        
        pipeline_data[stage] = [deal_to_response(d) for d in deals]
    
    return pipeline_data


@router.get("/{deal_id}", response_model=DealResponse)
async def get_deal(
    deal_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific deal"""
    try:
        deal = await Deal.get(PydanticObjectId(deal_id))
    except:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    if not deal or deal.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Deal not found")
    
    return deal_to_response(deal)


@router.post("", response_model=DealResponse, status_code=status.HTTP_201_CREATED)
async def create_deal(
    deal_data: DealCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new deal from a startup"""
    # Get startup info
    try:
        startup = await Startup.get(PydanticObjectId(deal_data.startup_id))
    except:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    # Check if deal already exists for this startup
    existing = await Deal.find_one({
        "user_id": str(current_user.id),
        "startup_id": deal_data.startup_id
    })
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Deal already exists for this startup"
        )
    
    # Create deal
    deal = Deal(
        startup_id=deal_data.startup_id,
        user_id=str(current_user.id),
        startup_name=startup.name,
        startup_sector=startup.sector,
        startup_stage=startup.stage,
        startup_score=startup.score,
        status=deal_data.status,
        priority=deal_data.priority,
        tags=deal_data.tags
    )
    
    # Add creation activity
    deal.activities.append(Activity(
        action="created",
        description="Deal added to pipeline",
        user_id=str(current_user.id),
        user_name=current_user.full_name
    ))
    
    await deal.insert()
    
    # Update startup deal status
    startup.deal_status = deal_data.status
    await startup.save()
    
    return deal_to_response(deal)


@router.put("/{deal_id}", response_model=DealResponse)
async def update_deal(
    deal_id: str,
    deal_data: DealUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a deal"""
    try:
        deal = await Deal.get(PydanticObjectId(deal_id))
    except:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    if not deal or deal.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Deal not found")
    
    # Track status changes
    old_status = deal.status
    
    # Update fields
    update_dict = deal_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(deal, key, value)
    
    # Log status change
    if deal_data.status and deal_data.status != old_status:
        deal.activities.append(Activity(
            action="status_change",
            description=f"Status changed from {old_status} to {deal_data.status}",
            user_id=str(current_user.id),
            user_name=current_user.full_name,
            metadata={"old_status": old_status, "new_status": deal_data.status}
        ))
        
        # Update startup status
        try:
            startup = await Startup.get(PydanticObjectId(deal.startup_id))
            if startup:
                startup.deal_status = deal_data.status
                await startup.save()
        except:
            pass
    
    deal.updated_at = datetime.utcnow()
    await deal.save()
    
    return deal_to_response(deal)


class NoteCreate(BaseModel):
    content: str


@router.post("/{deal_id}/notes", response_model=DealResponse)
async def add_note(
    deal_id: str,
    note_data: NoteCreate,
    current_user: User = Depends(get_current_user)
):
    """Add a note to a deal"""
    try:
        deal = await Deal.get(PydanticObjectId(deal_id))
    except:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    if not deal or deal.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Deal not found")
    
    # Add note
    note = Note(
        content=note_data.content,
        author_id=str(current_user.id),
        author_name=current_user.full_name
    )
    deal.notes.append(note)
    
    # Add activity
    deal.activities.append(Activity(
        action="note_added",
        description="Added a note",
        user_id=str(current_user.id),
        user_name=current_user.full_name
    ))
    
    deal.updated_at = datetime.utcnow()
    await deal.save()
    
    return deal_to_response(deal)


@router.delete("/{deal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deal(
    deal_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a deal"""
    try:
        deal = await Deal.get(PydanticObjectId(deal_id))
    except:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    if not deal or deal.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Deal not found")
    
    # Reset startup status
    try:
        startup = await Startup.get(PydanticObjectId(deal.startup_id))
        if startup:
            startup.deal_status = "new"
            await startup.save()
    except:
        pass
    
    await deal.delete()
