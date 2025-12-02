/**
 * DiscoveryContext - Manages AI Discovery state across the application
 * Shares discovered startups, job status, and preferences between Overview and Discovery pages
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { discoveryAPI, startupsAPI } from './api';

const DiscoveryContext = createContext();

// Helper function to generate realistic metrics based on startup stage
const generateMetrics = (stage, sector) => {
  const stageMetrics = {
    'Pre-Seed': {
      revenue: '$0 - $50K ARR',
      growth: '10x+ (early)',
      users: '100 - 1K',
      funding: 'Pre-Seed',
    },
    'Seed': {
      revenue: '$50K - $500K ARR',
      growth: '3x - 5x YoY',
      users: '1K - 10K',
      funding: 'Seed',
    },
    'Series A': {
      revenue: '$500K - $2M ARR',
      growth: '2x - 3x YoY',
      users: '10K - 100K',
      funding: 'Series A',
    },
    'Series B': {
      revenue: '$2M - $10M ARR',
      growth: '80% - 150% YoY',
      users: '100K - 500K',
      funding: 'Series B',
    },
    'Series C': {
      revenue: '$10M - $50M ARR',
      growth: '50% - 100% YoY',
      users: '500K - 2M',
      funding: 'Series C',
    },
    'Growth/Late Stage': {
      revenue: '$50M+ ARR',
      growth: '30% - 50% YoY',
      users: '2M+',
      funding: 'Late Stage',
    },
  };

  // Find matching stage or closest match
  const normalizedStage = stage || 'Seed';
  const metrics = stageMetrics[normalizedStage] || stageMetrics['Seed'];
  
  return metrics;
};

// Helper function to generate score breakdown
const generateScoreBreakdown = (discoveryScore, fitScore) => {
  const baseScore = discoveryScore || 75;
  const variance = () => Math.floor(Math.random() * 15) - 7; // -7 to +7
  
  return {
    team: Math.min(100, Math.max(50, baseScore + variance())),
    traction: Math.min(100, Math.max(50, baseScore + variance())),
    market: Math.min(100, Math.max(50, baseScore + variance())),
    fit: fitScore || Math.min(100, Math.max(50, baseScore + variance())),
  };
};

export function DiscoveryProvider({ children }) {
  // Discovery state
  const [discoveredStartups, setDiscoveredStartups] = useState([]);
  const [discoveryInProgress, setDiscoveryInProgress] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [jobProgress, setJobProgress] = useState(0);
  const [jobStatus, setJobStatus] = useState(null); // 'pending', 'running', 'completed', 'failed'
  const [jobError, setJobError] = useState(null);
  const [filtersMatched, setFiltersMatched] = useState(true); // Track if thesis filters matched
  const [appliedFilters, setAppliedFilters] = useState(null); // Store the filters that were applied
  const [discoveryMetadata, setDiscoveryMetadata] = useState({
    startedAt: null,
    completedAt: null,
    sources: [],
    resultCount: 0,
  });

  // Load thesis preferences for discovery
  const getThesisPreferences = useCallback(() => {
    const thesis = localStorage.getItem('fundThesis');
    if (!thesis) return null;
    
    try {
      return JSON.parse(thesis);
    } catch (e) {
      console.error('Failed to parse thesis preferences:', e);
      return null;
    }
  }, []);

  // Start discovery job with user preferences
  const startDiscovery = useCallback(async (options = {}) => {
    const thesis = getThesisPreferences();
    
    if (!thesis) {
      setJobError('Please configure your fund thesis first to use Discovery');
      return null;
    }

    setDiscoveryInProgress(true);
    setJobStatus('pending');
    setJobProgress(0);
    setJobError(null);
    setDiscoveredStartups([]);
    setDiscoveryMetadata({
      startedAt: new Date(),
      completedAt: null,
      sources: options.sources || ['yc'],
      resultCount: 0,
    });
    setFiltersMatched(true); // Reset filter match status
    setAppliedFilters(null);

    try {
      // Prepare discovery options from thesis and user input
      const discoveryOptions = {
        sources: options.sources || ['yc'],
        stages: options.stages || thesis.investmentStage || [],
        sectors: options.sectors || thesis.sectors || [],
        limit: options.limit || 50,
        geography: options.geography || thesis.geography || [],
      };

      // Store applied filters for display
      setAppliedFilters({
        sectors: discoveryOptions.sectors,
        stages: discoveryOptions.stages,
        geography: discoveryOptions.geography,
      });

      console.log('Starting discovery with options:', discoveryOptions);

      // Call backend to start discovery job
      const response = await discoveryAPI.run(discoveryOptions);
      
      const jobId = response.job_id;
      setCurrentJobId(jobId);
      setJobStatus('running');

      // Poll for job status
      return await pollJobStatus(jobId);
    } catch (error) {
      console.error('Discovery error:', error);
      setJobError(error.message || 'Failed to start discovery');
      setJobStatus('failed');
      setDiscoveryInProgress(false);
      return null;
    }
  }, [getThesisPreferences]);

  // Poll for job status and fetch results
  const pollJobStatus = useCallback(async (jobId) => {
    const maxAttempts = 60; // 2 minutes with 2-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const status = await discoveryAPI.getStatus(jobId);
        
        console.log('Poll attempt', attempts, '- Job status:', status);
        
        setJobProgress(status.progress || 0);
        setJobStatus(status.status);

        if (status.status === 'completed') {
          // Check if filters matched
          const didFiltersMatch = status.filters_matched !== false;
          setFiltersMatched(didFiltersMatch);
          
          if (status.applied_filters) {
            setAppliedFilters(status.applied_filters);
          }
          
          // Fetch the discovered startups from discovery results
          console.log('Job completed, fetching results for job:', jobId);
          console.log('Filters matched:', didFiltersMatch, 'Applied filters:', status.applied_filters);
          const results = await discoveryAPI.getResults(jobId, 0, 200);
          
          console.log('Discovery results:', results);

          // Map discovery results to startup format for display
          const discovered = results.map(r => {
            const metrics = generateMetrics(r.stage, r.sector);
            const scoreBreakdown = generateScoreBreakdown(r.discovery_score, r.fit_score);
            
            return {
              id: r.id,
              name: r.name,
              sector: r.sector,
              stage: r.stage,
              location: r.location,
              website: r.website,
              description: r.description,
              tagline: r.tagline || r.description || `${r.sector} startup`,
              score: r.discovery_score || 75,
              fit_score: r.fit_score,
              sources: r.sources,
              source: r.sources?.[0]?.name || 'Unknown',
              is_saved: r.is_saved,
              dealStatus: 'new',
              // Generated metrics based on stage
              metrics,
              scoreBreakdown,
              // Generated signals from available data
              signals: [r.sector, r.stage, r.location].filter(Boolean),
              investorFit: `Strong match based on ${r.sector} sector and ${r.stage || 'early'} stage focus`,
              founders: [], // No founder data from discovery
              mutualConnections: 0,
            };
          });
          
          console.log('Mapped discovered startups:', discovered);
          
          setDiscoveredStartups(discovered);
          setDiscoveryMetadata(prev => ({
            ...prev,
            completedAt: new Date(),
            resultCount: discovered.length,
          }));
          
          setDiscoveryInProgress(false);
          return discovered;
        } else if (status.status === 'failed') {
          setJobError(status.error || 'Discovery job failed');
          setDiscoveryInProgress(false);
          setJobStatus('failed');
          return null;
        } else if (attempts < maxAttempts) {
          // Continue polling
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 2000));
          return poll();
        } else {
          // Timeout
          setJobError('Discovery job timed out');
          setDiscoveryInProgress(false);
          setJobStatus('failed');
          return null;
        }
      } catch (error) {
        console.error('Error polling job status:', error);
        setJobError(error.message || 'Failed to get job status');
        setDiscoveryInProgress(false);
        setJobStatus('failed');
        return null;
      }
    };

    return poll();
  }, []);

  // Clear discovery results
  const clearDiscovery = useCallback(() => {
    setDiscoveredStartups([]);
    setCurrentJobId(null);
    setJobProgress(0);
    setJobStatus(null);
    setJobError(null);
    setDiscoveryMetadata({
      startedAt: null,
      completedAt: null,
      sources: [],
      resultCount: 0,
    });
  }, []);

  // Save a discovered startup (mark as saved)
  const saveDealFromDiscovery = useCallback(async (startup) => {
    try {
      // Update the startup status
      await startupsAPI.update(startup.id, {
        dealStatus: 'saved',
        savedAt: new Date().toISOString(),
      });

      // Update local state
      setDiscoveredStartups(prev =>
        prev.map(s =>
          s.id === startup.id
            ? { ...s, dealStatus: 'saved', isSaved: true }
            : s
        )
      );

      return true;
    } catch (error) {
      console.error('Failed to save startup:', error);
      return false;
    }
  }, []);

  // Pass on a discovered startup (remove from discovery)
  const passOnStartup = useCallback((startupId) => {
    setDiscoveredStartups(prev =>
      prev.filter(s => s.id !== startupId)
    );
  }, []);

  const value = {
    // State
    discoveredStartups,
    discoveryInProgress,
    currentJobId,
    jobProgress,
    jobStatus,
    jobError,
    discoveryMetadata,
    filtersMatched,
    appliedFilters,

    // Actions
    startDiscovery,
    clearDiscovery,
    saveDealFromDiscovery,
    passOnStartup,
    pollJobStatus,
  };

  return (
    <DiscoveryContext.Provider value={value}>
      {children}
    </DiscoveryContext.Provider>
  );
}

// Hook to use discovery context
export function useDiscovery() {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error('useDiscovery must be used within DiscoveryProvider');
  }
  return context;
}
