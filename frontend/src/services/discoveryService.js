import { API_BASE_URL } from "../lib/api";

/**
 * Discovery Service
 * Handles all discovery-related API calls
 */

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? `Bearer ${token}` : "";
};

export const discoveryService = {
  /**
   * Start a discovery job
   */
  async startDiscovery(sources = ["yc"], limitPerSource = 20) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/discovery/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify({
          sources,
          limit_per_source: limitPerSource,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error starting discovery:", error);
      throw error;
    }
  },

  /**
   * Get discovery job status
   */
  async getJobStatus(jobId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/discovery/jobs/${jobId}`,
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error getting job status:", error);
      throw error;
    }
  },

  /**
   * Get discovery results
   */
  async getResults(jobId, skip = 0, limit = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/discovery/jobs/${jobId}/results?skip=${skip}&limit=${limit}`,
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error getting discovery results:", error);
      throw error;
    }
  },

  /**
   * Save a discovery result
   */
  async saveResult(resultId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/discovery/results/${resultId}/save`,
        {
          method: "POST",
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error saving result:", error);
      throw error;
    }
  },

  /**
   * Pass a discovery result
   */
  async passResult(resultId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/discovery/results/${resultId}/pass`,
        {
          method: "POST",
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error passing result:", error);
      throw error;
    }
  },

  /**
   * Get saved discovery results
   */
  async getSavedResults(skip = 0, limit = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/discovery/saved?skip=${skip}&limit=${limit}`,
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error getting saved results:", error);
      throw error;
    }
  },
};
