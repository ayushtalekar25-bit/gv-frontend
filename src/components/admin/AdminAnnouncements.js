import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatDateTime } from '../../utils/helpers';

const TYPES = ['Quiz Live','Tournament','Prize','Maintenance','Community Update','General'];
const TYPE_ICONS = { 'Quiz Live':'🔥','Tournament':'🎮','Prize':'🎁','Maintenance':'🔧','Community Update':'📣','General':'📢' };

export default function AdminAnnouncements() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title:'', message:'', type:'General' });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/notifications/admin/all').then(r => setNotifications(r.data.notifications || []));
  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/notifications/admin/create', form);
      toast.success('Announcement created');
      setForm({ title:'', message:'', type:'General' });
      setShowForm(false);
      load();
    } catch { toast.error('Failed'); } finally { setLoading(false); }
  };

  const del = async id => {
    if (!window.confirm('Delete this announcement?')) return;
    await api.delete(`/notifications/admin/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div className="section-title">Announcements</div>
        <button className="btn-solid" onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ New Announcement'}
        </button>
      </div>

      {showForm && (
        <div className="glass" style={{ padding:28 }}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="grid-2">
              <div>
                <label className="form-label">Title</label>
                <input className="input-field" value={form.title} required
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title" />
              </div>
              <div>
                <label className="form-label">Type</label>
                <select className="input-field" value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea className="input-field" value={form.message} required rows={3}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Write your announcement..." />
            </div>
            <button type="submit" className="btn-solid" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {notifications.map(n => (
          <div key={n._id} className="glass" style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
              <div style={{ display:'flex', gap:14, flex:1 }}>
                <span style={{ fontSize:28, flexShrink:0 }}>{TYPE_ICONS[n.type] || '📢'}</span>
                <div>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:16, color:'#fff' }}>{n.title}</span>
                    <span className="badge badge-blue" style={{ fontSize:10 }}>{n.type}</span>
                    <span style={{ fontSize:12, color:'#555' }}>{n.readBy?.length || 0} read</span>
                  </div>
                  <p style={{ fontSize:13, color:'#888' }}>{n.message}</p>
                  <p style={{ fontSize:11, color:'#555', marginTop:4 }}>{formatDateTime(n.createdAt)}</p>
                </div>
              </div>
              <button className="btn-danger" style={{ padding:'6px 12px', fontSize:12 }} onClick={() => del(n._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
