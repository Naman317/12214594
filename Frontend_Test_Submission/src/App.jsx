import React, { useState } from 'react';
import ShortenerForm from './components/ShortenerForm';
import StatisticsPage from './components/StatisticsPage';

function App() {
  const [showStats, setShowStats] = useState(false);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>URL Shortener Service</h1>
      <button onClick={() => setShowStats(!showStats)}>
        {showStats ? 'Back to Shortener' : 'View Stats'}
      </button>
      <hr />
      {showStats ? <StatisticsPage /> : <ShortenerForm />}
    </div>
  );
}

export default App;
