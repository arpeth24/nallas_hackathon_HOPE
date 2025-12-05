import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ currentUser }) {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/home" className="logo">HOPE</Link>
        <nav className="nav">
          <Link to="/home">Home</Link>
          <Link to="/gallery">Gallery</Link>
          {currentUser && <span className="user-name">Welcome, {currentUser.name}</span>}
        </nav>
      </div>
    </header>
  );
}

export default Header;
