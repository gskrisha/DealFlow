/**
 * DealFlow API Service
 * Handles all communication with the FastAPI backend
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Get the stored auth token
 */
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Get the refresh token
 */
const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

/**
 * Store auth tokens
 */
const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

/**
 * Clear auth tokens
 */
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

/**
 * Make an authenticated API request with timeout
 */
const apiRequestWithTimeout = async (endpoint, options = {}, timeoutMs = 10000) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn(`[API] No auth token found for endpoint: ${endpoint}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 401 - try to refresh token
    if (response.status === 401 && getRefreshToken()) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the request with new token
        headers['Authorization'] = `Bearer ${getAuthToken()}`;
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), timeoutMs);
        
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
          signal: controller2.signal,
        });
        
        clearTimeout(timeoutId2);
        return handleResponse(retryResponse);
      } else {
        // Refresh failed, clear tokens and throw
        clearTokens();
        throw new Error('Session expired. Please login again.');
      }
    }

    return handleResponse(response);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw error;
  }
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

/**
 * Refresh the access token
 */
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      storeTokens(data.access_token, data.refresh_token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Make an authenticated API request (backward compatible)
 */
const apiRequest = async (endpoint, options = {}) => {
  return apiRequestWithTimeout(endpoint, options, 10000);
};

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          full_name: userData.name || userData.fullName,
          company: userData.fundName || userData.company,
          role: userData.role,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Registration request timed out. Please check your connection.');
      }
      throw error;
    }
  },

  /**
   * Login and get tokens
   */
  login: async (email, password) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const data = await handleResponse(response);
      storeTokens(data.access_token, data.refresh_token);
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Login request timed out. Please check your connection and try again.');
      }
      throw error;
    }
  },

  /**
   * Get current user profile
   */
  getMe: async () => {
    return apiRequest('/auth/me');
  },

  /**
   * Update fund thesis
   */
  updateThesis: async (thesisData) => {
    return apiRequest('/auth/thesis', {
      method: 'PUT',
      body: JSON.stringify({
        fund_name: thesisData.fundName,
        fund_size: thesisData.fundSize,
        portfolio_size: thesisData.portfolioSize,
        check_size: thesisData.checkSize,
        check_size_min: parseCheckSize(thesisData.checkSize)?.min,
        check_size_max: parseCheckSize(thesisData.checkSize)?.max,
        stages: thesisData.investmentStage,
        sectors: thesisData.sectors,
        geographies: thesisData.geography,
        thesis_description: thesisData.thesisDescription,
        anti_portfolio: thesisData.dealBreakers,
        key_metrics: thesisData.keyMetrics,
        deal_breakers: thesisData.dealBreakers,
      }),
    });
  },

  /**
   * Logout - clear tokens
   */
  logout: () => {
    clearTokens();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('fundThesis');
    localStorage.removeItem('onboardingComplete');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// ============================================================================
// STARTUPS API
// ============================================================================

export const startupsAPI = {
  /**
   * Get all startups with optional filters
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.sector && filters.sector !== 'all') {
      params.append('sector', filters.sector);
    }
    if (filters.stage && filters.stage !== 'all') {
      params.append('stage', filters.stage);
    }
    if (filters.minScore) {
      params.append('min_score', filters.minScore);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.sortBy) {
      params.append('sort_by', filters.sortBy);
    }
    if (filters.sortOrder) {
      params.append('sort_order', filters.sortOrder);
    }
    if (filters.skip) {
      params.append('skip', filters.skip);
    }
    if (filters.limit) {
      params.append('limit', filters.limit);
    }

    const queryString = params.toString();
    return apiRequest(`/startups${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get a single startup by ID
   */
  getById: async (id) => {
    return apiRequest(`/startups/${id}`);
  },

  /**
   * Create a new startup
   */
  create: async (startupData) => {
    return apiRequest('/startups', {
      method: 'POST',
      body: JSON.stringify(startupData),
    });
  },

  /**
   * Update a startup
   */
  update: async (id, startupData) => {
    return apiRequest(`/startups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(startupData),
    });
  },

  /**
   * Delete a startup
   */
  delete: async (id) => {
    return apiRequest(`/startups/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Re-calculate AI score for a startup
   */
  rescore: async (id) => {
    return apiRequest(`/startups/${id}/score`, {
      method: 'POST',
    });
  },

  /**
   * Get startup statistics
   */
  getStats: async () => {
    return apiRequest('/startups/stats');
  },
};

// ============================================================================
// DISCOVERY API
// ============================================================================

export const discoveryAPI = {
  /**
   * Run a discovery job
   */
  run: async (options = {}) => {
    return apiRequest('/discovery/run', {
      method: 'POST',
      body: JSON.stringify({
        sources: options.sources || ['yc'],
        sectors: options.sectors,
        stages: options.stages,
        limit_per_source: options.limit || 50,
      }),
    });
  },

  /**
   * Get discovery job status
   */
  getStatus: async (jobId) => {
    console.log('[API] Getting status for job:', jobId);
    const result = await apiRequest(`/discovery/jobs/${jobId}`);
    console.log('[API] Status result:', result);
    return result;
  },

  /**
   * Get discovery job results
   */
  getResults: async (jobId, skip = 0, limit = 100) => {
    console.log('[API] Getting results for job:', jobId, 'skip:', skip, 'limit:', limit);
    const result = await apiRequest(`/discovery/jobs/${jobId}/results?skip=${skip}&limit=${limit}`);
    console.log('[API] Results:', result);
    return result;
  },

  /**
   * Get available data sources
   */
  getSources: async () => {
    return apiRequest('/discovery/sources');
  },
};

// ============================================================================
// DEALS API
// ============================================================================

export const dealsAPI = {
  /**
   * Get all deals
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.priority) {
      params.append('priority', filters.priority);
    }
    if (filters.assignedTo) {
      params.append('assigned_to', filters.assignedTo);
    }

    const queryString = params.toString();
    return apiRequest(`/deals${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get deals organized by pipeline stage (Kanban view)
   */
  getPipeline: async () => {
    return apiRequest('/deals/pipeline');
  },

  /**
   * Get a single deal by ID
   */
  getById: async (id) => {
    return apiRequest(`/deals/${id}`);
  },

  /**
   * Create a deal from a startup
   */
  create: async (dealData) => {
    return apiRequest('/deals', {
      method: 'POST',
      body: JSON.stringify({
        startup_id: dealData.startupId,
        status: dealData.status || 'new',
        priority: dealData.priority || 'medium',
        tags: dealData.tags || [],
      }),
    });
  },

  /**
   * Update a deal
   */
  update: async (id, dealData) => {
    return apiRequest(`/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dealData),
    });
  },

  /**
   * Add a note to a deal
   */
  addNote: async (id, content) => {
    return apiRequest(`/deals/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  /**
   * Delete a deal
   */
  delete: async (id) => {
    return apiRequest(`/deals/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// OUTREACH API
// ============================================================================

export const outreachAPI = {
  /**
   * Get all outreach messages
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.type) {
      params.append('type', filters.type);
    }

    const queryString = params.toString();
    return apiRequest(`/outreach${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get outreach statistics
   */
  getStats: async () => {
    return apiRequest('/outreach/stats');
  },

  /**
   * Get a single outreach by ID
   */
  getById: async (id) => {
    return apiRequest(`/outreach/${id}`);
  },

  /**
   * Create an outreach message
   */
  create: async (outreachData) => {
    return apiRequest('/outreach', {
      method: 'POST',
      body: JSON.stringify(outreachData),
    });
  },

  /**
   * Generate AI-powered outreach message
   */
  generate: async (options) => {
    return apiRequest('/outreach/generate', {
      method: 'POST',
      body: JSON.stringify({
        startup_id: options.startupId,
        type: options.type || 'email',
        tone: options.tone || 'professional',
        include_thesis_fit: options.includeThesisFit !== false,
        custom_notes: options.customNotes,
      }),
    });
  },

  /**
   * Update an outreach message
   */
  update: async (id, outreachData) => {
    return apiRequest(`/outreach/${id}`, {
      method: 'PUT',
      body: JSON.stringify(outreachData),
    });
  },

  /**
   * Send an outreach message
   */
  send: async (id) => {
    return apiRequest(`/outreach/${id}/send`, {
      method: 'POST',
    });
  },

  /**
   * Delete an outreach message
   */
  delete: async (id) => {
    return apiRequest(`/outreach/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parse check size string to min/max values
 */
function parseCheckSize(checkSizeStr) {
  if (!checkSizeStr) return null;
  
  const ranges = {
    '$100K - $500K': { min: 100, max: 500 },
    '$500K - $1M': { min: 500, max: 1000 },
    '$1M - $3M': { min: 1000, max: 3000 },
    '$3M - $5M': { min: 3000, max: 5000 },
    '$5M - $10M': { min: 5000, max: 10000 },
    '$10M+': { min: 10000, max: null },
  };
  
  return ranges[checkSizeStr] || null;
}

/**
 * Transform backend startup to frontend format
 */
export function transformStartup(backendStartup) {
  return {
    id: backendStartup.id,
    name: backendStartup.name,
    tagline: backendStartup.tagline || '',
    sector: backendStartup.sector,
    stage: backendStartup.stage,
    location: backendStartup.location || '',
    score: backendStartup.score || 0,
    scoreBreakdown: backendStartup.score_breakdown ? {
      team: backendStartup.score_breakdown.team,
      traction: backendStartup.score_breakdown.traction,
      market: backendStartup.score_breakdown.market,
      fit: backendStartup.score_breakdown.fit,
    } : { team: 0, traction: 0, market: 0, fit: 0 },
    founders: backendStartup.founders || [],
    metrics: backendStartup.metrics || { revenue: '', growth: '', users: '', funding: '' },
    signals: backendStartup.signals || [],
    sources: backendStartup.sources || [],
    lastUpdated: backendStartup.last_updated || 'Unknown',
    description: backendStartup.description || '',
    investorFit: backendStartup.investor_fit || '',
    dealStatus: backendStartup.deal_status || 'new',
    mutualConnections: backendStartup.mutual_connections || 0,
    unicornProbability: backendStartup.unicorn_probability,
    website: backendStartup.website,
    ycBatch: backendStartup.yc_batch,
  };
}

/**
 * Transform backend deal to frontend format
 */
export function transformDeal(backendDeal) {
  return {
    id: backendDeal.id,
    startupId: backendDeal.startup_id,
    name: backendDeal.startup_name,
    sector: backendDeal.startup_sector,
    stage: backendDeal.startup_stage,
    score: backendDeal.startup_score,
    status: backendDeal.status,
    priority: backendDeal.priority,
    assignedTo: backendDeal.assigned_to,
    assignedName: backendDeal.assigned_name,
    notesCount: backendDeal.notes_count || 0,
    tags: backendDeal.tags || [],
    nextMeetingDate: backendDeal.next_meeting_date,
    createdAt: backendDeal.created_at,
    updatedAt: backendDeal.updated_at,
  };
}

export default {
  auth: authAPI,
  startups: startupsAPI,
  discovery: discoveryAPI,
  deals: dealsAPI,
  outreach: outreachAPI,
};
