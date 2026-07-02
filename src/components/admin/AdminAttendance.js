import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendance/community').then(r => setRecords(r.data.records || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div className="section-title">Community Attendance</div>
      <div className="glass" style={{ overflow:'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Player</th><th>Total Events</th><th>Current Streak</th>
                <th>Best Streak</th><th>Last Participation</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:40 }}>
                  <div className="spinner" style={{ margin:'0 auto' }} />
                </td></tr>
              ) : records.map(r => (
                <tr key={r._id}>
                  <td>
                    <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#fff' }}>
                      {r.userId?.username}
                    </div>
                    <div style={{ fontSize:12, color:'#555' }}>{r.userId?.email}</div>
                  </td>
                  <td style={{ textAlign:'center' }}>
                    <span style={{ fontFamily:'Orbitron,monospace', fontWeight:700, color:'#00ff88' }}>
                      {r.totalAttended}
                    </span>
                  </td>
                  <td style={{ textAlign:'center' }}>
                    {r.currentStreak > 0 && (
                      <span style={{ color:'#ffa502' }}>🔥 {r.currentStreak}w</span>
                    )}
                    {r.currentStreak === 0 && <span style={{ color:'#555' }}>--</span>}
                  </td>
                  <td style={{ textAlign:'center', color:'#aaa' }}>{r.longestStreak}w</td>
                  <td style={{ fontSize:12 }}>{formatDate(r.lastParticipation)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
