import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatDateTime, formatTime, getWeekId } from '../../utils/helpers';

export default function AdminWinners() {
  const [winners, setWinners] = useState([]);
  const [weekId, setWeekId] = useState(getWeekId());
  const [editing, setEditing] = useState({});

  const load = (wid = weekId) => {
    api.get(`/admin/winners?weekId=${wid}`).then(r => setWinners(r.data.winners || []));
  };
  useEffect(() => { load(); }, []);

  const save = async (id) => {
    try {
      await api.put(`/admin/winners/${id}/reward`, editing[id]);
      toast.success('Reward updated');
      setEditing(p => { const n = {...p}; delete n[id]; return n; });
      load();
    } catch { toast.error('Failed'); }
  };

  const MEDALS = ['🥇','🥈','🥉'];
  const LABELS = ['1st Place','2nd Place','3rd Place'];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div className="section-title">Winners</div>
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
          <p style={{ color:'#555' }}>No winners for this week yet</p>
        </div>
      ) : winners.map((w, i) => (
        <div key={w._id} className="glass" style={{ padding:24 }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:16, flexWrap:'wrap' }}>
            <div style={{ fontSize:40 }}>{MEDALS[i]}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:18, color:'#fff', marginBottom:4 }}>
                {w.userId?.username || 'Unknown'} — {LABELS[i]}
              </div>
              <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:12 }}>
                <span style={{ fontSize:13, color:'#555' }}>Score: <b style={{ color:'#00ff88' }}>{w.score}/15</b></span>
                <span style={{ fontSize:13, color:'#555' }}>Time: <b style={{ color:'#fff' }}>{formatTime(w.timeTaken)}</b></span>
                <span style={{ fontSize:13, color:'#555' }}>Date: {formatDateTime(w.submittedAt)}</span>
              </div>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:12 }}>
                <span style={{ fontSize:13, color:'#555' }}>WhatsApp: <b style={{ color:'#fff' }}>{w.userId?.whatsappNumber || '--'}</b></span>
                <span style={{ fontSize:13, color:'#555' }}>Instagram: <b style={{ color:'#fff' }}>{w.userId?.instagramUsername || '--'}</b></span>
              </div>

              {/* Reward form */}
              <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'flex-end' }}>
                <div>
                  <label className="form-label">Redeem Code</label>
                  <input className="input-field" style={{ width:200 }}
                    value={editing[w._id]?.redeemCode ?? w.redeemCode ?? ''}
                    onChange={e => setEditing(p => ({ ...p, [w._id]: { ...p[w._id], redeemCode: e.target.value } }))}
                    placeholder="Enter redeem code" />
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select className="input-field" style={{ width:140 }}
                    value={editing[w._id]?.rewardStatus ?? w.rewardStatus}
                    onChange={e => setEditing(p => ({ ...p, [w._id]: { ...p[w._id], rewardStatus: e.target.value } }))}>
                    <option value="Pending">Pending</option>
                    <option value="Sent">Sent</option>
                    <option value="Claimed">Claimed</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Notes</label>
                  <input className="input-field" style={{ width:200 }}
                    value={editing[w._id]?.adminNotes ?? w.adminNotes ?? ''}
                    onChange={e => setEditing(p => ({ ...p, [w._id]: { ...p[w._id], adminNotes: e.target.value } }))}
                    placeholder="Admin notes..." />
                </div>
                <button className="btn-solid" style={{ marginBottom:1 }} onClick={() => save(w._id)}>
                  Save
                </button>
              </div>
            </div>
            <span className={`badge ${w.rewardStatus==='Sent'?'badge-green':w.rewardStatus==='Claimed'?'badge-blue':'badge-orange'}`}>
              {w.rewardStatus}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
