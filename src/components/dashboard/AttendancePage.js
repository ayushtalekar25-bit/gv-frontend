import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

export default function AttendancePage() {
  const [att, setAtt] = useState(null);
  const [perfectUsers, setPerfectUsers] = useState([]);

  useEffect(() => {
    api.get('/attendance/my').then(r => setAtt(r.data.attendance)).catch(() => {});
    api.get('/attendance/perfect-month').then(r => setPerfectUsers(r.data.perfectAttendance || [])).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="section-title">Community Attendance</div>

      {/* Personal stats */}
      <div className="grid-4">
        {[
          { label: 'Total Events Joined', value: att?.totalAttended || 0 },
          { label: 'Current Streak', value: `${att?.currentStreak || 0}w` },
          { label: 'Best Streak', value: `${att?.longestStreak || 0}w` },
          { label: 'Last Participation', value: att?.lastParticipation ? formatDate(att.lastParticipation) : '--' },
        ].map(s => (
          <div key={s.label} className="glass stat-card">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Streak visual */}
      {att?.records?.length > 0 && (
        <div className="glass" style={{ padding: 24 }}>
          <div className="section-title">Participation History</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {att.records.slice(-20).map((r, i) => (
              <div key={i} title={formatDate(r.attendedAt)} style={{
                width: 36, height: 36, borderRadius: 6,
                background: 'rgba(0,255,136,0.2)', border: '1px solid rgba(0,255,136,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, boxShadow: '0 0 8px rgba(0,255,136,0.2)'
              }}>✓</div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#555', marginTop: 12 }}>Each block = one event attended</p>
        </div>
      )}

      {/* Perfect attendance */}
      {perfectUsers.length > 0 && (
        <div className="glass" style={{ padding: 24 }}>
          <div className="section-title">🌟 Perfect Attendance — Last Month</div>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
            Players with perfect attendance last month are highlighted below.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {perfectUsers.map(u => (
              <div key={u.username} style={{
                padding: '8px 16px', borderRadius: 8,
                background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)',
                fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 15,
                color: '#ffd700', textShadow: '0 0 8px rgba(255,215,0,0.5)'
              }}>
                ⭐ {u.username}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="glass" style={{ padding: 24 }}>
        <div className="section-title">How Attendance Works</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['📅', 'Weekly event happens every Saturday at 9:00 PM'],
            ['✅', 'Submitting the quiz counts as attendance for that week'],
            ['🔥', 'Build streaks by participating every week'],
            ['⭐', 'Perfect monthly attendance earns a golden highlight'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontSize: 14, color: '#888' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
