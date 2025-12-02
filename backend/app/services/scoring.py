"""
DealFlow Backend - AI Scoring Service
Scores startups based on Team, Traction, Market, Fit, and Unicorn Probability
"""
from typing import Dict, Any, Optional
from app.models.startup import Startup, ScoreBreakdown
from app.models.user import FundThesis
from app.core.config import settings
from loguru import logger
import openai


class ScoringService:
    """Service for scoring startups using AI and heuristics"""
    
    def __init__(self):
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
    
    async def calculate_score(
        self,
        startup: Startup,
        thesis: Optional[FundThesis] = None
    ) -> Dict[str, Any]:
        """
        Calculate AI score for a startup
        Returns overall score, breakdown, unicorn probability, and investor fit
        """
        # Calculate individual scores
        team_score = await self._score_team(startup)
        traction_score = await self._score_traction(startup)
        market_score = await self._score_market(startup)
        fit_score = await self._score_fit(startup, thesis)
        
        # Calculate weighted overall score
        weights = {
            "team": 0.30,
            "traction": 0.25,
            "market": 0.25,
            "fit": 0.20
        }
        
        overall_score = (
            team_score * weights["team"] +
            traction_score * weights["traction"] +
            market_score * weights["market"] +
            fit_score * weights["fit"]
        )
        
        # Calculate unicorn probability
        unicorn_probability = await self._calculate_unicorn_probability(
            startup, team_score, traction_score, market_score
        )
        
        # Generate investor fit description
        investor_fit = self._generate_fit_description(
            startup, thesis, fit_score
        )
        
        return {
            "overall_score": round(overall_score, 1),
            "breakdown": ScoreBreakdown(
                team=round(team_score, 1),
                traction=round(traction_score, 1),
                market=round(market_score, 1),
                fit=round(fit_score, 1)
            ),
            "unicorn_probability": round(unicorn_probability, 1),
            "investor_fit": investor_fit
        }
    
    async def _score_team(self, startup: Startup) -> float:
        """Score the founding team"""
        score = 50.0  # Base score
        
        if not startup.founders:
            return score
        
        for founder in startup.founders:
            # Check for strong backgrounds
            background = founder.background.lower() if founder.background else ""
            
            # Ex-FAANG or top companies
            if any(company in background for company in 
                   ["google", "meta", "facebook", "amazon", "apple", "microsoft", 
                    "netflix", "deepmind", "openai", "stripe", "coinbase"]):
                score += 10
            
            # Academic credentials
            if any(school in background for school in 
                   ["stanford", "mit", "harvard", "berkeley", "yale", "princeton"]):
                score += 8
            
            # PhD
            if "phd" in background or "ph.d" in background:
                score += 5
            
            # Serial entrepreneur
            if "serial" in background or "exit" in background:
                score += 10
            
            # Technical co-founder check
            if founder.role and any(role in founder.role.lower() for role in ["cto", "technical"]):
                score += 5
            
            # LinkedIn presence
            if founder.linkedin:
                score += 2
        
        # Multiple founders bonus
        if len(startup.founders) >= 2:
            score += 5
        
        return min(100, score)
    
    async def _score_traction(self, startup: Startup) -> float:
        """Score startup traction based on metrics"""
        score = 50.0  # Base score
        
        if not startup.metrics:
            return score
        
        metrics = startup.metrics
        
        # Revenue scoring
        if metrics.revenue:
            revenue_str = metrics.revenue.lower()
            if "m" in revenue_str:  # Millions
                try:
                    amount = float(revenue_str.replace("$", "").replace("m", "").replace("arr", "").strip())
                    if amount >= 10:
                        score += 30
                    elif amount >= 5:
                        score += 25
                    elif amount >= 1:
                        score += 20
                    else:
                        score += 10
                except:
                    score += 10
            elif "k" in revenue_str:  # Thousands
                score += 5
        
        # Growth scoring
        if metrics.growth:
            growth_str = metrics.growth.replace("+", "").replace("%", "").replace("yoy", "").strip()
            try:
                growth = float(growth_str)
                if growth >= 200:
                    score += 25
                elif growth >= 100:
                    score += 20
                elif growth >= 50:
                    score += 15
                else:
                    score += 5
            except:
                score += 5
        
        # User/Customer base
        if metrics.users:
            users_str = metrics.users.lower()
            if "enterprise" in users_str or "fortune" in users_str:
                score += 15
            elif any(word in users_str for word in ["client", "customer"]):
                score += 10
        
        # Signals scoring
        if startup.signals:
            for signal in startup.signals:
                signal_lower = signal.lower()
                if "y combinator" in signal_lower or "yc" in signal_lower:
                    score += 10
                if "techcrunch" in signal_lower or "featured" in signal_lower:
                    score += 5
                if "partnership" in signal_lower:
                    score += 8
                if "grew" in signal_lower or "growth" in signal_lower:
                    score += 5
        
        return min(100, score)
    
    async def _score_market(self, startup: Startup) -> float:
        """Score market opportunity"""
        score = 60.0  # Base score
        
        # Hot sectors get bonus
        hot_sectors = {
            "ai/ml": 15,
            "ai": 15,
            "healthtech": 12,
            "fintech": 12,
            "climate tech": 15,
            "enterprise saas": 10,
            "developer tools": 10,
            "crypto": 8,
            "cybersecurity": 12,
            "biotech": 12,
        }
        
        sector_lower = startup.sector.lower() if startup.sector else ""
        for sector, bonus in hot_sectors.items():
            if sector in sector_lower:
                score += bonus
                break
        
        # Stage scoring (earlier stage = higher potential)
        stage_scores = {
            "pre-seed": 10,
            "seed": 8,
            "series a": 5,
            "series b": 3,
            "series c": 2,
        }
        
        stage_lower = startup.stage.lower() if startup.stage else ""
        for stage, bonus in stage_scores.items():
            if stage in stage_lower:
                score += bonus
                break
        
        # Location bonus (strong startup ecosystems)
        location_lower = startup.location.lower() if startup.location else ""
        if any(city in location_lower for city in 
               ["san francisco", "new york", "boston", "austin", "seattle", "london"]):
            score += 5
        
        # YC batch bonus
        if startup.yc_batch:
            score += 10
        
        return min(100, score)
    
    async def _score_fit(
        self,
        startup: Startup,
        thesis: Optional[FundThesis]
    ) -> float:
        """Score investor fit based on thesis"""
        if not thesis:
            return 70.0  # Default moderate fit
        
        score = 50.0  # Base score
        
        # Sector match
        if thesis.sectors:
            sector_lower = startup.sector.lower() if startup.sector else ""
            for thesis_sector in thesis.sectors:
                if thesis_sector.lower() in sector_lower or sector_lower in thesis_sector.lower():
                    score += 20
                    break
        
        # Stage match
        if thesis.stages:
            stage_lower = startup.stage.lower() if startup.stage else ""
            for thesis_stage in thesis.stages:
                if thesis_stage.lower() in stage_lower:
                    score += 20
                    break
        
        # Geography match
        if thesis.geographies:
            location_lower = startup.location.lower() if startup.location else ""
            for geo in thesis.geographies:
                if geo.lower() in location_lower:
                    score += 15
                    break
        
        # Anti-portfolio check (negative score)
        if thesis.anti_portfolio:
            sector_lower = startup.sector.lower() if startup.sector else ""
            for anti in thesis.anti_portfolio:
                if anti.lower() in sector_lower:
                    score -= 30
                    break
        
        return max(0, min(100, score))
    
    async def _calculate_unicorn_probability(
        self,
        startup: Startup,
        team_score: float,
        traction_score: float,
        market_score: float
    ) -> float:
        """Calculate probability of becoming a unicorn"""
        # Base probability based on scores
        base_prob = (team_score * 0.35 + traction_score * 0.35 + market_score * 0.30) * 0.9
        
        # Adjustments
        adjustments = 0
        
        # YC companies have higher success rate
        if startup.yc_batch:
            adjustments += 15
        
        # Multiple data sources = more visibility
        if len(startup.sources) >= 3:
            adjustments += 5
        
        # Strong signals
        if startup.signals and len(startup.signals) >= 4:
            adjustments += 5
        
        return min(99, base_prob + adjustments)
    
    def _generate_fit_description(
        self,
        startup: Startup,
        thesis: Optional[FundThesis],
        fit_score: float
    ) -> str:
        """Generate human-readable investor fit description"""
        if not thesis:
            return f"Score: {fit_score}/100. Configure your fund thesis for personalized fit analysis."
        
        matches = []
        
        # Check matches
        if thesis.sectors:
            sector_lower = startup.sector.lower() if startup.sector else ""
            for thesis_sector in thesis.sectors:
                if thesis_sector.lower() in sector_lower or sector_lower in thesis_sector.lower():
                    matches.append(f"{thesis_sector} thesis")
                    break
        
        if thesis.stages:
            stage_lower = startup.stage.lower() if startup.stage else ""
            for thesis_stage in thesis.stages:
                if thesis_stage.lower() in stage_lower:
                    matches.append(f"{thesis_stage} stage")
                    break
        
        if thesis.geographies:
            location_lower = startup.location.lower() if startup.location else ""
            for geo in thesis.geographies:
                if geo.lower() in location_lower:
                    matches.append(f"{geo} geography")
                    break
        
        if fit_score >= 85:
            prefix = "Perfect match"
        elif fit_score >= 70:
            prefix = "Strong fit"
        elif fit_score >= 50:
            prefix = "Moderate fit"
        else:
            prefix = "Limited fit"
        
        if matches:
            return f"{prefix}: {', '.join(matches)}"
        else:
            return f"{prefix}: {startup.sector} in {startup.stage}"
    
    async def score_with_ai(self, startup: Startup) -> Optional[Dict[str, Any]]:
        """
        Use OpenAI to provide enhanced scoring and insights
        This is a premium feature requiring OpenAI API key
        """
        if not settings.OPENAI_API_KEY:
            return None
        
        try:
            prompt = f"""
            Analyze this startup and provide a JSON response with scores (0-100) and brief insights:
            
            Name: {startup.name}
            Sector: {startup.sector}
            Stage: {startup.stage}
            Tagline: {startup.tagline}
            Description: {startup.description}
            Founders: {[f.dict() for f in startup.founders] if startup.founders else 'Unknown'}
            Metrics: {startup.metrics.dict() if startup.metrics else 'Unknown'}
            Signals: {startup.signals}
            
            Provide:
            1. team_score (0-100)
            2. market_score (0-100)
            3. traction_score (0-100)
            4. unicorn_probability (0-100)
            5. key_strengths (list of 3)
            6. key_risks (list of 3)
            7. recommendation (one sentence)
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a VC analyst scoring startups."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            # Parse response
            content = response.choices[0].message.content
            # In production, properly parse the JSON response
            return {"ai_analysis": content}
            
        except Exception as e:
            logger.error(f"OpenAI scoring error: {e}")
            return None

    async def generate_insights(self, startup_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Generate AI insights for a startup (optional feature)
        Returns None if OpenAI API key is not configured
        """
        if not settings.OPENAI_API_KEY:
            return None
        
        try:
            name = startup_data.get("name", "Unknown")
            sector = startup_data.get("sector", "Technology")
            tagline = startup_data.get("tagline", "")
            
            # Simple heuristic-based insights when no API key
            return {
                "summary": f"{name} is a {sector} company",
                "strengths": [f"Operating in {sector} sector"],
                "risks": ["Limited data available"],
                "recommendation": "Further research recommended"
            }
        except Exception as e:
            logger.warning(f"Could not generate insights: {e}")
            return None

    async def calculate_fit_score(self, startup_data: Dict[str, Any], thesis: Optional[FundThesis] = None) -> float:
        """
        Calculate how well a startup fits the investor's thesis
        Returns a score from 0-100
        """
        score = 50.0  # Base score
        
        sector = startup_data.get("sector", "")
        stage = startup_data.get("stage", "")
        
        # If no thesis provided, return base score
        if not thesis:
            return score
        
        # Sector match
        if thesis.sectors:
            if sector in thesis.sectors or "Sector Agnostic" in thesis.sectors:
                score += 25
        
        # Stage match
        if thesis.stages:
            if stage in thesis.stages:
                score += 25
        
        return min(score, 100.0)
