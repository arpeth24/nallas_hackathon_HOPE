import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './GatheringCard.css';

function GatheringCard({ gathering, currentUser }) {
  const [isParticipating, setIsParticipating] = useState(gathering.participants.includes(currentUser?.id));

  const handleParticipate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/gatherings/${gathering.id}/participate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, action: isParticipating ? 'remove' : 'add' })
      });

      if (response.ok) {
        setIsParticipating(!isParticipating);
      }
    } catch (error) {
      console.error('Error participating:', error);
    }
  };

  return (
    <div className="gathering-card">
      <h3>{gathering.gatheringName}</h3>
      <p><strong>Organizer:</strong> {gathering.organizerName}</p>
      <p><strong>Event Type:</strong> {gathering.eventType}</p>
      <p><strong>Date:</strong> {gathering.date}</p>
      <p><strong>Time:</strong> {gathering.time}</p>
      <p><strong>Venue:</strong> {gathering.venue}</p>
      <p><strong>Location:</strong> {gathering.location}</p>
      <div className="card-buttons">
        <Link to={`/gathering/${gathering.id}`} className="details-btn">View Details</Link>
        <button onClick={handleParticipate} className={`participate-btn ${isParticipating ? 'active' : ''}`}>
          {isParticipating ? '✓ I am there' : 'I am there'}
        </button>
      </div>
    </div>
  );
}

export default GatheringCard;
