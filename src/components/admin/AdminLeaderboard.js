import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatDateTime, formatTime } from '../../utils/helpers';

export default function AdminLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [weekId, setWeekId] = useState('');

  useEffect(() => {
    api.get('/leaderboard').then(r => {
      setLeaderboard(r.data.leaderboard || []);
      setWeekId(r.data.weekId);
    });
  }, []);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div className="section-title">Leaderboard — Week {weekId}</div>
      </div>
      <div className="glass" style={{ overflow:'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Rank</th><th>Player</th><th>Score</th><th>Time</th><th>Submitted</th></tr>
            </thead>
            <tbody>
              {leaderboard.map((p, i) => (
                <tr key={p.username}>
                  <td>
                    <span style={{ fontFamily:'Orbitron,monospace', fontWeight:700,
                      color:i===0?'#ffd700':i===1?'#c0c0c0':i===2?'#cd7f32':'#555' }}>
                      {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
                    </span>
                  </td>
                  <td style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#fff', fontSize:15 }}>{p.username}</td>
                  <td>
                    <span style={{ color:p.score>=12?'#00ff88':p.score>=8?'#ffa502':'#ff4757', fontWeight:600 }}>
                      {p.score}/{p.totalQuestions}
                    </span>
                  </td>
                  <td style={{ fontFamily:'monospace', fontSize:13 }}>{formatTime(p.timeTaken)}</td>
                  <td style={{ fontSize:12 }}>{formatDateTime(p.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
