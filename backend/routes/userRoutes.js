const express = require('express');
const router = express.Router();

// Mock database
const users = [];

router.post('/register', (req, res) => {
  const { name, age, phoneNo, pincode, location } = req.body;
  
  if (!name || !age || !phoneNo || !pincode || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = {
    id: users.length + 1,
    name,
    age,
    phoneNo,
    pincode,
    location,
    createdAt: new Date()
  };

  users.push(user);
  res.status(201).json({ message: 'User registered successfully', user });
});

module.exports = router;
