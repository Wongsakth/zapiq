import React, { useState, useEffect, useCallback, useRef } from 'react'
import { LEVEL_CONFIG } from '../utils/levelConfig'
import Timer from '../components/ui/Timer'

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

function generateEquation(operations, numRange) {
  const [min, max] = numRange
  const op = operations[Math.floor(Math.random() * operations.length)]
  let a, b, answer

  if (op === '+') {
    a = randBetween(min, max)
    b = randBetween(min, max)
    answer = a + b
  } else if (op === '-') {
    a = randBetween(min + 1, max)
    b = randBetween(min, a)
    answer = a - b
  } else if (op === '×') {
    a = randBetween(1, Math.min(max, 12))
    b = randBetween(1, Math.min(max, 12))
    answer = a * b
  } else {
    // Division: generate clean divisions
    b = randBetween(2, Math.min(max, 10))
    answer = randBetween(1, Math.min(max, 10))
    a = b * answer
  }

  // Generate wrong answers
  const wrongs = new Set()
  while (wrongs.size < 3) {
    const delta = randBetween(1, 8) * (Math.random() < 0.5 ? 1 : -1)
    const w = answer + delta
    if (w !== answer && w >= 0) wrongs.add(w)
  }

  const choices = shuffle([answer, ...Array.from(wrongs)])
  return { a, op, b, answer, choices, display: `${a} ${OP_SYMBOLS[op]} ${b}` }
}

export default function MathGame({ crownLevel, onFinish, isDemo = false }) {
  const config = LEVEL_CONFIG[crownLevel].math
  const [score, setScore] = useState(0)
  const [eq, setEq] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [expired, setExpired] = useState(false)
  const [solvedCount, setSolvedCount] = useState(0)
  const feedbackTimer = useRef(null)

  const next = useCallback(() => {
    setEq(generateEquation(config.operations, config.numRange))
  }, [crownLevel])

  useEffect(() => { next() }, [next])

  const handleChoice = useCallback((choice) => {
    if (expired || feedback || !eq) return
    clearTimeout(feedbackTimer.current)

    const correct = choice === eq.answer

    if (correct) {
      setScore(s => s + 2)
      setFeedback('correct')
      setSolvedCount(c => c + 1)
      if (isDemo && solvedCount + 1 >= 2) {
        setTimeout(() => onFinish?.(score + 2), 600)
        return
      }
    } else {
      setScore(s => Math.max(0, s + config.wrongPenalty))
      setFeedback('wrong')
    }

    feedbackTimer.current = setTimeout(() => {
      setFeedback(null)
      next()
    }, 400)
  }, [expired, feedback, eq, score, solvedCount, isDemo, config, next, onFinish])

  const handleExpire = useCallback(() => {
    setExpired(true)
    clearTimeout(feedbackTimer.current)
    setTimeout(() => onFinish?.(score), 500)
  }, [score, onFinish])

  if (!eq) return null

  const bgFeedback =
    feedback === 'correct' ? 'bg-green-500/15' :
    feedback === 'wrong' ? 'bg-red-500/15' : 'bg-transparent'

  return (
    <div className={`flex flex-col h-full transition-colors duration-200 ${bgFeedback}`}>
      <div className="px-4 pt-4 pb-2">
        {!isDemo && (
          <Timer duration={config.timeLimit} onExpire={handleExpire} paused={expired} />
        )}
        <div className="flex justify-between items-center mt-3">
          <span className="text-white/60 text-sm font-medium">Score</span>
          <span className="text-white text-2xl font-bold tabular-nums">{score}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        {/* Equation display */}
        <div className="bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-center w-full">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Solve</p>
          <p className="text-5xl font-bold text-white tabular-nums">{eq.display} = ?</p>
        </div>

        {/* Feedback */}
        <div className={`text-3xl transition-all duration-200 ${feedback ? 'opacity-100' : 'opacity-0'}`}>
          {feedback === 'correct' ? '✅' : '❌'}
        </div>
      </div>

      {/* Answer choices */}
      <div className="p-4 grid grid-cols-2 gap-3 pb-6">
        {eq.choices.map((choice) => (
          <button
            key={choice}
            onClick={() => handleChoice(choice)}
            className="
              h-16 rounded-2xl font-bold text-2xl text-white
              bg-white/10 border border-white/15
              active:scale-90 transition-transform duration-100
              hover:bg-white/15
            "
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  )
}
