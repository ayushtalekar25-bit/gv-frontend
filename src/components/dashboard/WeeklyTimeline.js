import React from 'react';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function WeeklyTimeline() {
  const today = new Date().getDay(); // 0=Sun, 6=Sat

  return (
    <div style={{ padding: '8px 0' }}>
      {DAYS.map((day, i) => {
        const isPast = i < today;
        const isToday = i === today;
        return (
          <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
            {/* Connector line */}
            {i < DAYS.length - 1 && (
              <div style={{
                position: 'absolute', left: 11, top: 22, width: 2, height: 28, zIndex: 0,
                background: isPast
                  ? 'linear-gradient(180deg,#00ff88,#00cc66)'
                  : 'rgba(255,255,255,0.08)'
              }} />
            )}
            {/* Dot */}
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0, zIndex: 1,
              background: isPast ? '#00ff88' : isToday
                ? 'transparent' : 'transparent',
              border: isToday
                ? '2px solid #00ff88'
                : isPast ? 'none' : '2px solid rgba(255,255,255,0.15)',
              boxShadow: isToday ? '0 0 12px rgba(0,255,136,0.7)' : isPast ? '0 0 6px rgba(0,255,136,0.4)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {isPast && <span style={{ color: '#000', fontSize: 10, fontWeight: 900 }}>✓</span>}
              {isToday && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88',
                boxShadow: '0 0 8px #00ff88', display: 'block' }} />}
            </div>
            {/* Label */}
            <div style={{ paddingBottom: i < DAYS.length - 1 ? 28 : 0 }}>
              <span style={{
                fontFamily: 'Rajdhani,sans-serif', fontSize: 14, fontWeight: 600,
                color: isToday ? '#00ff88' : isPast ? '#aaa' : '#555',
                textShadow: isToday ? '0 0 8px rgba(0,255,136,0.5)' : 'none'
              }}>
                {day}
                {isToday && <span style={{ marginLeft: 8, fontSize: 11,
                  background: 'rgba(0,255,136,0.15)', border: '1px solid rgba(0,255,136,0.3)',
                  color: '#00ff88', padding: '1px 6px', borderRadius: 4 }}>TODAY</span>}
                {i === 6 && <span style={{ marginLeft: 8, fontSize: 11, color: '#ffa502' }}>Quiz Day</span>}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
