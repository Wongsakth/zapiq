import React, { useState, useEffect, useCallback, useRef } from 'react'
import { GAME_COLORS, LEVEL_CONFIG } from '../utils/levelConfig'
import Timer from '../components/ui/Timer'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function TapColorGame({ crownLevel, onFinish, isDemo = false }) {
  const config = LEVEL_CONFIG[crownLevel].tapColor
  const colors = GAME_COLORS.slice(0, config.colorCount)

  const [score, setScore] = useState(0)
  const [target, setTarget] = useState(null)
  const [options, setOptions] = useState([])
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong'
  const [timerKey, setTimerKey] = useState(0)
  const [expired, setExpired] = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const feedbackTimer = useRef(null)

  const generateRound = useCallback(() => {
    const shuffled = shuffle(colors)
    const tgt = shuffled[0]
    const opts = shuffle(shuffled.slice(0, Math.min(4, colors.length)))
    if (!opts.find(c => c.name === tgt.name)) {
      opts[Math.floor(Math.random() * opts.length)] = tgt
    }
    setTarget(tgt)
    setOptions(shuffle(opts))
  }, [crownLevel])

  useEffect(() => {
    generateRound()
  }, [generateRound])

  const handleTap = useCallback((color) => {
    if (expired || feedback) return
    clearTimeout(feedbackTimer.current)

    if (color.name === target.name) {
      setScore(s => s + 1)
      setFeedback('correct')
      if (isDemo && tapCount + 1 >= 3) {
        setTimeout(() => onFinish?.(score + 1), 600)
        return
      }
    } else {
      const penalty = config.wrongPenalty
      setScore(s => Math.max(0, s + penalty))
      setFeedback('wrong')
    }

    setTapCount(t => t + 1)

    feedbackTimer.current = setTimeout(() => {
      setFeedback(null)
      generateRound()
    }, 350)
  }, [expired, feedback, target, score, tapCount, isDemo, config, generateRound, onFinish])

  const handleExpire = useCallback(() => {
    setExpired(true)
    clearTimeout(feedbackTimer.current)
    setTimeout(() => onFinish?.(score), 500)
  }, [score, onFinish])

  if (!target) return null

  const bgFeedback =
    feedback === 'correct'
      ? 'bg-green-500/20'
      : feedback === 'wrong'
      ? 'bg-red-500/20'
      : 'bg-transparent'

  return (
    <div className={`flex flex-col h-full transition-colors duration-200 ${bgFeedback}`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        {!isDemo && (
          <Timer
            key={timerKey}
            duration={config.timeLimit}
            onExpire={handleExpire}
            paused={expired}
          />
        )}
        <div className="flex justify-between items-center mt-3">
          <span className="text-white/60 text-sm font-medium">Score</span>
          <span className="text-white text-2xl font-bold tabular-nums">{score}</span>
        </div>
      </div>

      {/* Target color prompt */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        <div className="text-center">
          <p className="text-white/50 text-sm mb-2 uppercase tracking-widest">Tap</p>
          <div
            className="px-8 py-4 rounded-2xl border-2"
            style={{ borderColor: target.hex + '80' }}
          >
            <span
              className="text-4xl font-bold"
              style={{ color: target.hex }}
            >
              {target.name.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Feedback icon */}
        <div className={`text-4xl transition-all duration-200 ${feedback ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`}>
          {feedback === 'correct' ? '✓' : feedback === 'wrong' ? '✗' : '·'}
        </div>
      </div>

      {/* Color buttons */}
      <div className="p-4 grid grid-cols-2 gap-3 pb-6">
        {options.map((color) => (
          <button
            key={color.name}
            onClick={() => handleTap(color)}
            className={`
              h-20 rounded-2xl font-bold text-white text-lg
              active:scale-90 transition-transform duration-100
              shadow-lg
              ${color.bg}
            `}
            style={{ boxShadow: `0 4px 20px ${color.hex}40` }}
          >
            {isDemo ? '' : color.name}
          </button>
        ))}
      </div>

      {isDemo && (
        <p className="text-center text-white/50 text-sm pb-4">
          Tap the <span style={{ color: target.hex }} className="font-bold">{target.name}</span> button!
        </p>
      )}
    </div>
  )
}
