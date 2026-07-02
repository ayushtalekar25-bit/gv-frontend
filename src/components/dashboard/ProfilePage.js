import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatDate, formatDateTime, formatTime } from '../../utils/helpers';

export default function ProfilePage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [attendance, setAttendance] = useState(null);

  useEffect(() => {
    api.get('/quiz/my-history').then(r => setHistory(r.data.results || [])).catch(() => {});
    api.get('/attendance/my').then(r => setAttendance(r.data.attendance)).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="section-title">My Profile</div>

      {/* Profile card */}
      <div className="glass" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg,#00ff88,#00cc66)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Orbitron,monospace', fontSize: 28, fontWeight: 900, color: '#000',
            boxShadow: '0 0 20px rgba(0,255,136,0.4)', flexShrink: 0
          }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'Orbitron,monospace', fontSize: 22, color: '#fff', marginBottom: 4 }}>
              {user?.username}
            </h2>
            <p style={{ color: '#666', fontSize: 14 }}>{user?.email}</p>
            <p style={{ color: '#555', fontSize: 13, marginTop: 4 }}>
              Joined {formatDate(user?.joinedDate)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginTop: 24 }}>
          {[
            { label: 'Total Wins', value: user?.totalWins || 0 },
            { label: 'Best Score', value: `${user?.bestScore || 0}/15` },
            { label: 'Best Time', value: formatTime(user?.bestTime) },
            { label: 'Quizzes Played', value: user?.totalQuizzesAttempted || 0 },
          ].map(s => (
            <div key={s.label} className="glass stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance summary */}
      {attendance && (
        <div className="glass" style={{ padding: 24 }}>
          <div className="section-title">Attendance</div>
          <div className="grid-3">
            {[
              { label: 'Total Events', value: attendance.totalAttended || 0 },
              { label: 'Current Streak', value: `${attendance.currentStreak || 0} weeks` },
              { label: 'Best Streak', value: `${attendance.longestStreak || 0} weeks` },
            ].map(s => (
              <div key={s.label} className="glass stat-card">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz history */}
      <div className="glass" style={{ padding: 24 }}>
        <div className="section-title">Quiz History</div>
        {history.length === 0 ? (
          <p style={{ color: '#555', textAlign: 'center', padding: '20px 0' }}>No quiz attempts yet</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Week</th><th>Score</th><th>Time Taken</th><th>Submitted</th><th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {history.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{r.weekId}</td>
                    <td>
                      <span style={{ color: r.score >= 12 ? '#00ff88' : r.score >= 8 ? '#ffa502' : '#ff4757' }}>
                        {r.score}/{r.totalQuestions}
                      </span>
                    </td>
                    <td>{formatTime(r.timeTaken)}</td>
                    <td style={{ fontSize: 12 }}>{formatDateTime(r.submittedAt)}</td>
                    <td>
                      {r.rank ? (
                        <span className={r.rank <= 3 ? `rank-${r.rank}` : ''}>
                          {r.rank <= 3 ? ['🥇','🥈','🥉'][r.rank-1] : `#${r.rank}`}
                        </span>
                      ) : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
