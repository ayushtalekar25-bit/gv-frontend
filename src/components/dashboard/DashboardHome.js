import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatDate, getCountdown } from '../../utils/helpers';
import WeeklyTimeline from './WeeklyTimeline';



export default function DashboardHome() {
  const { user } = useAuth();
  const [quizStatus, setQuizStatus] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [winners, setWinners] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    api.get('/quiz/status').then(r => {
      setQuizStatus(r.data);
      if (r.data.isLive && !r.data.alreadySubmitted) setShowPopup(true);
    }).catch(() => {});
    api.get('/notifications').then(r => setNotifications(r.data.notifications?.slice(0,3) || [])).catch(() => {});
    api.get('/admin/winners/user-view').then(r => setWinners(r.data.winners || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!quizStatus?.nextEvent || quizStatus?.isLive) return;
    const interval = setInterval(() => {
      const c = getCountdown(quizStatus.nextEvent);
      setCountdown(c);
      if (!c) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [quizStatus]);

  const rankEmoji = r => r === 1 ? '🥇' : r === 2 ? '🥈' : '🥉';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Quiz Live Popup */}
      {showPopup && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.8)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:200
        }}>
          <div className="glass" style={{ padding:40, textAlign:'center', maxWidth:400, animation:'fadeInUp 0.4s ease' }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🔥</div>
            <h2 style={{ fontFamily:'Orbitron,monospace', color:'#00ff88', fontSize:24, marginBottom:8 }}>
              Weekly Quiz is Live!
            </h2>
            <p style={{ color:'#aaa', marginBottom:24 }}>
              The weekly challenge has started. Test your Free Fire knowledge!
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
              <Link to="/quiz" className="btn-solid" onClick={() => setShowPopup(false)}>
                Start Weekly Challenge
              </Link>
              <button className="btn-neon" onClick={() => setShowPopup(false)}>Later</button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome card */}
      <div className="glass" style={{ padding:28 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontFamily:'Orbitron,monospace', fontSize:22, marginBottom:4 }}>
              Welcome back, <span style={{ color:'#00ff88' }}>{user?.username}</span>!
            </h1>
            <p style={{ color:'#666', fontSize:14 }}>
              Joined {formatDate(user?.joinedDate)} · {user?.totalQuizzesAttempted} quizzes played · {user?.totalWins} wins
            </p>
          </div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {quizStatus?.isLive && !quizStatus?.alreadySubmitted ? (
              <Link to="/quiz" className="btn-solid" style={{ animation:'pulse-neon 2s infinite' }}>
                🔥 Quiz Live — Play Now
              </Link>
            ) : quizStatus?.alreadySubmitted ? (
              <span className="badge badge-green">✓ Submitted This Week</span>
            ) : (
              <Link to="/dashboard/quiz" className="btn-neon">View Quiz Status</Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-4">
        {[
          { label:'Best Score', value: user?.bestScore || 0, sub:'out of 15' },
          { label:'Total Wins', value: user?.totalWins || 0, sub:'all time' },
          { label:'Best Time', value: user?.bestTime ? `${Math.floor(user.bestTime/60)}m ${user.bestTime%60}s` : '--', sub:'fastest' },
          { label:'Quizzes Played', value: user?.totalQuizzesAttempted || 0, sub:'total' },
        ].map(s => (
          <div key={s.label} className="glass stat-card">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize:11, color:'#555', marginTop:2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Countdown */}
      {!quizStatus?.isLive && countdown && (
        <div className="glass" style={{ padding:24, textAlign:'center' }}>
          <p style={{ fontFamily:'Rajdhani,sans-serif', fontSize:13, color:'#666', textTransform:'uppercase', letterSpacing:2, marginBottom:8 }}>
            Next Weekly Event Starts In...
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            {[['Days',countdown.d],['Hours',countdown.h],['Min',countdown.m],['Sec',countdown.s]].map(([l,v]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:32, fontWeight:900, color:'#00ff88',
                  textShadow:'0 0 15px rgba(0,255,136,0.5)' }}>{String(v).padStart(2,'0')}</div>
                <div style={{ fontSize:11, color:'#555', textTransform:'uppercase', letterSpacing:1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid-2">
        {/* Weekly Timeline */}
        <div className="glass" style={{ padding:24 }}>
          <div className="section-title">Weekly Timeline</div>
          <WeeklyTimeline />
        </div>

        {/* Winners preview */}
        <div className="glass" style={{ padding:24 }}>
          <div className="section-title">This Week's Winners</div>
          {winners.length === 0 ? (
            <p style={{ color:'#555', fontSize:14, textAlign:'center', padding:'20px 0' }}>
              No results yet this week
            </p>
          ) : winners.map(w => (
            <div key={w._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0',
              borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize:24 }}>{rankEmoji(w.rank)}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#fff' }}>
                  {w.userId?.username || 'Player'}
                </div>
                <div style={{ fontSize:12, color:'#555' }}>{w.score}/15 · {Math.floor(w.timeTaken/60)}m {w.timeTaken%60}s</div>
              </div>
              <span className={`badge ${w.rewardStatus==='Sent'?'badge-green':'badge-orange'}`}>
                {w.rewardStatus}
              </span>
            </div>
          ))}
          <Link to="/dashboard/winners" style={{ display:'block', textAlign:'center', color:'#00ff88', fontSize:13, marginTop:16, textDecoration:'none' }}>
            View All Winners →
          </Link>
        </div>
      </div>

      {/* Notifications preview */}
      {notifications.length > 0 && (
        <div className="glass" style={{ padding:24 }}>
          <div className="section-title">Recent Announcements</div>
          {notifications.map(n => (
            <div key={n._id} style={{ padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)',
              display:'flex', alignItems:'flex-start', gap:12 }}>
              <span style={{ fontSize:20 }}>
                {n.type==='Quiz Live'?'🔥':n.type==='Tournament'?'🎮':n.type==='Prize'?'🎁':'📢'}
              </span>
              <div>
                <div style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#fff', fontSize:15 }}>{n.title}</div>
                <div style={{ fontSize:13, color:'#666' }}>{n.message}</div>
              </div>
              {!n.isRead && <span className="badge badge-green" style={{ marginLeft:'auto', flexShrink:0 }}>New</span>}
            </div>
          ))}
          <Link to="/dashboard/notifications" style={{ display:'block', textAlign:'center', color:'#00ff88', fontSize:13, marginTop:16, textDecoration:'none' }}>
            View All →
          </Link>
        </div>
      )}
    </div>
  );
}
