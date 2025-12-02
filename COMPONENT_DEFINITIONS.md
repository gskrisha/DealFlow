# 📚 Component Definitions - Simple English Explanation

## 🏗️ Main Components (Pages)

### **App.jsx**
**What it does:** The brain of the entire application. It decides which page to show based on whether the user is logged in or not.
- **Checks:** Are you logged in? Have you set up your fund? 
- **Decisions:** Show login page → setup page → main dashboard
- **Uses:** localStorage to remember if you're logged in

---

### **main.jsx**
**What it does:** The starting point of the application. It loads App.jsx and puts it on the screen.
- **Simple:** It's like turning on the application
- **Does:** Loads App.jsx into the webpage

---

### **LoginPage.jsx**
**What it does:** The login screen where users enter their email/password or use Google/GitHub/LinkedIn to sign in.
- **Shows:** Email and password input fields
- **Has:** Social login buttons (Google, GitHub, LinkedIn)
- **Does:** Checks if credentials are correct and logs user in
- **Next:** After login, goes to onboarding or dashboard

---

### **FundThesisOnboarding.jsx**
**What it does:** A wizard that asks new users about their investment fund (name, strategy, preferences).
- **Asks:** Fund name, investment strategy, target sectors, etc.
- **Saves:** Information to localStorage
- **Purpose:** Sets up the user's fund profile before they see the main dashboard
- **Next:** After completion, shows main dashboard

---

### **Dashboard.jsx**
**What it does:** The main menu/navigation hub. Shows all the different sections like Overview, Deal Tracker, Inbound Deals, etc.
- **Contains:** Navigation menu with 6-8 main sections
- **Shows:** The main page layout and header
- **Does:** Lets users click to go to different parts of the app

---

## 📊 Dashboard Sections (Sub-Pages)

### **OverviewDashboard.jsx**
**What it does:** Shows a summary of all important information - stats, charts, key metrics.
- **Shows:** 
  - Total deals in pipeline
  - Money invested
  - Recent activities
  - Performance charts
- **Purpose:** Quick overview of fund performance at a glance

---

### **DiscoveryFeed.jsx**
**What it does:** A news feed showing new investment opportunities and deals available.
- **Shows:** 
  - New startup opportunities
  - Funding announcements
  - Market news
  - Deal suggestions
- **Like:** LinkedIn feed but for investment deals

---

### **DealTracker.jsx**
**What it does:** Shows all deals in different stages (New → Review → Due Diligence → Partner → Term Sheet → Closed).
- **Shows:** Pipeline stages with deal count in each stage
- **Helps:** Track where each deal is in the process
- **Purpose:** Organize deals by their current status

---

### **OutreachCenter.jsx** (or In Bound Deals)
**What it does:** Shows inbound messages and pitches from entrepreneurs seeking investment.
- **Contains:**
  - Messages from founders
  - Pitch deck submissions
  - Contact information
  - AI scoring of opportunities
- **Shows:** Which deals are "hot" and which need attention

---

### **Intelligence.jsx**
**What it does:** AI-powered insights and analytics about market trends and opportunities.
- **Shows:**
  - Market analysis
  - Trending sectors
  - AI recommendations
  - Deal insights
- **Purpose:** Help you make better investment decisions

---

### **ThesisSettings.jsx**
**What it does:** Settings page where users can change their fund's investment strategy and preferences.
- **Allows:** 
  - Update fund name
  - Change investment strategy
  - Set preferred sectors
  - Update investment amount range
- **Like:** Settings in any app

---

### **LandingPage.jsx**
**What it does:** The home/welcome page (usually shown to visitors not yet logged in).
- **Shows:**
  - What DealFlow is
  - Features overview
  - Call to action (Sign up/Login)
  - How it works

---

## 🔄 In-Bound Deals Section (in Flow/) - The NEW REDESIGNED UI

### **in Flow/Dashboard.jsx**
**What it does:** Main dashboard for inbound deals. Shows messages, deals, and AI insights all in one place.
- **Top Section:** 4 key stats cards (Unread Messages, Hot Deals, AI Confidence, Response Rate)
- **Left Side:** Messages and deal submissions
- **Right Side:** Quick actions, hot deals list, pipeline stages, AI insights
- **Features:** 
  - Scrollable message list (shows 3 rows, scroll for more)
  - Scrollable deal cards (shows 3 cards, scroll for more)
  - Real-time filtering and sorting

---

### **MessageFeed.jsx**
**What it does:** Displays a list of messages/pitches from entrepreneurs.
- **Shows:** Multiple MessageCard components
- **Does:** Filters and sorts based on user selection
- **Connected to:** MessageCard (each item)

---

### **MessageCard.jsx**
**What it does:** A single message card showing one pitch/message from an entrepreneur.
- **Shows:**
  - Sender's name and picture
  - Message preview/title
  - AI confidence score (0-100%)
  - Industry/sector tag
  - Action buttons (Reply, Review, Schedule)
- **Has:** Left colored border (orange if "hot", gray if normal)
- **Animation:** Pulsing score, hover effects

---

### **FilterBar.jsx**
**What it does:** Allows users to filter and sort messages by sector or priority.
- **Options:**
  - Filter by sector (Tech, Healthcare, Finance, etc.)
  - Sort by AI Priority, Recent, Funding Amount, Sector
- **Shows:** Emoji icons for better visual understanding (🤖 AI, ⏰ Recent, 💰 Funding, 📊 Sector)

---

### **DealCard.jsx**
**What it does:** Shows a deal/pitch submission with company info and key metrics.
- **Shows:**
  - Company logo/thumbnail
  - How much money they're seeking
  - Company valuation
  - Key highlights (Growth, Technology, Market)
  - Action buttons (Review Pitch, Schedule Call, Share)
- **Has:** Smooth animations and hover effects

---

### **HotDeals.jsx**
**What it does:** Shows the top 5 "hottest" deals that need attention.
- **Shows:** Ranked list of highest priority deals
- **Has:** 
  - Rotating flame icon animation
  - Deal ranking (1-5)
  - Deal name and AI score
  - Floating animations
- **Purpose:** Quick access to most important deals

---

### **QuickActions.jsx**
**What it does:** 4 big buttons for common actions users want to do quickly.
- **Buttons:**
  1. Circle Share - Share deals with partners
  2. Upload Deck - Upload a pitch deck
  3. Schedule Call - Set up meeting
  4. Updates - View latest updates
- **Has:** Gradient colors and hover animations

---

### **PipelineStages.jsx**
**What it does:** Shows a visual of the 6 deal pipeline stages with count of deals in each stage.
- **Shows 6 Stages:**
  1. New (incoming deals)
  2. Review (being reviewed)
  3. Due Diligence (deep investigation)
  4. Partner (approval process)
  5. Term Sheet (finalizing terms)
  6. Closed (done deal)
- **Displays:** Number of deals at each stage with animated counters

---

### **AIInsights.jsx**
**What it does:** AI-generated insights about deals, market trends, and recommendations.
- **Shows:**
  - AI learning insights (what it discovered)
  - Trending sectors right now
  - Average response time
  - Deal velocity (how fast deals are moving)
  - Progress on key metrics
- **Has:** Rotating brain icon, animated charts

---

### **LogoScroll.jsx**
**What it does:** A horizontal scrolling carousel of company/partner logos.
- **Shows:** Logos of investors, partners, or featured companies
- **Like:** Logos at bottom of websites
- **Purpose:** Show credibility and partnerships

---

### **UploadDeckPage.jsx**
**What it does:** Page/modal where users can upload a pitch deck document.
- **Does:**
  - File upload area
  - Preview of uploaded file
  - Submit button
- **Used for:** Submitting pitch decks for review

---

### **CircleSharePage.jsx**
**What it does:** Page/modal to share deals with specific people or groups.
- **Does:**
  - Select recipients/people to share with
  - Add personal message
  - Send share
- **Used for:** Team collaboration and deal sharing

---

### **CompanyPortfolio.jsx**
**What it does:** Shows a portfolio/collection of companies (yours or others).
- **Shows:**
  - List of companies
  - Company details
  - Investment amounts
  - Performance metrics

---

### **SelectRecipientsPage.jsx**
**What it does:** Modal to choose who you want to share a deal with.
- **Shows:**
  - List of team members
  - Checkboxes to select recipients
  - Send button
- **Used when:** Sharing deals or documents

---

## 🎨 UI Components (shadcn/ui Library) - Building Blocks

### **Card & CardHeader & CardTitle & CardDescription**
**What:** Container boxes for organizing content.
- **Card:** The whole box
- **CardHeader:** Top section with title
- **CardTitle:** The heading
- **CardDescription:** Description text below title
- **Example:** Message card has title, description, and content

---

### **Button**
**What:** Clickable buttons for actions.
- **Shows:** Text or icon
- **Types:** Primary (colored), Secondary (outline), Danger (red)
- **Example:** "Send", "Reply", "Delete" buttons

---

### **Input & Textarea**
**What:** Text input fields where users type.
- **Input:** Single line (email, password, name)
- **Textarea:** Multiple lines (longer messages)
- **Example:** Email field in login page

---

### **Tabs**
**What:** Multiple panels you can switch between.
- **Shows:** Tab buttons at top (All Messages, LinkedIn, Email, WhatsApp)
- **Does:** Switch between different content
- **Example:** Message tabs in inbound dashboard

---

### **Dialog & Modal**
**What:** Pop-up windows for important messages or forms.
- **Shows:** On top of main content
- **Example:** Delete confirmation, upload deck modal

---

### **Badge**
**What:** Small labels/tags to show status or category.
- **Shows:** Tech, Finance, Healthcare, etc.
- **Colors:** Different colors for different categories
- **Example:** "Hot Deal" badge, sector badges

---

### **Avatar**
**What:** User profile pictures.
- **Shows:** Circular image of person
- **Example:** Sender's picture in message card

---

### **Progress**
**What:** Progress bar showing completion percentage.
- **Shows:** How much is done (0-100%)
- **Example:** File upload progress, deal review progress

---

### **Select & Dropdown**
**What:** List to choose one option from many.
- **Shows:** Dropdown menu when clicked
- **Example:** Choose sector, choose sort order

---

### **Checkbox & Radio**
**What:** Selection options.
- **Checkbox:** Select multiple (tick multiple boxes)
- **Radio:** Select only one (pick one option)
- **Example:** Choose recipients, select priority level

---

### **Popover & Tooltip**
**What:** Small information boxes that appear on hover/click.
- **Popover:** Larger popup with more content
- **Tooltip:** Tiny hint text on hover
- **Example:** Help text, additional details

---

### **Pagination**
**What:** Buttons to go to next/previous pages.
- **Shows:** Previous, page numbers, Next buttons
- **Example:** Go to page 2 of deals

---

### **Skeleton**
**What:** Gray placeholder boxes while content is loading.
- **Shows:** Empty boxes in shape of content
- **Example:** Card placeholders while data loads

---

## 🔧 Utility Files

### **motionVariants.js**
**What it does:** Pre-made animation patterns used across the app.
- **Contains:** Fade-in, slide-in, scale, rotate animations
- **Used by:** All components for smooth animations
- **Purpose:** Keep animations consistent everywhere

---

### **mockData.ts & mockDeals.ts**
**What it does:** Fake data used for testing and demo without a real backend.
- **Contains:** Sample messages, deals, companies, metrics
- **Used for:** Development, testing, showing how the app works
- **Will be replaced:** With real data from backend later

---

### **utils.ts**
**What it does:** Helper functions used throughout the app.
- **Examples:** 
  - Format money ($1,000,000)
  - Format dates (Jan 15, 2024)
  - Calculate percentages
  - Sort arrays

---

### **Tailwind CSS & globals.css**
**What it does:** Styling framework for all colors, fonts, spacing.
- **Does:** Makes everything look pretty
- **Used:** Every component uses Tailwind classes for styling

---

## 🎬 Animation Library - Framer Motion

### **Stagger Animation**
**What:** Makes items appear one after another smoothly.
- **Example:** Message cards fade in one by one, not all at once
- **Effect:** Professional, smooth entrance

---

### **Pulsing Animation**
**What:** Makes something grow and shrink continuously.
- **Example:** AI confidence score pulses to draw attention
- **Effect:** Eye-catching, shows importance

---

### **Hover Animation**
**What:** Something happens when you move mouse over it.
- **Example:** Card lifts up slightly when you hover on it
- **Effect:** Interactive feedback, feels responsive

---

### **Rotating Animation**
**What:** Icon spins around continuously.
- **Example:** Flame icon in hot deals spins
- **Effect:** Shows it's active/important

---

### **Floating Animation**
**What:** Something goes up and down continuously.
- **Example:** Score badge floats up and down
- **Effect:** Draws attention smoothly

---

## 📱 How They All Work Together

```
User opens app
    ↓
App.jsx checks if logged in
    ↓ (Not logged in)
    → LoginPage.jsx
        ↓ (Login successful)
        → FundThesisOnboarding.jsx
            ↓ (Setup complete)
            → Dashboard.jsx (Main Menu)
                ↓
                → Choose a section:
                    • OverviewDashboard
                    • DiscoveryFeed
                    • DealTracker
                    • In Bound Deals (in Flow/Dashboard.jsx)
                        ├─ MessageFeed.jsx
                        │   └─ MessageCard.jsx (repeated)
                        ├─ FilterBar.jsx
                        ├─ DealCard.jsx (repeated)
                        ├─ HotDeals.jsx
                        ├─ QuickActions.jsx
                        ├─ PipelineStages.jsx
                        └─ AIInsights.jsx
                    • OutreachCenter
                    • Intelligence
                    • ThesisSettings
```

---

## 🎯 Quick Component Cheat Sheet

| Component | What It Is | What It Does |
|-----------|-----------|--------------|
| **App.jsx** | Main router | Decides which page to show |
| **LoginPage** | Login form | Lets users sign in |
| **Dashboard** | Menu hub | Main navigation |
| **OverviewDashboard** | Summary page | Shows key stats |
| **DiscoveryFeed** | Deal feed | New opportunities |
| **DealTracker** | Pipeline view | Deal stages |
| **In Bound Dashboard** | Inbound hub | Messages & deals |
| **MessageFeed** | List of messages | Shows all messages |
| **MessageCard** | Single message | One pitch/message |
| **DealCard** | Single deal | One deal submission |
| **HotDeals** | Top deals | Most important 5 |
| **QuickActions** | Big buttons | Common actions |
| **PipelineStages** | Pipeline view | 6 deal stages |
| **AIInsights** | AI analysis | Market insights |
| **FilterBar** | Filter/sort | Search options |