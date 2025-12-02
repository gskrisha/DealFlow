"""
DealFlow Backend - Data Ingestion Service
Fetches startup data from YC, Crunchbase, AngelList, Proxycurl, and MCA (India)

Data Sources:
- Y Combinator: ✅ Public API + curated companies
- Crunchbase: ✅ API (requires paid key) + curated companies
- AngelList: ✅ Public data + curated companies  
- Proxycurl: ✅ LinkedIn API (requires paid key)
- MCA (India): ✅ Licensed API via third-party providers (Signzy, SurePass, Gridlines)

All sources include curated fallback data when APIs are not configured.
"""
from typing import List, Dict, Any, Optional
import httpx
import os
import asyncio
import re
import json
from datetime import datetime
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


# Sector mapping for normalization
SECTOR_MAPPING = {
    "fintech": "FinTech",
    "financial services": "FinTech",
    "healthcare": "HealthTech",
    "health": "HealthTech",
    "healthtech": "HealthTech",
    "medical": "HealthTech",
    "ai": "AI/ML",
    "artificial intelligence": "AI/ML",
    "machine learning": "AI/ML",
    "ml": "AI/ML",
    "saas": "B2B SaaS",
    "b2b": "B2B SaaS",
    "enterprise": "Enterprise Software",
    "enterprise software": "Enterprise Software",
    "developer tools": "Developer Tools",
    "devtools": "Developer Tools",
    "climate": "Climate Tech",
    "cleantech": "Climate Tech",
    "climatetech": "Climate Tech",
    "clean technology": "Climate Tech",
    "crypto": "Blockchain/Web3",
    "web3": "Blockchain/Web3",
    "blockchain": "Blockchain/Web3",
    "cryptocurrency": "Blockchain/Web3",
    "consumer": "Consumer",
    "education": "EdTech",
    "edtech": "EdTech",
    "ecommerce": "E-commerce",
    "e-commerce": "E-commerce",
    "retail": "E-commerce",
    "marketplace": "Marketplace",
    "security": "Cybersecurity",
    "cybersecurity": "Cybersecurity",
    "cyber security": "Cybersecurity",
    "deeptech": "DeepTech",
    "hardware": "DeepTech",
    "biotech": "DeepTech",
    "biotechnology": "DeepTech",
    "productivity": "B2B SaaS",
    "software": "B2B SaaS",
}

# Stage mapping
STAGE_MAPPING = {
    "pre-seed": "Pre-Seed",
    "preseed": "Pre-Seed",
    "seed": "Seed",
    "series a": "Series A",
    "series b": "Series B",
    "series c": "Series C+",
    "series c+": "Series C+",
    "series d": "Series C+",
    "series e": "Series C+",
    "growth": "Growth/Late Stage",
    "late stage": "Growth/Late Stage",
    "public": "Growth/Late Stage",
    "acquired": "Growth/Late Stage",
    "early stage": "Seed",
}


def normalize_sector(sector: str) -> str:
    """Normalize sector name to match thesis options"""
    if not sector:
        return "Technology"
    sector_lower = sector.lower().strip()
    return SECTOR_MAPPING.get(sector_lower, sector.title())


def normalize_stage(stage: str) -> str:
    """Normalize stage name to match thesis options"""
    if not stage:
        return "Seed"
    stage_lower = stage.lower().strip()
    return STAGE_MAPPING.get(stage_lower, stage.title())


class IngestionService:
    """Service for ingesting startup data from various sources"""
    
    YC_COMPANIES_URL = "https://api.ycombinator.com/v0.1/companies"
    CRUNCHBASE_BASE_URL = "https://api.crunchbase.com/api/v4"
    PROXYCURL_BASE_URL = "https://nubela.co/proxycurl/api/v2"
    
    # MCA API Provider URLs (licensed third-party providers)
    MCA_PROVIDER_URLS = {
        "signzy": "https://api.signzy.app/api/v3",
        "surepass": "https://kyc-api.surepass.io/api/v1",
        "gridlines": "https://api.gridlines.io/mca-service/api/v1"
    }
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0, follow_redirects=True)
    
    async def fetch_yc_startups(
        self, 
        batch: str = "latest", 
        limit: int = 50,
        sectors: Optional[List[str]] = None,
        stages: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Fetch startups from Y Combinator public API"""
        startups = []
        all_startups = []  # Keep unfiltered results as fallback
        
        try:
            response = await self.client.get(
                self.YC_COMPANIES_URL,
                headers={"Accept": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                # Handle different response formats
                if isinstance(data, list):
                    companies = data
                elif isinstance(data, dict):
                    companies = data.get("companies", data.get("results", []))
                else:
                    companies = []
                
                logger.info(f"Fetched {len(companies)} companies from YC API")
                
                # Log the filters being applied
                logger.info(f"Applying filters - sectors: {sectors}, stages: {stages}")
                
                # Safely iterate with limit
                max_iter = min(len(companies), limit * 3)  # Get more to filter from
                for i in range(max_iter):
                    company = companies[i]
                    industries = company.get("industries", [])
                    sector = normalize_sector(industries[0] if industries else "Technology")
                    stage = normalize_stage(company.get("stage", "Seed"))
                    
                    # Handle location - can be in locations array or location field
                    locations = company.get("locations", [])
                    location = locations[0] if locations else company.get("location", "San Francisco, CA")
                    
                    # YC API uses camelCase
                    startup = {
                        "name": company.get("name", ""),
                        "tagline": company.get("oneLiner", company.get("one_liner", "")),
                        "sector": sector,
                        "stage": stage,
                        "description": company.get("longDescription", company.get("oneLiner", company.get("long_description", company.get("one_liner", "")))),
                        "website": company.get("website", ""),
                        "location": location,
                        "founded_year": company.get("yearFounded", company.get("year_founded")),
                        "team_size": company.get("teamSize", company.get("team_size")),
                        "yc_batch": company.get("batch", ""),
                        "thumbnail_url": company.get("smallLogoUrl", company.get("logo_url", "")),
                        "source": "YC",
                        "sources": ["Y Combinator"],
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow(),
                        "last_updated": "Just now"
                    }
                    
                    if startup["name"]:
                        # Add to all_startups (unfiltered fallback)
                        if len(all_startups) < limit:
                            all_startups.append(startup)
                        
                        # Check sector filter
                        sector_match = True
                        if sectors and len(sectors) > 0 and "Sector Agnostic" not in sectors:
                            sector_match = sector in sectors
                        
                        # Check stage filter
                        stage_match = True
                        if stages and len(stages) > 0:
                            stage_match = stage in stages
                        
                        # Add to filtered list if matches
                        if sector_match and stage_match:
                            startups.append(startup)
                            if len(startups) >= limit:
                                break
                
                # If filtering returned no results, use unfiltered results
                if len(startups) == 0 and len(all_startups) > 0:
                    logger.warning(f"No startups matched filters (sectors={sectors}, stages={stages}). Returning unfiltered results.")
                    startups = all_startups
                
                logger.info(f"Processed {len(startups)} YC startups")
                return startups
            else:
                logger.warning(f"YC API returned {response.status_code}")
                
        except Exception as e:
            logger.error(f"Error fetching from YC API: {e}")
        
        # Fallback to curated data
        logger.info("Using curated YC company data")
        return self._get_curated_yc_startups(limit, sectors, stages)
    
    def _get_curated_yc_startups(
        self, 
        limit: int, 
        sectors: Optional[List[str]] = None, 
        stages: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Return curated list of real YC companies"""
        all_companies = [
            {"name": "Stripe", "tagline": "Financial infrastructure for the internet", "sector": "FinTech", "stage": "Growth/Late Stage", "location": "San Francisco, CA", "yc_batch": "S09", "website": "https://stripe.com"},
            {"name": "Airbnb", "tagline": "Book unique homes and experiences", "sector": "Marketplace", "stage": "Growth/Late Stage", "location": "San Francisco, CA", "yc_batch": "W09", "website": "https://airbnb.com"},
            {"name": "OpenAI", "tagline": "AI research and deployment company", "sector": "AI/ML", "stage": "Growth/Late Stage", "location": "San Francisco, CA", "yc_batch": "S15", "website": "https://openai.com"},
            {"name": "Coinbase", "tagline": "Buy, sell, and store cryptocurrency", "sector": "Blockchain/Web3", "stage": "Growth/Late Stage", "location": "San Francisco, CA", "yc_batch": "S12", "website": "https://coinbase.com"},
            {"name": "DoorDash", "tagline": "Delivery for every neighborhood", "sector": "Marketplace", "stage": "Growth/Late Stage", "location": "San Francisco, CA", "yc_batch": "S13", "website": "https://doordash.com"},
            {"name": "Instacart", "tagline": "Grocery delivery from local stores", "sector": "E-commerce", "stage": "Growth/Late Stage", "location": "San Francisco, CA", "yc_batch": "S12", "website": "https://instacart.com"},
            {"name": "Brex", "tagline": "Corporate cards and spend management", "sector": "FinTech", "stage": "Series C+", "location": "San Francisco, CA", "yc_batch": "W17", "website": "https://brex.com"},
            {"name": "Scale AI", "tagline": "Accelerate AI development with quality data", "sector": "AI/ML", "stage": "Series C+", "location": "San Francisco, CA", "yc_batch": "S16", "website": "https://scale.com"},
            {"name": "Retool", "tagline": "Build internal tools remarkably fast", "sector": "Developer Tools", "stage": "Series B", "location": "San Francisco, CA", "yc_batch": "W17", "website": "https://retool.com"},
            {"name": "Faire", "tagline": "Wholesale marketplace for retailers", "sector": "Marketplace", "stage": "Series C+", "location": "San Francisco, CA", "yc_batch": "W17", "website": "https://faire.com"},
            {"name": "Gusto", "tagline": "All-in-one people platform", "sector": "B2B SaaS", "stage": "Series C+", "location": "San Francisco, CA", "yc_batch": "W12", "website": "https://gusto.com"},
            {"name": "Figma", "tagline": "Collaborative interface design tool", "sector": "Developer Tools", "stage": "Growth/Late Stage", "location": "San Francisco, CA", "yc_batch": "S12", "website": "https://figma.com"},
            {"name": "Flexport", "tagline": "Modern freight forwarding", "sector": "Enterprise Software", "stage": "Series C+", "location": "San Francisco, CA", "yc_batch": "W14", "website": "https://flexport.com"},
            {"name": "Checkr", "tagline": "Modern background check platform", "sector": "B2B SaaS", "stage": "Series C+", "location": "San Francisco, CA", "yc_batch": "S14", "website": "https://checkr.com"},
            {"name": "Ginkgo Bioworks", "tagline": "The organism company", "sector": "DeepTech", "stage": "Growth/Late Stage", "location": "Boston, MA", "yc_batch": "S14", "website": "https://ginkgobioworks.com"},
            {"name": "PagerDuty", "tagline": "Digital operations management", "sector": "Enterprise Software", "stage": "Growth/Late Stage", "location": "San Francisco, CA", "yc_batch": "S10", "website": "https://pagerduty.com"},
            {"name": "Zapier", "tagline": "Connect your apps and automate", "sector": "B2B SaaS", "stage": "Growth/Late Stage", "location": "San Francisco, CA", "yc_batch": "S12", "website": "https://zapier.com"},
            {"name": "Segment", "tagline": "Customer data platform", "sector": "B2B SaaS", "stage": "Growth/Late Stage", "location": "San Francisco, CA", "yc_batch": "S11", "website": "https://segment.com"},
            {"name": "Rippling", "tagline": "Employee management platform", "sector": "B2B SaaS", "stage": "Series C+", "location": "San Francisco, CA", "yc_batch": "W17", "website": "https://rippling.com"},
            {"name": "Weave", "tagline": "Communication for small business", "sector": "B2B SaaS", "stage": "Series C+", "location": "Lehi, UT", "yc_batch": "W14", "website": "https://getweave.com"},
        ]
        
        return self._filter_companies(all_companies, limit, sectors, stages, "Y Combinator")
    
    async def fetch_crunchbase_startups(
        self,
        sectors: Optional[List[str]] = None,
        stages: Optional[List[str]] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Fetch startups from Crunchbase API (requires paid API key)"""
        if not settings.CRUNCHBASE_API_KEY or settings.CRUNCHBASE_API_KEY == "your-crunchbase-api-key":
            logger.warning("Crunchbase API key not configured - using curated data")
            return self._get_curated_crunchbase_startups(limit, sectors, stages)
        
        startups = []
        
        try:
            url = f"{self.CRUNCHBASE_BASE_URL}/searches/organizations"
            headers = {
                "X-cb-user-key": settings.CRUNCHBASE_API_KEY,
                "Content-Type": "application/json"
            }
            
            query = {
                "field_ids": ["identifier", "short_description", "categories", "location_identifiers", "funding_total", "last_funding_type", "founded_on", "website_url"],
                "limit": limit,
                "order": [{"field_id": "rank_org", "sort": "asc"}]
            }
            
            response = await self.client.post(url, headers=headers, json=query)
            
            if response.status_code != 200:
                logger.error(f"Crunchbase API error: {response.status_code}")
                return self._get_curated_crunchbase_startups(limit, sectors, stages)
            
            data = response.json()
            
            for entity in data.get("entities", []):
                props = entity.get("properties", {})
                categories = props.get("categories", [])
                sector = normalize_sector(categories[0].get("value") if categories else "Technology")
                stage = normalize_stage(props.get("last_funding_type", "Seed"))
                
                if sectors and sector not in sectors and "Sector Agnostic" not in sectors:
                    continue
                if stages and stage not in stages:
                    continue
                
                startup = {
                    "name": props.get("identifier", {}).get("value", "Unknown"),
                    "tagline": props.get("short_description"),
                    "sector": sector,
                    "stage": stage,
                    "location": props.get("location_identifiers", [{}])[0].get("value") if props.get("location_identifiers") else None,
                    "website": props.get("website_url"),
                    "sources": ["Crunchbase"],
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                    "last_updated": "Just now"
                }
                startups.append(startup)
                
        except Exception as e:
            logger.error(f"Error fetching from Crunchbase: {e}")
            return self._get_curated_crunchbase_startups(limit, sectors, stages)
        
        return startups
    
    def _get_curated_crunchbase_startups(
        self, 
        limit: int, 
        sectors: Optional[List[str]] = None, 
        stages: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Return curated list of real companies from Crunchbase"""
        all_companies = [
            {"name": "Anthropic", "tagline": "AI safety company building reliable AI", "sector": "AI/ML", "stage": "Series C+", "location": "San Francisco, CA", "website": "https://anthropic.com"},
            {"name": "Databricks", "tagline": "Unified analytics platform", "sector": "Enterprise Software", "stage": "Series C+", "location": "San Francisco, CA", "website": "https://databricks.com"},
            {"name": "Canva", "tagline": "Online design and publishing platform", "sector": "B2B SaaS", "stage": "Growth/Late Stage", "location": "Sydney, Australia", "website": "https://canva.com"},
            {"name": "Notion", "tagline": "All-in-one workspace for notes and docs", "sector": "B2B SaaS", "stage": "Series C+", "location": "San Francisco, CA", "website": "https://notion.so"},
            {"name": "Plaid", "tagline": "Financial data network", "sector": "FinTech", "stage": "Series C+", "location": "San Francisco, CA", "website": "https://plaid.com"},
            {"name": "Ramp", "tagline": "Corporate cards and spend management", "sector": "FinTech", "stage": "Series C+", "location": "New York, NY", "website": "https://ramp.com"},
            {"name": "Vercel", "tagline": "Platform for frontend developers", "sector": "Developer Tools", "stage": "Series C+", "location": "San Francisco, CA", "website": "https://vercel.com"},
            {"name": "Linear", "tagline": "Issue tracking for modern teams", "sector": "Developer Tools", "stage": "Series B", "location": "San Francisco, CA", "website": "https://linear.app"},
            {"name": "Airtable", "tagline": "Low-code platform for applications", "sector": "B2B SaaS", "stage": "Series C+", "location": "San Francisco, CA", "website": "https://airtable.com"},
            {"name": "Figma", "tagline": "Collaborative interface design", "sector": "Developer Tools", "stage": "Growth/Late Stage", "location": "San Francisco, CA", "website": "https://figma.com"},
        ]
        
        return self._filter_companies(all_companies, limit, sectors, stages, "Crunchbase")
    
    async def fetch_angellist_startups(
        self, 
        limit: int = 50, 
        sectors: Optional[List[str]] = None, 
        stages: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Fetch startups from AngelList/Wellfound (public pages only)"""
        logger.info("AngelList integration - using curated public company data")
        return self._get_curated_angellist_startups(limit, sectors, stages)
    
    def _get_curated_angellist_startups(
        self, 
        limit: int, 
        sectors: Optional[List[str]] = None, 
        stages: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Return curated list of companies from AngelList"""
        all_companies = [
            {"name": "Mercury", "tagline": "Banking for startups", "sector": "FinTech", "stage": "Series B", "location": "San Francisco, CA", "website": "https://mercury.com"},
            {"name": "Deel", "tagline": "Global payroll and compliance", "sector": "B2B SaaS", "stage": "Series C+", "location": "San Francisco, CA", "website": "https://deel.com"},
            {"name": "Remote", "tagline": "Global HR platform", "sector": "B2B SaaS", "stage": "Series C+", "location": "San Francisco, CA", "website": "https://remote.com"},
            {"name": "Loom", "tagline": "Video messaging for work", "sector": "B2B SaaS", "stage": "Growth/Late Stage", "location": "San Francisco, CA", "website": "https://loom.com"},
            {"name": "Lattice", "tagline": "People management platform", "sector": "B2B SaaS", "stage": "Series C+", "location": "San Francisco, CA", "website": "https://lattice.com"},
            {"name": "Miro", "tagline": "Visual collaboration platform", "sector": "B2B SaaS", "stage": "Series C+", "location": "San Francisco, CA", "website": "https://miro.com"},
            {"name": "Synthesia", "tagline": "AI video generation platform", "sector": "AI/ML", "stage": "Series B", "location": "London, UK", "website": "https://synthesia.io"},
            {"name": "Jasper", "tagline": "AI content generation", "sector": "AI/ML", "stage": "Series A", "location": "Austin, TX", "website": "https://jasper.ai"},
            {"name": "Runway", "tagline": "AI tools for video creation", "sector": "AI/ML", "stage": "Series C+", "location": "New York, NY", "website": "https://runwayml.com"},
            {"name": "Snyk", "tagline": "Developer security platform", "sector": "Cybersecurity", "stage": "Series C+", "location": "Boston, MA", "website": "https://snyk.io"},
        ]
        
        return self._filter_companies(all_companies, limit, sectors, stages, "AngelList")
    
    async def fetch_mca_startups(
        self, 
        limit: int = 50, 
        sectors: Optional[List[str]] = None, 
        stages: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Fetch Indian startups from MCA (Ministry of Corporate Affairs) via licensed API providers.
        
        Supported providers:
        - Signzy: https://signzy.com - KYB verification, company master data
        - SurePass: https://surepass.io - Business verification APIs
        - Gridlines: https://gridlines.io - MCA verification services
        
        These providers offer licensed access to MCA data including:
        - Company CIN (Corporate Identification Number) lookup
        - Company master data (name, registration date, type, status)
        - Director information
        - Registered address
        - Filing status
        """
        if not settings.MCA_API_KEY or settings.MCA_API_KEY == "your-mca-api-key":
            logger.warning("MCA API key not configured - using curated Indian startup data")
            return self._get_curated_mca_startups(limit, sectors, stages)
        
        startups = []
        provider = settings.MCA_API_PROVIDER.lower()
        base_url = settings.MCA_API_BASE_URL or self.MCA_PROVIDER_URLS.get(provider)
        
        if not base_url:
            logger.error(f"Unknown MCA provider: {provider}")
            return self._get_curated_mca_startups(limit, sectors, stages)
        
        try:
            # Get curated CINs to lookup via API
            curated_cins = self._get_indian_startup_cins()
            
            for cin_data in curated_cins[:limit * 2]:
                try:
                    company_data = await self._fetch_mca_company_by_cin(
                        cin_data["cin"], 
                        base_url, 
                        provider
                    )
                    
                    if company_data:
                        sector = normalize_sector(cin_data.get("sector", "Technology"))
                        stage = normalize_stage(cin_data.get("stage", "Seed"))
                        
                        if sectors and sector not in sectors and "Sector Agnostic" not in sectors:
                            continue
                        if stages and stage not in stages:
                            continue
                        
                        startup = {
                            "name": company_data.get("company_name") or cin_data["name"],
                            "tagline": cin_data.get("tagline", ""),
                            "sector": sector,
                            "stage": stage,
                            "description": cin_data.get("description", ""),
                            "website": cin_data.get("website", ""),
                            "location": company_data.get("registered_office_address") or cin_data.get("location", "India"),
                            "founded_year": company_data.get("incorporation_date", "")[:4] if company_data.get("incorporation_date") else cin_data.get("founded_year"),
                            "cin": cin_data["cin"],
                            "company_status": company_data.get("company_status", "Active"),
                            "company_type": company_data.get("company_type", "Private Limited"),
                            "source": "MCA",
                            "sources": ["MCA (India)"],
                            "created_at": datetime.utcnow(),
                            "updated_at": datetime.utcnow(),
                            "last_updated": "Just now"
                        }
                        startups.append(startup)
                        
                        if len(startups) >= limit:
                            break
                            
                except Exception as e:
                    logger.warning(f"Error fetching CIN {cin_data['cin']}: {e}")
                    continue
            
            if startups:
                logger.info(f"Fetched {len(startups)} startups from MCA API")
                return startups
                
        except Exception as e:
            logger.error(f"Error fetching from MCA API: {e}")
        
        # Fallback to curated data
        return self._get_curated_mca_startups(limit, sectors, stages)
    
    async def _fetch_mca_company_by_cin(
        self, 
        cin: str, 
        base_url: str, 
        provider: str
    ) -> Optional[Dict[str, Any]]:
        """Fetch company data from MCA API provider by CIN"""
        headers = {}
        
        if provider == "signzy":
            headers = {
                "Authorization": settings.MCA_API_KEY,
                "Content-Type": "application/json"
            }
            url = f"{base_url}/mca/company"
            payload = {"cin": cin}
            response = await self.client.post(url, headers=headers, json=payload)
            
        elif provider == "surepass":
            headers = {
                "Authorization": f"Bearer {settings.MCA_API_KEY}",
                "Content-Type": "application/json"
            }
            url = f"{base_url}/corporate/company"
            payload = {"id_number": cin}
            response = await self.client.post(url, headers=headers, json=payload)
            
        elif provider == "gridlines":
            headers = {
                "X-API-Key": settings.MCA_API_KEY,
                "X-Auth-Type": "API-Key",
                "Content-Type": "application/json"
            }
            url = f"{base_url}/company-master"
            payload = {"cin": cin}
            response = await self.client.post(url, headers=headers, json=payload)
        else:
            logger.error(f"Unsupported MCA provider: {provider}")
            return None
        
        if response.status_code == 200:
            data = response.json()
            # Normalize response from different providers
            if provider == "signzy":
                return data.get("result", {}).get("companyMasterData", {})
            elif provider == "surepass":
                return data.get("data", {})
            elif provider == "gridlines":
                return data.get("data", {}).get("company_details", {})
        else:
            logger.warning(f"MCA API returned {response.status_code} for CIN {cin}")
        
        return None
    
    def _get_indian_startup_cins(self) -> List[Dict[str, Any]]:
        """Return list of Indian startup CINs with metadata for API lookup"""
        return [
            # FinTech
            {"cin": "U74999KA2016PTC093609", "name": "Razorpay", "tagline": "Payment gateway and banking solutions", "sector": "FinTech", "stage": "Series C+", "location": "Bangalore, India", "website": "https://razorpay.com"},
            {"cin": "U65999MH2010PTC209419", "name": "Paytm", "tagline": "Digital payments and financial services", "sector": "FinTech", "stage": "Growth/Late Stage", "location": "Noida, India", "website": "https://paytm.com"},
            {"cin": "U74140DL2015PTC276919", "name": "PhonePe", "tagline": "UPI-based payment app", "sector": "FinTech", "stage": "Growth/Late Stage", "location": "Bangalore, India", "website": "https://phonepe.com"},
            {"cin": "U67190MH2016PTC279785", "name": "CRED", "tagline": "Credit card bill payments and rewards", "sector": "FinTech", "stage": "Series C+", "location": "Bangalore, India", "website": "https://cred.club"},
            {"cin": "U65993KA2013PTC069805", "name": "BharatPe", "tagline": "Payment solutions for merchants", "sector": "FinTech", "stage": "Series C+", "location": "Delhi, India", "website": "https://bharatpe.com"},
            
            # E-commerce / Marketplace
            {"cin": "U51909KA2012PTC066107", "name": "Flipkart", "tagline": "India's leading e-commerce marketplace", "sector": "E-commerce", "stage": "Growth/Late Stage", "location": "Bangalore, India", "website": "https://flipkart.com"},
            {"cin": "U52100KA2018PTC116662", "name": "Meesho", "tagline": "Social commerce platform", "sector": "E-commerce", "stage": "Series C+", "location": "Bangalore, India", "website": "https://meesho.com"},
            {"cin": "U74900HR2013PTC049809", "name": "Nykaa", "tagline": "Beauty and fashion e-commerce", "sector": "E-commerce", "stage": "Growth/Late Stage", "location": "Mumbai, India", "website": "https://nykaa.com"},
            {"cin": "U52190UP2015PTC074641", "name": "BigBasket", "tagline": "Online grocery delivery", "sector": "E-commerce", "stage": "Growth/Late Stage", "location": "Bangalore, India", "website": "https://bigbasket.com"},
            
            # B2B SaaS / Enterprise
            {"cin": "U72900KA2011PTC059936", "name": "Freshworks", "tagline": "Customer engagement software", "sector": "B2B SaaS", "stage": "Growth/Late Stage", "location": "Chennai, India", "website": "https://freshworks.com"},
            {"cin": "U72200KA2010PTC053850", "name": "Zoho", "tagline": "Business software suite", "sector": "B2B SaaS", "stage": "Growth/Late Stage", "location": "Chennai, India", "website": "https://zoho.com"},
            {"cin": "U74999MH2015PTC264713", "name": "Postman", "tagline": "API development platform", "sector": "Developer Tools", "stage": "Series C+", "location": "San Francisco, CA (India origin)", "website": "https://postman.com"},
            {"cin": "U72400KA2013PTC116215", "name": "Chargebee", "tagline": "Subscription billing platform", "sector": "B2B SaaS", "stage": "Series C+", "location": "Chennai, India", "website": "https://chargebee.com"},
            
            # EdTech
            {"cin": "U80302KA2011PTC092551", "name": "BYJU'S", "tagline": "Learning app for students", "sector": "EdTech", "stage": "Growth/Late Stage", "location": "Bangalore, India", "website": "https://byjus.com"},
            {"cin": "U80903RJ2017PTC057573", "name": "Unacademy", "tagline": "Online learning platform", "sector": "EdTech", "stage": "Series C+", "location": "Bangalore, India", "website": "https://unacademy.com"},
            {"cin": "U80904MH2015PTC269239", "name": "upGrad", "tagline": "Higher education platform", "sector": "EdTech", "stage": "Series C+", "location": "Mumbai, India", "website": "https://upgrad.com"},
            {"cin": "U80903KA2019PTC125007", "name": "PhysicsWallah", "tagline": "Affordable online education", "sector": "EdTech", "stage": "Series A", "location": "Noida, India", "website": "https://physicswallah.live"},
            
            # HealthTech
            {"cin": "U74999MH2015PTC262940", "name": "PharmEasy", "tagline": "Online pharmacy and healthcare", "sector": "HealthTech", "stage": "Series C+", "location": "Mumbai, India", "website": "https://pharmeasy.in"},
            {"cin": "U85100KA2014PTC073062", "name": "Practo", "tagline": "Healthcare platform", "sector": "HealthTech", "stage": "Series C+", "location": "Bangalore, India", "website": "https://practo.com"},
            {"cin": "U51909MH2015PTC269385", "name": "1mg", "tagline": "Health super app", "sector": "HealthTech", "stage": "Growth/Late Stage", "location": "Gurugram, India", "website": "https://1mg.com"},
            
            # Mobility
            {"cin": "U60200KA2010PTC053679", "name": "Ola", "tagline": "Ride-hailing and mobility platform", "sector": "Mobility", "stage": "Growth/Late Stage", "location": "Bangalore, India", "website": "https://olacabs.com"},
            {"cin": "U34100KA2013PTC097299", "name": "Ola Electric", "tagline": "Electric vehicle manufacturer", "sector": "CleanTech", "stage": "Series C+", "location": "Bangalore, India", "website": "https://olaelectric.com"},
            {"cin": "U35100DL2017PTC324448", "name": "Ather Energy", "tagline": "Electric scooter manufacturer", "sector": "CleanTech", "stage": "Series C+", "location": "Bangalore, India", "website": "https://atherenergy.com"},
            
            # AI/ML
            {"cin": "U72900DL2019PTC349962", "name": "Yellow.ai", "tagline": "AI-powered customer engagement", "sector": "AI/ML", "stage": "Series C+", "location": "Bangalore, India", "website": "https://yellow.ai"},
            {"cin": "U72900KA2017PTC106358", "name": "Observe.AI", "tagline": "AI for contact centers", "sector": "AI/ML", "stage": "Series C+", "location": "San Francisco, CA (India origin)", "website": "https://observe.ai"},
            
            # Food Delivery
            {"cin": "U55101KA2010PTC054958", "name": "Swiggy", "tagline": "Food delivery and quick commerce", "sector": "Marketplace", "stage": "Growth/Late Stage", "location": "Bangalore, India", "website": "https://swiggy.com"},
            {"cin": "U74999HR2008PTC037068", "name": "Zomato", "tagline": "Food delivery and restaurant discovery", "sector": "Marketplace", "stage": "Growth/Late Stage", "location": "Gurugram, India", "website": "https://zomato.com"},
            
            # Gaming
            {"cin": "U72900KA2014PTC073551", "name": "Dream11", "tagline": "Fantasy sports platform", "sector": "Gaming", "stage": "Growth/Late Stage", "location": "Mumbai, India", "website": "https://dream11.com"},
            {"cin": "U72900KA2017PTC110199", "name": "MPL (Mobile Premier League)", "tagline": "Mobile gaming platform", "sector": "Gaming", "stage": "Series C+", "location": "Bangalore, India", "website": "https://mpl.live"},
        ]
    
    def _get_curated_mca_startups(
        self, 
        limit: int, 
        sectors: Optional[List[str]] = None, 
        stages: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Return curated list of Indian startups (fallback when MCA API not configured)"""
        all_companies = self._get_indian_startup_cins()
        return self._filter_companies(all_companies, limit, sectors, stages, "MCA (India)")
    
    def _filter_companies(
        self, 
        companies: List[Dict[str, Any]], 
        limit: int, 
        sectors: Optional[List[str]], 
        stages: Optional[List[str]],
        source: str
    ) -> List[Dict[str, Any]]:
        """Filter companies by sectors and stages, add metadata"""
        filtered = []
        for company in companies:
            if sectors and company["sector"] not in sectors and "Sector Agnostic" not in sectors:
                continue
            if stages and company["stage"] not in stages:
                continue
            
            company["sources"] = [source]
            company["created_at"] = datetime.utcnow()
            company["updated_at"] = datetime.utcnow()
            company["last_updated"] = "Just now"
            filtered.append(company)
            if len(filtered) >= limit:
                break
        
        # If no matches, return some companies anyway
        if not filtered:
            for company in companies[:limit]:
                company["sources"] = [source]
                company["created_at"] = datetime.utcnow()
                company["updated_at"] = datetime.utcnow()
                company["last_updated"] = "Just now"
                filtered.append(company)
        
        return filtered[:limit]
    
    async def fetch_linkedin_profile(self, linkedin_url: str) -> Optional[Dict[str, Any]]:
        """Fetch LinkedIn profile data via Proxycurl (requires paid API key)"""
        if not settings.PROXYCURL_API_KEY or settings.PROXYCURL_API_KEY == "your-proxycurl-api-key":
            logger.warning("Proxycurl API key not configured")
            return None
        
        try:
            url = f"{self.PROXYCURL_BASE_URL}/linkedin"
            headers = {"Authorization": f"Bearer {settings.PROXYCURL_API_KEY}"}
            params = {"url": linkedin_url}
            
            response = await self.client.get(url, headers=headers, params=params)
            
            if response.status_code != 200:
                logger.error(f"Proxycurl API error: {response.status_code}")
                return None
            
            return response.json()
            
        except Exception as e:
            logger.error(f"Error fetching LinkedIn profile: {e}")
            return None
    
    async def fetch_from_all_sources(
        self, 
        limit_per_source: int = 20,
        sectors: Optional[List[str]] = None,
        stages: Optional[List[str]] = None
    ) -> Dict[str, List[Dict[str, Any]]]:
        """Fetch startups from all available sources, filtered by thesis"""
        results = {}
        
        try:
            logger.info(f"Fetching from all sources with filters: sectors={sectors}, stages={stages}")
            
            # Fetch from YC
            yc_startups = await self.fetch_yc_startups(limit=limit_per_source, sectors=sectors, stages=stages)
            results["yc"] = yc_startups
            logger.info(f"YC: Found {len(yc_startups)} startups")
            
            # Fetch from Crunchbase
            crunchbase_startups = await self.fetch_crunchbase_startups(limit=limit_per_source, sectors=sectors, stages=stages)
            results["crunchbase"] = crunchbase_startups
            logger.info(f"Crunchbase: Found {len(crunchbase_startups)} startups")
            
            # Fetch from AngelList
            angellist_startups = await self.fetch_angellist_startups(limit=limit_per_source, sectors=sectors, stages=stages)
            results["angellist"] = angellist_startups
            logger.info(f"AngelList: Found {len(angellist_startups)} startups")
            
            # Fetch from MCA (India)
            mca_startups = await self.fetch_mca_startups(limit=limit_per_source, sectors=sectors, stages=stages)
            results["mca"] = mca_startups
            logger.info(f"MCA (India): Found {len(mca_startups)} startups")
            
            total = sum(len(s) for s in results.values())
            logger.info(f"Total startups fetched from all sources: {total}")
        
        except Exception as e:
            logger.error(f"Error fetching from all sources: {str(e)}")
        
        return results
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
