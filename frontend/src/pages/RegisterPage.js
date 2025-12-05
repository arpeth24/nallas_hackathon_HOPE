import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import './RegisterPage.css';

function RegisterPage({ setCurrentUser }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phoneNo: '',
    pincode: '',
    location: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // require name
    if (!formData.name || !formData.name.trim()) {
      setError('Name is required.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const uid = userCredential.user.uid;
      const registeredName = formData.name.trim();

      // set displayName in Firebase Auth
      try {
        await updateProfile(userCredential.user, { displayName: registeredName });
      } catch (updErr) {
        console.warn('Could not set displayName on auth user:', updErr);
      }

      // ensure Firestore users doc saved (merge)
      try {
        await setDoc(doc(db, 'users', uid), {
          uid,
          name: registeredName,
          age: formData.age,
          phoneNo: formData.phoneNo,
          pincode: formData.pincode,
          location: formData.location,
          email: formData.email,
          createdAt: new Date()
        }, { merge: true });
      } catch (dbErr) {
        console.warn('Could not save user to Firestore:', dbErr);
      }

      // optional: still call backend register endpoint if you use it
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age,
          phoneNo: formData.phoneNo,
          pincode: formData.pincode,
          location: formData.location,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      if (response.ok) {
        setCurrentUser({
          uid,
          email: userCredential.user.email,
          name: registeredName
        });
        navigate('/home');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // ...existing error handling...
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please use a different email.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Create Account</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="number" 
            name="age" 
            placeholder="Age" 
            value={formData.age} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="tel" 
            name="phoneNo" 
            placeholder="Phone Number" 
            value={formData.phoneNo} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="pincode" 
            placeholder="Pincode" 
            value={formData.pincode} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="location" 
            placeholder="Location" 
            value={formData.location} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password (min 6 characters)" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirm Password" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
