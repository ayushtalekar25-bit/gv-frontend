import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatDateTime, formatTime } from '../../utils/helpers';

const MEDALS = ['🥇','🥈','🥉'];
const MEDAL_COLORS = ['#ffd700','#c0c0c0','#cd7f32'];
const RANK_LABELS = ['First Place','Second Place','Third Place'];

export default function WinnersPage() {
  const [winners, setWinners] = useState([]);
  const [weekId, setWeekId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/winners/user-view').then(r => {
      setWinners(r.data.winners || []);
      setWeekId(r.data.weekId || '');
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" style={{ marginTop: 40 }} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div className="section-title">Weekly Winners</div>
        {weekId && (
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#555',
            background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: 6 }}>
            Week: {weekId}
          </span>
        )}
      </div>

      {winners.length === 0 ? (
        <div className="glass" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
          <p style={{ color: '#555' }}>No winners announced yet for this week.</p>
        </div>
      ) : (
        <div className="grid-3">
          {winners.map((w, i) => (
            <div key={w._id} className="glass" style={{
              padding: 28, textAlign: 'center',
              border: `1px solid ${MEDAL_COLORS[i]}40`,
              boxShadow: `0 0 20px ${MEDAL_COLORS[i]}15`,
              transition: 'all 0.3s'
            }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>{MEDALS[i]}</div>
              <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 13,
                color: MEDAL_COLORS[i], textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
                {RANK_LABELS[i]}
              </div>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
                {w.userId?.username || 'Player'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Score', `${w.score}/15`],
                  ['Time', formatTime(w.timeTaken)],
                  ['Date', formatDateTime(w.submittedAt)],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between',
                    padding: '6px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 6 }}>
                    <span style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 }}>{l}</span>
                    <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  padding: '6px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 }}>Reward</span>
                  <span className={`badge ${w.rewardStatus === 'Sent' ? 'badge-green' : w.rewardStatus === 'Claimed' ? 'badge-blue' : 'badge-orange'}`}>
                    {w.rewardStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
