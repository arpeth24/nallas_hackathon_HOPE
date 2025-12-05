const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

router.post('/create', async (req, res) => {
  const { organizerName, organizerId, gatheringName, eventType, date, time, venue, location, description } = req.body;
  
  if (!organizerName || !gatheringName || !eventType || !date || !time || !venue || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const gatheringData = {
      organizerName,
      organizerId: organizerId || null,
      gatheringName,
      eventType,
      date,
      time,
      venue,
      location,
      description: description || '',
      participants: [],
      photos: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('gatherings').add(gatheringData);

    res.status(201).json({ 
      message: 'Gathering created successfully', 
      gathering: {
        id: docRef.id,
        ...gatheringData
      }
    });
  } catch (error) {
    console.error('Error creating gathering:', error);
    res.status(500).json({ message: 'Error creating gathering: ' + error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const snapshot = await db.collection('gatherings').orderBy('createdAt', 'desc').get();
    const gatherings = [];
    snapshot.forEach(doc => {
      gatherings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.status(200).json(gatherings);
  } catch (error) {
    console.error('Error fetching gatherings:', error);
    res.status(500).json({ message: 'Error fetching gatherings: ' + error.message });
  }
});

router.get('/search', async (req, res) => {
  const { keyword, eventType } = req.query;

  try {
    let query = db.collection('gatherings');

    if (eventType) {
      query = query.where('eventType', '==', eventType);
    }

    const snapshot = await query.get();
    let results = [];
    
    snapshot.forEach(doc => {
      results.push({
        id: doc.id,
        ...doc.data()
      });
    });

    if (keyword) {
      results = results.filter(g => 
        g.gatheringName.toLowerCase().includes(keyword.toLowerCase()) ||
        g.location.toLowerCase().includes(keyword.toLowerCase()) ||
        g.organizerName.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ message: 'Error searching: ' + error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('gatherings').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Gathering not found' });
    }
    res.status(200).json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error fetching gathering:', error);
    res.status(500).json({ message: 'Error fetching gathering: ' + error.message });
  }
});

router.post('/:id/participate', async (req, res) => {
  const { userId } = req.body;

  try {
    const gatheringRef = db.collection('gatherings').doc(req.params.id);
    const doc = await gatheringRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Gathering not found' });
    }

    const gathering = doc.data();
    const participants = gathering.participants || [];

    if (participants.includes(userId)) {
      const updatedParticipants = participants.filter(id => id !== userId);
      await gatheringRef.update({ participants: updatedParticipants });
    } else {
      await gatheringRef.update({ participants: [...participants, userId] });
    }

    res.status(200).json({ message: 'Participation updated' });
  } catch (error) {
    console.error('Error updating participation:', error);
    res.status(500).json({ message: 'Error updating participation: ' + error.message });
  }
});

// Update gathering
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    // remove id if present
    if (updateData.id) delete updateData.id;
    updateData.updatedAt = new Date();

    const gatheringRef = db.collection('gatherings').doc(id);
    const doc = await gatheringRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Gathering not found' });
    }

    await gatheringRef.update(updateData);
    res.status(200).json({ message: 'Gathering updated', gathering: { id, ...updateData } });
  } catch (error) {
    console.error('Error updating gathering:', error);
    res.status(500).json({ message: 'Error updating gathering: ' + error.message });
  }
});

// Delete gathering
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const gatheringRef = db.collection('gatherings').doc(id);
    const doc = await gatheringRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Gathering not found' });
    }

    await gatheringRef.delete();
    res.status(200).json({ message: 'Gathering deleted' });
  } catch (error) {
    console.error('Error deleting gathering:', error);
    res.status(500).json({ message: 'Error deleting gathering: ' + error.message });
  }
});

module.exports = router;
