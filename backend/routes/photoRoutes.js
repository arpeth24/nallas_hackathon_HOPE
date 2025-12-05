const express = require('express');
const router = express.Router();

// Mock database
const photos = [];
let photoId = 1;

router.post('/upload', (req, res) => {
  const { gatheringId, gatheringName, eventType, photo } = req.body;
  
  if (!gatheringId || !photo) {
    return res.status(400).json({ message: 'Gathering ID and photo are required' });
  }

  const photoEntry = {
    id: photoId++,
    gatheringId,
    gatheringName: gatheringName || 'Unknown',
    eventType: eventType || 'General',
    photo,
    uploadedAt: new Date()
  };

  photos.push(photoEntry);
  res.status(201).json({ message: 'Photo uploaded successfully', photoEntry });
});

router.get('/all', (req, res) => {
  res.status(200).json(photos);
});

router.get('/search', (req, res) => {
  const { keyword } = req.query;
  
  let results = photos;
  
  if (keyword) {
    results = results.filter(p => 
      p.gatheringName.toLowerCase().includes(keyword.toLowerCase()) ||
      p.eventType.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  res.status(200).json(results);
});

module.exports = router;
