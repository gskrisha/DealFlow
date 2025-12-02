"""
DealFlow Backend - Outreach Service
AI-powered outreach message generation
"""
from typing import Dict, Any, Optional
from app.models.startup import Startup
from app.models.user import User
from app.core.config import settings
from loguru import logger
import openai


class OutreachService:
    """Service for generating personalized outreach messages"""
    
    def __init__(self):
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
    
    async def generate_message(
        self,
        startup: Startup,
        user: User,
        message_type: str = "email",
        tone: str = "professional",
        include_thesis_fit: bool = True,
        custom_notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate personalized outreach message"""
        
        # Get founder info
        founder_name = startup.founders[0].name if startup.founders else "Founder"
        founder_background = startup.founders[0].background if startup.founders else ""
        
        # Try AI generation if API key available
        if settings.OPENAI_API_KEY:
            try:
                return await self._generate_with_ai(
                    startup=startup,
                    user=user,
                    founder_name=founder_name,
                    message_type=message_type,
                    tone=tone,
                    include_thesis_fit=include_thesis_fit,
                    custom_notes=custom_notes
                )
            except Exception as e:
                logger.error(f"AI generation failed: {e}")
        
        # Fallback to template-based generation
        return self._generate_from_template(
            startup=startup,
            user=user,
            founder_name=founder_name,
            message_type=message_type,
            tone=tone,
            include_thesis_fit=include_thesis_fit
        )
    
    async def _generate_with_ai(
        self,
        startup: Startup,
        user: User,
        founder_name: str,
        message_type: str,
        tone: str,
        include_thesis_fit: bool,
        custom_notes: Optional[str]
    ) -> Dict[str, Any]:
        """Generate message using OpenAI"""
        
        thesis_context = ""
        if include_thesis_fit and user.thesis:
            thesis_context = f"""
            Our fund focuses on: {', '.join(user.thesis.sectors or [])}
            We invest in: {', '.join(user.thesis.stages or [])} stage
            Check size: ${user.thesis.check_size_min or 'flexible'}k - ${user.thesis.check_size_max or 'flexible'}k
            """
        
        prompt = f"""
        Write a {tone} {message_type} outreach message to {founder_name} at {startup.name}.
        
        About the startup:
        - Company: {startup.name}
        - Tagline: {startup.tagline}
        - Sector: {startup.sector}
        - Stage: {startup.stage}
        - Description: {startup.description}
        - Recent signals: {', '.join(startup.signals[:3]) if startup.signals else 'None'}
        
        Sender: {user.full_name}
        Role: {user.role or 'Investor'}
        Fund: {user.company or 'Investment Fund'}
        {thesis_context}
        
        {f'Additional notes: {custom_notes}' if custom_notes else ''}
        
        Write a compelling, personalized message that:
        1. Shows genuine interest in their specific company
        2. References something specific about them (signals, traction, etc.)
        3. Explains why we'd be a good fit
        4. Has a clear call to action
        5. Is concise (under 200 words)
        
        Format as JSON with "subject" and "body" fields.
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {
                    "role": "system", 
                    "content": "You are an expert VC investor writing personalized outreach emails. Write compelling, genuine messages that get responses."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        
        # Parse JSON response
        import json
        try:
            result = json.loads(content)
            result["personalization_score"] = 85.0  # AI messages are well personalized
            return result
        except:
            # Fallback if JSON parsing fails
            return {
                "subject": f"Interested in {startup.name}",
                "body": content,
                "personalization_score": 80.0
            }
    
    def _generate_from_template(
        self,
        startup: Startup,
        user: User,
        founder_name: str,
        message_type: str,
        tone: str,
        include_thesis_fit: bool
    ) -> Dict[str, Any]:
        """Generate message from templates"""
        
        templates = {
            "email": {
                "professional": {
                    "subject": f"Investment interest in {startup.name}",
                    "body": f"""Hi {founder_name},

I hope this email finds you well. I'm {user.full_name}, {user.role or 'an investor'} at {user.company or 'our fund'}.

I came across {startup.name} and was impressed by what you're building in the {startup.sector} space. {f'The recent news about {startup.signals[0]} caught my attention.' if startup.signals else 'Your approach to solving this problem is compelling.'}

{f'We focus on {", ".join(user.thesis.sectors[:2]) if user.thesis and user.thesis.sectors else startup.sector} companies at the {startup.stage} stage, which seems like a great alignment.' if include_thesis_fit else ''}

I'd love to learn more about {startup.name} and explore if there might be a fit for collaboration. Would you have 20-30 minutes for a call next week?

Looking forward to connecting.

Best regards,
{user.full_name}
{user.company or ''}"""
                },
                "friendly": {
                    "subject": f"Big fan of what {startup.name} is doing!",
                    "body": f"""Hey {founder_name}!

I've been following {startup.name} for a bit now and really love what you're building. {startup.tagline or 'Your solution'} is exactly what the market needs.

{f'Saw you recently {startup.signals[0].lower()} - congrats! 🎉' if startup.signals else 'The traction you\'re getting is impressive!'}

I'm {user.full_name} from {user.company or 'our investment team'}. We back ambitious founders in {startup.sector} and would love to chat and see how we might be helpful.

Free for a quick call sometime?

Cheers,
{user.full_name}"""
                }
            },
            "linkedin": {
                "professional": {
                    "subject": None,
                    "body": f"""Hi {founder_name},

I lead investments at {user.company or 'a VC fund'} focused on {startup.sector}. Impressed by {startup.name} - would love to connect and learn more about your journey.

Best,
{user.full_name}"""
                },
                "friendly": {
                    "subject": None,
                    "body": f"""Hey {founder_name}! 👋

Love what you're building at {startup.name}. We invest in {startup.sector} companies and I'd love to connect!

- {user.full_name}"""
                }
            }
        }
        
        # Get appropriate template
        type_templates = templates.get(message_type, templates["email"])
        tone_template = type_templates.get(tone, type_templates["professional"])
        
        return {
            "subject": tone_template["subject"],
            "body": tone_template["body"],
            "personalization_score": 65.0  # Template messages have lower personalization
        }
    
    def get_templates(self) -> Dict[str, Any]:
        """Get available message templates"""
        return {
            "templates": [
                {
                    "id": "initial_outreach",
                    "name": "Initial Outreach",
                    "type": "email",
                    "description": "First contact with a founder"
                },
                {
                    "id": "follow_up",
                    "name": "Follow Up",
                    "type": "email",
                    "description": "Following up on previous outreach"
                },
                {
                    "id": "intro_request",
                    "name": "Intro Request",
                    "type": "email",
                    "description": "Requesting an introduction from a mutual connection"
                },
                {
                    "id": "linkedin_connect",
                    "name": "LinkedIn Connection",
                    "type": "linkedin",
                    "description": "Brief LinkedIn connection request"
                }
            ]
        }
