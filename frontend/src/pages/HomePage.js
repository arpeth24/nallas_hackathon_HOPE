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
    if (!currentUser) navigate('/');
    fetchGatherings();
  }, [currentUser, navigate]);

  const fetchGatherings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/gatherings/all');
      const data = await response.json();
      setGatherings(data);
      setFilteredGatherings(data);
    } catch (error) {
      console.error('Error fetching gatherings:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (searchKeyword) params.append('keyword', searchKeyword);
      if (eventTypeFilter) params.append('eventType', eventTypeFilter);

      const response = await fetch(`http://localhost:5000/api/gatherings/search?${params}`);
      const data = await response.json();
      setFilteredGatherings(data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const eventTypes = ['Religious', 'Sports', 'Club', 'Education', 'Get Together'];

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
        {filteredGatherings.map(gathering => (
          <GatheringCard key={gathering.id} gathering={gathering} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
