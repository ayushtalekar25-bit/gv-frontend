import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import toast from 'react-hot-toast';
import '../styles/AuthPages.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:'', email:'', password:'', confirmPassword:'' });
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to Game Valute!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <ParticleBackground />
      <div className="auth-card glass" style={{ maxWidth: 440 }}>
        <div className="auth-logo">
          <div className="auth-logo-box">GV</div>
          <span className="auth-logo-name">GAME VALUTE</span>
        </div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Join the Free Fire community</p>
        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input name="username" value={form.username} onChange={handle}
              className="input-field" placeholder="Choose a username" required minLength={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handle}
              className="input-field" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handle}
              className="input-field" placeholder="Create a password (min 6 chars)" required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handle}
              className="input-field" placeholder="Repeat your password" required />
          </div>
          <button type="submit" className="btn-solid auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-notice">
          Create an email and password that you can remember. These login details are only for this website.
        </p>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
