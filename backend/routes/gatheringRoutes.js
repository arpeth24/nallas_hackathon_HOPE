const express = require('express');
const router = express.Router();

// Mock database
const gatherings = [];
let gatheringId = 1;

router.post('/create', (req, res) => {
  const { organizerName, gatheringName, eventType, date, time, venue, location, description } = req.body;
  
  if (!organizerName || !gatheringName || !eventType || !date || !time || !venue || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const gathering = {
    id: gatheringId++,
    organizerName,
    gatheringName,
    eventType,
    date,
    time,
    venue,
    location,
    description: description || '',
    participants: [],
    photos: [],
    createdAt: new Date()
  };

  gatherings.push(gathering);
  res.status(201).json({ message: 'Gathering created successfully', gathering });
});

router.get('/all', (req, res) => {
  res.status(200).json(gatherings);
});

router.get('/search', (req, res) => {
  const { keyword, eventType } = req.query;
  
  let results = gatherings;
  
  if (keyword) {
    results = results.filter(g => 
      g.gatheringName.toLowerCase().includes(keyword.toLowerCase()) ||
      g.location.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  if (eventType) {
    results = results.filter(g => g.eventType === eventType);
  }

  res.status(200).json(results);
});

router.get('/:id', (req, res) => {
  const gathering = gatherings.find(g => g.id === parseInt(req.params.id));
  if (!gathering) {
    return res.status(404).json({ message: 'Gathering not found' });
  }
  res.status(200).json(gathering);
});

router.post('/:id/participate', (req, res) => {
  const { userId, action } = req.body;
  const gathering = gatherings.find(g => g.id === parseInt(req.params.id));
  
  if (!gathering) {
    return res.status(404).json({ message: 'Gathering not found' });
  }

  if (action === 'remove') {
    gathering.participants = gathering.participants.filter(id => id !== userId);
  } else {
    if (!gathering.participants.includes(userId)) {
      gathering.participants.push(userId);
    }
  }

  res.status(200).json({ message: 'Participation updated', gathering });
});

module.exports = router;
