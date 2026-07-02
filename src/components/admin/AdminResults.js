import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatDateTime, formatTime, getWeekId } from '../../utils/helpers';

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [weekId, setWeekId] = useState(getWeekId());
  const [loading, setLoading] = useState(false);

  const load = (wid = weekId) => {
    setLoading(true);
    api.get(`/quiz/admin/results?weekId=${wid}`)
      .then(r => setResults(r.data.results || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div className="section-title">Weekly Results</div>
        <div style={{ display:'flex', gap:10, alignItems:'flex-end', flexWrap:'wrap' }}>
          <div>
            <label className="form-label">Week ID</label>
            <input value={weekId} onChange={e => setWeekId(e.target.value)}
              className="input-field" style={{ width:160 }} />
          </div>
          <button className="btn-neon" onClick={() => load(weekId)}>Load</button>
        </div>
      </div>

      <div className="glass" style={{ overflow:'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Rank</th><th>Player</th><th>Score</th><th>Time Taken</th><th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:40 }}>
                  <div className="spinner" style={{ margin:'0 auto' }} />
                </td></tr>
              ) : results.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:40, color:'#555' }}>
                  No results for this week
                </td></tr>
              ) : results.map((r, i) => (
                <tr key={r._id} style={{ background: i < 3 ? 'rgba(0,255,136,0.03)' : undefined }}>
                  <td>
                    <span style={{ fontFamily:'Orbitron,monospace', fontWeight:700,
                      color: i===0?'#ffd700':i===1?'#c0c0c0':i===2?'#cd7f32':'#555' }}>
                      {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#fff' }}>
                      {r.userId?.username || 'Unknown'}
                    </div>
                    <div style={{ fontSize:12, color:'#555' }}>{r.userId?.email}</div>
                  </td>
                  <td>
                    <span style={{ color: r.score >= 12 ? '#00ff88' : r.score >= 8 ? '#ffa502' : '#ff4757',
                      fontWeight:600, fontFamily:'Rajdhani,sans-serif', fontSize:15 }}>
                      {r.score}/{r.totalQuestions}
                    </span>
                  </td>
                  <td style={{ fontFamily:'monospace', fontSize:13 }}>{formatTime(r.timeTaken)}</td>
                  <td style={{ fontSize:12 }}>{formatDateTime(r.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
