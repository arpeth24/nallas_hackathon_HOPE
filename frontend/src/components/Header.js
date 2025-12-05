import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import './Header.css';

function Header({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to={currentUser ? "/home" : "/"} className="logo">HOPE</Link>
        <nav className="nav">
          {currentUser ? (
            <>
              <Link to="/home">Home</Link>
              <Link to="/gallery">Gallery</Link>
              <span className="user-name">Welcome, {currentUser.name && currentUser.name.trim() ? currentUser.name : 'User'}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
