import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatDateTime, formatTime, getCountdown } from '../../utils/helpers';

export default function WeeklyQuizSection() {
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    api.get('/quiz/status').then(r => {
      setStatus(r.data);
      if (r.data.alreadySubmitted) {
        api.get(`/quiz/my-result?weekId=${r.data.weekId}`)
          .then(res => setResult(res.data.result)).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!status?.nextEvent || status?.isLive) return;
    const t = setInterval(() => {
      const c = getCountdown(status.nextEvent);
      setCountdown(c);
      if (!c) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [status]);

  if (!status) return <div className="spinner" style={{ marginTop: 40 }} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="section-title">Weekly Quiz</div>

      {/* Status card */}
      <div className="glass" style={{ padding: 28, textAlign: 'center' }}>
        {status.isLive && !status.alreadySubmitted && (
          <>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🔥</div>
            <h2 style={{ fontFamily: 'Orbitron,monospace', color: '#00ff88', fontSize: 24, marginBottom: 8 }}>
              Weekly Quiz is LIVE!
            </h2>
            <p style={{ color: '#aaa', marginBottom: 24 }}>
              {status.questionCount} questions · No time limit · Submit when ready
            </p>
            <Link to="/quiz" className="btn-solid" style={{ fontSize: 16, padding: '14px 36px' }}>
              Start Weekly Challenge
            </Link>
          </>
        )}

        {status.alreadySubmitted && result && (
          <>
            <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
            <h2 style={{ fontFamily: 'Orbitron,monospace', color: '#00ff88', fontSize: 22, marginBottom: 8 }}>
              Quiz Submitted!
            </h2>
            <div className="grid-3" style={{ marginTop: 24, textAlign: 'left' }}>
              <div className="glass stat-card">
                <div className="stat-value" style={{
                  color: result.score >= 12 ? '#00ff88' : result.score >= 8 ? '#ffa502' : '#ff4757'
                }}>
                  {result.score}/{result.totalQuestions}
                </div>
                <div className="stat-label">Score</div>
              </div>
              <div className="glass stat-card">
                <div className="stat-value">{formatTime(result.timeTaken)}</div>
                <div className="stat-label">Time Taken</div>
              </div>
              <div className="glass stat-card">
                <div className="stat-value">{result.rank ? `#${result.rank}` : '--'}</div>
                <div className="stat-label">Current Rank</div>
              </div>
            </div>
            <p style={{ color: '#555', fontSize: 13, marginTop: 16 }}>
              Submitted {formatDateTime(result.submittedAt)}
            </p>
          </>
        )}

        {!status.isLive && !status.alreadySubmitted && (
          <>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
            <h2 style={{ fontFamily: 'Orbitron,monospace', color: '#fff', fontSize: 20, marginBottom: 8 }}>
              Next Weekly Event Starts In...
            </h2>
            {countdown ? (
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                {[['Days',countdown.d],['Hours',countdown.h],['Min',countdown.m],['Sec',countdown.s]].map(([l,v]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 40, fontWeight: 900, color: '#00ff88',
                      textShadow: '0 0 20px rgba(0,255,136,0.5)' }}>
                      {String(v).padStart(2,'0')}
                    </div>
                    <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>Quiz starts every Saturday at 9:00 PM</p>
            )}
          </>
        )}
      </div>

      {/* Info cards */}
      <div className="grid-3">
        {[
          { icon: '📝', title: '15 Questions', desc: 'MCQ, True/False, and Image-based questions' },
          { icon: '⏱️', title: 'No Time Limit', desc: 'Timer runs but there is no cutoff — submit when ready' },
          { icon: '🏆', title: 'Ranked by Score + Speed', desc: 'Higher score wins; ties broken by fastest time' },
        ].map(c => (
          <div key={c.title} className="glass" style={{ padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: '#666' }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
