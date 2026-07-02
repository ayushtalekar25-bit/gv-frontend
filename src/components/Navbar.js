import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { FiBell, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="navbar-logo">
          <Logo size="sm" showText />
        </Link>

        {/* Desktop nav links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {user && (
            <>
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="nav-link"
                onClick={() => setMenuOpen(false)}>Dashboard</Link>
              {!isAdmin && <>
                <Link to="/dashboard/tournament"  className="nav-link" onClick={() => setMenuOpen(false)}>Tournament</Link>
                <Link to="/dashboard/leaderboard" className="nav-link" onClick={() => setMenuOpen(false)}>Leaderboard</Link>
                <Link to="/dashboard/rewards"     className="nav-link" onClick={() => setMenuOpen(false)}>Rewards</Link>
              </>}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {user && (
            <>
              <Link to={isAdmin ? '/admin/announcements' : '/dashboard/notifications'}
                className="nav-icon-btn" title="Notifications">
                <FiBell size={17} />
              </Link>
              <Link to={isAdmin ? '/admin' : '/dashboard/profile'}
                className="nav-avatar" title="Profile">
                {user.username?.[0]?.toUpperCase()}
              </Link>
              <button className="nav-icon-btn" onClick={handleLogout} title="Logout">
                <FiLogOut size={17} />
              </button>
            </>
          )}
          <button className="nav-menu-btn" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
