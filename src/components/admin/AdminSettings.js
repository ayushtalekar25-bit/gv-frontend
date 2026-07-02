import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState(null);
  const [creds, setCreds] = useState({ username: user?.username || '', password: '', confirmPassword: '' });
  const [savingCreds, setSavingCreds] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    api.get('/admin/settings').then(r => setSettings(r.data.settings || {}));
  }, []);

  const saveSettings = async e => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.put('/admin/settings', settings);
      toast.success('Settings saved');
    } catch { toast.error('Failed'); } finally { setSavingSettings(false); }
  };

  const saveCreds = async e => {
    e.preventDefault();
    if (creds.password && creds.password !== creds.confirmPassword)
      return toast.error('Passwords do not match');
    setSavingCreds(true);
    try {
      const payload = {};
      if (creds.username !== user.username) payload.username = creds.username;
      if (creds.password) payload.password = creds.password;
      if (!Object.keys(payload).length) return toast('Nothing to update');
      const res = await api.put('/admin/change-credentials', payload);
      updateUser(res.data.user);
      toast.success('Credentials updated');
      setCreds(p => ({ ...p, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSavingCreds(false); }
  };

  if (!settings) return <div className="spinner" style={{ marginTop:40 }} />;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div className="section-title">Admin Settings</div>

      {/* Credentials */}
      <div className="glass" style={{ padding:28 }}>
        <h3 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#ff4757', fontSize:16,
          textTransform:'uppercase', letterSpacing:1, marginBottom:20 }}>
          🔐 Admin Credentials
        </h3>
        <form onSubmit={saveCreds} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label className="form-label">Admin Username</label>
            <input className="input-field" value={creds.username}
              onChange={e => setCreds(p => ({ ...p, username: e.target.value }))} />
          </div>
          <div>
            <label className="form-label">New Password</label>
            <input type="password" className="input-field" value={creds.password}
              onChange={e => setCreds(p => ({ ...p, password: e.target.value }))}
              placeholder="Leave blank to keep current" />
          </div>
          <div>
            <label className="form-label">Confirm Password</label>
            <input type="password" className="input-field" value={creds.confirmPassword}
              onChange={e => setCreds(p => ({ ...p, confirmPassword: e.target.value }))} />
          </div>
          <button type="submit" className="btn-solid" disabled={savingCreds}>
            {savingCreds ? 'Saving...' : 'Update Credentials'}
          </button>
        </form>
      </div>

      {/* Website settings */}
      <div className="glass" style={{ padding:28 }}>
        <h3 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#00ff88', fontSize:16,
          textTransform:'uppercase', letterSpacing:1, marginBottom:20 }}>
          ⚙️ Website Settings
        </h3>
        <form onSubmit={saveSettings} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="grid-2">
            <div>
              <label className="form-label">Website Name</label>
              <input className="input-field" value={settings.websiteName || ''}
                onChange={e => setSettings(p => ({ ...p, websiteName: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Primary Color</label>
              <input type="color" className="input-field" value={settings.primaryColor || '#00ff88'}
                onChange={e => setSettings(p => ({ ...p, primaryColor: e.target.value }))}
                style={{ height:44, cursor:'pointer', padding:4 }} />
            </div>
            <div>
              <label className="form-label">Weekly Event Day (0=Sun, 6=Sat)</label>
              <input type="number" min={0} max={6} className="input-field" value={settings.weeklyEventDay ?? 6}
                onChange={e => setSettings(p => ({ ...p, weeklyEventDay: parseInt(e.target.value) }))} />
            </div>
            <div>
              <label className="form-label">Weekly Event Hour (24h format)</label>
              <input type="number" min={0} max={23} className="input-field" value={settings.weeklyEventHour ?? 21}
                onChange={e => setSettings(p => ({ ...p, weeklyEventHour: parseInt(e.target.value) }))} />
            </div>
          </div>
          <div>
            <label className="form-label">Announcement Banner Text</label>
            <input className="input-field" value={settings.announcementBanner || ''}
              onChange={e => setSettings(p => ({ ...p, announcementBanner: e.target.value }))}
              placeholder="Leave blank to hide banner" />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <input type="checkbox" id="bannerActive" checked={settings.bannerActive || false}
              onChange={e => setSettings(p => ({ ...p, bannerActive: e.target.checked }))} />
            <label htmlFor="bannerActive" style={{ color:'#aaa', fontSize:14 }}>Show announcement banner</label>
          </div>
          <button type="submit" className="btn-solid" disabled={savingSettings}>
            {savingSettings ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
