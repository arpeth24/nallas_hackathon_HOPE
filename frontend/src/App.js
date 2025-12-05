import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import PhotoGallery from './pages/PhotoGallery';
import CreateGatheringPage from './pages/CreateGatheringPage';
import Header from './components/Header';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('App mounted - setting up auth listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User: ${user.email}` : 'No user');
      
      if (user) {
        // try to fetch user profile from Firestore (users collection)
        let name = user.displayName || 'User';
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const d = userDoc.data();
            if (d && d.name) name = d.name;
          }
        } catch (err) {
          console.warn('Could not fetch user profile from Firestore:', err);
        }

        setCurrentUser({
          uid: user.uid,
          email: user.email,
          name
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Auth error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner">Loading HOPE...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <Routes>
          <Route path="/" element={currentUser ? <Navigate to="/home" /> : <LoginPage setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={currentUser ? <Navigate to="/home" /> : <RegisterPage setCurrentUser={setCurrentUser} />} />
          <Route path="/home" element={currentUser ? <HomePage currentUser={currentUser} /> : <Navigate to="/" />} />
          <Route path="/gathering/:id" element={currentUser ? <LandingPage currentUser={currentUser} /> : <Navigate to="/" />} />
          <Route path="/gallery" element={<PhotoGallery />} />
          <Route path="/create-gathering" element={currentUser ? <CreateGatheringPage currentUser={currentUser} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
