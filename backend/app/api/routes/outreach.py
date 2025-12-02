"""
DealFlow Backend - Outreach Routes
"""
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from beanie import PydanticObjectId
from app.models.outreach import (
    Outreach,
    OutreachCreate,
    OutreachUpdate,
    OutreachResponse,
    OutreachGenerate
)
from app.models.startup import Startup
from app.models.user import User
from app.api.deps import get_current_user, get_optional_user
from app.services.outreach import OutreachService

router = APIRouter(prefix="/outreach", tags=["Outreach"])


def outreach_to_response(outreach: Outreach) -> OutreachResponse:
    """Convert Outreach document to response model"""
    return OutreachResponse(
        id=str(outreach.id),
        startup_id=outreach.startup_id,
        type=outreach.type,
        subject=outreach.subject,
        body=outreach.body,
        recipient_name=outreach.recipient_name,
        status=outreach.status,
        is_ai_generated=outreach.is_ai_generated,
        sent_at=outreach.sent_at,
        created_at=outreach.created_at
    )


@router.get("", response_model=List[OutreachResponse])
async def get_outreach_list(
    current_user: User = Depends(get_optional_user),
    status_filter: Optional[str] = Query(None, alias="status"),
    type_filter: Optional[str] = Query(None, alias="type"),
    skip: int = 0,
    limit: int = 50
):
    """Get all outreach for the current user"""
    # Return empty list if no user
    if current_user is None:
        return []
    
    query = {"user_id": str(current_user.id)}
    
    if status_filter:
        query["status"] = status_filter
    if type_filter:
        query["type"] = type_filter
    
    outreach_list = await Outreach.find(query).sort(
        [("created_at", -1)]
    ).skip(skip).limit(limit).to_list()
    
    return [outreach_to_response(o) for o in outreach_list]


@router.get("/stats")
async def get_outreach_stats(current_user: User = Depends(get_optional_user)):
    """Get outreach statistics"""
    # Return demo stats if no user
    if current_user is None:
        return {
            "total": 47,
            "sent": 47,
            "opened": 32,
            "replied": 12,
            "open_rate": 68,
            "reply_rate": 25,
        }
    
    user_id = str(current_user.id)
    
    total = await Outreach.find({"user_id": user_id}).count()
    sent = await Outreach.find({"user_id": user_id, "status": "sent"}).count()
    opened = await Outreach.find({"user_id": user_id, "status": "opened"}).count()
    replied = await Outreach.find({"user_id": user_id, "status": "replied"}).count()
    
    return {
        "total": total,
        "sent": sent,
        "opened": opened,
        "replied": replied,
        "open_rate": round((opened / sent * 100), 1) if sent > 0 else 0,
        "reply_rate": round((replied / sent * 100), 1) if sent > 0 else 0
    }


@router.get("/{outreach_id}", response_model=OutreachResponse)
async def get_outreach(
    outreach_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific outreach"""
    try:
        outreach = await Outreach.get(PydanticObjectId(outreach_id))
    except:
        raise HTTPException(status_code=404, detail="Outreach not found")
    
    if not outreach or outreach.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Outreach not found")
    
    return outreach_to_response(outreach)


@router.post("", response_model=OutreachResponse, status_code=status.HTTP_201_CREATED)
async def create_outreach(
    outreach_data: OutreachCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new outreach"""
    # Verify startup exists
    try:
        startup = await Startup.get(PydanticObjectId(outreach_data.startup_id))
    except:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    outreach = Outreach(
        user_id=str(current_user.id),
        startup_id=outreach_data.startup_id,
        type=outreach_data.type,
        subject=outreach_data.subject,
        body=outreach_data.body,
        recipient_name=outreach_data.recipient_name,
        recipient_email=outreach_data.recipient_email,
        recipient_linkedin=outreach_data.recipient_linkedin,
        scheduled_for=outreach_data.scheduled_for,
        status="scheduled" if outreach_data.scheduled_for else "draft"
    )
    
    await outreach.insert()
    
    return outreach_to_response(outreach)


@router.post("/generate", response_model=OutreachResponse)
async def generate_outreach(
    request: OutreachGenerate,
    current_user: User = Depends(get_current_user)
):
    """Generate AI-powered outreach message"""
    # Get startup
    try:
        startup = await Startup.get(PydanticObjectId(request.startup_id))
    except:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    # Generate message using AI
    outreach_service = OutreachService()
    generated = await outreach_service.generate_message(
        startup=startup,
        user=current_user,
        message_type=request.type,
        tone=request.tone,
        include_thesis_fit=request.include_thesis_fit,
        custom_notes=request.custom_notes
    )
    
    # Get primary founder
    recipient_name = startup.founders[0].name if startup.founders else startup.name
    
    outreach = Outreach(
        user_id=str(current_user.id),
        startup_id=request.startup_id,
        type=request.type,
        subject=generated.get("subject"),
        body=generated.get("body"),
        recipient_name=recipient_name,
        is_ai_generated=True,
        ai_personalization_score=generated.get("personalization_score"),
        status="draft"
    )
    
    await outreach.insert()
    
    return outreach_to_response(outreach)


@router.put("/{outreach_id}", response_model=OutreachResponse)
async def update_outreach(
    outreach_id: str,
    outreach_data: OutreachUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update an outreach"""
    try:
        outreach = await Outreach.get(PydanticObjectId(outreach_id))
    except:
        raise HTTPException(status_code=404, detail="Outreach not found")
    
    if not outreach or outreach.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Outreach not found")
    
    # Update fields
    update_dict = outreach_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(outreach, key, value)
    
    outreach.updated_at = datetime.utcnow()
    await outreach.save()
    
    return outreach_to_response(outreach)


@router.post("/{outreach_id}/send", response_model=OutreachResponse)
async def send_outreach(
    outreach_id: str,
    current_user: User = Depends(get_current_user)
):
    """Mark outreach as sent (actual sending would be handled by email service)"""
    try:
        outreach = await Outreach.get(PydanticObjectId(outreach_id))
    except:
        raise HTTPException(status_code=404, detail="Outreach not found")
    
    if not outreach or outreach.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Outreach not found")
    
    if outreach.status not in ["draft", "scheduled"]:
        raise HTTPException(status_code=400, detail="Outreach already sent")
    
    # In production, this would integrate with email service
    outreach.status = "sent"
    outreach.sent_at = datetime.utcnow()
    outreach.updated_at = datetime.utcnow()
    await outreach.save()
    
    return outreach_to_response(outreach)


@router.delete("/{outreach_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_outreach(
    outreach_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete an outreach"""
    try:
        outreach = await Outreach.get(PydanticObjectId(outreach_id))
    except:
        raise HTTPException(status_code=404, detail="Outreach not found")
    
    if not outreach or outreach.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Outreach not found")
    
    await outreach.delete()
