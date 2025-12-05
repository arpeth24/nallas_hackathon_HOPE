import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateGatheringPage.css';

function CreateGatheringPage({ currentUser }) {
  const [formData, setFormData] = useState({
    organizerName: currentUser?.name || '',
    gatheringName: '',
    eventType: '',
    date: '',
    time: '',
    venue: '',
    location: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const eventTypes = ['Religious', 'Sports', 'Club', 'Education', 'Get Together'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/gatherings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Gathering created successfully!');
        navigate('/home');
      } else {
        alert('Error creating gathering: ' + data.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="create-gathering-container">
      <div className="create-gathering-box">
        <h1>Host a Meeting</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="organizerName" 
            placeholder="Organizer Name" 
            value={formData.organizerName} 
            onChange={handleChange} 
            readOnly
          />
          <input 
            type="text" 
            name="gatheringName" 
            placeholder="Gathering Name" 
            value={formData.gatheringName} 
            onChange={handleChange} 
            required
          />
          <select 
            name="eventType" 
            value={formData.eventType} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Event Type</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            required
          />
          <input 
            type="time" 
            name="time" 
            value={formData.time} 
            onChange={handleChange} 
            required
          />
          <input 
            type="text" 
            name="venue" 
            placeholder="Venue" 
            value={formData.venue} 
            onChange={handleChange} 
            required
          />
          <input 
            type="text" 
            name="location" 
            placeholder="Location" 
            value={formData.location} 
            onChange={handleChange} 
            required
          />
          <textarea 
            name="description" 
            placeholder="Event Description" 
            value={formData.description} 
            onChange={handleChange}
            rows="4"
          />
          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Gathering'}
            </button>
            <button type="button" onClick={() => navigate('/home')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGatheringPage;
