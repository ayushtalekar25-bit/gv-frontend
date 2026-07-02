import React from 'react';
import '../styles/LoadingScreen.css';

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <img src="/logo.png" alt="GameVolute" className="loading-logo-img" />
        </div>
        <div className="loading-title">
          <span style={{ color: '#fff' }}>GAME</span>
          <span style={{ color: '#e53e3e' }}>VOLUTE</span>
        </div>
        <div className="loading-bar">
          <div className="loading-bar-fill" />
        </div>
        <div className="loading-text">Loading…</div>
      </div>
    </div>
  );
}
