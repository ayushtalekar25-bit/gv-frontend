import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function PrizeInfoPage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    whatsappNumber: user?.whatsappNumber || '',
    instagramUsername: user?.instagramUsername || '',
  });
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/prize-info', form);
      updateUser(res.data.user);
      toast.success('Prize info updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 520 }}>
      <div className="section-title">Prize Information</div>

      <div className="glass" style={{ padding: 20, borderColor: 'rgba(0,255,136,0.25)' }}>
        <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.7 }}>
          If you become a winner, your reward or redeem code will be sent using the contact information below.
        </p>
      </div>

      <div className="glass" style={{ padding: 28 }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="form-label">WhatsApp Number</label>
            <input name="whatsappNumber" value={form.whatsappNumber} onChange={handle}
              className="input-field" placeholder="+91 9876543210" />
            <p style={{ fontSize: 12, color: '#555', marginTop: 6 }}>
              Include country code (e.g. +91 for India)
            </p>
          </div>
          <div>
            <label className="form-label">Instagram Username (Optional)</label>
            <input name="instagramUsername" value={form.instagramUsername} onChange={handle}
              className="input-field" placeholder="@your_username" />
          </div>
          <button type="submit" className="btn-solid" disabled={loading}>
            {loading ? 'Saving...' : 'Save Prize Info'}
          </button>
        </form>
      </div>

      {/* Current saved info */}
      {(user?.whatsappNumber || user?.instagramUsername) && (
        <div className="glass" style={{ padding: 20 }}>
          <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 13, color: '#555',
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Currently Saved
          </div>
          {user?.whatsappNumber && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#666', fontSize: 13 }}>WhatsApp</span>
              <span style={{ color: '#fff', fontSize: 13 }}>{user.whatsappNumber}</span>
            </div>
          )}
          {user?.instagramUsername && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ color: '#666', fontSize: 13 }}>Instagram</span>
              <span style={{ color: '#fff', fontSize: 13 }}>{user.instagramUsername}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
