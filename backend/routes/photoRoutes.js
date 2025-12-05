const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

router.post('/upload', async (req, res) => {
  const { gatheringId, gatheringName, organizerName, eventType, photo } = req.body;
  
  if (!gatheringId || !photo) {
    return res.status(400).json({ message: 'Gathering ID and photo are required' });
  }

  try {
    const photoData = {
      gatheringId,
      gatheringName: gatheringName || 'Unknown',
      organizerName: organizerName || 'Unknown',
      eventType: eventType || 'General',
      photo,
      uploadedAt: new Date()
    };

    const docRef = await db.collection('photos').add(photoData);

    res.status(201).json({ 
      message: 'Photo uploaded successfully', 
      photo: {
        id: docRef.id,
        ...photoData
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Error uploading photo: ' + error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const snapshot = await db.collection('photos').orderBy('uploadedAt', 'desc').get();
    const photos = [];
    snapshot.forEach(doc => {
      photos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photos: ' + error.message });
  }
});

router.get('/search', async (req, res) => {
  const { keyword } = req.query;
  
  try {
    const snapshot = await db.collection('photos').get();
    let results = [];

    snapshot.forEach(doc => {
      results.push({
        id: doc.id,
        ...doc.data()
      });
    });

    if (keyword) {
      results = results.filter(p => 
        p.gatheringName.toLowerCase().includes(keyword.toLowerCase()) ||
        p.organizerName.toLowerCase().includes(keyword.toLowerCase()) ||
        p.eventType.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching photos: ' + error.message });
  }
});

module.exports = router;
