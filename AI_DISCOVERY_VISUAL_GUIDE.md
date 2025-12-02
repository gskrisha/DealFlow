# AI Discovery Feature - Visual Guide

## 🎯 Feature Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    DealFlow Platform                          │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────┐        ┌──────────────────────┐    │
│  │  Overview Page      │        │  Discovery Page      │    │
│  ├─────────────────────┤        ├──────────────────────┤    │
│  │                     │        │                      │    │
│  │ [Run AI Discovery] ◀──────────────────────────────► │    │
│  │     ↓ Opens        │        │  Shows Same Data     │    │
│  │   Modal Dialog     │        │                      │    │
│  │                     │        │ • Filter by sector   │    │
│  │ • Select Sources   │◄──────►│ • Filter by stage    │    │
│  │ • Start Discovery  │ Sync    │ • Save/Pass buttons  │    │
│  │ • View Top 5       │        │ • Real-time progress │    │
│  │ • Real Stats       │        │                      │    │
│  │ • Real Activity    │        │                      │    │
│  │                     │        │                      │    │
│  └─────────────────────┘        └──────────────────────┘    │
│           ▲                              ▲                   │
│           │                              │                   │
│           └──────────┬───────────────────┘                   │
│                      │                                        │
│              DiscoveryContext                                │
│              (Shared State)                                  │
│                      ▲                                        │
│                      │                                        │
│              ┌───────┴────────┐                              │
│              │                │                              │
│         ┌────┴────┐      ┌────┴────┐                        │
│         │   YC    │      │Crunchbase│                        │
│         │   API   │      │   API    │                        │
│         └────┬────┘      └────┬────┘                        │
│              │                │                              │
│              │         ┌──────┴──────┐                       │
│              │         │             │                       │
│              └─────────►  Backend    │                       │
│                        │             │                       │
│                        │AngelList API│                       │
│                        └─────────────┘                       │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Discovery Process Flow

```
STEP 1: START
┌──────────────────────┐
│ User clicks button   │
└──────────┬───────────┘
           │
           ▼
STEP 2: CONFIGURE
┌──────────────────────────────┐
│ Modal Opens                  │
│ ☐ Y Combinator               │ ← Check sources
│ ☐ Crunchbase                 │
│ ☐ AngelList                  │
│ [Start Discovery] (enabled)  │
└──────────┬───────────────────┘
           │
           ▼
STEP 3: REQUEST
┌──────────────────────────────┐
│ POST /discovery/run          │
│ {                            │
│   sources: ['yc'],           │
│   stages: [...],             │
│   sectors: [...],            │
│   limit: 50                  │
│ }                            │
└──────────┬───────────────────┘
           │
           ▼
STEP 4: PROCESSING
┌──────────────────────────────┐
│ Backend Creates Job          │
│ Returns: job_id              │
│                              │
│ 📊 Progress: 0%              │
│ ▯▯▯▯▯▯▯▯▯▯ (empty bar)       │
└──────────┬───────────────────┘
           │
           ▼ (repeat every 2 seconds)
STEP 5: POLLING
┌──────────────────────────────┐
│ GET /discovery/status/{id}   │
│                              │
│ ✓ Progress: 25%              │
│ ▰▰▰▯▯▯▯▯▯▯ (1/4 filled)       │
│                              │
│ ✓ Progress: 50%              │
│ ▰▰▰▰▰▯▯▯▯▯ (1/2 filled)       │
│                              │
│ ✓ Progress: 100%             │
│ ▰▰▰▰▰▰▰▰▰▰ (full bar)        │
│ Status: COMPLETED            │
└──────────┬───────────────────┘
           │
           ▼
STEP 6: FETCH RESULTS
┌──────────────────────────────┐
│ GET /startups?limit=200      │
│                              │
│ Returns: 42 startups         │
└──────────┬───────────────────┘
           │
           ▼
STEP 7: UPDATE UI
┌──────────────────────────────┐
│ Overview Page Updates:       │
│ • Top 5 startups             │
│ • Real stats                 │
│ • Activity log               │
│                              │
│ Discovery Page Updates:      │
│ • All startups show          │
│ • Save/Pass buttons ready    │
│ • Filters work               │
└──────────────────────────────┘
```

## 📊 Data Structure

```
DiscoveryContext State
{
  discoveredStartups: [
    {
      id: "startup_1",
      name: "TechCo AI",
      score: 92,                    ← Used for sorting
      sector: "AI",                 ← Used for filtering
      stage: "Series A",            ← Used for filtering
      dealStatus: "new",            ← Used for stats
      sources: ["yc"],              ← Badge display
      scoreBreakdown: {
        team: 85,
        traction: 90,
        market: 95,
        fit: 92
      },
      location: "San Francisco",
      founders: [...],
      metrics: {...},
      website: "...",
      ...
    },
    ...
  ],
  discoveryInProgress: true/false,  ← Button state
  jobProgress: 0-100,               ← Progress bar
  jobStatus: 'pending|running|completed|failed',
  jobError: null,
  discoveryMetadata: {
    startedAt: timestamp,
    completedAt: timestamp,
    sources: ['yc'],
    resultCount: 42
  }
}
```

## 🎨 UI Components Hierarchy

```
App
├─ DiscoveryProvider ◄─────────────────────── State Provider
│  └─ AuthProvider
│     └─ AppContent
│        ├─ Dashboard (when authenticated)
│        │  └─ Layout with sidebar
│        │     ├─ OverviewDashboard ◄───────── Uses useDiscovery()
│        │     │  ├─ Header
│        │     │  │  └─ "Run AI Discovery" Button
│        │     │  │     └─ Opens Modal
│        │     │  │        ├─ Source Checkboxes
│        │     │  │        ├─ Progress Bar
│        │     │  │        └─ Start Button
│        │     │  ├─ Stats Grid
│        │     │  │  └─ Shows real calculated stats
│        │     │  ├─ Top 5 Startups
│        │     │  │  └─ Shows real discovered startups
│        │     │  └─ Activity + Pipeline
│        │     │     └─ Shows real data
│        │     │
│        │     ├─ DiscoveryFeed ◄─────────── Uses useDiscovery()
│        │     │  ├─ Filters
│        │     │  │  ├─ Search input
│        │     │  │  ├─ Sector dropdown
│        │     │  │  └─ Stage dropdown
│        │     │  └─ Startup List
│        │     │     ├─ Progress Indicator
│        │     │     │  └─ Shows "X% complete"
│        │     │     ├─ Error Display
│        │     │     │  └─ Shows error messages
│        │     │     └─ Startup Cards
│        │     │        ├─ Score display
│        │     │        ├─ Details
│        │     │        ├─ Signals
│        │     │        └─ Action Buttons
│        │     │           ├─ "Save" ✓ (only for discoveries)
│        │     │           ├─ "Pass" ✕ (only for discoveries)
│        │     │           └─ "View Details"
│        │     │
│        │     ├─ DealTracker
│        │     ├─ OutreachCenter
│        │     └─ Intelligence
```

## 🔌 API Integration Points

```
Frontend (React)
    │
    ├─ POST /api/v1/discovery/run ──────────────────┐
    │  Body: {                                        │
    │    sources: ['yc'],                             │
    │    stages: [...],                               │
    │    sectors: [...],                              │
    │    limit: 50                                    │
    │  }                                              │
    │  Response: {                                    │
    │    job_id: "disc_123"                           │
    │  }                                              │
    │                                                  │
    ├─ GET /api/v1/discovery/status/{job_id} ─────┐  │ Poll
    │  Response: {                                    │ every
    │    status: "running",                           │ 2s
    │    progress: 50,                                │
    │    result_count: 21                             │
    │  }                                              │
    │                                                  │
    └─ GET /api/v1/startups ────────────────────────┘
       Query: ?limit=200&sort_by=score&sort_order=desc
       Response: [
         {...startup_1},
         {...startup_2},
         ...
       ]

Backend (FastAPI)
    │
    ├─ Discovery Service
    │  ├─ fetch_yc_startups()
    │  ├─ fetch_crunchbase_startups()
    │  ├─ fetch_angellist_startups()
    │  └─ score_startups()
    │
    └─ Startups Service
       ├─ get_all()
       ├─ update()
       └─ save_startup()

Database (MongoDB)
    │
    ├─ Startups collection
    ├─ Discovery jobs collection
    └─ User thesis collection
```

## 💾 State Management Flow

```
Component A              Component B
(OverviewDashboard)     (DiscoveryFeed)
    │                       │
    └─────────┬─────────────┘
              │
              ▼
        useDiscovery()
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
Get State:          Trigger Action:
- discoveredStartups    - startDiscovery()
- jobProgress           - saveDealFromDiscovery()
- jobStatus             - passOnStartup()
- jobError
    │                   │
    └─────────┬─────────┘
              │
              ▼
      DiscoveryContext
              │
    ┌─────────┴──────────┬────────────┐
    │                    │            │
    ▼                    ▼            ▼
Manage state      Call APIs      Update both
                                 components
```

## 📈 Feature Timeline

```
Before Implementation:
├─ Dummy data only
├─ Hard-coded stats
├─ Button doesn't work
└─ No real discovery

After Implementation:
├─ Real API data
├─ Calculated stats
├─ Functional button
├─ Real-time progress
├─ Save/Pass workflow
└─ Synchronized pages
```

## 🎯 User Journey Map

```
START
  │
  ▼
Click "Run AI Discovery"
  │
  ├─────────► Modal Opens ◄─ Select Sources
  │                │
  │                ├─ Y Combinator (recommended)
  │                ├─ Crunchbase
  │                └─ AngelList
  │                │
  │                ▼
  │           Click "Start"
  │                │
  ▼                ▼
Watch Progress
  │ Progress: 0% →→→→ 50% →→→→ 100%
  │ ▯▯▯▯▯▯▯▯▯▯ → ▰▰▰▯▯▯▯▯▯▯ → ▰▰▰▰▰▰▰▰▰▰
  │
  ├───────────► Completed
  │                │
  ▼                ▼
View Results
  ├─ Overview: Top 5 startups
  ├─ Overview: Updated stats
  └─ Discovery: All startups
       │
       ├─ Filter by sector
       ├─ Filter by stage
       └─ Search by name
            │
            ▼
       View Startup
            │
       ┌────┴────┐
       │          │
       ▼          ▼
      Save      Pass
       │          │
       ├─────┬────┤
       │     │    │
       ▼     │    ▼
    Saved   │   Removed
    (+1)    │   (-1)
       │    │    │
       └────┴────┤
              │
              ▼
          Continue...
```

## 🔐 Security & Auth Flow

```
User Logs In
    │
    ├─ JWT Token stored in localStorage
    │
    ▼
User clicks "Run AI Discovery"
    │
    ├─ Load fund thesis from localStorage
    │  (User-specific preferences)
    │
    ├─ Include JWT token in API request
    │  Authorization: Bearer {token}
    │
    ▼
Backend receives request
    │
    ├─ Validates JWT token
    │
    ├─ Gets user ID from token
    │
    ├─ Uses user's thesis preferences
    │
    ├─ Runs discovery for this user only
    │
    ▼
Results returned to user
    │
    └─ Only this user sees results
```

## 📱 Responsive Design

```
Desktop (> 768px)
┌──────────────────────────────┐
│ [Run AI Discovery]           │
├──────────────────────────────┤
│ Top 5 | Recent | Pipeline    │
│ Side  | Main   | Right       │
└──────────────────────────────┘

Tablet (480px - 768px)
┌──────────────────────┐
│ [Run AI Discovery]   │
├──────────────────────┤
│ Main Content Stacked │
│ Wider cards          │
└──────────────────────┘

Mobile (< 480px)
┌─────────────────┐
│ [Run AI ▼]      │
├─────────────────┤
│ Full Width      │
│ Collapsed Menu  │
└─────────────────┘
```

## 🎬 Animation Flow

```
Button Click
    │
    ▼
Modal Slide In
  ├─ Fade in overlay
  ├─ Slide up content
  └─ 0.24s duration

Discovery Start
    │
    ▼
Progress Bar Animation
  ├─ Gradient fill
  ├─ Width: 0% → 100%
  ├─ Duration: 2s per update
  └─ Smooth easing

Results Display
    │
    ▼
Stagger Cards In
  ├─ Each card fades + scales
  ├─ Delay between cards
  ├─ 0.06s stagger
  └─ Cards appear one by one

Save/Pass Action
    │
    ▼
Button State Change
  ├─ Icon animates
  ├─ Color transitions
  └─ Card might fade out
```

## 📊 Statistics Calculation

```
Raw Data
[startup_1, startup_2, ...]
    │
    ├─► Filter dealStatus === 'new'    → "New Deals Today"
    │
    ├─► Filter score >= 90             → "High Score >90"
    │
    ├─► Filter dealStatus === 'meeting' → "Meetings"
    │
    └─► Calculate: meetings/total*100  → "Response Rate"

Pipeline
[startup_1, startup_2, ...]
    │
    ├─► Group dealStatus               → Pipeline stages
    │   ├─ new → "New Discoveries"
    │   ├─ contacted → "Contacted"
    │   ├─ meeting → "Meetings"
    │   ├─ diligence → "DD"
    │   └─ invested → "Invested"
    │
    └─► Count per group               → Stage counts
```

---

This visual guide provides a comprehensive understanding of how the AI Discovery feature works architecturally and from a user perspective.

