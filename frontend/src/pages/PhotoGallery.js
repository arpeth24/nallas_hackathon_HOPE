import React, { useState, useEffect } from 'react';
import './PhotoGallery.css';

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchAllPhotos();
  }, []);

  const fetchAllPhotos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/photos/all');
      const data = await response.json();
      setPhotos(data);
      setFilteredPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/photos/search?keyword=${searchKeyword}`);
      const data = await response.json();
      setFilteredPhotos(data);
    } catch (error) {
      console.error('Error searching photos:', error);
    }
  };

  return (
    <div className="gallery-container">
      <h1>Photo Gallery</h1>
      <div className="search-bar">
        <input type="text" placeholder="Search photos..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="photos-grid">
        {filteredPhotos.length > 0 ? (
          filteredPhotos.map(photo => (
            <div key={photo.id} className="photo-card">
              <img src={photo.photo} alt={photo.gatheringName} />
              <div className="photo-info">
                <p className="gathering-name">{photo.gatheringName}</p>
                <p className="event-type">{photo.eventType}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-photos">No photos found.</p>
        )}
      </div>
    </div>
  );
}

export default PhotoGallery;
