import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatDateTime } from '../../utils/helpers';

const CATEGORIES = ['Bug Report','Suggestion','Technical Issue','Rule Violation','Other'];
const STATUS_BADGE = { Open: 'badge-orange', 'In Progress': 'badge-blue', Resolved: 'badge-green' };

export default function ComplaintPage() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ category: 'Bug Report', subject: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/complaints/my').then(r => setComplaints(r.data.complaints || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/complaints', form);
      toast.success('Complaint submitted!');
      setForm({ category: 'Bug Report', subject: '', description: '' });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div className="section-title">Complaint Center</div>
        <button className="btn-neon" onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ New Complaint'}
        </button>
      </div>

      {showForm && (
        <div className="glass" style={{ padding: 28 }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="form-label">Category</label>
              <select name="category" value={form.category} onChange={handle} className="input-field">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Subject</label>
              <input name="subject" value={form.subject} onChange={handle}
                className="input-field" placeholder="Brief subject" required />
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea name="description" value={form.description} onChange={handle}
                className="input-field" placeholder="Describe the issue in detail..." required />
            </div>
            <button type="submit" className="btn-solid" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {complaints.length === 0 ? (
          <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            <p style={{ color: '#555' }}>No complaints submitted yet</p>
          </div>
        ) : complaints.map(c => (
          <div key={c._id} className="glass" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 16, color: '#fff' }}>
                    {c.subject}
                  </span>
                  <span className={`badge ${STATUS_BADGE[c.status] || 'badge-orange'}`}>{c.status}</span>
                  <span className="badge badge-blue" style={{ fontSize: 10 }}>{c.category}</span>
                </div>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{c.description}</p>
                <p style={{ fontSize: 11, color: '#555' }}>{formatDateTime(c.createdAt)}</p>
              </div>
            </div>
            {c.adminReply && (
              <div style={{ marginTop: 12, padding: '12px 16px',
                background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)',
                borderRadius: 8 }}>
                <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 12, color: '#00ff88',
                  textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Admin Reply</div>
                <p style={{ fontSize: 13, color: '#aaa' }}>{c.adminReply}</p>
                <p style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{formatDateTime(c.repliedAt)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
