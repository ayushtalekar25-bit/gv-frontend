import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import WeeklyTimeline from '../dashboard/WeeklyTimeline';
import { FiUsers, FiUserCheck, FiTarget, FiMessageSquare, FiAward, FiBarChart2 } from 'react-icons/fi';

const STAT_ITEMS = [
  { key:'totalUsers',         label:'Total Users',       icon: FiUsers,        color:'#FFD400' },
  { key:'activeUsers',        label:'Active Users',      icon: FiUserCheck,    color:'#FFD400' },
  { key:'weeklyParticipants', label:'Weekly Players',    icon: FiTarget,       color:'#FFD400' },
  { key:'pendingComplaints',  label:'Complaints',        icon: FiMessageSquare,color:'#FF3B30' },
  { key:'totalWinners',       label:'Total Winners',     icon: FiAward,        color:'#FFD400' },
  { key:'averageQuizScore',   label:'Avg Score',         icon: FiBarChart2,    color:'#FFD400' },
];

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}); }, []);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div className="section-title">Admin Dashboard</div>

      {/* ── Compact stat cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {STAT_ITEMS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="glass" style={{
            padding:'14px 16px',
            display:'flex', alignItems:'center', gap:12,
            transition:'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor=`${color}40`; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor=''; }}>
            <div style={{
              width:36, height:36, borderRadius:8, flexShrink:0,
              background:`${color}18`, border:`1px solid ${color}30`,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon size={16} color={color} />
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:20, fontWeight:700,
                color:'#fff', lineHeight:1 }}>
                {stats ? (stats[key] ?? 0) : '—'}
              </div>
              <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:11, color:'#555',
                textTransform:'uppercase', letterSpacing:'0.8px', marginTop:3 }}>
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Timeline + Quick Actions ── */}
      <div className="grid-2">
        <div className="glass" style={{ padding:20 }}>
          <div className="section-title">Weekly Timeline</div>
          <WeeklyTimeline />
        </div>
        <div className="glass" style={{ padding:20 }}>
          <div className="section-title">Quick Actions</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              ['Questions', '/admin/questions'],
              ['Announcements', '/admin/announcements'],
              ['Winners', '/admin/winners'],
              ['Tournament', '/admin/tournament'],
              ['Complaints', '/admin/complaints'],
            ].map(([label, path]) => (
              <a key={path} href={path} style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'10px 14px', background:'rgba(255,255,255,0.03)',
                borderRadius:8, color:'#666', textDecoration:'none',
                fontFamily:'Rajdhani,sans-serif', fontSize:13, fontWeight:600,
                textTransform:'uppercase', letterSpacing:'0.5px',
                border:'1px solid rgba(255,255,255,0.06)', transition:'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.color='#FFD400'; e.currentTarget.style.borderColor='rgba(255,212,0,0.25)'; e.currentTarget.style.background='rgba(255,212,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.color='#666'; e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
