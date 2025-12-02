# MCA (Ministry of Corporate Affairs, India) Integration

## Overview

The DealFlow platform now integrates with MCA (Ministry of Corporate Affairs, India) data sources to discover Indian startups and companies.

## Implementation Details

### Data Source
MCA data is accessed through licensed third-party API providers:
- **Signzy** (https://signzy.com) - KYB verification, MCA company master data
- **SurePass** (https://surepass.io) - Business verification APIs
- **Gridlines** (https://gridlines.io) - MCA verification services

### Configuration

Add these to your `backend/.env` file:

```env
# MCA (Ministry of Corporate Affairs, India) API
MCA_API_KEY=your-api-key-here
MCA_API_PROVIDER=signzy  # Options: signzy, surepass, gridlines
MCA_API_BASE_URL=        # Optional: custom base URL
```

### Features

1. **Company Lookup by CIN** - Look up companies using their Corporate Identification Number
2. **Company Master Data** - Get company name, registration date, type, status
3. **Director Information** - Access director details (when available)
4. **Curated Fallback** - 30+ curated Indian startups when API is not configured

### Curated Indian Startups (No API Key Required)

The system includes curated data for 30+ prominent Indian startups across various sectors:

| Sector | Companies |
|--------|-----------|
| FinTech | Razorpay, Paytm, PhonePe, CRED, BharatPe |
| E-commerce | Flipkart, Meesho, Nykaa, BigBasket |
| B2B SaaS | Freshworks, Zoho, Postman, Chargebee |
| EdTech | BYJU'S, Unacademy, upGrad, PhysicsWallah |
| HealthTech | PharmEasy, Practo, 1mg |
| Mobility | Ola, Ola Electric, Ather Energy |
| AI/ML | Yellow.ai, Observe.AI |
| Food Delivery | Swiggy, Zomato |
| Gaming | Dream11, MPL |

### API Providers Comparison

| Provider | Features | API Style |
|----------|----------|-----------|
| **Signzy** | KYB, MCA lookup, comprehensive company data | POST with Bearer token |
| **SurePass** | Business verification, identity APIs | POST with API key header |
| **Gridlines** | MCA verification, company master | POST with X-API-Key |

### Usage

#### In Frontend (AIDiscoveryFeed)
MCA is available as a data source option:
- ☑️ Y Combinator
- ☑️ Crunchbase
- ☑️ AngelList
- ☑️ MCA (India)

#### In API
```json
POST /api/v1/discovery/run
{
  "sources": ["mca"],
  "limit_per_source": 20,
  "sectors": ["FinTech", "E-commerce"],
  "stages": ["Series A", "Series B"]
}
```

### Testing

Run the MCA test script:
```bash
python test_mca_discovery.py
```

Run all sources test:
```bash
python test_all_sources.py
```

## Files Modified

1. **backend/app/core/config.py** - Added MCA API settings
2. **backend/app/services/ingestion.py** - Added MCA fetch methods and curated data
3. **backend/app/api/routes/discovery.py** - Added MCA as valid source
4. **backend/.env** - Added MCA configuration options
5. **frontend/src/components/AIDiscoveryFeed.jsx** - Added MCA as source option

## Notes

- MCA API calls are rate-limited by providers
- Curated data includes CINs (Corporate Identification Numbers) for API lookup
- All data sources include thesis-based filtering (sectors, stages, geographies)
