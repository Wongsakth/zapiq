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

// Stroop round: target is a word; buttons show words in mismatched ink+bg colors
function generateStroopRound(colors) {
  const words  = shuffle([...colors])
  const bgs    = shuffle([...colors])
  const inks   = shuffle([...colors])

  const options = words.slice(0, 4).map((wordColor, i) => {
    // Ensure bg ≠ word and ink ≠ word
    let bgIdx  = i
    let inkIdx = (i + 2) % colors.length
    while (bgs[bgIdx].name === wordColor.name)   bgIdx  = (bgIdx  + 1) % colors.length
    while (inks[inkIdx].name === wordColor.name) inkIdx = (inkIdx + 1) % colors.length

    return {
      word:        wordColor.name,
      bg:          bgs[bgIdx].bg,
      borderColor: bgs[bgIdx].borderColor,
      textColor:   inks[inkIdx].textColor,
    }
  })

  // Target is one of the option words; show it in neutral styling
  const targetIdx  = Math.floor(Math.random() * options.length)
  const targetWord = options[targetIdx].word

  return { targetWord, options: shuffle(options) }
}

export default function BossTapColorGame({ onFinish, timerBonus = 0, enableTick = true }) {
  const config    = LEVEL_CONFIG.boss.tapColor
  const wrongLimit = LEVEL_CONFIG.boss.wrongLimit

  const [score, setScore]             = useState(0)
  const [round, setRound]             = useState(null)
  const [feedback, setFeedback]       = useState(null)
  const [expired, setExpired]         = useState(false)
  const [consecutiveWrongs, setConsecutiveWrongs] = useState(0)
  const feedbackTimer = useRef(null)

  const nextRound = useCallback(() => {
    setRound(generateStroopRound(GAME_COLORS))
  }, [])

  useEffect(() => { nextRound() }, [nextRound])

  const handleTap = useCallback((option) => {
    if (expired || feedback || !round) return
    clearTimeout(feedbackTimer.current)

    const correct = option.word === round.targetWord

    if (correct) {
      setScore(s => s + 1)
      setFeedback('correct')
      setConsecutiveWrongs(0)
      playSound('ding')
      feedbackTimer.current = setTimeout(() => {
        setFeedback(null)
        nextRound()
      }, 350)
    } else {
      setScore(s => Math.max(0, s - 1))
      setFeedback('wrong')
      playSound('buzz')
      const newWrongs = consecutiveWrongs + 1
      setConsecutiveWrongs(newWrongs)
      if (newWrongs >= wrongLimit) {
        playSound('gameOver')
        feedbackTimer.current = setTimeout(() => onFinish?.(Math.max(0, score - 1)), 600)
        return
      }
      feedbackTimer.current = setTimeout(() => {
        setFeedback(null)
        nextRound()
      }, 350)
    }
  }, [expired, feedback, round, score, consecutiveWrongs, wrongLimit, nextRound, onFinish])

  const handleExpire = useCallback(() => {
    setExpired(true)
    clearTimeout(feedbackTimer.current)
    playSound('gameOver')
    setTimeout(() => onFinish?.(score), 500)
  }, [score, onFinish])

  useEffect(() => () => clearTimeout(feedbackTimer.current), [])

  if (!round) return null

  const flashBg =
    feedback === 'correct' ? 'bg-purple-900/30'
    : feedback === 'wrong'  ? 'bg-red-900/30'
    : ''

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

      {/* Stroop instruction */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        <div className="text-center">
          <p className="text-purple-400 text-xs mb-3 uppercase tracking-widest">Tap the WORD</p>
          <div className="px-10 py-5 rounded-3xl border-2 border-purple-700 bg-[#2D1B50]">
            <span className="text-4xl font-bold text-white tracking-wide">
              {round.targetWord.toUpperCase()}
            </span>
          </div>
          <p className="text-purple-500 text-xs mt-3">Find the button that says this word — ignore the colors!</p>
        </div>

        <div className={`text-4xl transition-all duration-200 ${feedback ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`}>
          {feedback === 'correct' ? '✓' : feedback === 'wrong' ? '✗' : '·'}
        </div>
      </div>

      {/* Stroop buttons */}
      <div className="p-4 grid grid-cols-2 gap-3 pb-6">
        {round.options.map((opt, i) => (
          <button
            key={`${opt.word}-${i}`}
            onClick={() => handleTap(opt)}
            className="h-20 rounded-2xl font-bold text-xl active:scale-90 transition-transform duration-100 border-2 shadow-sm"
            style={{
              backgroundColor: opt.bg,
              color: opt.textColor,
              borderColor: opt.borderColor,
            }}
          >
            {opt.word}
          </button>
        ))}
      </div>
    </div>
  )
}
