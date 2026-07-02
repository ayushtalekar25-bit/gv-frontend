import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatDateTime, formatTime } from '../../utils/helpers';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [weekId, setWeekId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaderboard').then(r => {
      setLeaderboard(r.data.leaderboard || []);
      setWeekId(r.data.weekId || '');
    }).finally(() => setLoading(false));
  }, []);

  const rankStyle = (rank) => {
    if (rank === 1) return { color: '#ffd700', textShadow: '0 0 10px rgba(255,215,0,0.5)' };
    if (rank === 2) return { color: '#c0c0c0' };
    if (rank === 3) return { color: '#cd7f32' };
    return { color: '#666' };
  };

  const rankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div className="section-title">Leaderboard</div>
        {weekId && (
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#555',
            background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: 6 }}>
            Week: {weekId}
          </span>
        )}
      </div>

      {loading ? (
        <div className="spinner" style={{ marginTop: 40 }} />
      ) : leaderboard.length === 0 ? (
        <div className="glass" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <p style={{ color: '#555' }}>No results this week yet. Be the first to submit!</p>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {leaderboard.length >= 3 && (
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
              {[1, 0, 2].map(i => {
                const p = leaderboard[i];
                if (!p) return null;
                const heights = ['120px', '150px', '110px'];
                return (
                  <div key={p.username} className="glass" style={{
                    padding: 20, textAlign: 'center', width: 160,
                    alignSelf: 'flex-end', height: heights[i],
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    border: i === 0 ? '1px solid rgba(255,215,0,0.3)' : undefined
                  }}>
                    <div style={{ fontSize: i === 0 ? 32 : 24, marginBottom: 6 }}>{rankIcon(p.rank)}</div>
                    <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 15,
                      color: '#fff', marginBottom: 2 }}>{p.username}</div>
                    <div style={{ fontSize: 12, color: '#00ff88' }}>{p.score}/15</div>
                    <div style={{ fontSize: 11, color: '#555' }}>{formatTime(p.timeTaken)}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full table */}
          <div className="glass" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Score</th>
                    <th>Time Taken</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map(p => {
                    const isMe = p.username === user?.username;
                    return (
                      <tr key={p.username} style={isMe ? { background: 'rgba(0,255,136,0.05)' } : {}}>
                        <td>
                          <span style={{ fontFamily: 'Orbitron,monospace', fontWeight: 700, fontSize: 14, ...rankStyle(p.rank) }}>
                            {rankIcon(p.rank)}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 600, fontSize: 15,
                            color: isMe ? '#00ff88' : '#fff' }}>
                            {p.username} {isMe && <span style={{ fontSize: 11, color: '#00ff88' }}>(you)</span>}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: p.score >= 12 ? '#00ff88' : p.score >= 8 ? '#ffa502' : '#ff4757',
                            fontWeight: 600, fontFamily: 'Rajdhani,sans-serif', fontSize: 15 }}>
                            {p.score}/{p.totalQuestions}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{formatTime(p.timeTaken)}</td>
                        <td style={{ fontSize: 12 }}>{formatDateTime(p.submittedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
