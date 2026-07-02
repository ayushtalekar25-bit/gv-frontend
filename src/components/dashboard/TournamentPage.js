import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

const STATUS_BADGE = { Upcoming: 'badge-orange', Live: 'badge-green', Completed: 'badge-blue' };

export default function TournamentPage() {
  const [tournament, setTournament] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    api.get('/tournament/latest').then(r => {
      setTournament(r.data.tournament);
      setIsRegistered(r.data.isRegistered);
    }).finally(() => setLoading(false));
  }, []);

  const register = async () => {
    if (!tournament) return;
    setRegistering(true);
    try {
      await api.post(`/tournament/${tournament._id}/register`);
      toast.success('Registered for tournament!');
      setIsRegistered(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: 40 }} />;

  if (!tournament) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="section-title">Tournament</div>
        <div className="glass" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎮</div>
          <h3 style={{ fontFamily: 'Orbitron,monospace', color: '#fff', marginBottom: 8 }}>
            No Tournament Scheduled
          </h3>
          <p style={{ color: '#555' }}>No tournament is currently scheduled. Please check back later.</p>
        </div>
      </div>
    );
  }

  const t = tournament;
  const registrationCount = t.registrations?.length || 0;
  const spotsLeft = t.maxPlayers - registrationCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="section-title">Tournament</div>

      <div className="glass" style={{
        padding: 28,
        border: t.status === 'Live' ? '1px solid rgba(0,255,136,0.4)' : undefined,
        boxShadow: t.status === 'Live' ? '0 0 30px rgba(0,255,136,0.1)' : undefined
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <span className={`badge ${STATUS_BADGE[t.status]}`}>{t.status}</span>
              <span className="badge badge-blue">{t.gameMode}</span>
            </div>
            <h2 style={{ fontFamily: 'Orbitron,monospace', fontSize: 22, color: '#fff' }}>{t.title}</h2>
          </div>
          {t.entryFee === 0 ? (
            <div style={{ textAlign: 'center', background: 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.3)', borderRadius: 12, padding: '12px 20px' }}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: 20, color: '#00ff88' }}>FREE</div>
              <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>Entry</div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.3)', borderRadius: 12, padding: '12px 20px' }}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: 20, color: '#ffd700' }}>₹{t.entryFee}</div>
              <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>Entry Fee</div>
            </div>
          )}
        </div>

        {/* Details grid */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          {[
            ['📅 Date', formatDate(t.date)],
            ['🕐 Time', t.time],
            ['🎯 Game Mode', t.gameMode],
            ['🏆 Prize Pool', t.prizePool || 'TBA'],
            ['👥 Max Players', `${t.maxPlayers}`],
            ['🎟️ Registered', `${registrationCount} / ${t.maxPlayers}`],
            ['⏰ Reg Deadline', t.registrationDeadline ? formatDate(t.registrationDeadline) : 'TBA'],
            ['📊 Status', t.status],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between',
              padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: '#666' }}>{label}</span>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Room details (shown only when published) */}
        {t.isRoomPublished && (t.roomId || t.roomPassword) && (
          <div style={{ padding: 16, background: 'rgba(0,255,136,0.06)',
            border: '1px solid rgba(0,255,136,0.25)', borderRadius: 10, marginBottom: 20 }}>
            <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 12, color: '#00ff88',
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              🔓 Room Details (Live)
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {t.roomId && (
                <div>
                  <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>Room ID</div>
                  <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 700, color: '#fff' }}>{t.roomId}</div>
                </div>
              )}
              {t.roomPassword && (
                <div>
                  <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>Password</div>
                  <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 700, color: '#fff' }}>{t.roomPassword}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {t.additionalInstructions && (
          <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              Instructions
            </div>
            <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{t.additionalInstructions}</p>
          </div>
        )}

        {/* Register button */}
        {t.status !== 'Completed' && (
          isRegistered ? (
            <div style={{ padding: '14px 24px', background: 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.3)', borderRadius: 8, textAlign: 'center',
              fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: '#00ff88', letterSpacing: 1 }}>
              ✅ You are registered for this tournament
            </div>
          ) : (
            <button className="btn-solid" onClick={register} disabled={registering || spotsLeft <= 0}
              style={{ width: '100%', padding: '14px', fontSize: 16 }}>
              {registering ? 'Registering...' : spotsLeft <= 0 ? 'Tournament Full' : 'Register for Tournament'}
            </button>
          )
        )}

        {t.status === 'Completed' && (
          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: 8,
            textAlign: 'center', color: '#555', fontFamily: 'Rajdhani,sans-serif', fontWeight: 600 }}>
            This tournament has ended
          </div>
        )}
      </div>
    </div>
  );
}
