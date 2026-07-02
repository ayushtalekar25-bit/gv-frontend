import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter'); // enter → shine → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('shine'), 500);
    const t2 = setTimeout(() => setPhase('exit'),  2200);
    const t3 = setTimeout(() => onDone?.(),        2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className={`splash-screen ${phase === 'exit' ? 'splash-exit' : ''}`}>

      {/* Background particles */}
      <div className="splash-particles">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="splash-particle" style={{ '--i': i }} />
        ))}
      </div>

      {/* Center: logo only, big, no box */}
      <div className={`splash-content ${phase === 'enter' ? 'splash-enter' : 'splash-visible'}`}>
        <div className="splash-logo-wrap">
          <div className="splash-glow-ring" />
          <img src="/logo.png" alt="GameVolute" className="splash-logo" />
        </div>
        <div className="splash-bar">
          <div className={`splash-bar-fill ${phase !== 'enter' ? 'bar-active' : ''}`} />
        </div>
      </div>
    </div>
  );
}
