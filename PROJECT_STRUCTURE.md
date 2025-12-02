# DealFlow - Project Structure & Program Flow

## 📁 Directory Tree

```
Deal Flow/
├── .git/                          # Git repository
├── .gitignore                     # Git ignore rules
├── backend/                       # Backend folder (for future development)
└── frontend/                      # React Frontend Application
    ├── node_modules/             # Dependencies
    ├── public/                    # Static files
    ├── src/
    │   ├── App.jsx               # Main app component with routing logic
    │   ├── main.jsx              # Entry point
    │   ├── index.css             # Global styles
    │   ├── Attributions.md       # Attribution credits
    │   ├── components/           # React components
    │   │   ├── CountUp.jsx       # Number counter animation
    │   │   ├── Dashboard.jsx     # Main dashboard page
    │   │   ├── DealDetailDialog.jsx    # Deal detail modal
    │   │   ├── DealTracker.jsx   # Deal tracking interface
    │   │   ├── DiscoveryFeed.jsx # Discovery/news feed
    │   │   ├── FundThesisOnboarding.jsx # Fund setup wizard
    │   │   ├── Intelligence.jsx  # AI insights page
    │   │   ├── LandingPage.jsx   # Landing/home page
    │   │   ├── LoginPage.jsx     # Authentication page
    │   │   ├── OutreachCenter.jsx # Outreach management
    │   │   ├── OverviewDashboard.jsx # Overview dashboard
    │   │   ├── ThesisSettings.jsx # Fund thesis settings
    │   │   ├── figma/            # Figma integration components
    │   │   │   └── ImageWithFallback.tsx
    │   │   ├── in Flow/          # In-Bound deals section (NEW UI)
    │   │   │   ├── App.jsx       # In Flow router
    │   │   │   ├── Dashboard.jsx # Inbound dashboard (REDESIGNED)
    │   │   │   ├── MessageFeed.jsx # Message list display
    │   │   │   ├── MessageCard.jsx # Individual message card (UPDATED)
    │   │   │   ├── FilterBar.jsx # Filter controls (UPDATED)
    │   │   │   ├── DealCard.jsx  # Deal submission card (REDESIGNED)
    │   │   │   ├── HotDeals.jsx  # Hot deals sidebar (REDESIGNED)
    │   │   │   ├── QuickActions.jsx # Action buttons (REDESIGNED)
    │   │   │   ├── PipelineStages.jsx # Pipeline tracker (REDESIGNED)
    │   │   │   ├── AIInsights.jsx # AI metrics (REDESIGNED)
    │   │   │   ├── LogoScroll.jsx # Logo carousel
    │   │   │   ├── CircleSharePage.jsx # Share feature page
    │   │   │   ├── CompanyPortfolio.jsx # Portfolio view
    │   │   │   ├── SelectRecipientsPage.jsx # Recipient selection
    │   │   │   ├── UploadDeckPage.jsx # Deck upload wizard
    │   │   │   └── data/         # Mock data
    │   │   │       ├── mockData.ts
    │   │   │       └── mockDeals.ts
    │   │   └── ui/               # shadcn/ui Components (50+ UI elements)
    │   │       ├── accordion.tsx
    │   │       ├── alert-dialog.tsx
    │   │       ├── badge.tsx
    │   │       ├── button.tsx
    │   │       ├── card.tsx      # (FIXED: CardDescription div instead of p)
    │   │       ├── checkbox.tsx
    │   │       ├── dialog.tsx    # (FIXED: DialogOverlay with React.forwardRef)
    │   │       ├── drawer.tsx
    │   │       ├── dropdown-menu.tsx
    │   │       ├── form.tsx
    │   │       ├── input.tsx
    │   │       ├── label.tsx
    │   │       ├── pagination.tsx
    │   │       ├── popover.tsx
    │   │       ├── progress.tsx
    │   │       ├── select.tsx
    │   │       ├── sheet.tsx
    │   │       ├── skeleton.tsx
    │   │       ├── tabs.tsx
    │   │       ├── textarea.tsx
    │   │       ├── table.tsx
    │   │       ├── toggle.tsx
    │   │       ├── tooltip.tsx
    │   │       ├── MotionWrappers.jsx
    │   │       ├── use-mobile.ts
    │   │       └── utils.ts      # Tailwind cn() utility
    │   ├── lib/                  # Utility functions
    │   │   ├── mockData.ts       # Mock data
    │   │   ├── motionVariants.js # Framer Motion animation presets
    │   │   └── utils.ts          # Helper functions
    │   ├── styles/               # CSS stylesheets
    │   │   └── globals.css       # Global styles
    │   └── guidelines/           # Documentation
    │       └── Guidelines.md     # Design guidelines
    ├── package.json             # Dependencies & scripts
    ├── package-lock.json        # Dependency lock file
    ├── vite.config.ts           # Vite build configuration
    ├── index.html               # HTML entry point
    └── README.md                # Frontend documentation
```

---

## 🔄 Program Flow & Architecture

### 1. **Application Entry Point** (`main.jsx`)
```
main.jsx → ReactDOM.render(App.jsx) → Mounts to #root
```

### 2. **Main App Flow** (`App.jsx`)
```
                    ┌─────────────┐
                    │   App.jsx   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Check Auth  │ (localStorage)
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼────────┐ ┌────▼──────┐ ┌──────▼──────┐
    │  LoginPage   │ │ Onboarding│ │  Dashboard  │
    │  (First)     │ │ (Second)  │ │  (Main)     │
    └──────────────┘ └───────────┘ └─────────────┘
```

### 3. **Authentication Flow**
```
LoginPage (LoginPage.jsx)
    ├─ Email/Password Input
    ├─ Social Login (Google, GitHub, LinkedIn)
    └─ onSuccess → handleLogin() → setIsAuthenticated(true)
         └─ Save to localStorage
         └─ If first time → Show FundThesisOnboarding
         └─ Else → Show Dashboard
```

### 4. **Onboarding Flow** (`FundThesisOnboarding.jsx`)
```
FundThesisOnboarding (Setup Wizard)
    ├─ Fund Details Collection
    ├─ Thesis Definition
    ├─ Preferences Setup
    └─ onComplete → handleOnboardingComplete()
         └─ Need to be Saved to localStorage
         └─ Navigate to Dashboard
```

### 5. **Main Dashboard** (`Dashboard.jsx`)
```
Dashboard (Main Page)
    ├─ Navigation/Header
    ├─ Main Menu
    │   ├─ Overview Dashboard (OverviewDashboard.jsx)
    │   ├─ Discovery Feed (DiscoveryFeed.jsx)
    │   ├─ Deal Tracker (DealTracker.jsx)
    │   ├─ In Bound Deals (in Flow/Dashboard.jsx) ⭐ NEW REDESIGNED
    │   ├─ Outreach Center (OutreachCenter.jsx)
    │   ├─ Intelligence (Intelligence.jsx)
    │   └─ Fund Thesis Settings (ThesisSettings.jsx)
    └─ Sidebar/Profile Menu
```

### 6. **In Bound Deals Section** (in Flow/Dashboard.jsx) ⭐ **REDESIGNED**
```
In Bound Dashboard (its static)
    ├─ Header with Stats (4 KPI cards)
    │   ├─ Unread Messages (247)
    │   ├─ Hot Deals (18)
    │   ├─ AI Confidence (94%)
    │   └─ Response Rate (72%)
    │
    ├─ Left Column (2/3 width)
    │   ├─ Message Feed
    │   │   ├─ Tabs: All | LinkedIn | Email | WhatsApp
    │   │   ├─ FilterBar (Sector & Sort)
    │   │   ├─ MessageFeed Component
    │   │   │   └─ List of MessageCard (SCROLLABLE - max-h-[600px])
    │   │   │       └─ Shows 3 rows, rest scrollable
    │   │   └─ Each MessageCard displays:
    │   │       ├─ Sender info + avatar
    │   │       ├─ Message preview
    │   │       ├─ AI Score (with pulsing animation)
    │   │       ├─ Sector tag
    │   │       └─ Action buttons
    │   │
    │   └─ Recent Deal Submissions
    │       ├─ 2-column grid layout
    │       ├─ DealCard components (SCROLLABLE - max-h-[520px])
    │       │   └─ Shows 3 items (2 per row), rest scrollable
    │       └─ Each DealCard displays:
    │           ├─ Company thumbnail/deck preview
    │           ├─ Seeking & Valuation info (gradient cards)
    │           ├─ Key highlights with icons
    │           └─ Action buttons (Review, Share, Schedule)
    │
    └─ Right Column (1/3 width)
        ├─ QuickActions (4 action buttons with gradients)
        ├─ HotDeals (Top 5 priority deals with animated flame icon)
        ├─ PipelineStages (6-stage pipeline tracker)
        └─ AIInsights (AI learning insights with rotating brain icon)
```

### 7. **Component Communication Flow**
```
Data Flow (Top-Down):
    Dashboard
    ├─ State: [selectedSource, selectedSector, sortBy]
    ├─ Props → MessageFeed → MessageCard
    ├─ Props → FilterBar (Filter options)
    └─ Props → DealCard

Event Flow (Bottom-Up):
    MessageCard/DealCard
    ├─ User clicks action button
    ├─ Event bubbles up to parent
    └─ Parent updates state & re-renders
```

---

## 🎨 **UI Component Hierarchy**

### Design System
```
shadcn/ui Components
├─ Layout: Card, Tabs, Grid, Sidebar, Sheet
├─ Forms: Input, Button, Select, Checkbox, Toggle
├─ Navigation: Tabs, Pagination, Breadcrumb
├─ Overlay: Dialog, Popover, Tooltip, Hover-Card
└─ Display: Badge, Avatar, Progress, Skeleton

Custom Components
├─ Animation Wrappers (Framer Motion)
├─ Motion Variants (reusable animation presets)
└─ Theme: Tailwind CSS with custom gradients
```

### Animation System
```
Framer Motion (v6+)
├─ Container Variants: Stagger children animation
├─ Item Variants: Individual element entrance/exit
├─ Hover Effects: Card lift, scale, color transitions
├─ Pulsing: Infinite scaling animations
├─ Rotating: Icon rotation animations
├─ Floating: Y-axis translate loops
└─ Tap Feedback: Scale down on click
```

---

## 🔌 **Integration Points**

### In Bound Dashboard Components (UPDATED)

| Component | Purpose | Status | Animations |
|-----------|---------|--------|-----------|
| **Dashboard.jsx** | Main orchestrator | ✅ Complete | Stagger, fade-in, scale |
| **MessageCard.jsx** | Individual message | ✅ Updated | Pulse, left-border accent, hover-lift |
| **MessageFeed.jsx** | Message list | ✅ Integrated | Dividers, filter support |
| **FilterBar.jsx** | Filter/sort controls | ✅ Updated | Fade-in, emoji icons |
| **DealCard.jsx** | Deal submission display | ✅ Updated | Hover-translate, floating badges |
| **HotDeals.jsx** | Top deals sidebar | ✅ Redesigned | Rotating flame, pulsing ranks |
| **QuickActions.jsx** | Action buttons | ✅ Redesigned | Gradient buttons, floating icons |
| **PipelineStages.jsx** | Pipeline tracker | ✅ Redesigned | Pulsing dots, animated totals |
| **AIInsights.jsx** | AI metrics | ✅ Redesigned | Rotating brain, staggered cards |

### UI Components (FIXED)
| Component | Issue | Fix | Status |
|-----------|-------|-----|--------|
| **dialog.tsx** | Ref forwarding warning | Added React.forwardRef | ✅ Fixed |
| **card.tsx** | Nested `<p>` tags warning | Changed `<p>` to `<div>` | ✅ Fixed |

---

## 📱 **Responsive Design**

```
Mobile (< 768px)
├─ Single column layout
├─ Collapsed navigation
└─ Touch-friendly buttons

Tablet (768px - 1024px)
├─ 2-column layout available
├─ Sidebar collapsible
└─ Grid adjusts to 2 columns

Desktop (> 1024px)
├─ Full 3-column layout (2/3 + 1/3 split)
├─ All features visible
└─ Hover effects enabled
```

---

## 🎯 **Key Features**

1. **Authentication** - Login with email or social providers
2. **Onboarding** - Fund setup wizard with persistence
3. **Message Management** - Inbound messages with filtering & sorting
4. **Deal Tracking** - Track pipeline stages and hot deals
5. **AI Insights** - Analytics and intelligence dashboard
6. **Outreach** - Contact and communication management
7. **Discovery Feed** - Investment opportunities discovery
8. **Settings** - Fund thesis and preferences customization

---

## 🛠️ **Tech Stack**

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend Framework** | React | 18+ |
| **Build Tool** | Vite | Latest |
| **Styling** | Tailwind CSS | v3+ |
| **UI Library** | shadcn/ui | Latest |
| **Animation** | Framer Motion | v6+ |
| **Icons** | lucide-react | v0.487+ |
| **Language** | JSX/TSX | ES2020+ |
| **State Management** | React Hooks | useState, useEffect |

---

## 📊 **Data Flow Diagram**

```
┌─────────────────────────────────────┐
│         localStorage                │ (Auth State)
│  ├─ isAuthenticated                 │
│  ├─ onboardingComplete              │
│  └─ fundThesis                      │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌──────────────┐
        │   App.jsx    │
        │  (Router)    │
        └──────┬───────┘
               │
      ┌────────┼────────┐
      │        │        │
      ▼        ▼        ▼
  ┌───────┐ ┌─────┐ ┌──────────┐
  │ Login │ │Onbrd│ │Dashboard │
  └───────┘ └─────┘ └────┬─────┘
                         │
              ┌──────────┴──────────┬──────────┐
              │                    │          │
         ┌────▼─────┐      ┌──────▼───┐   ┌──▼──┐
         │ Overview │      │In Bound  │   │...  │
         │Dashboard │      │Dashboard │   │     │
         └──────────┘      └────┬─────┘   └─────┘
                                │
                    ┌───────────┼──────────┐
                    │           │          │
              ┌─────▼──┐  ┌────▼──┐  ┌───▼───┐
              │Messages │  │Filters│  │ Deals │
              │ & Cards │  │ Bar   │  │ Cards │
              └─────────┘  └───────┘  └───────┘
```

---

## 🚀 **Running the Application**

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📝 **Notes**

- **In Bound Section (in Flow/)**: Completely redesigned with modern UI matching other pages
- **Scrollable Sections**: Messages show 3 rows (600px max-height), Deals show 3 items (520px max-height)
- **Animations**: All components use consistent Framer Motion patterns with staggered entrance effects
- **Responsive**: Full mobile-first responsive design with Tailwind CSS breakpoints
- **Accessibility**: Semantic HTML, proper labels, ARIA attributes where needed
- **Performance**: Component memoization, lazy loading ready, optimized re-renders

