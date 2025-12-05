import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage({ currentUser }) {
  const { id } = useParams();
  const [gathering, setGathering] = useState(null);
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate('/');
    fetchGatheringDetails();
  }, [id, currentUser, navigate]);

  const fetchGatheringDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/gatherings/${id}`);
      const data = await response.json();
      setGathering(data);
      
      const photoResponse = await fetch(`http://localhost:5000/api/photos/search?keyword=${data.gatheringName}`);
      const photoData = await photoResponse.json();
      setPhotos(photoData);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  if (!gathering) return <div className="loading">Loading...</div>;

  return (
    <div className="landing-container">
      <div className="gathering-details">
        <h1>{gathering.gatheringName}</h1>
        <div className="details-section">
          <p><strong>Organizer:</strong> {gathering.organizerName}</p>
          <p><strong>Event Type:</strong> {gathering.eventType}</p>
          <p><strong>Date:</strong> {gathering.date}</p>
          <p><strong>Time:</strong> {gathering.time}</p>
          <p><strong>Venue:</strong> {gathering.venue}</p>
          <p><strong>Location:</strong> {gathering.location}</p>
          <p><strong>Participants:</strong> {gathering.participants.length}</p>
        </div>

        <div className="description-section">
          <h2>Description</h2>
          <p>{gathering.description || 'No description available.'}</p>
        </div>
      </div>

      <div className="photos-section">
        <h2>Event Memories</h2>
        <div className="photos-grid">
          {photos.length > 0 ? (
            photos.map(photo => (
              <div key={photo.id} className="photo-item">
                <img src={photo.photo} alt={photo.gatheringName} />
                <p>{photo.gatheringName}</p>
              </div>
            ))
          ) : (
            <p>No photos available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
