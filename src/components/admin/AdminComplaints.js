import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatDateTime } from '../../utils/helpers';

const STATUS_BADGE = { Open:'badge-orange', 'In Progress':'badge-blue', Resolved:'badge-green' };

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [replyState, setReplyState] = useState({});
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/complaints/admin/all').then(r => setComplaints(r.data.complaints || []))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const reply = async (id) => {
    const { adminReply, status } = replyState[id] || {};
    if (!adminReply?.trim()) return toast.error('Enter a reply');
    await api.put(`/complaints/admin/${id}/reply`, { adminReply, status: status || 'In Progress' });
    toast.success('Reply sent');
    setReplyState(p => { const n = {...p}; delete n[id]; return n; });
    load();
  };

  const resolve = async (id) => {
    await api.patch(`/complaints/admin/${id}/resolve`);
    toast.success('Marked resolved');
    load();
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div className="section-title">Complaints ({complaints.length})</div>
      {loading ? <div className="spinner" style={{ marginTop:40 }} /> :
        complaints.length === 0 ? (
          <div className="glass" style={{ padding:40, textAlign:'center' }}>
            <p style={{ color:'#555' }}>No complaints yet</p>
          </div>
        ) : complaints.map(c => (
          <div key={c._id} className="glass" style={{ padding:24 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:12 }}>
              <div>
                <div style={{ display:'flex', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                  <span className={`badge ${STATUS_BADGE[c.status]}`}>{c.status}</span>
                  <span className="badge badge-blue" style={{ fontSize:10 }}>{c.category}</span>
                </div>
                <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:17, color:'#fff' }}>{c.subject}</div>
                <div style={{ fontSize:13, color:'#888', marginTop:4 }}>{c.description}</div>
                <div style={{ fontSize:12, color:'#555', marginTop:6 }}>
                  From: <b style={{ color:'#aaa' }}>{c.userId?.username}</b> · {formatDateTime(c.createdAt)}
                </div>
              </div>
              {c.status !== 'Resolved' && (
                <button className="btn-neon" style={{ padding:'6px 14px', fontSize:13 }} onClick={() => resolve(c._id)}>
                  Mark Resolved
                </button>
              )}
            </div>

            {c.adminReply && (
              <div style={{ padding:'12px 16px', background:'rgba(0,255,136,0.06)',
                border:'1px solid rgba(0,255,136,0.2)', borderRadius:8, marginBottom:12 }}>
                <div style={{ fontSize:12, color:'#00ff88', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>
                  Your Reply
                </div>
                <p style={{ fontSize:13, color:'#aaa' }}>{c.adminReply}</p>
              </div>
            )}

            {c.status !== 'Resolved' && (
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <textarea className="input-field" rows={2} style={{ flex:1 }}
                  value={replyState[c._id]?.adminReply || ''}
                  onChange={e => setReplyState(p => ({ ...p, [c._id]: { ...p[c._id], adminReply: e.target.value } }))}
                  placeholder="Write a reply..." />
                <div style={{ display:'flex', flexDirection:'column', gap:8, justifyContent:'flex-end' }}>
                  <select className="input-field" style={{ width:150 }}
                    value={replyState[c._id]?.status || 'In Progress'}
                    onChange={e => setReplyState(p => ({ ...p, [c._id]: { ...p[c._id], status: e.target.value } }))}>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <button className="btn-solid" style={{ padding:'8px 16px' }} onClick={() => reply(c._id)}>Send Reply</button>
                </div>
              </div>
            )}
          </div>
        ))
      }
    </div>
  );
}
