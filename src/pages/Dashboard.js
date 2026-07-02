import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import '../styles/Dashboard.css';

// Sub-pages
import DashboardHome     from '../components/dashboard/DashboardHome';
import ProfilePage       from '../components/dashboard/ProfilePage';
import WeeklyQuizSection from '../components/dashboard/WeeklyQuizSection';
import LeaderboardPage   from '../components/dashboard/LeaderboardPage';
import WinnersPage       from '../components/dashboard/WinnersPage';
import AttendancePage    from '../components/dashboard/AttendancePage';
import RewardsPage       from '../components/dashboard/RewardsPage';
import PrizeInfoPage     from '../components/dashboard/PrizeInfoPage';
import ComplaintPage     from '../components/dashboard/ComplaintPage';
import NotificationsPage from '../components/dashboard/NotificationsPage';
import SettingsPage      from '../components/dashboard/SettingsPage';
import TournamentPage    from '../components/dashboard/TournamentPage';

import {
  FiHome, FiUser, FiAward, FiList, FiStar, FiCalendar,
  FiGift, FiMessageSquare, FiBell, FiSettings, FiTarget, FiTrendingUp
} from 'react-icons/fi';

const NAV_ITEMS = [
  { to: '/dashboard',               label: 'Home',        icon: FiHome,          end: true },
  { to: '/dashboard/profile',       label: 'Profile',     icon: FiUser },
  { to: '/dashboard/quiz',          label: 'Weekly Quiz', icon: FiTarget },
  { to: '/dashboard/leaderboard',   label: 'Leaderboard', icon: FiTrendingUp },
  { to: '/dashboard/winners',       label: 'Winners',     icon: FiAward },
  { to: '/dashboard/tournament',    label: 'Tournament',  icon: FiList },
  { to: '/dashboard/attendance',    label: 'Attendance',  icon: FiCalendar },
  { to: '/dashboard/rewards',       label: 'Rewards',     icon: FiGift },
  { to: '/dashboard/prize-info',    label: 'Prize Info',  icon: FiStar },
  { to: '/dashboard/complaints',    label: 'Complaints',  icon: FiMessageSquare },
  { to: '/dashboard/notifications', label: 'Notifications', icon: FiBell },
  { to: '/dashboard/settings',      label: 'Settings',    icon: FiSettings },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Navbar />
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
          <nav className="sidebar-nav">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}>
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="dashboard-main">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>☰ Menu</button>
          <Routes>
            <Route index              element={<DashboardHome />} />
            <Route path="profile"     element={<ProfilePage />} />
            <Route path="quiz"        element={<WeeklyQuizSection />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="winners"     element={<WinnersPage />} />
            <Route path="tournament"  element={<TournamentPage />} />
            <Route path="attendance"  element={<AttendancePage />} />
            <Route path="rewards"     element={<RewardsPage />} />
            <Route path="prize-info"  element={<PrizeInfoPage />} />
            <Route path="complaints"  element={<ComplaintPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings"    element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
