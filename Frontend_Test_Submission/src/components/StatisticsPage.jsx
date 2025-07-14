import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Log } from '../../../Logging_Middleware/logger';

function StatisticsPage() {
  const [urls, setUrls] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/all-urls');
      setUrls(res.data);
      Log('frontend', 'info', 'handler', 'Fetched all analytics');
    } catch (err) {
      Log('frontend', 'error', 'handler', 'Analytics fetch failed: ' + err.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h2>All URL Analytics</h2>
      {urls.map((u, idx) => (
        <div key={idx} style={{ border: '1px solid gray', padding: '10px', marginBottom: '10px' }}>
          <p><strong>Short URL:</strong> <a href={`http://localhost:5000/${u.slug}`} target="_blank" rel="noreferrer">/{u.slug}</a></p>
          <p><strong>Original:</strong> {u.originalUrl}</p>
          <p><strong>Created:</strong> {new Date(u.createdAt).toLocaleString()}</p>
          <p><strong>Expires:</strong> {u.expiresAt ? new Date(u.expiresAt).toLocaleString() : 'Never'}</p>
          <p><strong>Total Clicks:</strong> {u.clicks}</p>

          <details>
            <summary>Click Details</summary>
            <ul>
              {u.clickDetails.map((cd, i) => (
                <li key={i}>
                  {new Date(cd.timestamp).toLocaleString()} from {cd.source} [{cd.location}]
                </li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </div>
  );
}

export default StatisticsPage;
