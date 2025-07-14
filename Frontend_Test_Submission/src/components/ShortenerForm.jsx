import React, { useState } from 'react';
import axios from 'axios';
import { Log } from '../../../Logging_Middleware/logger';

function ShortenerForm() {
  const [entries, setEntries] = useState([{ originalUrl: '', slug: '', validity: '' }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const copy = [...entries];
    copy[index][field] = value;
    setEntries(copy);
  };

  const addRow = () => {
    if (entries.length >= 5) return;
    setEntries([...entries, { originalUrl: '', slug: '', validity: '' }]);
  };

  const handleSubmit = async () => {
    const newResults = [];

    for (let entry of entries) {
      if (!entry.originalUrl) continue;

      try {
        const res = await axios.post('http://localhost:5000/shorten', {
          originalUrl: entry.originalUrl,
          customSlug: entry.slug || undefined,
          validity: entry.validity ? parseInt(entry.validity) : undefined,
        });

        newResults.push(res.data);
        Log('frontend', 'info', 'handler', `Shortened ${entry.originalUrl}`);
      } catch (err) {
        console.error(err);
        Log('frontend', 'error', 'handler', 'Shorten failed: ' + err.message);
      }
    }

    setResults(newResults);
  };

  return (
    <div>
      <h2>Shorten up to 5 URLs</h2>
      {entries.map((entry, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <input
            placeholder="Original URL"
            value={entry.originalUrl}
            onChange={(e) => handleChange(index, 'originalUrl', e.target.value)}
          />
          <input
            placeholder="Custom Slug"
            value={entry.slug}
            onChange={(e) => handleChange(index, 'slug', e.target.value)}
          />
          <input
            placeholder="Validity (min)"
            value={entry.validity}
            onChange={(e) => handleChange(index, 'validity', e.target.value)}
            type="number"
            min="1"
          />
        </div>
      ))}
      <button onClick={addRow}>+ Add URL</button>
      <button onClick={handleSubmit}>Shorten</button>

      <h3>Results:</h3>
      <ul>
        {results.map((r, idx) => (
          <li key={idx}>
            <a href={r.shortUrl} target="_blank" rel="noreferrer">{r.shortUrl}</a>
            {r.expiresAt && (
              <span> (expires at {new Date(r.expiresAt).toLocaleString()})</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShortenerForm;
