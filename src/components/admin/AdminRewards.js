import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatTime, getWeekId } from '../../utils/helpers';

export default function AdminRewards() {
  // Reuse AdminWinners but focused on reward distribution
  const [winners, setWinners] = useState([]);
  const [weekId, setWeekId] = useState(getWeekId());

  const load = (wid = weekId) => {
    api.get(`/admin/winners?weekId=${wid}`).then(r => setWinners(r.data.winners || []));
  };
  useEffect(() => { load(); }, []);

  const MEDALS = ['🥇','🥈','🥉'];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div className="section-title">Reward Distribution</div>
        <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
          <div>
            <label className="form-label">Week</label>
            <input value={weekId} onChange={e => setWeekId(e.target.value)}
              className="input-field" style={{ width:160 }} />
          </div>
          <button className="btn-neon" onClick={() => load(weekId)}>Load</button>
        </div>
      </div>

      {winners.length === 0 ? (
        <div className="glass" style={{ padding:40, textAlign:'center' }}>
          <p style={{ color:'#555' }}>No winners for this week</p>
        </div>
      ) : (
        <div className="glass" style={{ overflow:'hidden' }}>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Rank</th><th>Player</th><th>WhatsApp</th><th>Instagram</th>
                  <th>Score</th><th>Time</th><th>Redeem Code</th><th>Reward Status</th></tr>
              </thead>
              <tbody>
                {winners.map((w, i) => (
                  <tr key={w._id}>
                    <td><span style={{ fontSize:20 }}>{MEDALS[i]}</span></td>
                    <td>
                      <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#fff' }}>
                        {w.userId?.username || 'Unknown'}
                      </div>
                      <div style={{ fontSize:12, color:'#555' }}>{w.userId?.email}</div>
                    </td>
                    <td style={{ fontSize:13 }}>{w.userId?.whatsappNumber || '--'}</td>
                    <td style={{ fontSize:13 }}>{w.userId?.instagramUsername || '--'}</td>
                    <td style={{ color:'#00ff88', fontWeight:600 }}>{w.score}/15</td>
                    <td style={{ fontFamily:'monospace', fontSize:13 }}>{formatTime(w.timeTaken)}</td>
                    <td>
                      {w.redeemCode ? (
                        <span style={{ fontFamily:'monospace', fontSize:13, color:'#00ff88' }}>{w.redeemCode}</span>
                      ) : <span style={{ color:'#555' }}>--</span>}
                    </td>
                    <td>
                      <span className={`badge ${w.rewardStatus==='Sent'?'badge-green':w.rewardStatus==='Claimed'?'badge-blue':'badge-orange'}`}>
                        {w.rewardStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
