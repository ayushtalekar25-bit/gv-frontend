import React from 'react';

const SIZES = { xs: 24, sm: 32, md: 40, lg: 64, xl: 120 };

export default function Logo({ size = 'md', showText = false, showTagline = false, className = '' }) {
  const px = SIZES[size] || SIZES.md;
  const textSize = Math.max(12, px * 0.38);
  const taglineSize = Math.max(9, px * 0.18);

  return (
    <div
      className={`gv-logo-wrap ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: Math.max(6, px * 0.22) }}
    >
      {/* wrapper removes black bg */}
      <div style={{
        width: px, height: px, flexShrink: 0,
        position: 'relative', overflow: 'hidden',
        borderRadius: 4, isolation: 'isolate',
        background: 'transparent',
      }}>
        <img
          src="/logo.png"
          alt="GameVolute"
          style={{
            width: '100%', height: '100%',
            objectFit: 'contain', display: 'block',
            mixBlendMode: 'screen',
            filter: 'brightness(1.6) contrast(1.15) saturate(1.1)',
          }}
        />
      </div>

      {(showText || showTagline) && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.1 }}>
          {showText && (
            <span style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: textSize, fontWeight: 900,
              letterSpacing: '1px', color: '#fff', whiteSpace: 'nowrap',
            }}>
              GAME<span style={{ color: '#e53e3e' }}>VOLUTE</span>
            </span>
          )}
          {showTagline && (
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: taglineSize, fontWeight: 600,
              color: '#f0b429', letterSpacing: '2px',
              textTransform: 'uppercase', marginTop: 2,
            }}>
              Play. Compete. Win.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
