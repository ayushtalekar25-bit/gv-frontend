import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState({ username: user?.username || '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword)
      return toast.error('Passwords do not match');
    if (form.password && form.password.length < 6)
      return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const payload = {};
      if (form.username !== user.username) payload.username = form.username;
      if (form.password) payload.password = form.password;
      if (Object.keys(payload).length === 0) return toast('Nothing to update');
      const res = await api.put('/users/settings', payload);
      updateUser(res.data.user);
      toast.success('Settings updated!');
      setForm(p => ({ ...p, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 480 }}>
      <div className="section-title">Account Settings</div>

      <div className="glass" style={{ padding: 28 }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="form-label">Username</label>
            <input name="username" value={form.username} onChange={handle} className="input-field" />
          </div>
          <div>
            <label className="form-label">New Password</label>
            <input name="password" type="password" value={form.password} onChange={handle}
              className="input-field" placeholder="Leave blank to keep current" />
          </div>
          <div>
            <label className="form-label">Confirm New Password</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handle}
              className="input-field" placeholder="Repeat new password" />
          </div>
          <button type="submit" className="btn-solid" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="glass" style={{ padding: 20 }}>
        <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 13, color: '#ff4757',
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          Danger Zone
        </div>
        <button className="btn-danger" onClick={() => { logout(); }}>
          Logout
        </button>
      </div>
    </div>
  );
}
