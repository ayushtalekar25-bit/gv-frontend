import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import '../styles/Dashboard.css';

import AdminHome         from '../components/admin/AdminHome';
import AdminUsers        from '../components/admin/AdminUsers';
import AdminQuestions    from '../components/admin/AdminQuestions';
import AdminResults      from '../components/admin/AdminResults';
import AdminLeaderboard  from '../components/admin/AdminLeaderboard';
import AdminWinners      from '../components/admin/AdminWinners';
import AdminAttendance   from '../components/admin/AdminAttendance';
import AdminComplaints   from '../components/admin/AdminComplaints';
import AdminAnnouncements from '../components/admin/AdminAnnouncements';
import AdminRewards      from '../components/admin/AdminRewards';
import AdminSettings     from '../components/admin/AdminSettings';
import AdminTournament   from '../components/admin/AdminTournament';

import {
  FiHome, FiUsers, FiHelpCircle, FiList, FiTrendingUp, FiAward,
  FiCalendar, FiMessageSquare, FiBell, FiGift, FiSettings, FiTarget
} from 'react-icons/fi';

const NAV_ITEMS = [
  { to:'/admin',                    label:'Dashboard',    icon:FiHome,         end:true },
  { to:'/admin/users',              label:'Users',        icon:FiUsers },
  { to:'/admin/questions',          label:'Questions',    icon:FiHelpCircle },
  { to:'/admin/results',            label:'Results',      icon:FiList },
  { to:'/admin/leaderboard',        label:'Leaderboard',  icon:FiTrendingUp },
  { to:'/admin/winners',            label:'Winners',      icon:FiAward },
  { to:'/admin/tournament',         label:'Tournament',   icon:FiTarget },
  { to:'/admin/attendance',         label:'Attendance',   icon:FiCalendar },
  { to:'/admin/complaints',         label:'Complaints',   icon:FiMessageSquare },
  { to:'/admin/announcements',      label:'Announcements',icon:FiBell },
  { to:'/admin/rewards',            label:'Rewards',      icon:FiGift },
  { to:'/admin/settings',           label:'Settings',     icon:FiSettings },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="dashboard-layout">
      <Navbar />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <div className="dashboard-body">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
          <nav className="sidebar-nav">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}>
                <Icon size={16} /><span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="dashboard-main">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>☰ Menu</button>
          <Routes>
            <Route index                element={<AdminHome />} />
            <Route path="users"         element={<AdminUsers />} />
            <Route path="questions"     element={<AdminQuestions />} />
            <Route path="results"       element={<AdminResults />} />
            <Route path="leaderboard"   element={<AdminLeaderboard />} />
            <Route path="winners"       element={<AdminWinners />} />
            <Route path="tournament"    element={<AdminTournament />} />
            <Route path="attendance"    element={<AdminAttendance />} />
            <Route path="complaints"    element={<AdminComplaints />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="rewards"       element={<AdminRewards />} />
            <Route path="settings"      element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
