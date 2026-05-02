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

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const OP_SYMBOLS = { '+': '+', '-': '−', '×': '×', '÷': '÷' }

// Fixed power pairs [base, exp, answer, displayStr]
const POW_PAIRS = [
  [2, 2, 4,  '2²'], [2, 3, 8,  '2³'], [2, 4, 16, '2⁴'],
  [3, 2, 9,  '3²'], [3, 3, 27, '3³'],
  [4, 2, 16, '4²'], [5, 2, 25, '5²'],
  [6, 2, 36, '6²'], [7, 2, 49, '7²'],
  [8, 2, 64, '8²'], [9, 2, 81, '9²'], [10, 2, 100, '10²'],
]

// Fixed sqrt pairs [radicand, answer]
const SQRT_PAIRS = [
  [4, 2], [9, 3], [16, 4], [25, 5],
  [36, 6], [49, 7], [64, 8], [81, 9], [100, 10],
]

function generateEquation(operations, numRange) {
  const [min, max] = numRange
  const op = operations[Math.floor(Math.random() * operations.length)]
  let a, b, answer, display

  if (op === 'pow') {
    const pair = POW_PAIRS[Math.floor(Math.random() * POW_PAIRS.length)]
    answer = pair[2]; display = pair[3]
  } else if (op === 'sqrt') {
    const pair = SQRT_PAIRS[Math.floor(Math.random() * SQRT_PAIRS.length)]
    answer = pair[1]; display = `√${pair[0]}`
  } else {
    if (op === '+') {
      a = randBetween(min, max); b = randBetween(min, max); answer = a + b
    } else if (op === '-') {
      a = randBetween(min + 1, max); b = randBetween(min, a); answer = a - b
    } else if (op === '×') {
      a = randBetween(1, Math.min(max, 12)); b = randBetween(1, Math.min(max, 12)); answer = a * b
    } else {
      b = randBetween(2, Math.min(max, 10)); answer = randBetween(1, Math.min(max, 10)); a = b * answer
    }
    display = `${a} ${OP_SYMBOLS[op]} ${b}`
  }

  const wrongs = new Set()
  while (wrongs.size < 3) {
    const delta = randBetween(1, 8) * (Math.random() < 0.5 ? 1 : -1)
    const w = answer + delta
    if (w !== answer && w >= 0) wrongs.add(w)
  }

  const choices = shuffle([answer, ...Array.from(wrongs)])
  return { answer, choices, display }
}

export default function MathGame({ crownLevel, onFinish, isDemo = false, timerBonus = 0, enableTick = false }) {
  const config = LEVEL_CONFIG[crownLevel].math
  const [score, setScore]             = useState(0)
  const [eq, setEq]                   = useState(null)
  const [feedback, setFeedback]       = useState(null)
  const [expired, setExpired]         = useState(false)
  const [solvedCount, setSolvedCount] = useState(0)
  const [clearing, setClearing]       = useState(false)
  const feedbackTimer = useRef(null)
  const wrongRef      = useRef(0)
  const streakRef     = useRef(0)
  const maxStreakRef  = useRef(0)
  const solvedRef     = useRef(0)

  const next = useCallback(() => {
    setEq(generateEquation(config.operations, config.numRange))
  }, [crownLevel])

  useEffect(() => { next() }, [next])

  const handleChoice = useCallback((choice) => {
    if (expired || feedback || clearing || !eq) return
    clearTimeout(feedbackTimer.current)

    const correct = choice === eq.answer

    if (correct) {
      const newScore = score + 2
      const newSolved = solvedCount + 1
      setScore(newScore)
      setFeedback('correct')
      setSolvedCount(newSolved)
      solvedRef.current = newSolved
      streakRef.current += 1
      if (streakRef.current > maxStreakRef.current) maxStreakRef.current = streakRef.current
      playSound('ding')

      if (isDemo && newSolved >= 2) {
        setTimeout(() => onFinish?.(newScore), 600)
        return
      }

      feedbackTimer.current = setTimeout(() => {
        setFeedback(null)
        setClearing(true)
        next()
        requestAnimationFrame(() => requestAnimationFrame(() => setClearing(false)))
      }, 280)
    } else {
      wrongRef.current += 1
      streakRef.current = 0
      if (config.wrongPenalty < 0) setScore(s => Math.max(0, s - 1))
      setFeedback('wrong')
      playSound('buzz')
      feedbackTimer.current = setTimeout(() => {
        setFeedback(null)
        next()
      }, 400)
    }
  }, [expired, feedback, clearing, eq, score, solvedCount, isDemo, config, next, onFinish])

  const handleExpire = useCallback(() => {
    setExpired(true)
    clearTimeout(feedbackTimer.current)
    playSound('gameOver')
    setTimeout(() => onFinish?.(score, {
      correct: solvedRef.current,
      wrong: wrongRef.current,
      maxStreak: maxStreakRef.current,
    }), 500)
  }, [score, onFinish])

  if (!eq) return null

  const flashBg =
    feedback === 'correct' ? 'bg-[#C0ECCC]/40'
    : feedback === 'wrong'  ? 'bg-[#FFD0D0]/40'
    : ''

  const CHOICE_COLORS = [
    { bg: '#E8F0FF', text: '#1A3D7A', border: '#C0CCEC' },
    { bg: '#E8FFF0', text: '#1A5A28', border: '#B0DCBC' },
    { bg: '#FFF0E8', text: '#7A3A10', border: '#E8C8A8' },
    { bg: '#F4E8FF', text: '#4A1A7A', border: '#D0B8EC' },
  ]

  return (
    <div className={`flex flex-col h-full transition-colors duration-200 ${flashBg}`}>
      <div className="px-4 pt-4 pb-2">
        {!isDemo && (
          <Timer duration={config.timeLimit + timerBonus} onExpire={handleExpire} paused={expired} enableTick={enableTick} />
        )}
        <div className="flex justify-between items-center mt-3">
          <span className="text-[#9D9AA8] text-sm font-medium">Score</span>
          <span className="text-[#2C2C2A] text-2xl font-bold tabular-nums">{score}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        {!clearing && (
          <>
            <div className="bg-white border border-[#E8E4F0] rounded-3xl px-8 py-6 text-center w-full shadow-sm">
              <p className="text-[#9D9AA8] text-xs uppercase tracking-widest mb-2">Solve</p>
              <p className="text-5xl font-bold text-[#2C2C2A] tabular-nums">{eq.display} = ?</p>
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
                className="h-16 rounded-2xl font-bold text-2xl border-2 active:scale-90 transition-transform duration-100 shadow-sm"
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
