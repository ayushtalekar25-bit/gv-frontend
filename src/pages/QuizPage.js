import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import '../styles/QuizPage.css';

export default function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [weekId, setWeekId] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    api.get('/quiz/questions').then(r => {
      setQuestions(r.data.questions);
      setWeekId(r.data.weekId);
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }).catch(err => {
      toast.error(err.response?.data?.message || 'Cannot load quiz');
      navigate('/dashboard/quiz');
    }).finally(() => setLoading(false));

    return () => clearInterval(timerRef.current);
  }, [navigate]);

  const select = (qId, answer) => setAnswers(p => ({ ...p, [qId]: answer }));

  const submit = useCallback(async () => {
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const payload = questions.map(q => ({
        questionId: q._id,
        selectedAnswer: answers[q._id] || ''
      }));
      const res = await api.post('/quiz/submit', { weekId, answers: payload, timeTaken: seconds });
      setResult(res.data);
      toast.success('Quiz submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
      if (err.response?.status === 409) navigate('/dashboard/quiz');
    } finally {
      setSubmitting(false);
    }
  }, [questions, answers, weekId, seconds, navigate]);

  const formatTimer = s => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a' }}>
      <div style={{ textAlign:'center' }}>
        <div className="spinner" />
        <p style={{ color:'#555', marginTop:16, fontFamily:'Rajdhani,sans-serif', letterSpacing:2, textTransform:'uppercase' }}>
          Loading Quiz...
        </p>
      </div>
    </div>
  );

  if (result) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'#0a0a0a', padding:20 }}>
      <div className="glass quiz-result-card">
        <div style={{ fontSize:64, textAlign:'center', marginBottom:16 }}>
          {result.score >= 12 ? '🏆' : result.score >= 8 ? '🎯' : '📝'}
        </div>
        <h2 style={{ fontFamily:'Orbitron,monospace', textAlign:'center', color:'#fff', marginBottom:8 }}>
          Quiz Complete!
        </h2>
        <div className="grid-3" style={{ margin:'24px 0' }}>
          {[
            { label:'Score', value:`${result.score}/${result.totalQuestions}` },
            { label:'Time', value:formatTimer(result.timeTaken) },
            { label:'Accuracy', value:`${Math.round((result.score/result.totalQuestions)*100)}%` }
          ].map(s => (
            <div key={s.label} className="glass stat-card">
              <div className="stat-value" style={{
                color: s.label === 'Score' ? (result.score >= 12 ? '#00ff88' : result.score >= 8 ? '#ffa502' : '#ff4757') : '#00ff88'
              }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign:'center', color:'#666', fontSize:14, marginBottom:24 }}>
          Rankings update automatically. Check the leaderboard for your rank.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button className="btn-solid" onClick={() => navigate('/dashboard/leaderboard')}>View Leaderboard</button>
          <button className="btn-neon" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );

  const q = questions[current];
  const answered = Object.keys(answers).length;
  const progress = (answered / questions.length) * 100;

  return (
    <div className="quiz-page">
      {/* Header */}
      <div className="quiz-header glass">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div className="quiz-logo">GV</div>
          <div>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:14, color:'#fff' }}>Weekly Quiz</div>
            <div style={{ fontSize:12, color:'#555' }}>{weekId}</div>
          </div>
        </div>
        <div className="quiz-timer">
          <span style={{ fontSize:12, color:'#555', marginRight:6 }}>⏱</span>
          <span style={{ fontFamily:'Orbitron,monospace', fontSize:20, color:'#00ff88',
            textShadow:'0 0 10px rgba(0,255,136,0.5)' }}>
            {formatTimer(seconds)}
          </span>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:13, color:'#aaa' }}>{answered}/{questions.length} answered</div>
          <div style={{ fontSize:12, color:'#555' }}>Q{current+1} of {questions.length}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height:3, background:'rgba(255,255,255,0.06)', margin:'0 0 24px' }}>
        <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#00ff88,#00cc66)',
          transition:'width 0.3s', boxShadow:'0 0 8px rgba(0,255,136,0.5)' }} />
      </div>

      <div className="quiz-body">
        {/* Question panel */}
        <div className="quiz-main">
          <div className="glass quiz-question-card" key={q._id}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <span style={{ background:'rgba(0,255,136,0.15)', border:'1px solid rgba(0,255,136,0.3)',
                padding:'4px 12px', borderRadius:6, fontFamily:'Orbitron,monospace',
                fontSize:12, color:'#00ff88' }}>Q{current+1}</span>
              <span style={{ fontSize:12, color:'#555', textTransform:'uppercase', letterSpacing:1 }}>
                {q.questionType.replace('_',' ')}
              </span>
            </div>

            {q.imageUrl && (
              <img src={q.imageUrl} alt="Question" style={{ width:'100%', maxHeight:240,
                objectFit:'cover', borderRadius:8, marginBottom:16, border:'1px solid rgba(255,255,255,0.1)' }} />
            )}

            <p style={{ fontSize:18, color:'#fff', fontFamily:'Rajdhani,sans-serif',
              fontWeight:600, lineHeight:1.5, marginBottom:24 }}>
              {q.questionText}
            </p>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {q.questionType === 'true_false'
                ? ['True','False'].map(opt => (
                  <button key={opt} className={`quiz-option ${answers[q._id] === opt ? 'selected' : ''}`}
                    onClick={() => select(q._id, opt)}>{opt}</button>
                ))
                : q.options?.map((opt, i) => (
                  <button key={i} className={`quiz-option ${answers[q._id] === opt ? 'selected' : ''}`}
                    onClick={() => select(q._id, opt)}>
                    <span style={{ width:28, height:28, borderRadius:6, background:'rgba(255,255,255,0.06)',
                      display:'inline-flex', alignItems:'center', justifyContent:'center',
                      fontSize:12, fontWeight:700, marginRight:10, flexShrink:0 }}>
                      {['A','B','C','D'][i]}
                    </span>
                    {opt}
                  </button>
                ))}
            </div>
          </div>

          {/* Nav */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:16 }}>
            <button className="btn-neon" onClick={() => setCurrent(p => p - 1)} disabled={current === 0}>
              ← Prev
            </button>
            {current < questions.length - 1 ? (
              <button className="btn-solid" onClick={() => setCurrent(p => p + 1)}>
                Next →
              </button>
            ) : (
              <button className="btn-solid" onClick={submit} disabled={submitting}
                style={{ background: answered < questions.length ? undefined : '#00ff88' }}>
                {submitting ? 'Submitting...' : `Submit Quiz (${answered}/${questions.length})`}
              </button>
            )}
          </div>
        </div>

        {/* Question map */}
        <div className="quiz-sidebar">
          <div className="glass" style={{ padding:20 }}>
            <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:13, color:'#555',
              textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Questions</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} style={{
                  aspectRatio:'1', borderRadius:6, cursor:'pointer',
                  fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:13,
                  background: i === current
                    ? '#00ff88' : answers[questions[i]?._id]
                    ? 'rgba(0,255,136,0.25)' : 'rgba(255,255,255,0.06)',
                  color: i === current ? '#000' : answers[questions[i]?._id] ? '#00ff88' : '#666',
                  border: i === current ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  transition:'all 0.2s'
                }}>{i + 1}</button>
              ))}
            </div>
            <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:6 }}>
              {[
                { color:'#00ff88', label:`Answered (${answered})` },
                { color:'rgba(255,255,255,0.06)', label:`Unanswered (${questions.length - answered})` },
              ].map(l => (
                <div key={l.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:12, height:12, borderRadius:3, background:l.color, flexShrink:0 }} />
                  <span style={{ fontSize:12, color:'#555' }}>{l.label}</span>
                </div>
              ))}
            </div>
            {answered === questions.length && (
              <button className="btn-solid" onClick={submit} disabled={submitting}
                style={{ width:'100%', marginTop:16 }}>
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
