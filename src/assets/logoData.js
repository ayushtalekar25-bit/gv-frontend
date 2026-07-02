// GameVolute official logo embedded as SVG
// Recreated from the uploaded brand image: shield with GV letters, crown, "GAMEVOLUTE" text
// Colors: Gold (#f0b429), Red (#e53e3e), Silver/White, Black background

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f0b429;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fcd34d;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b8860b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="shieldRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e53e3e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fc8181;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9b2c2c;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#e0e0e0;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#888;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="goldGlow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Outer shield border (silver) -->
  <path d="M100 8 L172 38 L172 110 Q172 158 100 192 Q28 158 28 110 L28 38 Z"
    fill="none" stroke="url(#silverGrad)" stroke-width="3"/>

  <!-- Shield background -->
  <path d="M100 14 L168 42 L168 110 Q168 154 100 186 Q32 154 32 110 L32 42 Z"
    fill="url(#shieldBg)"/>

  <!-- Hexagonal pattern background (subtle) -->
  <path d="M100 14 L168 42 L168 110 Q168 154 100 186 Q32 154 32 110 L32 42 Z"
    fill="none" stroke="#222" stroke-width="0.5" opacity="0.5"/>

  <!-- Gold shield accent lines -->
  <path d="M100 8 L172 38" stroke="url(#shieldGold)" stroke-width="2.5" fill="none"/>
  <path d="M28 38 L100 8" stroke="url(#shieldGold)" stroke-width="2.5" fill="none"/>
  <path d="M168 42 L168 110 Q168 154 100 186" stroke="url(#silverGrad)" stroke-width="2" fill="none"/>
  <path d="M32 42 L32 110 Q32 154 100 186" stroke="#e53e3e" stroke-width="2" fill="none"/>

  <!-- Crown at top -->
  <g filter="url(#goldGlow)" transform="translate(100, 22)">
    <polygon points="-12,8 -8,-4 -4,2 0,-10 4,2 8,-4 12,8 10,12 -10,12"
      fill="url(#shieldGold)" stroke="#b8860b" stroke-width="0.5"/>
    <!-- Crown gems -->
    <circle cx="0" cy="-10" r="2.5" fill="#fcd34d"/>
    <circle cx="-8" cy="-4" r="1.8" fill="#fcd34d"/>
    <circle cx="8" cy="-4" r="1.8" fill="#fcd34d"/>
  </g>

  <!-- Big G letter (gold) -->
  <g filter="url(#goldGlow)">
    <text x="52" y="115" font-family="Arial Black, sans-serif" font-size="68"
      font-weight="900" fill="url(#shieldGold)" letter-spacing="-2">G</text>
    <!-- G inner stroke for depth -->
    <text x="52" y="115" font-family="Arial Black, sans-serif" font-size="68"
      font-weight="900" fill="none" stroke="#b8860b" stroke-width="1">G</text>
  </g>

  <!-- Big V letter (red) - overlapping G -->
  <g filter="url(#glow)">
    <text x="95" y="115" font-family="Arial Black, sans-serif" font-size="66"
      font-weight="900" fill="url(#shieldRed)" letter-spacing="-2">V</text>
    <text x="95" y="115" font-family="Arial Black, sans-serif" font-size="66"
      font-weight="900" fill="none" stroke="#9b2c2c" stroke-width="1">V</text>
  </g>

  <!-- Bottom banner -->
  <rect x="22" y="148" width="156" height="26" rx="3"
    fill="#111" stroke="url(#silverGrad)" stroke-width="1.2"/>

  <!-- GAMEVOLUTE text -->
  <text x="100" y="165" font-family="Arial Black, sans-serif" font-size="13"
    font-weight="900" fill="white" text-anchor="middle" letter-spacing="0.5">
    <tspan fill="white">GAME</tspan><tspan fill="#e53e3e">VOLUTE</tspan>
  </text>

  <!-- Tagline -->
  <text x="100" y="183" font-family="Arial, sans-serif" font-size="7"
    font-weight="600" fill="#f0b429" text-anchor="middle" letter-spacing="1.5">
    PLAY. COMPETE. WIN.
  </text>

  <!-- Bottom mini GV emblem -->
  <text x="100" y="196" font-family="Arial Black, sans-serif" font-size="7"
    font-weight="900" fill="url(#silverGrad)" text-anchor="middle">GV</text>
</svg>`;

export const LOGO_DATA_URL = `data:image/svg+xml;base64,${btoa(LOGO_SVG)}`;
export default LOGO_DATA_URL;
