import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatDateTime } from '../../utils/helpers';

const TYPE_ICONS = {
  'Quiz Live': '🔥', 'Tournament': '🎮', 'Prize': '🎁',
  'Maintenance': '🔧', 'Community Update': '📣', 'General': '📢'
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications').then(r => setNotifications(r.data.notifications || []))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await api.post(`/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  if (loading) return <div className="spinner" style={{ marginTop: 40 }} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div className="section-title">Notifications</div>
        {notifications.filter(n => !n.isRead).length > 0 && (
          <span className="badge badge-green">
            {notifications.filter(n => !n.isRead).length} unread
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
          <p style={{ color: '#555' }}>No notifications yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.map(n => (
            <div key={n._id} className="glass" style={{
              padding: 20,
              borderColor: !n.isRead ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.08)',
              background: !n.isRead ? 'rgba(0,255,136,0.04)' : undefined,
              cursor: !n.isRead ? 'pointer' : 'default'
            }}
              onClick={() => !n.isRead && markRead(n._id)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{TYPE_ICONS[n.type] || '📢'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 16, color: '#fff' }}>
                      {n.title}
                    </span>
                    <span className="badge badge-blue" style={{ fontSize: 10 }}>{n.type}</span>
                    {!n.isRead && <span className="badge badge-green" style={{ fontSize: 10 }}>New</span>}
                  </div>
                  <p style={{ fontSize: 14, color: '#888', marginBottom: 6 }}>{n.message}</p>
                  <p style={{ fontSize: 11, color: '#555' }}>{formatDateTime(n.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
