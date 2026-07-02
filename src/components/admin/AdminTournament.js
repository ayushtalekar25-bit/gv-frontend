import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatDate, formatDateTime } from '../../utils/helpers';

const EMPTY = {
  title:'', date:'', time:'', gameMode:'Bermuda', entryFee:0,
  prizePool:'', maxPlayers:50, roomId:'', roomPassword:'',
  status:'Upcoming', registrationDeadline:'', additionalInstructions:'', isRoomPublished:false
};
const GAME_MODES = ['Bermuda','Clash Squad','Lone Wolf','Craftland','Other'];
const STATUS_OPTS = ['Upcoming','Live','Completed'];
const STATUS_BADGE = { Upcoming:'badge-orange', Live:'badge-green', Completed:'badge-blue' };

export default function AdminTournament() {
  const [tournaments, setTournaments] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewRegs, setViewRegs] = useState(null);
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/tournament/admin/all').then(r => setTournaments(r.data.tournaments || []));
  useEffect(() => { load(); }, []);

  const reset = () => { setForm(EMPTY); setEditId(null); setShowForm(false); };

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/tournament/admin/${editId}`, form);
        toast.success('Tournament updated');
      } else {
        await api.post('/tournament/admin/create', form);
        toast.success('Tournament created');
      }
      reset(); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const startEdit = t => {
    setForm({
      title: t.title, date: t.date?.split('T')[0] || '', time: t.time,
      gameMode: t.gameMode, entryFee: t.entryFee, prizePool: t.prizePool,
      maxPlayers: t.maxPlayers, roomId: t.roomId, roomPassword: t.roomPassword,
      status: t.status, registrationDeadline: t.registrationDeadline?.split('T')[0] || '',
      additionalInstructions: t.additionalInstructions, isRoomPublished: t.isRoomPublished
    });
    setEditId(t._id);
    setShowForm(true);
  };

  const del = async id => {
    if (!window.confirm('Delete this tournament?')) return;
    await api.delete(`/tournament/admin/${id}`);
    toast.success('Deleted');
    load();
  };

  const loadRegs = async id => {
    const res = await api.get(`/tournament/admin/${id}/registrations`);
    setRegs(res.data.registrations || []);
    setViewRegs(id);
  };

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div className="section-title">Tournament Management</div>
        <button className="btn-solid" onClick={() => { reset(); setShowForm(v => !v); }}>
          {showForm ? 'Cancel' : '+ Create Tournament'}
        </button>
      </div>

      {/* Registrations modal */}
      {viewRegs && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:20 }}>
          <div className="glass" style={{ padding:28, maxWidth:700, width:'100%', maxHeight:'80vh', overflow:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <div className="section-title" style={{ margin:0 }}>Registrations</div>
              <button className="btn-neon" style={{ padding:'6px 12px' }} onClick={() => setViewRegs(null)}>Close</button>
            </div>
            <div className="table-container">
              <table>
                <thead><tr><th>Username</th><th>WhatsApp</th><th>Registered</th><th>Payment</th></tr></thead>
                <tbody>
                  {regs.map((r, i) => (
                    <tr key={i}>
                      <td><div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#fff' }}>{r.username}</div>
                        <div style={{ fontSize:12, color:'#555' }}>{r.email}</div></td>
                      <td style={{ fontSize:13 }}>{r.whatsappNumber || '--'}</td>
                      <td style={{ fontSize:12 }}>{formatDateTime(r.registeredAt)}</td>
                      <td><span className={`badge ${r.paymentStatus==='Paid'?'badge-green':r.paymentStatus==='Free'?'badge-blue':'badge-orange'}`}>
                        {r.paymentStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="glass" style={{ padding:28 }}>
          <h3 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#fff', fontSize:18, marginBottom:20 }}>
            {editId ? 'Edit Tournament' : 'New Tournament'}
          </h3>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label className="form-label">Tournament Title</label>
              <input name="title" className="input-field" value={form.title} onChange={handle} required />
            </div>
            <div className="grid-2">
              <div>
                <label className="form-label">Date</label>
                <input name="date" type="date" className="input-field" value={form.date} onChange={handle} required />
              </div>
              <div>
                <label className="form-label">Time</label>
                <input name="time" className="input-field" value={form.time} onChange={handle} placeholder="e.g. 8:00 PM" required />
              </div>
              <div>
                <label className="form-label">Game Mode</label>
                <select name="gameMode" className="input-field" value={form.gameMode} onChange={handle}>
                  {GAME_MODES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Entry Fee (₹0 = Free)</label>
                <input name="entryFee" type="number" min={0} className="input-field" value={form.entryFee} onChange={handle} />
              </div>
              <div>
                <label className="form-label">Prize Pool / Reward</label>
                <input name="prizePool" className="input-field" value={form.prizePool} onChange={handle} placeholder="e.g. ₹500 + Redeem Codes" />
              </div>
              <div>
                <label className="form-label">Max Players</label>
                <input name="maxPlayers" type="number" min={1} className="input-field" value={form.maxPlayers} onChange={handle} />
              </div>
              <div>
                <label className="form-label">Room ID</label>
                <input name="roomId" className="input-field" value={form.roomId} onChange={handle} />
              </div>
              <div>
                <label className="form-label">Room Password</label>
                <input name="roomPassword" className="input-field" value={form.roomPassword} onChange={handle} />
              </div>
              <div>
                <label className="form-label">Status</label>
                <select name="status" className="input-field" value={form.status} onChange={handle}>
                  {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Registration Deadline</label>
                <input name="registrationDeadline" type="date" className="input-field"
                  value={form.registrationDeadline} onChange={handle} />
              </div>
            </div>
            <div>
              <label className="form-label">Additional Instructions</label>
              <textarea name="additionalInstructions" className="input-field" rows={3}
                value={form.additionalInstructions} onChange={handle} />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <input type="checkbox" name="isRoomPublished" id="roomPub" checked={form.isRoomPublished} onChange={handle} />
              <label htmlFor="roomPub" style={{ color:'#aaa', fontSize:14 }}>
                Publish Room ID & Password (visible to all users)
              </label>
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button type="submit" className="btn-solid" disabled={loading}>
                {loading ? 'Saving...' : editId ? 'Update Tournament' : 'Create Tournament'}
              </button>
              <button type="button" className="btn-neon" onClick={reset}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {tournaments.map(t => (
          <div key={t._id} className="glass" style={{ padding:24 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                  <span className={`badge ${STATUS_BADGE[t.status]}`}>{t.status}</span>
                  <span className="badge badge-blue">{t.gameMode}</span>
                  {t.entryFee === 0 ? <span className="badge badge-green">Free</span> :
                    <span className="badge badge-orange">₹{t.entryFee}</span>}
                  {t.isRoomPublished && <span className="badge badge-green">Room Published</span>}
                </div>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:18, color:'#fff', marginBottom:6 }}>{t.title}</div>
                <div style={{ display:'flex', gap:16, fontSize:13, color:'#666', flexWrap:'wrap' }}>
                  <span>📅 {formatDate(t.date)}</span>
                  <span>🕐 {t.time}</span>
                  <span>👥 {t.registrations?.length || 0}/{t.maxPlayers}</span>
                  {t.prizePool && <span>🏆 {t.prizePool}</span>}
                </div>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <button className="btn-neon" style={{ padding:'6px 12px', fontSize:12 }}
                  onClick={() => loadRegs(t._id)}>
                  Registrations ({t.registrations?.length || 0})
                </button>
                <button className="btn-neon" style={{ padding:'6px 12px', fontSize:12 }}
                  onClick={() => startEdit(t)}>Edit</button>
                <button className="btn-danger" style={{ padding:'6px 12px', fontSize:12 }}
                  onClick={() => del(t._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
