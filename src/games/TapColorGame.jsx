import React, { useState, useEffect, useCallback, useRef } from 'react'
import { GAME_COLORS, LEVEL_CONFIG } from '../utils/levelConfig'
import Timer from '../components/ui/Timer'
import { playSound } from '../utils/soundPlayer'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function TapColorGame({ crownLevel, onFinish, isDemo = false, timerBonus = 0, enableTick = false }) {
  const config = LEVEL_CONFIG[crownLevel].tapColor
  const colors = GAME_COLORS.slice(0, config.colorCount)

  const [score, setScore]       = useState(0)
  const [target, setTarget]     = useState(null)
  const [options, setOptions]   = useState([])
  const [feedback, setFeedback] = useState(null)
  const [expired, setExpired]   = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const feedbackTimer = useRef(null)
  const correctRef    = useRef(0)
  const wrongRef      = useRef(0)

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

  useEffect(() => { generateRound() }, [generateRound])

  const handleTap = useCallback((color) => {
    if (expired || feedback) return
    clearTimeout(feedbackTimer.current)

    if (color.name === target.name) {
      correctRef.current += 1
      setScore(s => s + 1)
      setFeedback('correct')
      playSound('ding')
      if (isDemo && tapCount + 1 >= 3) {
        setTimeout(() => onFinish?.(score + 1), 600)
        return
      }
    } else {
      wrongRef.current += 1
      if (config.wrongPenalty < 0) setScore(s => Math.max(0, s - 1))
      setFeedback('wrong')
      playSound('buzz')
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
    playSound('gameOver')
    setTimeout(() => onFinish?.(score, { correct: correctRef.current, wrong: wrongRef.current }), 500)
  }, [score, onFinish])

  if (!target) return null

  const flashBg =
    feedback === 'correct' ? 'bg-[#C0ECCC]/50'
    : feedback === 'wrong'  ? 'bg-[#FFD0D0]/50'
    : ''

  return (
    <div className={`flex flex-col h-full transition-colors duration-200 ${flashBg}`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        {!isDemo && (
          <Timer duration={config.timeLimit + timerBonus} onExpire={handleExpire} paused={expired} enableTick={enableTick} />
        )}
        <div className="flex justify-between items-center mt-3">
          <span className="text-[#9D9AA8] text-sm font-medium">Score</span>
          <span className="text-[#2C2C2A] text-2xl font-bold tabular-nums">{score}</span>
        </div>
      </div>

      {/* Target prompt */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        <div className="text-center">
          <p className="text-[#9D9AA8] text-xs mb-3 uppercase tracking-widest">Tap the color</p>
          <div
            className="px-10 py-5 rounded-3xl border-2 bg-white shadow-sm"
            style={{ borderColor: target.borderColor }}
          >
            <span className="text-4xl font-bold" style={{ color: target.textColor }}>
              {target.name.toUpperCase()}
            </span>
          </div>
        </div>

        <div className={`text-4xl transition-all duration-200 ${feedback ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`}>
          {feedback === 'correct' ? '✓' : feedback === 'wrong' ? '✗' : '·'}
        </div>
      </div>

      {/* Pastel color buttons */}
      <div className="p-4 grid grid-cols-2 gap-3 pb-6">
        {options.map((color) => (
          <button
            key={color.name}
            onClick={() => handleTap(color)}
            className="h-20 rounded-2xl font-bold text-lg active:scale-90 transition-transform duration-100 border-2 shadow-sm"
            style={{
              backgroundColor: color.bg,
              color: color.textColor,
              borderColor: color.borderColor,
            }}
          >
            {/* Silver shows text labels; Gold/Diamond show solid color only */}
            {(!isDemo && crownLevel === 'silver') ? color.name : ''}
          </button>
        ))}
      </div>

      {isDemo && (
        <p className="text-center text-[#9D9AA8] text-sm pb-4">
          Tap the{' '}
          <span style={{ color: target.textColor }} className="font-bold">{target.name}</span>{' '}
          button!
        </p>
      )}
    </div>
  )
}
