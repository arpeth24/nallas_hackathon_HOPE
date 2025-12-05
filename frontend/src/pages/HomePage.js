import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GatheringCard from '../components/GatheringCard';
import './HomePage.css';

function HomePage({ currentUser }) {
  const [gatherings, setGatherings] = useState([]);
  const [filteredGatherings, setFilteredGatherings] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchGatherings();
    }
  }, [currentUser, navigate]);

  const safeArray = (value) => (Array.isArray(value) ? value : []);

  const extractArrayFromResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      for (const key of Object.keys(data)) {
        if (Array.isArray(data[key])) return data[key];
      }
      const firstArray = Object.values(data).find(v => Array.isArray(v));
      if (firstArray) return firstArray;
    }
    return null;
  };

  const fetchGatherings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/gatherings/all');
      const data = await response.json();

      const arr = extractArrayFromResponse(data);
      if (!arr) {
        console.error('Expected array from /gatherings/all, got:', data);
        setGatherings([]);
        setFilteredGatherings([]);
        return;
      }

      setGatherings(arr);
      setFilteredGatherings(arr);
    } catch (error) {
      console.error('Error fetching gatherings:', error);
      setGatherings([]);
      setFilteredGatherings([]);
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (searchKeyword) params.append('keyword', searchKeyword);
      if (eventTypeFilter) params.append('eventType', eventTypeFilter);

      const response = await fetch(`http://localhost:5000/api/gatherings/search?${params}`);
      const data = await response.json();

      const arr = extractArrayFromResponse(data);
      if (!arr) {
        console.error('Expected array from /gatherings/search, got:', data);
        const localResults = safeArray(gatherings).filter(g =>
          (searchKeyword ? g.gatheringName.toLowerCase().includes(searchKeyword.toLowerCase()) : true) &&
          (eventTypeFilter ? g.eventType === eventTypeFilter : true)
        );
        setFilteredGatherings(localResults);
        return;
      }

      setFilteredGatherings(arr);
    } catch (error) {
      console.error('Error searching:', error);
      const localResults = safeArray(gatherings).filter(g =>
        (searchKeyword ? g.gatheringName.toLowerCase().includes(searchKeyword.toLowerCase()) : true) &&
        (eventTypeFilter ? g.eventType === eventTypeFilter : true)
      );
      setFilteredGatherings(localResults);
    }
  };

  const handleDeleteGathering = (id) => {
    const updated = (g) => g.filter(item => item.id !== id);
    setGatherings(prev => updated(prev));
    setFilteredGatherings(prev => updated(prev));
  };

  const handleUpdateGathering = (updatedGathering) => {
    const updateArray = (arr) => arr.map(item => item.id === updatedGathering.id ? { ...item, ...updatedGathering } : item);
    setGatherings(prev => updateArray(prev));
    setFilteredGatherings(prev => updateArray(prev));
  };

  const eventTypes = ['Religious', 'Sports', 'Club', 'Education', 'Get Together'];

  if (!currentUser) {
    return (
      <div className="home-container">
        <div style={{ padding: 24, background: '#fff3cd', borderRadius: 8, border: '1px solid #ffeeba' }}>
          <h2 style={{ marginTop: 0 }}>Firebase Auth not configured</h2>
          <p>
            Registration / sign-in failed because Firebase Authentication is not fully configured.
            To fix:
          </p>
          <ol>
            <li>Open Firebase console: <a href="https://console.firebase.google.com/project/hope-431dd/authentication/providers" target="_blank" rel="noreferrer">Authentication → Sign-in method</a></li>
            <li>Enable <strong>Email/Password</strong> provider and save.</li>
            <li>Make sure frontend <code>.env</code> has correct REACT_APP_FIREBASE_* values (API key, authDomain, projectId, storageBucket (use <code>.appspot.com</code>), appId).</li>
            <li>Stop and restart the React dev server after changing <code>.env</code>.</li>
          </ol>
          <p>
            After enabling Email/Password, return to <Link to="/">Register</Link> and try again.
          </p>
        </div>
      </div>
    );
  }

  const items = Array.isArray(filteredGatherings) ? filteredGatherings : [];

  return (
    <div className="home-container">
      <div className="search-section">
        <input type="text" placeholder="Search gatherings..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
        <select value={eventTypeFilter} onChange={(e) => setEventTypeFilter(e.target.value)}>
          <option value="">All Event Types</option>
          {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <button onClick={handleSearch}>Search</button>
        <Link to="/create-gathering" className="host-btn">Host a Meeting</Link>
      </div>

      <div className="gatherings-grid">
        {items.length > 0 ? (
          items.map(gathering => (
            <GatheringCard
              key={gathering.id}
              gathering={gathering}
              currentUser={currentUser}
              onDelete={handleDeleteGathering}
              onUpdate={handleUpdateGathering}
            />
          ))
        ) : (
          <div style={{ padding: 20, color: '#555', textAlign: 'center' }}>
            <p>No gatherings to display.</p>
            <p>Be the first to <Link to="/create-gathering">host a meeting</Link>!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
