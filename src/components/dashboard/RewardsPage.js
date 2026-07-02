import React from 'react';

const REWARDS = [
  [100,'₹10'],[200,'₹20'],[300,'₹30'],[400,'₹40'],[500,'₹50'],
  [600,'₹60'],[700,'₹70'],[800,'₹80'],[900,'₹90'],[1000,'₹100'],
];

export default function RewardsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="section-title">Reward Information</div>

      <div className="glass" style={{ padding: 24 }}>
        <p style={{ color: '#aaa', fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>
          Rewards depend on the number of YouTube subscribers. As the channel grows, redeem code values increase.
        </p>
        <div style={{
          background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)',
          borderRadius: 8, padding: '12px 16px', marginTop: 12
        }}>
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: '#00ff88', fontSize: 15 }}>
            Formula: Every additional 100 YouTube subscribers increases the reward by ₹10
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
        {REWARDS.map(([subs, reward], i) => (
          <div key={subs} className="glass" style={{
            padding: 24, textAlign: 'center',
            transition: 'all 0.3s',
            animationDelay: `${i * 0.05}s`,
            animation: 'fadeInUp 0.5s ease forwards',
            opacity: 0
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = 'rgba(0,255,136,0.4)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,136,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.borderColor = '';
              e.currentTarget.style.boxShadow = '';
            }}>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 11, color: '#555',
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Subscribers
            </div>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 24, fontWeight: 900,
              color: '#fff', marginBottom: 12 }}>
              {subs.toLocaleString()}
            </div>
            <div style={{ width: '100%', height: 1, background: 'rgba(0,255,136,0.15)', marginBottom: 12 }} />
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 11, color: '#555',
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              Redeem Code
            </div>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 28, fontWeight: 900,
              color: '#00ff88', textShadow: '0 0 15px rgba(0,255,136,0.5)' }}>
              {reward}
            </div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ padding: 24 }}>
        <div className="section-title">How to Receive Rewards</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['🏆', 'Finish in the top 3 of the weekly quiz leaderboard'],
            ['📱', 'Make sure your WhatsApp number is saved in Prize Info'],
            ['✉️', 'Admin will send your redeem code via WhatsApp'],
            ['📊', 'Track your reward status in the Winners section'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontSize: 14, color: '#888' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
