import React, { useMemo } from 'react'
import Crown from './Crown'
import { LEVEL_CONFIG } from '../../utils/levelConfig'

const PALETTE = [
  '#FFD700','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4',
  '#FFEAA7','#DDA0DD','#98D8C8','#F08080','#FFB347',
  '#87CEEB','#98FB98','#C8A0FF','#E0E0E0','#FFCC80',
]

function mkSparks(count, radius, baseDelay) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const r     = radius + (Math.random() - 0.5) * 28
    return {
      id:    i,
      tx:    Math.cos(angle) * r,
      ty:    Math.sin(angle) * r,
      delay: baseDelay + Math.random() * 0.18,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      size:  3.5 + Math.random() * 5.5,
    }
  })
}

function SparkBurst({ sparks }) {
  return sparks.map(sp => (
    <div
      key={sp.id}
      style={{
        position:        'absolute',
        top:             '50%',
        left:            '50%',
        width:           sp.size,
        height:          sp.size,
        marginTop:       -(sp.size / 2),
        marginLeft:      -(sp.size / 2),
        borderRadius:    '50%',
        backgroundColor: sp.color,
        pointerEvents:   'none',
        '--tx':          `${sp.tx.toFixed(1)}px`,
        '--ty':          `${sp.ty.toFixed(1)}px`,
        animation:       `sparkle-burst 1.0s ${sp.delay.toFixed(2)}s cubic-bezier(0.1,0.8,0.3,1) forwards`,
        opacity:         0,
      }}
    />
  ))
}

export default function LevelUpCelebration({ level, onDismiss }) {
  const isObsidian = level === 'obsidian'
  const cfg        = LEVEL_CONFIG[isObsidian ? 'boss' : level] || LEVEL_CONFIG.gold
  const levelName  = isObsidian ? 'Obsidian' : cfg.name

  const confetti = useMemo(() => Array.from({ length: 65 }, (_, i) => ({
    id:     i,
    left:   Math.random() * 100,
    sway:   (Math.random() - 0.5) * 90,
    delay:  Math.random() * 1.6,
    dur:    2.6 + Math.random() * 2.2,
    color:  PALETTE[i % PALETTE.length],
    w:      6 + Math.random() * 9,
    h:      3 + Math.random() * 5,
    rot:    Math.floor(Math.random() * 360),
    circle: Math.random() > 0.5,
  })), [])

  const sparks1 = useMemo(() => mkSparks(14,  90, 0.05), [])
  const sparks2 = useMemo(() => mkSparks(10, 130, 0.55), [])

  const rings = [0, 0.22, 0.44]
  const ringColor = isObsidian ? '#8B5CF6' : '#FFD700'
  const btnCls = isObsidian
    ? 'bg-purple-700 text-white'
    : 'bg-[#A8D5A2] text-[#1A4D1A]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">

      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: isObsidian
            ? 'linear-gradient(160deg,#0F0620 0%,#1A0A3A 100%)'
            : 'rgba(8,8,20,0.91)',
          animation: 'fadeIn 0.3s ease-out',
        }}
      />

      {/* Confetti layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map(p => (
          <div
            key={p.id}
            style={{
              position:        'absolute',
              top:             0,
              left:            `${p.left}%`,
              width:           p.circle ? p.w : p.w,
              height:          p.circle ? p.w : p.h,
              borderRadius:    p.circle ? '50%' : '2px',
              backgroundColor: p.color,
              '--sway':        `${p.sway.toFixed(1)}px`,
              animation:       `confetti-fall ${p.dur.toFixed(2)}s ${p.delay.toFixed(2)}s ease-in forwards`,
              transform:       `rotate(${p.rot}deg)`,
              opacity:         1,
            }}
          />
        ))}
      </div>

      {/* Central card */}
      <div className="relative z-10 text-center px-6 max-w-[320px] w-full">

        {/* Crown zone */}
        <div className="relative flex items-center justify-center mb-4" style={{ height: 195 }}>

          {/* Expanding ring pulses */}
          {rings.map(d => (
            <div key={d} style={{ position: 'absolute', top: '50%', left: '50%' }}>
              <div
                style={{
                  position:     'absolute',
                  width:        144,
                  height:       144,
                  top:          -72,
                  left:         -72,
                  borderRadius: '50%',
                  border:       `2.5px solid ${ringColor}`,
                  animation:    `shimmer-ring-expand 1.15s ${d}s ease-out forwards`,
                  opacity:      0,
                }}
              />
            </div>
          ))}

          {/* Sparkle burst wave 1 */}
          <SparkBurst sparks={sparks1} />
          {/* Sparkle burst wave 2 */}
          <SparkBurst sparks={sparks2} />

          {/* Crown — bounces in */}
          <div
            style={{
              animation: 'crown-bounce-in 0.8s cubic-bezier(0.34,1.56,0.64,1) both',
              filter: isObsidian
                ? 'drop-shadow(0 0 30px rgba(139,92,246,0.9))'
                : level === 'diamond'
                  ? 'drop-shadow(0 0 28px rgba(0,180,255,0.8))'
                  : 'drop-shadow(0 0 24px rgba(220,170,20,0.85))',
            }}
          >
            <Crown level={level} size={120} animated />
          </div>
        </div>

        {/* Text block */}
        <div style={{ animation: 'celebration-text-in 0.5s 0.45s ease-out both', maxWidth: '90vw', overflow: 'hidden' }}>
          <p
            className="font-syne font-extrabold text-white tracking-tight mb-1"
            style={{ fontSize: 16, wordBreak: 'break-word', overflowWrap: 'break-word' }}
          >
            CROWN UP!
          </p>
          <p className={`font-syne font-bold text-2xl mb-1 ${cfg.theme.shimmer}`}>
            {cfg.label}
          </p>
          <p className="text-white/55 mb-7" style={{ fontSize: 9, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            You reached {levelName} Crown!
          </p>
        </div>

        {/* Button */}
        <div style={{ animation: 'celebration-text-in 0.5s 0.75s ease-out both' }}>
          <button
            onClick={onDismiss}
            className={`w-full py-4 rounded-2xl font-bold text-xl active:scale-95 transition-transform shadow-lg ${btnCls}`}
          >
            Awesome! 🎉
          </button>
        </div>

      </div>
    </div>
  )
}
