"""
DealFlow Backend - Discovery Routes
For data ingestion and startup discovery
"""
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends, BackgroundTasks
from pydantic import BaseModel, Field
import uuid
import asyncio
import logging
from app.models.user import User
from app.models.startup import Startup
from app.models.discovery import DiscoveryJob, DiscoveryResult, DiscoverySource, DiscoveryInsight
from app.api.deps import get_current_user, get_optional_user
from app.services.ingestion import IngestionService
from app.services.scoring import ScoringService
from beanie import PydanticObjectId

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/discovery", tags=["Discovery"])


class DiscoveryRunRequest(BaseModel):
    """Request to run discovery"""
    sources: List[str] = ["yc"]  # yc, crunchbase, angellist, mca
    sectors: Optional[List[str]] = None
    stages: Optional[List[str]] = None
    limit_per_source: int = 20


class DiscoveryRunResponse(BaseModel):
    """Response from discovery run"""
    job_id: str
    status: str
    message: str
    startups_found: int = 0


class DiscoveryStatusResponse(BaseModel):
    """Discovery job status"""
    job_id: str
    status: str  # pending, running, completed, failed
    progress: int
    startups_found: int
    startups_added: int
    current_source: Optional[str] = None
    errors: List[str]
    filters_matched: bool = True  # Whether thesis filters matched any results
    applied_filters: Optional[Dict[str, Any]] = None  # Filters that were applied
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class DiscoveryResultResponse(BaseModel):
    """Single discovery result"""
    id: Optional[str] = None
    name: str
    sector: str
    stage: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    tagline: Optional[str] = None
    sources: List[Dict[str, Any]]
    discovery_score: float
    fit_score: Optional[float] = None
    is_saved: bool = False


# In-memory job tracking (use Redis/database in production for persistence)
discovery_jobs: Dict[str, Dict[str, Any]] = {}


async def run_discovery_job(
    job_id: str,
    ingestion_service: IngestionService,
    scoring_service: ScoringService,
    sources: List[str],
    limit_per_source: int,
    user_id: Optional[str] = None,
    sectors: Optional[List[str]] = None,
    stages: Optional[List[str]] = None
):
    """
    Background task to run discovery job
    Fetches from APIs, stores in MongoDB, generates insights
    Filters results based on user thesis (sectors, stages)
    """
    try:
        if job_id not in discovery_jobs:
            return
        
        job_data = discovery_jobs[job_id]
        job_data["status"] = "running"
        job_data["started_at"] = datetime.utcnow()
        
        logger.info(f"Starting discovery job {job_id} with sectors={sectors}, stages={stages}")
        
        total_startups = 0
        total_added = 0
        
        # Fetch from each source with thesis filtering
        for source in sources:
            try:
                job_data["current_source"] = source
                job_data["progress"] = int((sources.index(source) / len(sources)) * 50)
                
                logger.info(f"Fetching from source: {source} with filters: sectors={sectors}, stages={stages}")
                
                if source.lower() == "yc":
                    startups_data = await ingestion_service.fetch_yc_startups(
                        limit=limit_per_source,
                        sectors=sectors,
                        stages=stages
                    )
                elif source.lower() == "crunchbase":
                    startups_data = await ingestion_service.fetch_crunchbase_startups(
                        limit=limit_per_source,
                        sectors=sectors,
                        stages=stages
                    )
                elif source.lower() == "angellist":
                    startups_data = await ingestion_service.fetch_angellist_startups(
                        limit=limit_per_source,
                        sectors=sectors,
                        stages=stages
                    )
                elif source.lower() == "mca":
                    startups_data = await ingestion_service.fetch_mca_startups(
                        limit=limit_per_source,
                        sectors=sectors,
                        stages=stages
                    )
                else:
                    logger.warning(f"Unknown source: {source}")
                    continue
                
                total_startups += len(startups_data)
                
                # Process and store each startup
                for startup_data in startups_data:
                    try:
                        # Create discovery result
                        discovery_result = DiscoveryResult(
                            job_id=job_id,
                            user_id=str(user_id) if user_id else None,
                            name=startup_data.get("name", ""),
                            sector=startup_data.get("sector", "Technology"),
                            stage=startup_data.get("stage"),
                            location=startup_data.get("location"),
                            website=startup_data.get("website"),
                            description=startup_data.get("description") or startup_data.get("tagline", ""),
                            tagline=startup_data.get("tagline", ""),
                            sources=[
                                DiscoverySource(
                                    name=source.lower(),
                                    url=startup_data.get("website"),
                                    relevance_score=0.8
                                )
                            ],
                            discovery_score=75  # Score on 0-100 scale
                        )
                        
                        # Generate AI insights
                        try:
                            insights = await scoring_service.generate_insights(startup_data)
                            if insights:
                                discovery_result.ai_insights = insights
                        except Exception as e:
                            logger.warning(f"Could not generate insights for {startup_data.get('name')}: {e}")
                        
                        # Calculate fit score
                        try:
                            fit_score = await scoring_service.calculate_fit_score(startup_data)
                            discovery_result.fit_score = fit_score
                        except Exception as e:
                            logger.warning(f"Could not calculate fit score: {e}")
                        
                        # Save to MongoDB
                        try:
                            await discovery_result.save()
                            total_added += 1
                            logger.info(f"Saved startup: {startup_data.get('name')}")
                        except Exception as save_error:
                            logger.error(f"Failed to save startup {startup_data.get('name')}: {save_error}")
                            job_data["errors"].append(f"Save error for {startup_data.get('name')}: {str(save_error)}")
                    except Exception as e:
                        logger.error(f"Error processing startup {startup_data.get('name')}: {e}")
                        job_data["errors"].append(f"Error processing {startup_data.get('name')}: {str(e)}")
                        continue
                
            except Exception as e:
                logger.error(f"Error fetching from {source}: {e}")
                job_data["errors"].append(f"Error fetching from {source}: {str(e)}")
                continue
        
        # Update job status
        job_data["status"] = "completed"
        job_data["progress"] = 100
        job_data["startups_found"] = total_startups
        job_data["startups_added"] = total_added
        job_data["completed_at"] = datetime.utcnow()
        
        # Check if any results matched the filters
        # If we have results but they don't match the requested sectors/stages, filters didn't match
        if total_added > 0 and (sectors or stages):
            # Get the saved results and check if any match the filters
            saved_results = await DiscoveryResult.find({"job_id": job_id}).to_list()
            filters_matched = False
            for result in saved_results:
                sector_ok = not sectors or len(sectors) == 0 or result.sector in sectors or "Sector Agnostic" in sectors
                stage_ok = not stages or len(stages) == 0 or result.stage in stages
                if sector_ok and stage_ok:
                    filters_matched = True
                    break
            job_data["filters_matched"] = filters_matched
            if not filters_matched:
                logger.warning(f"Discovery job {job_id}: No results matched filters. Showing all results instead.")
        
        logger.info(f"Discovery job {job_id} completed. Added {total_added} startups from {total_startups} found")
        
    except Exception as e:
        logger.error(f"Discovery job {job_id} failed: {e}")
        job_data["status"] = "failed"
        job_data["errors"].append(str(e))
        job_data["completed_at"] = datetime.utcnow()


@router.post("/run", response_model=DiscoveryRunResponse)
async def start_discovery(
    request: DiscoveryRunRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_optional_user)
):
    """
    Start an AI discovery job
    Fetches data from specified sources and stores in MongoDB
    Filters based on user's thesis preferences if available
    
    Example sources:
    - yc: Y Combinator
    - crunchbase: Crunchbase
    - angellist: AngelList (Wellfound)
    """
    try:
        # Generate job ID
        job_id = str(uuid.uuid4())
        
        # Determine sectors and stages from request or user thesis
        sectors = request.sectors
        stages = request.stages
        
        # If no filters provided in request, use user's thesis preferences
        if current_user and current_user.thesis:
            thesis = current_user.thesis
            if not sectors and thesis.sectors:
                sectors = thesis.sectors
                logger.info(f"Using user thesis sectors: {sectors}")
            if not stages and thesis.stages:
                stages = thesis.stages
                logger.info(f"Using user thesis stages: {stages}")
        
        # Initialize job tracking
        discovery_jobs[job_id] = {
            "status": "pending",
            "progress": 0,
            "startups_found": 0,
            "startups_added": 0,
            "errors": [],
            "filters_matched": True,  # Will be set to False if no matches found
            "applied_filters": {
                "sectors": sectors or [],
                "stages": stages or [],
            },
            "created_at": datetime.utcnow(),
            "started_at": None,
            "completed_at": None,
            "current_source": None,
            "filters": {
                "sectors": sectors,
                "stages": stages
            }
        }
        
        # Initialize services
        ingestion_service = IngestionService()
        scoring_service = ScoringService()
        
        # Add background task with thesis filters
        background_tasks.add_task(
            run_discovery_job,
            job_id=job_id,
            ingestion_service=ingestion_service,
            scoring_service=scoring_service,
            sources=request.sources,
            limit_per_source=request.limit_per_source,
            user_id=current_user.id if current_user else None,
            sectors=sectors,
            stages=stages
        )
        
        filters_msg = ""
        if sectors:
            filters_msg += f" Filtering by sectors: {', '.join(sectors)}."
        if stages:
            filters_msg += f" Filtering by stages: {', '.join(stages)}."
        
        logger.info(f"Discovery job {job_id} started by user {current_user.id if current_user else 'anonymous'}.{filters_msg}")
        
        return DiscoveryRunResponse(
            job_id=job_id,
            status="pending",
            message=f"Discovery job started. Fetching from sources: {', '.join(request.sources)}.{filters_msg}"
        )
    
    except Exception as e:
        logger.error(f"Error starting discovery job: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/jobs/{job_id}", response_model=DiscoveryStatusResponse)
async def get_discovery_status(job_id: str):
    """
    Get the status of a discovery job
    """
    if job_id not in discovery_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job_data = discovery_jobs[job_id]
    
    return DiscoveryStatusResponse(
        job_id=job_id,
        status=job_data["status"],
        progress=job_data["progress"],
        startups_found=job_data["startups_found"],
        startups_added=job_data["startups_added"],
        current_source=job_data.get("current_source"),
        errors=job_data["errors"],
        filters_matched=job_data.get("filters_matched", True),
        applied_filters=job_data.get("applied_filters"),
        created_at=job_data["created_at"],
        started_at=job_data.get("started_at"),
        completed_at=job_data.get("completed_at")
    )


@router.get("/jobs/{job_id}/results", response_model=List[DiscoveryResultResponse])
async def get_discovery_results(job_id: str, skip: int = 0, limit: int = 20):
    """
    Get discovery results from a completed job
    """
    if job_id not in discovery_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job_data = discovery_jobs[job_id]
    if job_data["status"] not in ["completed", "running"]:
        raise HTTPException(status_code=400, detail=f"Job is {job_data['status']}, cannot fetch results yet")
    
    try:
        # Fetch results from MongoDB
        results = await DiscoveryResult.find({"job_id": job_id}).skip(skip).limit(limit).to_list()
        
        return [
            DiscoveryResultResponse(
                id=str(r.id),
                name=r.name,
                sector=r.sector,
                stage=r.stage,
                location=r.location,
                website=r.website,
                description=r.description,
                tagline=r.tagline or r.description or f"{r.sector} startup",
                sources=[{"name": s.name, "url": s.url, "relevance_score": s.relevance_score} for s in r.sources],
                discovery_score=r.discovery_score,
                fit_score=r.fit_score,
                is_saved=r.is_saved
            )
            for r in results
        ]
    
    except Exception as e:
        logger.error(f"Error fetching discovery results: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/results/{result_id}/save")
async def save_discovery_result(result_id: str, current_user: User = Depends(get_current_user)):
    """
    Save a discovery result as a startup lead
    """
    try:
        result = await DiscoveryResult.get(result_id)
        if not result:
            raise HTTPException(status_code=404, detail="Result not found")
        
        # Mark as saved
        result.is_saved = True
        result.updated_at = datetime.utcnow()
        await result.save()
        
        logger.info(f"User {current_user.id} saved discovery result {result_id}")
        
        return {"message": "Result saved successfully"}
    
    except Exception as e:
        logger.error(f"Error saving discovery result: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/results/{result_id}/pass")
async def pass_discovery_result(result_id: str, current_user: User = Depends(get_current_user)):
    """
    Mark a discovery result as passed
    """
    try:
        result = await DiscoveryResult.get(result_id)
        if not result:
            raise HTTPException(status_code=404, detail="Result not found")
        
        # Mark as passed
        result.is_passed = True
        result.updated_at = datetime.utcnow()
        await result.save()
        
        logger.info(f"User {current_user.id} passed discovery result {result_id}")
        
        return {"message": "Result marked as passed"}
    
    except Exception as e:
        logger.error(f"Error passing discovery result: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/saved")
async def get_saved_discovery_results(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 20
):
    """
    Get all saved discovery results for current user
    """
    try:
        results = await DiscoveryResult.find(
            {"user_id": str(current_user.id), "is_saved": True}
        ).skip(skip).limit(limit).to_list()
        
        return [
            DiscoveryResultResponse(
                id=str(r.id),
                name=r.name,
                sector=r.sector,
                stage=r.stage,
                location=r.location,
                website=r.website,
                description=r.description,
                tagline=r.tagline or r.description or f"{r.sector} startup",
                sources=[{"name": s.name, "url": s.url, "relevance_score": s.relevance_score} for s in r.sources],
                discovery_score=r.discovery_score,
                fit_score=r.fit_score,
                is_saved=r.is_saved
            )
            for r in results
        ]
    
    except Exception as e:
        logger.error(f"Error fetching saved results: {e}")
        raise HTTPException(status_code=500, detail=str(e))
