import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatDate, formatDateTime } from '../../utils/helpers';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [resetId, setResetId] = useState(null);
  const [newPass, setNewPass] = useState('');

  const load = (s = search, p = page) => {
    setLoading(true);
    api.get(`/admin/users?search=${s}&page=${p}&limit=20`)
      .then(r => { setUsers(r.data.users); setTotal(r.data.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const ban = async (id, isBanned) => {
    await api.patch(`/admin/users/${id}/${isBanned ? 'unban' : 'ban'}`);
    toast.success(isBanned ? 'User unbanned' : 'User banned');
    load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    await api.delete(`/admin/users/${id}`);
    toast.success('User deleted');
    load();
  };

  const resetPassword = async () => {
    if (!newPass || newPass.length < 6) return toast.error('Min 6 chars');
    await api.patch(`/admin/users/${resetId}/reset-password`, { newPassword: newPass });
    toast.success('Password reset');
    setResetId(null); setNewPass('');
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div className="section-title">Registered Users ({total})</div>
        <div style={{ display:'flex', gap:10 }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input-field" placeholder="Search username or email..."
            style={{ width:240 }}
            onKeyDown={e => e.key === 'Enter' && load(search, 1)} />
          <button className="btn-neon" onClick={() => load(search, 1)}>Search</button>
        </div>
      </div>

      {resetId && (
        <div className="glass" style={{ padding:20 }}>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#fff', marginBottom:12 }}>
            Reset Password for User
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <input value={newPass} onChange={e => setNewPass(e.target.value)}
              className="input-field" placeholder="New password (min 6 chars)" type="password" style={{ flex:1 }} />
            <button className="btn-solid" onClick={resetPassword}>Reset</button>
            <button className="btn-neon" onClick={() => setResetId(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="glass" style={{ overflow:'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th><th>WhatsApp</th><th>Instagram</th>
                <th>Joined</th><th>Last Login</th><th>Events</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:40 }}>
                  <div className="spinner" style={{ margin:'0 auto' }} />
                </td></tr>
              ) : users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#fff', fontSize:15 }}>{u.username}</div>
                    <div style={{ fontSize:12, color:'#555' }}>{u.email}</div>
                  </td>
                  <td style={{ fontSize:13 }}>{u.whatsappNumber || '--'}</td>
                  <td style={{ fontSize:13 }}>{u.instagramUsername || '--'}</td>
                  <td style={{ fontSize:12 }}>{formatDate(u.joinedDate)}</td>
                  <td style={{ fontSize:12 }}>{formatDateTime(u.lastLogin)}</td>
                  <td style={{ textAlign:'center' }}>{u.attendanceCount || 0}</td>
                  <td>
                    <span className={`badge ${u.isBanned ? 'badge-red' : 'badge-green'}`}>
                      {u.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      <button onClick={() => ban(u._id, u.isBanned)}
                        className={u.isBanned ? 'btn-neon' : 'btn-danger'}
                        style={{ padding:'5px 10px', fontSize:12 }}>
                        {u.isBanned ? 'Unban' : 'Ban'}
                      </button>
                      <button onClick={() => setResetId(u._id)}
                        className="btn-neon" style={{ padding:'5px 10px', fontSize:12 }}>
                        Reset PW
                      </button>
                      <button onClick={() => del(u._id)}
                        className="btn-danger" style={{ padding:'5px 10px', fontSize:12 }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {total > 20 && (
        <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
          {page > 1 && <button className="btn-neon" onClick={() => setPage(p => p-1)}>← Prev</button>}
          <span style={{ padding:'8px 16px', color:'#555', fontSize:14 }}>Page {page}</span>
          {users.length === 20 && <button className="btn-neon" onClick={() => setPage(p => p+1)}>Next →</button>}
        </div>
      )}
    </div>
  );
}
