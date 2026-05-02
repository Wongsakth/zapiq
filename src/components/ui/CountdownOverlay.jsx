import React, { useState, useEffect } from 'react'
import { playSound } from '../../utils/soundPlayer'

const STEPS    = ['3', '2', '1', 'GO!']
const DURATIONS = [800, 800, 800, 400]   // ms each step is visible

export default function CountdownOverlay({ onDone, isBoss = false }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    playSound(step < 3 ? 'countdownTick' : 'countdownGo')

    const id = setTimeout(() => {
      if (step < STEPS.length - 1) {
        setStep(s => s + 1)
      } else {
        onDone()
      }
    }, DURATIONS[step])

    return () => clearTimeout(id)
  }, [step])   // eslint-disable-line react-hooks/exhaustive-deps

  const isGo = step === 3

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isBoss ? 'rgba(26,10,58,0.88)' : 'rgba(0,0,0,0.62)',
        pointerEvents: 'all',
      }}
    >
      <span
        key={step}
        className="countdown-num"
        style={{
          '--cd-dur': `${DURATIONS[step]}ms`,
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: isGo ? 80 : 120,
          color: isGo
            ? (isBoss ? '#C4B5FD' : '#A8D5A2')
            : '#FFFFFF',
          letterSpacing: isGo ? '0.06em' : '0',
          textShadow: isBoss
            ? '0 0 48px rgba(139,92,246,0.9)'
            : '0 4px 32px rgba(0,0,0,0.6)',
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        {STEPS[step]}
      </span>
    </div>
  )
}
