import React, { useState } from 'react';
import axios from 'axios';

const NumberManagement = () => {
  const [iUrls, setiUrls] = useState('');
  const [res, setResult] = useState(null);

  const handleFetchData = () => {
    const urls = iUrls.split(',').map(url => url.trim());
    const validUrls = urls.filter(url => isValidUrl(url));
    const fetchedData = validUrls.map(url => axios.get(url).then(response => response.data));

    Promise.all(fetchedData)
      .then(results => {
        const mergedNumbers = results.flatMap(data => data.numbers);
        mergedNumbers.sort((a, b) => a - b);
        setResult(mergedNumbers);
      })
      .catch(error => {
        setResult([]);
        console.error('Error fetching data:', error);
      });
  };

  const isValidUrl = url => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div>
      <h1>Sort the Links</h1>
      <p>Enter URLs (comma-separated):</p>
      <input type="text" value={iUrls} onChange={e => setiUrls(e.target.value)} />
      <button onClick={handleFetchData}>Fetch Data</button>

      {res && res.length > 0 && (
        <div>
          <h2>Sorted Array is:</h2>
          <pre>{JSON.stringify({ numbers: res }, null, 2)}</pre>
        </div>
      )}

      {res && res.length === 0 && (
        <div>
          <h2>Error:</h2>
          <p>There was an error fetching data from the URLs.</p>
        </div>
      )}
    </div>
  );
};

export default NumberManagement;