import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import ParticleBackground from '../components/ParticleBackground';
import toast from 'react-hot-toast';
import '../styles/LandingPage.css';

const REWARD_TABLE = [
  [100,'₹10'],[200,'₹20'],[300,'₹30'],[400,'₹40'],[500,'₹50'],
  [600,'₹60'],[700,'₹70'],[800,'₹80'],[900,'₹90'],[1000,'₹100'],
];

// Free Fire characters using publicly available Garena wiki / fan-art CDN images
const FF_CHARACTERS = [
  {
    name: 'DJ Alok',
    role: 'Support',
    ability: 'Drop the Beat',
    img: 'https://static.wikia.nocookie.net/freefire/images/5/5c/Alok_New.png',
    color: '#4fc3f7'
  },
  {
    name: 'Chrono',
    role: 'Defense',
    ability: 'Time Turner',
    img: 'https://static.wikia.nocookie.net/freefire/images/1/1a/Chrono.png',
    color: '#ce93d8'
  },
  {
    name: 'K (Captain Booyah)',
    role: 'Utility',
    ability: 'Master of All',
    img: 'https://static.wikia.nocookie.net/freefire/images/a/a7/K_New.png',
    color: '#ffb74d'
  },
  {
    name: 'Skyler',
    role: 'Offense',
    ability: 'Riptide Rhythm',
    img: 'https://static.wikia.nocookie.net/freefire/images/8/8a/Skyler_New.png',
    color: '#80cbc4'
  },
  {
    name: 'Wukong',
    role: 'Stealth',
    ability: 'Camouflage',
    img: 'https://static.wikia.nocookie.net/freefire/images/b/ba/Wukong_New.png',
    color: '#a5d6a7'
  },
  {
    name: 'Jai',
    role: 'Aggression',
    ability: 'Raging Reload',
    img: 'https://static.wikia.nocookie.net/freefire/images/5/5c/Jai_New.png',
    color: '#ef9a9a'
  },
];

// Free Fire gameplay/promo screenshots from public sources
const FF_GALLERY = [
  {
    img: 'https://images.alphacoders.com/132/1326622.jpg',
    caption: 'Survive. Fight. Win.'
  },
  {
    img: 'https://images.alphacoders.com/131/1312769.jpg',
    caption: 'Battle Royale — 50 Players, 1 Winner'
  },
  {
    img: 'https://images.alphacoders.com/129/1298019.jpg',
    caption: 'Clash Squad — 4v4 Intense Mode'
  },
];

export default function LandingPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [authTab, setAuthTab] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ username:'', email:'', password:'', confirmPassword:'' });
  const [errors, setErrors] = useState({});
  const [activeGallery, setActiveGallery] = useState(0);

  const isValidEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const validateLogin = () => {
    const e = {};
    if (!loginForm.email.trim()) e.email = 'Email or username is required';
    if (!loginForm.password)     e.password = 'Password is required';
    return e;
  };

  const validateSignup = () => {
    const e = {};
    if (!signupForm.username.trim()) e.username = 'Username is required';
    else if (signupForm.username.trim().length < 3) e.username = 'Min 3 characters';
    if (!signupForm.email.trim()) e.email = 'Email is required';
    else if (!isValidEmail(signupForm.email)) e.email = 'Enter a valid email';
    if (!signupForm.password) e.password = 'Password is required';
    else if (signupForm.password.length < 6) e.password = 'Min 6 characters';
    if (!signupForm.confirmPassword) e.confirmPassword = 'Confirm your password';
    else if (signupForm.password !== signupForm.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleLogin = async e => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setAuthLoading(true);
    try {
      const user = await login(loginForm.email.trim(), loginForm.password);
      toast.success(`Welcome back, ${user.username}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      toast.error(msg); setErrors({ general: msg });
    } finally { setAuthLoading(false); }
  };

  const handleSignup = async e => {
    e.preventDefault();
    const errs = validateSignup();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setAuthLoading(true);
    try {
      await register(signupForm);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg); setErrors({ general: msg });
    } finally { setAuthLoading(false); }
  };

  const switchTab = tab => { setAuthTab(tab); setErrors({}); };

  return (
    <div className="landing">
      <ParticleBackground />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-logo-area">
            <Logo size="lg" showTagline />
          </div>
          <p className="hero-desc">
            Join the ultimate Free Fire community. Compete in weekly quizzes,
            climb the leaderboard, win real rewards, and be part of the action.
          </p>
          <div className="hero-stats">
            {[['Weekly Quizzes','Every Saturday'],['Real Rewards','Redeem Codes'],['Tournaments','Regular Events']].map(([t,s]) => (
              <div key={t} className="hero-stat">
                <div className="hero-stat-title">{t}</div>
                <div className="hero-stat-sub">{s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Auth card */}
        <div className="hero-auth-card">
          <div className="auth-tabs">
            <button className={`auth-tab ${authTab==='login'?'active':''}`} onClick={()=>switchTab('login')}>Login</button>
            <button className={`auth-tab ${authTab==='signup'?'active':''}`} onClick={()=>switchTab('signup')}>Sign Up</button>
          </div>

          {errors.general && <div className="auth-error-banner">{errors.general}</div>}

          {authTab === 'login' && (
            <form onSubmit={handleLogin} className="auth-form" noValidate>
              <div className="form-group">
                <label className="form-label">Email or Username</label>
                <input className={`input-field ${errors.email?'input-error':''}`}
                  value={loginForm.email}
                  onChange={e=>{setLoginForm(p=>({...p,email:e.target.value}));setErrors(p=>({...p,email:'',general:''}));}}
                  placeholder="Enter email or username" autoComplete="username" />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className={`input-field ${errors.password?'input-error':''}`}
                  value={loginForm.password}
                  onChange={e=>{setLoginForm(p=>({...p,password:e.target.value}));setErrors(p=>({...p,password:'',general:''}));}}
                  placeholder="Enter your password" autoComplete="current-password" />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>
              <button type="submit" className="btn-solid auth-submit" disabled={authLoading}>
                {authLoading ? 'Signing in…' : 'Login'}
              </button>
              <p className="auth-switch-hint">Don't have an account?{' '}
                <button type="button" className="link-btn" onClick={()=>switchTab('signup')}>Sign Up</button>
              </p>
            </form>
          )}

          {authTab === 'signup' && (
            <form onSubmit={handleSignup} className="auth-form" noValidate>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className={`input-field ${errors.username?'input-error':''}`}
                  value={signupForm.username}
                  onChange={e=>{setSignupForm(p=>({...p,username:e.target.value}));setErrors(p=>({...p,username:'',general:''}));}}
                  placeholder="Choose a username" autoComplete="username" />
                {errors.username && <span className="field-error">{errors.username}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className={`input-field ${errors.email?'input-error':''}`}
                  value={signupForm.email}
                  onChange={e=>{setSignupForm(p=>({...p,email:e.target.value}));setErrors(p=>({...p,email:'',general:''}));}}
                  placeholder="your@email.com" autoComplete="email" />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Create Password</label>
                <input type="password" className={`input-field ${errors.password?'input-error':''}`}
                  value={signupForm.password}
                  onChange={e=>{setSignupForm(p=>({...p,password:e.target.value}));setErrors(p=>({...p,password:'',general:''}));}}
                  placeholder="Min 6 characters" autoComplete="new-password" />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type="password" className={`input-field ${errors.confirmPassword?'input-error':''}`}
                  value={signupForm.confirmPassword}
                  onChange={e=>{setSignupForm(p=>({...p,confirmPassword:e.target.value}));setErrors(p=>({...p,confirmPassword:'',general:''}));}}
                  placeholder="Repeat your password" autoComplete="new-password" />
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>
              <button type="submit" className="btn-solid auth-submit" disabled={authLoading}>
                {authLoading ? 'Creating account…' : 'Create Account'}
              </button>
              <p className="auth-notice">
                Create a new password for your GameVault account. It does not need to match your email password.
              </p>
              <p className="auth-switch-hint">Already have an account?{' '}
                <button type="button" className="link-btn" onClick={()=>switchTab('login')}>Login</button>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── GAMEPLAY BANNER ── */}
      <section className="gallery-section">
        <div className="gallery-main">
          <img
            src={FF_GALLERY[activeGallery].img}
            alt={FF_GALLERY[activeGallery].caption}
            className="gallery-img"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div className="gallery-overlay">
            <span className="gallery-caption">{FF_GALLERY[activeGallery].caption}</span>
          </div>
        </div>
        <div className="gallery-thumbs">
          {FF_GALLERY.map((g, i) => (
            <button key={i} className={`gallery-thumb ${activeGallery===i?'active':''}`}
              onClick={() => setActiveGallery(i)}>
              <img src={g.img} alt={g.caption}
                onError={e => { e.target.src = ''; e.target.style.display='none'; }} />
            </button>
          ))}
        </div>
      </section>

      {/* ── CHARACTER SHOWCASE ── */}
      <section className="characters-section">
        <div className="section-header">
          <h2 className="section-heading">Free Fire Characters</h2>
          <p className="section-subheading">Master your character's abilities and dominate the battlefield</p>
        </div>
        <div className="characters-grid">
          {FF_CHARACTERS.map(c => (
            <div key={c.name} className="char-card">
              <div className="char-img-wrap" style={{ '--char-color': c.color }}>
                <img
                  src={c.img} alt={c.name} className="char-img"
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentNode.style.background = '#1a1a1a';
                  }}
                />
                <div className="char-role-badge">{c.role}</div>
              </div>
              <div className="char-info">
                <div className="char-name">{c.name}</div>
                <div className="char-ability">⚡ {c.ability}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-heading">Platform Features</h2>
          <p className="section-subheading">Everything you need to compete and win</p>
        </div>
        <div className="features-grid">
          {[
            { icon:'🎯', title:'Weekly Quiz', desc:'15-question quiz every Saturday at 9 PM. Compete for top ranks.' },
            { icon:'🏆', title:'Leaderboard', desc:'Real-time rankings based on score, speed, and submission time.' },
            { icon:'🎮', title:'Tournaments', desc:'Regular Free Fire tournaments with room details published live.' },
            { icon:'🎁', title:'Real Rewards', desc:'Win redeem codes worth ₹10–₹100+ based on community growth.' },
            { icon:'📊', title:'Attendance Track', desc:'Track streaks, earn recognition for consistent participation.' },
            { icon:'📢', title:'Notifications', desc:'Stay updated with announcements, quiz alerts, and results.' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REWARD TABLE ── */}
      <section className="rewards-section">
        <div className="section-header">
          <h2 className="section-heading">Reward System</h2>
          <p className="section-subheading">Rewards grow with every 100 YouTube subscribers — ₹10 increase per milestone</p>
        </div>
        <div className="rewards-grid">
          {REWARD_TABLE.map(([subs, reward]) => (
            <div key={subs} className="reward-card">
              <div className="reward-subs">{subs.toLocaleString()}</div>
              <div className="reward-label">Subscribers</div>
              <div className="reward-value">{reward}</div>
              <div className="reward-label">Redeem Code</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-logo-area">
            <Logo size="sm" showText />
          </div>
          <p>© 2024 GameVolute. All rights reserved. Free Fire Community Platform.</p>
          <p className="footer-sub">Free Fire is a registered trademark of Garena. This is a fan community site.</p>
        </div>
      </footer>
    </div>
  );
}
