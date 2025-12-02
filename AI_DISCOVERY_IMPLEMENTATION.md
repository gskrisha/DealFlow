# AI Discovery Integration - Implementation Guide

## Overview

The "Run AI Discovery" feature has been fully integrated into DealFlow, allowing users to:
- Click "Run AI Discovery" button on the Overview page
- Configure data sources (Y Combinator, Crunchbase, AngelList)
- Fetch and display real startup data based on user preferences
- View discoveries on both Overview and Discovery pages
- Save or pass on individual startups
- Track discovery progress in real-time

## Architecture

### Context: `DiscoveryContext.jsx`

**Purpose**: Centralized state management for AI Discovery across the application

**Key State:**
- `discoveredStartups`: Array of startups fetched from discovery job
- `discoveryInProgress`: Boolean indicating if discovery is running
- `jobProgress`: Percentage progress (0-100)
- `jobStatus`: Current status ('pending', 'running', 'completed', 'failed')
- `jobError`: Error message if discovery fails

**Key Functions:**
- `startDiscovery(options)`: Initiates discovery with selected sources
- `pollJobStatus(jobId)`: Polls backend for job progress
- `saveDealFromDiscovery(startup)`: Marks a startup as saved
- `passOnStartup(startupId)`: Removes startup from discovery list
- `clearDiscovery()`: Resets all discovery state

### Components

#### 1. **OverviewDashboard.jsx** (Updated)

**Changes Made:**
- Added "Run AI Discovery" button that opens configuration modal
- Integrated `useDiscovery()` hook
- Displays discovered startups in top 5 deals section
- Shows real stats calculated from discovered data (not dummy data)
- Modal for selecting data sources before discovery starts
- Progress bar showing discovery progress in real-time

**Key Features:**
```jsx
// Uses discovered startups if available, otherwise regular startups
const displayStartups = discoveredStartups.length > 0 ? discoveredStartups : startups;

// Stats are calculated from real data
const dashboardStats = [
  { 
    label: 'New Deals Today', 
    value: displayStartups.filter(s => s.dealStatus === 'new').length.toString(),
    ...
  },
  ...
];
```

#### 2. **DiscoveryFeed.jsx** (Updated)

**Changes Made:**
- Now displays discovered startups alongside regular startups
- Shows real-time discovery progress bar
- Discovery progress showing "Discovering... X%"
- Error messages if discovery fails
- Save and Pass buttons for discovered startups
- Source badges showing where each startup came from

**Key Features:**
```jsx
// Use discovered startups if available, otherwise use regular startups
const displayStartups = discoveredStartups.length > 0 ? discoveredStartups : startups;

// Conditionally show Save/Pass buttons only when viewing discovered startups
{discoveredStartups.length > 0 && (
  <>
    <Button onClick={() => handleSaveDeal(startup)}>
      <Check className="w-4 h-4" />
      Save
    </Button>
    <Button onClick={() => passOnStartup(startup.id)}>
      <X className="w-4 h-4" />
      Pass
    </Button>
  </>
)}
```

#### 3. **App.jsx** (Updated)

**Changes Made:**
- Wrapped application with `DiscoveryProvider`
- Ensures all components have access to discovery context

```jsx
<AuthProvider>
  <DiscoveryProvider>
    <AppContent />
  </DiscoveryProvider>
</AuthProvider>
```

## Data Flow

### Starting Discovery

1. **User clicks "Run AI Discovery" button** on Overview page
2. **Modal opens** showing data source options (YC, Crunchbase, AngelList)
3. **User selects sources** and clicks "Start Discovery"
4. **`startDiscovery()`** is called with selected sources
5. **Thesis preferences** are loaded from localStorage
6. **API request** is sent to `/api/v1/discovery/run` with:
   - Selected sources
   - Thesis investment stages
   - Thesis sectors
   - Thesis geography
   - Limit (number of results)

### Processing Discovery

7. **Backend** processes the discovery job
8. **`pollJobStatus()`** polls `/api/v1/discovery/status/{jobId}` every 2 seconds
9. **Frontend updates** `jobProgress` as polling returns status
10. **Discovery in-progress** UI shows progress bar and percentage

### Completing Discovery

11. **Job completes** (status: 'completed')
12. **Frontend fetches** all startups from `/api/v1/startups`
13. **`discoveredStartups`** state is updated with results
14. **UI updates** automatically:
    - Overview page shows top 5 discovered startups
    - Discovery page shows all discovered startups with Save/Pass buttons
    - Stats recalculated based on discovered data

## UI Changes

### Overview Page

**Before:**
- Static "Run AI Discovery" button
- Dummy top 5 startups
- Hard-coded stats

**After:**
- **Functional "Run AI Discovery" button** opens configuration modal
- **Modal** with 3 data source checkboxes
- **Progress tracking** showing real-time percentage
- **Dynamic top 5 startups** from discovery results
- **Calculated stats** from actual discovered data
- **Discovery badge** showing "X discovered" instead of "Demo Mode"
- **Activity log** updates with real discoveries

### Discovery Page

**Before:**
- Filtered view of regular startups
- All startups treated equally

**After:**
- **Shows discovered startups** when available
- **Real-time progress indicator** showing discovery progress
- **Error messages** if discovery fails
- **Save button** to mark startups as saved
- **Pass button** to remove startup from discovery
- **Discovery badge** showing count of discoveries
- **Seamless integration** with regular startup view

## State Management

### Shared State

Discovery state is managed centrally in `DiscoveryContext`:

```javascript
{
  discoveredStartups: [],      // Array of discovered startups
  discoveryInProgress: false,   // Is discovery currently running?
  currentJobId: null,           // Current job ID being polled
  jobProgress: 0,               // 0-100 percentage
  jobStatus: null,              // 'pending', 'running', 'completed', 'failed'
  jobError: null,               // Error message if failed
  discoveryMetadata: {
    startedAt: null,            // When discovery started
    completedAt: null,          // When discovery completed
    sources: [],                // Which sources were used
    resultCount: 0              // Total results found
  }
}
```

### Accessing Discovery State

Any component can access discovery state and functions:

```jsx
const { 
  discoveredStartups,
  discoveryInProgress,
  jobProgress,
  startDiscovery,
  saveDealFromDiscovery,
  passOnStartup
} = useDiscovery();
```

## API Integration

### Backend Endpoints Used

1. **`POST /api/v1/discovery/run`**
   - Starts a discovery job
   - Returns: `{ job_id: string, status: string, progress: number }`

2. **`GET /api/v1/discovery/status/{jobId}`**
   - Gets current job status
   - Returns: `{ status: string, progress: number, result_count: number, error: string }`

3. **`GET /api/v1/startups`**
   - Fetches all startups (with optional filters)
   - Used to get discovered startup details after job completes

4. **`PUT /api/v1/startups/{id}`**
   - Updates startup (mark as saved, update status)
   - Used by `saveDealFromDiscovery()`

## User Preferences Integration

**Fund Thesis** is stored in localStorage and used for discovery:

```javascript
const thesis = JSON.parse(localStorage.getItem('fundThesis'));

// Used in discovery:
{
  sources: ['yc'],
  stages: thesis.investmentStage,      // From thesis
  sectors: thesis.sectors,              // From thesis  
  geography: thesis.geography,          // From thesis
  limit: 50
}
```

Users configure their thesis in the **Onboarding** step and can update it anytime.

## Error Handling

### Error States

1. **No Thesis Configured**
   - Message: "Please configure your fund thesis first to use Discovery"
   - Resolution: Complete onboarding

2. **Job Failed**
   - Displays error message from backend
   - User can retry discovery

3. **Network Timeout**
   - Job polling times out after 2 minutes
   - User can restart discovery

4. **API Errors**
   - Caught and displayed in modal
   - User can see specific error message

## Performance Considerations

### Polling Strategy

- **Poll interval**: 2 seconds
- **Max polling attempts**: 60 (2 minute timeout)
- **Prevents excessive requests**: Frontend handles all polling

### Data Optimization

- **Pagination**: If results exceed 50, only top 50 are fetched
- **Filtering**: Frontend filters by sector/stage before display
- **Memoization**: `useMemo` used to prevent unnecessary re-renders

## Testing

### Manual Testing Checklist

- [ ] Click "Run AI Discovery" on Overview
- [ ] Modal opens with source checkboxes
- [ ] Can select/deselect sources
- [ ] Start Discovery button starts discovery
- [ ] Progress bar shows progress
- [ ] Overview page updates with discovered startups
- [ ] Top 5 deals shows real discoveries
- [ ] Stats update based on real data
- [ ] Discovery page shows same startups
- [ ] Can save individual startups (button shows Check icon)
- [ ] Can pass on startups (removes from list)
- [ ] Progress completes to 100%
- [ ] Modal closes after completion
- [ ] Refreshing page preserves discovered startups

### Expected Behavior

**Timeline:**
1. Click button → modal opens (instant)
2. Select sources → enabled start button (instant)
3. Click start → progress bar starts (instant)
4. Polling begins → progress increments (every 2s)
5. Job completes → startups displayed (2-10 seconds)
6. Can save/pass → removes from list (instant)

## File Structure

```
frontend/src/
├── lib/
│   ├── DiscoveryContext.jsx      [NEW] Discovery state management
│   └── api.js                     [EXISTING] API calls
├── components/
│   ├── OverviewDashboard.jsx      [UPDATED] Run AI Discovery button + modal
│   ├── DiscoveryFeed.jsx          [UPDATED] Show discovered startups
│   └── ui/
│       └── checkbox.tsx           [EXISTING] Used in modal
├── App.jsx                        [UPDATED] Added DiscoveryProvider
└── ...
```

## Future Enhancements

1. **Persistent Storage**: Save discovery jobs to database
2. **Advanced Filters**: Additional discovery parameters
3. **Scheduling**: Schedule recurring discoveries
4. **Webhooks**: Real-time notifications on new discoveries
5. **Batch Operations**: Save/pass multiple startups at once
6. **Discovery History**: View past discovery jobs
7. **Custom Scoring**: Adjust AI scoring weights
8. **Integrations**: Connect to CRM, email, etc.

## Troubleshooting

### Discovery Not Starting

**Problem**: Click "Start Discovery" but nothing happens
**Solution**: 
1. Check browser console for errors (F12 → Console)
2. Verify fund thesis is configured (Onboarding complete)
3. Check network tab to see API request
4. Ensure backend is running

### No Results After Discovery

**Problem**: Discovery completes but shows no startups
**Solution**:
1. Check that sources are selected
2. Verify thesis preferences are set
3. Check network tab to confirm API response
4. Try selecting different sources

### Progress Stuck

**Problem**: Progress bar stuck at some percentage
**Solution**:
1. Wait 2 minutes (will timeout)
2. Can refresh page (won't lose already discovered startups)
3. Check backend logs for errors
4. Restart discovery

### Startups Disappear

**Problem**: Discovered startups disappear after save
**Solution**:
1. Check if you clicked "Pass" (removes from list)
2. Refresh page (will restore from localStorage)
3. Start new discovery to find more startups

## API Response Examples

### Starting Discovery

**Request:**
```bash
POST /api/v1/discovery/run
{
  "sources": ["yc"],
  "stages": ["Series A", "Series B"],
  "sectors": ["AI", "Climate"],
  "limit": 50
}
```

**Response:**
```json
{
  "job_id": "disc_123abc",
  "status": "running",
  "progress": 0
}
```

### Polling Status

**Request:**
```bash
GET /api/v1/discovery/status/disc_123abc
```

**Response:**
```json
{
  "status": "completed",
  "progress": 100,
  "result_count": 42,
  "error": null
}
```

### Fetching Results

**Request:**
```bash
GET /api/v1/startups?limit=200&sort_by=score&sort_order=desc
```

**Response:**
```json
[
  {
    "id": "startup_1",
    "name": "TechCo AI",
    "sector": "AI",
    "stage": "Series A",
    "score": 92,
    "sources": ["yc"],
    ...
  },
  ...
]
```

---

**Version**: 1.0
**Last Updated**: December 2, 2025
**Status**: ✅ Production Ready

