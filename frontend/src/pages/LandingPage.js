import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage({ currentUser }) {
  const { id } = useParams();
  const [gathering, setGathering] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // don't auto-redirect; just fetch details if user exists
    if (currentUser) {
      fetchGatheringDetails();
    }
  }, [id, currentUser, navigate]);

  // If user not signed in show guidance so you can fix Firebase config
  if (!currentUser) {
    return (
      <div className="landing-container">
        <div style={{ padding: 24, background: '#fff3cd', borderRadius: 8, border: '1px solid #ffeeba' }}>
          <h2>Firebase Auth not configured</h2>
          <p>
            You must enable Email/Password authentication in Firebase and ensure your frontend environment variables are correct.
          </p>
          <ul>
            <li><a href="https://console.firebase.google.com/project/hope-431dd/authentication/providers" target="_blank" rel="noreferrer">Enable Email/Password in Firebase Console</a></li>
            <li>Update frontend <code>frontend/.env</code> with the Web App config values and restart the dev server</li>
            <li>Make sure <code>REACT_APP_FIREBASE_STORAGE_BUCKET</code> uses <code>.appspot.com</code> (example: <code>hope-431dd.appspot.com</code>)</li>
          </ul>
          <p>Return to <a href="/">Register</a> after fixing settings and try again.</p>
        </div>
      </div>
    );
  }

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

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) {
      alert('Please select a photo');
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const photoData = {
          gatheringId: gathering.id,
          gatheringName: gathering.gatheringName,
          organizerName: gathering.organizerName,
          eventType: gathering.eventType,
          photo: reader.result
        };

        const response = await fetch('http://localhost:5000/api/photos/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(photoData)
        });

        const data = await response.json();
        if (response.ok) {
          alert('Photo uploaded successfully!');
          setPhotoFile(null);
          setPreviewUrl(null);
          document.getElementById('photo-input').value = '';
          fetchGatheringDetails();
        } else {
          alert('Error uploading photo: ' + data.message);
        }
      };
      reader.readAsDataURL(photoFile);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
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
        
        <div className="upload-section">
          <h3>Upload Your Photo</h3>
          <div className="upload-container">
            {previewUrl && (
              <div className="photo-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
            <div className="upload-input-group">
              <input 
                type="file" 
                id="photo-input"
                accept="image/*" 
                onChange={handlePhotoSelect}
                disabled={uploading}
              />
              <button 
                onClick={handlePhotoUpload} 
                disabled={uploading || !photoFile}
                className="upload-btn"
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </div>
            <p className="upload-info">Share your memories from this event. Photos will be saved with event name and organizer name.</p>
          </div>
        </div>

        <div className="photos-grid">
          <h3>All Event Photos ({photos.length})</h3>
          {photos.length > 0 ? (
            <div className="gallery-grid">
              {photos.map(photo => (
                <div key={photo.id} className="photo-item">
                  <img src={photo.photo} alt={photo.gatheringName} />
                  <div className="photo-info">
                    <p className="photo-event">{photo.gatheringName}</p>
                    <p className="photo-organizer">by {photo.organizerName}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-photos">No photos available yet. Be the first to share!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
