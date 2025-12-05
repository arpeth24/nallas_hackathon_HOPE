const express = require('express');
const router = express.Router();
const { db, auth } = require('../config/firebase');

router.post('/register', async (req, res) => {
  const { name, age, phoneNo, pincode, location, email, password } = req.body;
  
  if (!name || !age || !phoneNo || !pincode || !location || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: name
    });

    // Store user details in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: name,
      age: parseInt(age),
      phoneNo: phoneNo,
      pincode: pincode,
      location: location,
      email: email,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: {
        uid: userRecord.uid,
        name,
        email
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user: ' + error.message });
  }
});

router.get('/:uid', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(userDoc.data());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user: ' + error.message });
  }
});

module.exports = router;
