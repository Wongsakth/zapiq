import React, { useEffect, useRef, useState } from 'react'

export default function Timer({ duration, onExpire, paused = false, className = '' }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const intervalRef = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    setTimeLeft(duration)
    startedRef.current = false
  }, [duration])

  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current)
      return
    }

    if (timeLeft <= 0) {
      onExpire?.()
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          onExpire?.()
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [paused, onExpire])

  const pct = (timeLeft / duration) * 100
  const isWarning = timeLeft <= Math.floor(duration * 0.3)
  const isCritical = timeLeft <= 3

  const barColor = isCritical
    ? 'bg-red-500'
    : isWarning
    ? 'bg-orange-400'
    : 'bg-emerald-400'

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white/50 font-medium">TIME</span>
        <span
          className={`text-sm font-bold tabular-nums transition-colors duration-300 ${
            isCritical ? 'text-red-400 animate-pulse' : isWarning ? 'text-orange-400' : 'text-white'
          }`}
        >
          {timeLeft}s
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full timer-bar transition-colors duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
