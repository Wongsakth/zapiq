import React, { useEffect, useRef, useState } from 'react'
import { playSound } from '../../utils/soundPlayer'

export default function Timer({ duration, onExpire, paused = false, className = '', enableTick = false }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const onExpireRef  = useRef(onExpire)
  const firedRef     = useRef(false)
  const lastTickRef  = useRef(null)
  onExpireRef.current = onExpire

  useEffect(() => {
    setTimeLeft(duration)
    firedRef.current    = false
    lastTickRef.current = null
  }, [duration])

  useEffect(() => {
    if (paused || timeLeft <= 0) return
    const id = setTimeout(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, paused])

  useEffect(() => {
    if (timeLeft <= 0 && !firedRef.current) {
      firedRef.current = true
      onExpireRef.current?.()
    }
  }, [timeLeft])

  // Tick sound at 4, 3, 2, 1 seconds (Gold+ only)
  useEffect(() => {
    if (!enableTick || paused || timeLeft <= 0 || timeLeft > 4) return
    if (lastTickRef.current !== timeLeft) {
      lastTickRef.current = timeLeft
      playSound('tick')
    }
  }, [timeLeft, enableTick, paused])

  const pct        = Math.max(0, (timeLeft / duration) * 100)
  const isWarning  = timeLeft <= Math.ceil(duration * 0.3)
  const isCritical = timeLeft <= 3
  const isTicking  = enableTick && timeLeft <= 4 && timeLeft > 0 && !paused

  const barColor = isCritical ? 'bg-red-400' : isWarning ? 'bg-orange-400' : 'bg-[#A8D5A2]'

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[#9D9AA8] font-medium uppercase tracking-wider">Time</span>
        <span
          className={`text-sm font-bold tabular-nums transition-colors duration-300 ${
            isTicking ? 'text-red-500 timer-shake'
            : isCritical ? 'text-red-500'
            : isWarning  ? 'text-orange-500'
            : 'text-[#2C2C2A]'
          }`}
        >
          {timeLeft}s
        </span>
      </div>
      <div className="h-2 bg-[#E8E4F0] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-colors duration-500 ${barColor}`}
          style={{ width: `${pct}%`, transition: 'width 1s linear, background-color 0.5s ease' }}
        />
      </div>
    </div>
  )
}
