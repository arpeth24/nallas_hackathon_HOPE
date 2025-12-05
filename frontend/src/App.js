import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import PhotoGallery from './pages/PhotoGallery';
import CreateGatheringPage from './pages/CreateGatheringPage';
import Header from './components/Header';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <Header currentUser={currentUser} />
        <Routes>
          <Route path="/" element={<RegisterPage setCurrentUser={setCurrentUser} />} />
          <Route path="/home" element={<HomePage currentUser={currentUser} />} />
          <Route path="/gathering/:id" element={<LandingPage currentUser={currentUser} />} />
          <Route path="/gallery" element={<PhotoGallery />} />
          <Route path="/create-gathering" element={<CreateGatheringPage currentUser={currentUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
