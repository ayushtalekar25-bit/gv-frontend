import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { getWeekId } from '../../utils/helpers';

const EMPTY = { questionText:'', questionType:'multiple_choice', options:['','','',''], correctAnswer:'', image:null, order:0 };

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [weekId, setWeekId] = useState(getWeekId());
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = (wid = weekId) => {
    api.get(`/quiz/admin/questions?weekId=${wid}`)
      .then(r => setQuestions(r.data.questions || [])).catch(() => {});
  };

  useEffect(() => { load(); }, [weekId]);

  const handleOption = (i, val) => {
    const opts = [...form.options];
    opts[i] = val;
    setForm(p => ({ ...p, options: opts }));
  };

  const reset = () => { setForm(EMPTY); setEditId(null); setShowForm(false); };

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('weekId', weekId);
      fd.append('questionText', form.questionText);
      fd.append('questionType', form.questionType);
      fd.append('correctAnswer', form.correctAnswer);
      fd.append('order', form.order);
      const opts = form.options.filter(o => o.trim());
      fd.append('options', JSON.stringify(form.questionType === 'true_false' ? ['True','False'] : opts));
      if (form.image) fd.append('image', form.image);

      if (editId) {
        await api.put(`/quiz/admin/question/${editId}`, fd);
        toast.success('Question updated');
      } else {
        await api.post('/quiz/admin/question', fd);
        toast.success('Question added');
      }
      reset(); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = q => {
    setForm({ questionText:q.questionText, questionType:q.questionType,
      options: q.options?.length ? [...q.options,...Array(4).fill('')].slice(0,4) : ['','','',''],
      correctAnswer:q.correctAnswer, image:null, order:q.order });
    setEditId(q._id);
    setShowForm(true);
  };

  const del = async id => {
    if (!window.confirm('Delete this question?')) return;
    await api.delete(`/quiz/admin/question/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div className="section-title">Weekly Questions</div>
        <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
          <div>
            <label className="form-label" style={{ marginBottom:4 }}>Week ID</label>
            <input value={weekId} onChange={e => setWeekId(e.target.value)}
              className="input-field" style={{ width:160 }} />
          </div>
          <button className="btn-solid" onClick={() => { reset(); setShowForm(v => !v); }} style={{ marginTop:22 }}>
            {showForm ? 'Cancel' : '+ Add Question'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="glass" style={{ padding:28 }}>
          <h3 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#fff', marginBottom:20, fontSize:18 }}>
            {editId ? 'Edit Question' : 'New Question'}
          </h3>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="grid-2">
              <div>
                <label className="form-label">Question Type</label>
                <select className="input-field" value={form.questionType}
                  onChange={e => setForm(p => ({ ...p, questionType: e.target.value }))}>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True / False</option>
                  <option value="image_based">Image Based</option>
                </select>
              </div>
              <div>
                <label className="form-label">Order</label>
                <input type="number" className="input-field" value={form.order}
                  onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div>
              <label className="form-label">Question Text</label>
              <textarea className="input-field" value={form.questionText} required
                onChange={e => setForm(p => ({ ...p, questionText: e.target.value }))}
                placeholder="Enter the question..." />
            </div>
            {form.questionType !== 'true_false' && (
              <div>
                <label className="form-label">Options (at least 2)</label>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {form.options.map((opt, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ color:'#555', fontFamily:'Orbitron,monospace', fontSize:12,
                        width:20, textAlign:'center' }}>{['A','B','C','D'][i]}</span>
                      <input className="input-field" value={opt} placeholder={`Option ${['A','B','C','D'][i]}`}
                        onChange={e => handleOption(i, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="form-label">Correct Answer</label>
              {form.questionType === 'true_false' ? (
                <select className="input-field" value={form.correctAnswer}
                  onChange={e => setForm(p => ({ ...p, correctAnswer: e.target.value }))}>
                  <option value="">Select...</option>
                  <option value="True">True</option>
                  <option value="False">False</option>
                </select>
              ) : (
                <input className="input-field" value={form.correctAnswer} required
                  onChange={e => setForm(p => ({ ...p, correctAnswer: e.target.value }))}
                  placeholder="Must match one of the options exactly" />
              )}
            </div>
            {(form.questionType === 'image_based' || form.questionType === 'multiple_choice') && (
              <div>
                <label className="form-label">Image (Optional)</label>
                <input type="file" accept="image/*" className="input-field"
                  onChange={e => setForm(p => ({ ...p, image: e.target.files[0] }))} />
              </div>
            )}
            <div style={{ display:'flex', gap:12 }}>
              <button type="submit" className="btn-solid" disabled={loading}>
                {loading ? 'Saving...' : editId ? 'Update Question' : 'Add Question'}
              </button>
              <button type="button" className="btn-neon" onClick={reset}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ color:'#555', fontSize:13 }}>{questions.length} question(s) for week {weekId}</div>
        {questions.map((q, i) => (
          <div key={q._id} className="glass" style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:'Orbitron,monospace', fontSize:11, color:'#00ff88' }}>Q{i+1}</span>
                  <span className="badge badge-blue" style={{ fontSize:10 }}>{q.questionType.replace('_',' ')}</span>
                </div>
                <p style={{ fontSize:15, color:'#fff', fontFamily:'Rajdhani,sans-serif', fontWeight:600, marginBottom:8 }}>
                  {q.questionText}
                </p>
                {q.imageUrl && <img src={q.imageUrl} alt="" style={{ maxHeight:80, borderRadius:6, marginBottom:8 }} />}
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {q.options?.map(opt => (
                    <span key={opt} style={{
                      padding:'3px 10px', borderRadius:6, fontSize:12,
                      background: opt === q.correctAnswer ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.05)',
                      color: opt === q.correctAnswer ? '#00ff88' : '#666',
                      border: opt === q.correctAnswer ? '1px solid rgba(0,255,136,0.3)' : '1px solid rgba(255,255,255,0.08)'
                    }}>{opt}</span>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn-neon" style={{ padding:'6px 12px', fontSize:12 }} onClick={() => startEdit(q)}>Edit</button>
                <button className="btn-danger" style={{ padding:'6px 12px', fontSize:12 }} onClick={() => del(q._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
