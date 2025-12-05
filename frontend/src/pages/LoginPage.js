import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './LoginPage.css';

function LoginPage({ setCurrentUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
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

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const uid = userCredential.user.uid;
      const providedName = formData.name.trim();

      // update Firebase Auth displayName (if different)
      try {
        await updateProfile(userCredential.user, { displayName: providedName });
      } catch (updErr) {
        console.warn('Could not update auth displayName:', updErr);
      }

      // persist name in Firestore users collection (merge)
      try {
        await setDoc(doc(db, 'users', uid), {
          name: providedName,
          email: userCredential.user.email,
          updatedAt: new Date()
        }, { merge: true });
      } catch (dbErr) {
        console.warn('Could not update Firestore user doc:', dbErr);
      }

      // set current user with provided name
      setCurrentUser({
        uid,
        email: userCredential.user.email,
        name: providedName
      });

      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/user-not-found') {
        setError('Email not found. Please register first.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Wrong password. Please try again.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Make name required */}
          <input
            type="text"
            name="name"
            placeholder="Your Name (required)"
            value={formData.name}
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
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="register-link">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
