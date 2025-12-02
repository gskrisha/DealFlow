import React, { useState, useEffect } from "react";
import { discoveryService } from "../services/discoveryService";
import { Play, Pause, X, Check } from "lucide-react";
import "./DiscoveryFeed.css";

/**
 * AI Discovery Feed Component
 * Fetches data from APIs, stores in MongoDB, displays results
 */

export default function AIDiscoveryFeed() {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [sources, setSources] = useState(["yc"]);
  const [limitPerSource, setLimitPerSource] = useState(20);

  // Poll for job status
  useEffect(() => {
    if (!jobId || !isRunning) return;

    const pollInterval = setInterval(async () => {
      try {
        const statusData = await discoveryService.getJobStatus(jobId);
        setStatus(statusData);

        // Stop polling if job is completed or failed
        if (statusData.status === "completed" || statusData.status === "failed") {
          setIsRunning(false);
          // Fetch results
          if (statusData.startups_added > 0) {
            const resultsData = await discoveryService.getResults(jobId, 0, 50);
            setResults(resultsData);
          }
        }
      } catch (error) {
        console.error("Error polling job status:", error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [jobId, isRunning]);

  // Start discovery
  const handleStartDiscovery = async () => {
    try {
      setLoading(true);
      const response = await discoveryService.startDiscovery(
        sources,
        limitPerSource
      );
      setJobId(response.job_id);
      setIsRunning(true);
      setResults([]);
    } catch (error) {
      console.error("Error starting discovery:", error);
      alert("Failed to start discovery job");
    } finally {
      setLoading(false);
    }
  };

  // Save result
  const handleSaveResult = async (resultId) => {
    try {
      await discoveryService.saveResult(resultId);
      // Update local state
      setResults(
        results.map((r) =>
          r.id === resultId ? { ...r, is_saved: true } : r
        )
      );
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  // Pass result
  const handlePassResult = async (resultId) => {
    try {
      await discoveryService.passResult(resultId);
      // Remove from list
      setResults(results.filter((r) => r.id !== resultId));
    } catch (error) {
      console.error("Error passing result:", error);
    }
  };

  return (
    <div className="discovery-feed-container">
      <div className="discovery-header">
        <h1>🤖 AI Discovery</h1>
        <p>Fetch startups from APIs and discover new investment opportunities</p>
      </div>

      {/* Discovery Controls */}
      <div className="discovery-controls">
        <div className="controls-section">
          <label>Data Sources:</label>
          <div className="source-checkboxes">
            {[
              { id: "yc", label: "Y Combinator" },
              { id: "crunchbase", label: "Crunchbase" },
              { id: "angellist", label: "AngelList" },
              { id: "mca", label: "MCA (India)" }
            ].map((source) => (
              <label key={source.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={sources.includes(source.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSources([...sources, source.id]);
                    } else {
                      setSources(sources.filter((s) => s !== source.id));
                    }
                  }}
                  disabled={isRunning}
                />
                <span>{source.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="controls-section">
          <label>
            Limit per source:
            <input
              type="number"
              min="5"
              max="100"
              value={limitPerSource}
              onChange={(e) => setLimitPerSource(parseInt(e.target.value))}
              disabled={isRunning}
            />
          </label>
        </div>

        <button
          onClick={handleStartDiscovery}
          disabled={loading || isRunning || sources.length === 0}
          className="btn-start-discovery"
        >
          {isRunning ? (
            <>
              <Pause size={20} /> Running...
            </>
          ) : (
            <>
              <Play size={20} /> Start Discovery
            </>
          )}
        </button>
      </div>

      {/* Job Status */}
      {status && (
        <div className="discovery-status">
          <h3>Job Status</h3>
          <div className="status-grid">
            <div className="status-item">
              <span className="label">Status:</span>
              <span className={`value status-${status.status}`}>
                {status.status.toUpperCase()}
              </span>
            </div>
            <div className="status-item">
              <span className="label">Progress:</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${status.progress}%` }}
                />
                <span className="progress-text">{status.progress}%</span>
              </div>
            </div>
            <div className="status-item">
              <span className="label">Current Source:</span>
              <span className="value">{status.current_source || "N/A"}</span>
            </div>
            <div className="status-item">
              <span className="label">Found:</span>
              <span className="value">{status.startups_found}</span>
            </div>
            <div className="status-item">
              <span className="label">Added:</span>
              <span className="value">{status.startups_added}</span>
            </div>
          </div>

          {status.errors && status.errors.length > 0 && (
            <div className="errors-list">
              <h4>Errors:</h4>
              <ul>
                {status.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="discovery-results">
          <h3>
            Discovery Results ({results.length} startups)
          </h3>
          <div className="results-list">
            {results.map((result) => (
              <div key={result.id} className="result-card">
                <div className="result-header">
                  <div className="result-info">
                    <h4>{result.name}</h4>
                    <p className="sector">{result.sector}</p>
                    {result.stage && (
                      <p className="stage">Stage: {result.stage}</p>
                    )}
                    {result.location && (
                      <p className="location">📍 {result.location}</p>
                    )}
                  </div>
                  <div className="result-scores">
                    <div className="score discovery-score">
                      <span className="label">Discovery</span>
                      <span className="value">
                        {(result.discovery_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    {result.fit_score && (
                      <div className="score fit-score">
                        <span className="label">Fit</span>
                        <span className="value">
                          {(result.fit_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {result.description && (
                  <p className="description">{result.description}</p>
                )}

                {result.website && (
                  <a
                    href={result.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="website-link"
                  >
                    {result.website}
                  </a>
                )}

                {result.sources && result.sources.length > 0 && (
                  <div className="sources">
                    <span className="label">Sources:</span>
                    <div className="source-badges">
                      {result.sources.map((source, idx) => (
                        <span key={idx} className="badge">
                          {source.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="result-actions">
                  <button
                    onClick={() => handleSaveResult(result.id)}
                    className="btn-save"
                    disabled={result.is_saved}
                  >
                    <Check size={18} />
                    {result.is_saved ? "Saved" : "Save"}
                  </button>
                  <button
                    onClick={() => handlePassResult(result.id)}
                    className="btn-pass"
                  >
                    <X size={18} />
                    Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!jobId && results.length === 0 && (
        <div className="empty-state">
          <p>Click "Start Discovery" to fetch startups from AI sources</p>
        </div>
      )}
    </div>
  );
}
