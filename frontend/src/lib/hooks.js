/**
 * DealFlow Custom Hooks
 * React hooks for data fetching with loading and error states
 */
import { useState, useEffect, useCallback } from 'react';
import { startupsAPI, dealsAPI, outreachAPI, discoveryAPI, transformStartup, transformDeal } from './api';
import { mockStartups } from './mockData';

/**
 * Hook to fetch startups with filters
 */
export function useStartups(filters = {}) {
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMock, setUseMock] = useState(false);

  const fetchStartups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await startupsAPI.getAll(filters);
      const transformed = data.map(transformStartup);
      setStartups(transformed);
      setUseMock(false);
    } catch (err) {
      console.warn('Failed to fetch startups from API, using mock data:', err);
      // Fallback to mock data
      setStartups(mockStartups);
      setUseMock(true);
      setError(null); // Don't show error when using fallback
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchStartups();
  }, [fetchStartups]);

  return { startups, isLoading, error, refetch: fetchStartups, useMock };
}

/**
 * Hook to fetch a single startup
 */
export function useStartup(id) {
  const [startup, setStartup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchStartup = async () => {
      setIsLoading(true);
      try {
        const data = await startupsAPI.getById(id);
        setStartup(transformStartup(data));
      } catch (err) {
        console.warn('Failed to fetch startup, using mock:', err);
        // Fallback to mock
        const mock = mockStartups.find(s => s.id === id);
        setStartup(mock || null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartup();
  }, [id]);

  return { startup, isLoading, error };
}

/**
 * Hook to fetch startup statistics
 */
export function useStartupStats() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await startupsAPI.getStats();
        setStats(data);
      } catch (err) {
        console.warn('Failed to fetch stats, using calculated mock:', err);
        // Calculate from mock data
        setStats({
          total: mockStartups.length,
          by_status: {
            new: mockStartups.filter(s => s.dealStatus === 'new').length,
            contacted: mockStartups.filter(s => s.dealStatus === 'contacted').length,
            meeting: mockStartups.filter(s => s.dealStatus === 'meeting').length,
            diligence: mockStartups.filter(s => s.dealStatus === 'diligence').length,
            passed: mockStartups.filter(s => s.dealStatus === 'passed').length,
            invested: mockStartups.filter(s => s.dealStatus === 'invested').length,
          },
          average_score: Math.round(mockStartups.reduce((acc, s) => acc + s.score, 0) / mockStartups.length),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
}

/**
 * Hook to fetch deals (pipeline view)
 */
export function useDeals(filters = {}) {
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dealsAPI.getAll(filters);
      setDeals(data.map(transformDeal));
    } catch (err) {
      console.warn('Failed to fetch deals, using mock:', err);
      // Create deals from mock startups
      setDeals(mockStartups.map(s => ({
        id: s.id,
        startupId: s.id,
        name: s.name,
        sector: s.sector,
        stage: s.stage,
        score: s.score,
        status: s.dealStatus,
        priority: 'medium',
        tagline: s.tagline,
        lastUpdated: s.lastUpdated,
      })));
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  return { deals, isLoading, error, refetch: fetchDeals };
}

/**
 * Hook to fetch pipeline (Kanban view)
 */
export function usePipeline() {
  const [pipeline, setPipeline] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPipeline = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dealsAPI.getPipeline();
      // Transform each deal in each stage
      const transformed = {};
      for (const [stage, deals] of Object.entries(data)) {
        transformed[stage] = deals.map(transformDeal);
      }
      setPipeline(transformed);
    } catch (err) {
      console.warn('Failed to fetch pipeline, using mock:', err);
      // Create pipeline from mock data
      setPipeline({
        new: mockStartups.filter(s => s.dealStatus === 'new'),
        contacted: mockStartups.filter(s => s.dealStatus === 'contacted'),
        meeting: mockStartups.filter(s => s.dealStatus === 'meeting'),
        diligence: mockStartups.filter(s => s.dealStatus === 'diligence'),
        passed: mockStartups.filter(s => s.dealStatus === 'passed'),
        invested: mockStartups.filter(s => s.dealStatus === 'invested'),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  return { pipeline, isLoading, error, refetch: fetchPipeline };
}

/**
 * Hook for outreach messages
 */
export function useOutreach(filters = {}) {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOutreach = useCallback(async () => {
    setIsLoading(true);
    try {
      const [messagesData, statsData] = await Promise.all([
        outreachAPI.getAll(filters),
        outreachAPI.getStats(),
      ]);
      setMessages(messagesData);
      setStats(statsData);
    } catch (err) {
      console.warn('Failed to fetch outreach, using mock:', err);
      // Mock data
      setMessages([]);
      setStats({
        total: 47,
        sent: 47,
        opened: 32,
        replied: 12,
        open_rate: 68,
        reply_rate: 25,
      });
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchOutreach();
  }, [fetchOutreach]);

  return { messages, stats, isLoading, error, refetch: fetchOutreach };
}

/**
 * Hook for discovery operations
 */
export function useDiscovery() {
  const [sources, setSources] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const data = await discoveryAPI.getSources();
        setSources(data.sources);
      } catch (err) {
        console.warn('Failed to fetch sources:', err);
        setSources([
          { id: 'yc', name: 'Y Combinator', status: 'active' },
          { id: 'crunchbase', name: 'Crunchbase', status: 'active' },
          { id: 'angellist', name: 'AngelList', status: 'active' },
        ]);
      }
    };
    fetchSources();
  }, []);

  const runDiscovery = useCallback(async (options) => {
    setIsLoading(true);
    setError(null);
    try {
      const job = await discoveryAPI.run(options);
      setActiveJob(job);
      return job;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkJobStatus = useCallback(async (jobId) => {
    try {
      const status = await discoveryAPI.getStatus(jobId);
      setActiveJob(status);
      return status;
    } catch (err) {
      console.error('Failed to check job status:', err);
      throw err;
    }
  }, []);

  return { sources, activeJob, isLoading, error, runDiscovery, checkJobStatus };
}

/**
 * Hook for deal mutations (create, update, delete)
 */
export function useDealMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createDeal = useCallback(async (dealData) => {
    setIsLoading(true);
    try {
      const result = await dealsAPI.create(dealData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateDeal = useCallback(async (id, dealData) => {
    setIsLoading(true);
    try {
      const result = await dealsAPI.update(id, dealData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteDeal = useCallback(async (id) => {
    setIsLoading(true);
    try {
      await dealsAPI.delete(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addNote = useCallback(async (id, content) => {
    setIsLoading(true);
    try {
      const result = await dealsAPI.addNote(id, content);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createDeal, updateDeal, deleteDeal, addNote, isLoading, error };
}

/**
 * Hook for outreach mutations
 */
export function useOutreachMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateOutreach = useCallback(async (options) => {
    setIsLoading(true);
    try {
      const result = await outreachAPI.generate(options);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendOutreach = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const result = await outreachAPI.send(id);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { generateOutreach, sendOutreach, isLoading, error };
}
