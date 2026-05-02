import React, { useState, useEffect, useCallback, useRef } from 'react'
import { LEVEL_CONFIG } from '../utils/levelConfig'
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

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 2-step equations with integer answers
function generateTwoStep() {
  const type = Math.floor(Math.random() * 6)
  let answer, display

  if (type === 0) {
    // (a + b) × c
    const a = rand(1, 8), b = rand(1, 8), c = rand(2, 5)
    answer = (a + b) * c
    display = `(${a}+${b})×${c}`
  } else if (type === 1) {
    // (a − b) × c
    const b = rand(1, 5), a = rand(b + 1, b + 8), c = rand(2, 5)
    answer = (a - b) * c
    display = `(${a}−${b})×${c}`
  } else if (type === 2) {
    // a × b + c
    const a = rand(2, 7), b = rand(2, 7), c = rand(1, 10)
    answer = a * b + c
    display = `${a}×${b}+${c}`
  } else if (type === 3) {
    // a × b − c
    const a = rand(2, 7), b = rand(2, 7), c = rand(1, Math.min(a * b - 1, 12))
    answer = a * b - c
    display = `${a}×${b}−${c}`
  } else if (type === 4) {
    // a ÷ b + c
    const b = rand(2, 5), q = rand(2, 6), c = rand(1, 10)
    const a = b * q
    answer = q + c
    display = `${a}÷${b}+${c}`
  } else {
    // a + b × c  (order of operations — b×c first)
    const b = rand(2, 6), c = rand(2, 6), a = rand(1, 10)
    answer = a + b * c
    display = `${a}+${b}×${c}`
  }

  const wrongs = new Set()
  while (wrongs.size < 3) {
    const delta = rand(1, 10) * (Math.random() < 0.5 ? 1 : -1)
    const w = answer + delta
    if (w !== answer && w >= 0) wrongs.add(w)
  }

  return { answer, choices: shuffle([answer, ...Array.from(wrongs)]), display }
}

export default function BossMathGame({ onFinish, timerBonus = 0, enableTick = true }) {
  const config     = LEVEL_CONFIG.boss.math
  const wrongLimit = LEVEL_CONFIG.boss.wrongLimit

  const [score, setScore]             = useState(0)
  const [eq, setEq]                   = useState(null)
  const [feedback, setFeedback]       = useState(null)
  const [expired, setExpired]         = useState(false)
  const [consecutiveWrongs, setConsecutiveWrongs] = useState(0)
  const [clearing, setClearing]       = useState(false)
  const feedbackTimer = useRef(null)

  const next = useCallback(() => {
    setEq(generateTwoStep())
  }, [])

  useEffect(() => { next() }, [next])

  const handleChoice = useCallback((choice) => {
    if (expired || feedback || clearing || !eq) return
    clearTimeout(feedbackTimer.current)

    const correct = choice === eq.answer

    if (correct) {
      const newScore = score + 2
      setScore(newScore)
      setFeedback('correct')
      setConsecutiveWrongs(0)
      playSound('ding')
      feedbackTimer.current = setTimeout(() => {
        setFeedback(null)
        setClearing(true)
        next()
        requestAnimationFrame(() => requestAnimationFrame(() => setClearing(false)))
      }, 280)
    } else {
      const newScore = Math.max(0, score - 1)
      setScore(newScore)
      setFeedback('wrong')
      playSound('buzz')
      const newWrongs = consecutiveWrongs + 1
      setConsecutiveWrongs(newWrongs)
      if (newWrongs >= wrongLimit) {
        playSound('gameOver')
        feedbackTimer.current = setTimeout(() => onFinish?.(newScore), 600)
        return
      }
      feedbackTimer.current = setTimeout(() => {
        setFeedback(null)
        next()
      }, 400)
    }
  }, [expired, feedback, clearing, eq, score, consecutiveWrongs, wrongLimit, next, onFinish])

  const handleExpire = useCallback(() => {
    setExpired(true)
    clearTimeout(feedbackTimer.current)
    playSound('gameOver')
    setTimeout(() => onFinish?.(score), 500)
  }, [score, onFinish])

  useEffect(() => () => clearTimeout(feedbackTimer.current), [])

  if (!eq) return null

  const flashBg =
    feedback === 'correct' ? 'bg-purple-900/30'
    : feedback === 'wrong'  ? 'bg-red-900/30'
    : ''

  const CHOICE_COLORS = [
    { bg: '#1E1040', text: '#A78BFA', border: '#3D1F6E' },
    { bg: '#1A0A3A', text: '#8B5CF6', border: '#2D1B69' },
    { bg: '#200C40', text: '#C4B5FD', border: '#4A1F7A' },
    { bg: '#180830', text: '#7C3AED', border: '#2A1050' },
  ]

  return (
    <div className={`flex flex-col h-full transition-colors duration-200 ${flashBg}`} style={{ background: '#1A1028' }}>
      <div className="px-4 pt-4 pb-2">
        <Timer duration={config.timeLimit + timerBonus} onExpire={handleExpire} paused={expired} enableTick={enableTick} />
        <div className="flex justify-between items-center mt-3">
          <span className="text-purple-400 text-sm font-medium">Score</span>
          <span className="text-white text-2xl font-bold tabular-nums">{score}</span>
        </div>
        {consecutiveWrongs > 0 && (
          <div className="flex gap-1 mt-1 justify-end">
            {Array.from({ length: wrongLimit }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < consecutiveWrongs ? 'bg-red-400' : 'bg-white/20'}`} />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        {!clearing && (
          <>
            <div className="rounded-3xl px-8 py-6 text-center w-full border-2 border-purple-800" style={{ background: '#2D1B50' }}>
              <p className="text-purple-400 text-xs uppercase tracking-widest mb-2">Solve</p>
              <p className="text-4xl font-bold text-white tabular-nums">{eq.display} = ?</p>
            </div>
            <div className={`text-3xl transition-opacity duration-200 ${feedback === 'correct' ? 'opacity-100' : 'opacity-0'}`}>
              ✅
            </div>
          </>
        )}
      </div>

      {!clearing && (
        <div className="p-4 grid grid-cols-2 gap-3 pb-6">
          {eq.choices.map((choice, i) => {
            const c = CHOICE_COLORS[i % CHOICE_COLORS.length]
            return (
              <button
                key={choice}
                onClick={() => handleChoice(choice)}
                className="h-16 rounded-2xl font-bold text-2xl border-2 active:scale-90 transition-transform duration-100"
                style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
              >
                {choice}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
