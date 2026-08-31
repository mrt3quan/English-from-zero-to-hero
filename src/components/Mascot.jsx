import React from 'react'

export default function Mascot({ size = 92, mood = 'happy', withBook = true, className = '' }) {
  const eyeY = mood === 'thinking' ? 67 : 66
  return (
    <div className={className} aria-label="Bunny English mascot">
      <svg viewBox="0 0 150 150" width={size} height={size} role="img">
        <defs>
          <linearGradient id="fur" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#f5eee6"/></linearGradient>
          <linearGradient id="book" x1="0" x2="1"><stop offset="0" stopColor="#3e88ff"/><stop offset="1" stopColor="#1460dc"/></linearGradient>
        </defs>
        <ellipse cx="75" cy="135" rx="43" ry="7" fill="#cfe4f4" opacity=".65" />
        <ellipse cx="52" cy="34" rx="15" ry="35" fill="url(#fur)" stroke="#e8ded4" strokeWidth="2" transform="rotate(-10 52 34)"/>
        <ellipse cx="99" cy="34" rx="15" ry="35" fill="url(#fur)" stroke="#e8ded4" strokeWidth="2" transform="rotate(10 99 34)"/>
        <ellipse cx="52" cy="35" rx="6.5" ry="24" fill="#ff9d9d" opacity=".72" transform="rotate(-10 52 35)"/>
        <ellipse cx="99" cy="35" rx="6.5" ry="24" fill="#ff9d9d" opacity=".72" transform="rotate(10 99 35)"/>
        <ellipse cx="75" cy="91" rx="38" ry="42" fill="url(#fur)" stroke="#e8ded4" strokeWidth="2"/>
        <ellipse cx="75" cy="116" rx="24" ry="20" fill="#fbf7f2"/>
        <circle cx="58" cy={eyeY} r="7" fill="#2c1b15"/><circle cx="92" cy={eyeY} r="7" fill="#2c1b15"/>
        <circle cx="55.5" cy={eyeY-2.2} r="2.2" fill="#fff"/><circle cx="89.5" cy={eyeY-2.2} r="2.2" fill="#fff"/>
        <ellipse cx="47" cy="82" rx="8" ry="4.5" fill="#ffb7ad" opacity=".7"/><ellipse cx="103" cy="82" rx="8" ry="4.5" fill="#ffb7ad" opacity=".7"/>
        <path d="M70 78 Q75 73 80 78 Q75 84 70 78Z" fill="#ff6a60"/>
        {mood === 'thinking' ? <path d="M69 89 Q75 86 81 89" fill="none" stroke="#5c3d36" strokeWidth="2.2" strokeLinecap="round"/> : <path d="M67 88 Q75 98 83 88" fill="#84241e" stroke="#5c3d36" strokeWidth="1.6"/>}
        <ellipse cx="48" cy="126" rx="13" ry="7" fill="#f0e8df"/><ellipse cx="101" cy="126" rx="13" ry="7" fill="#f0e8df"/>
        <path d="M47 94 Q34 88 32 72" fill="none" stroke="#eadfd6" strokeWidth="9" strokeLinecap="round"/><path d="M103 95 Q114 97 119 108" fill="none" stroke="#eadfd6" strokeWidth="9" strokeLinecap="round"/>
        <circle cx="31.5" cy="69" r="6" fill="#fbf7f2" stroke="#e8ded4"/>
        {withBook && <g transform="translate(87 88) rotate(5)"><path d="M0 0 Q15 -7 28 1 V29 Q14 21 0 28Z" fill="url(#book)" stroke="#155ad1" strokeWidth="2"/><path d="M28 1 Q41 -7 54 0 V28 Q41 21 28 29Z" fill="url(#book)" stroke="#155ad1" strokeWidth="2"/><circle cx="18" cy="12" r="2.4" fill="#eaf3ff"/><circle cx="38" cy="12" r="2.4" fill="#eaf3ff"/><path d="M18 20 Q28 27 38 20" fill="none" stroke="#eaf3ff" strokeWidth="2" strokeLinecap="round"/></g>}
        {mood === 'thinking' && <g fill="#2f7df4"><circle cx="118" cy="44" r="2.6"/><text x="114" y="38" fontSize="22" fontWeight="800">?</text></g>}
      </svg>
    </div>
  )
}
