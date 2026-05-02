import React, { useState, useCallback, useRef, useEffect } from 'react'
import { LEVEL_CONFIG, MEMORY_EMOJIS } from '../utils/levelConfig'
import Timer from '../components/ui/Timer'
import { playSound } from '../utils/soundPlayer'

function buildDeck(pairs, emojis) {
  const items = emojis.slice(0, pairs).flatMap((e, i) => [
    { id: i * 2,     emoji: e, pairId: i },
    { id: i * 2 + 1, emoji: e, pairId: i },
  ])
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

export default function BossMemoryGame({ onFinish, timerBonus = 0, flipBackDelay = 500, enableTick = true }) {
  const config     = LEVEL_CONFIG.boss.memory
  const wrongLimit = LEVEL_CONFIG.boss.wrongLimit
  const pairs      = config.pairs
  const cols       = 4

  const [deck]      = useState(() => buildDeck(pairs, MEMORY_EMOJIS))
  const [flipped, setFlipped]             = useState([])
  const [matched, setMatched]             = useState(new Set())
  const [score, setScore]                 = useState(0)
  const [expired, setExpired]             = useState(false)
  const [locked, setLocked]               = useState(false)
  const [pairsFound, setPairsFound]       = useState(0)
  const [consecutiveWrongs, setConsecutiveWrongs] = useState(0)
  const lockTimer = useRef(null)

  const handleCardTap = useCallback((idx) => {
    if (locked || expired || matched.has(idx) || flipped.includes(idx)) return

    const newFlipped = [...flipped, idx]
    if (newFlipped.length === 1) { setFlipped(newFlipped); playSound('flip'); return }

    setFlipped(newFlipped)
    setLocked(true)

    const [a, b] = newFlipped
    if (deck[a].pairId === deck[b].pairId) {
      const newMatched = new Set([...matched, a, b])
      const newFound   = pairsFound + 1
      const newScore   = score + 2

      setMatched(newMatched)
      setScore(newScore)
      setPairsFound(newFound)
      setConsecutiveWrongs(0)
      playSound('pop')

      lockTimer.current = setTimeout(() => {
        setFlipped([])
        setLocked(false)
        if (newMatched.size === deck.length) { setTimeout(() => onFinish?.(newScore), 400) }
      }, 400)
    } else {
      const newScore = config.wrongPenalty < 0 ? Math.max(0, score + config.wrongPenalty) : score
      setScore(newScore)
      playSound('buzz')
      const newWrongs = consecutiveWrongs + 1
      setConsecutiveWrongs(newWrongs)

      if (newWrongs >= wrongLimit) {
        playSound('gameOver')
        lockTimer.current = setTimeout(() => onFinish?.(newScore), 700)
        return
      }

      // Flip-back delay (default 500ms, prestige ×3+ uses 700ms for easier play)
      lockTimer.current = setTimeout(() => {
        setFlipped([])
        setLocked(false)
      }, flipBackDelay)
    }
  }, [locked, expired, matched, flipped, deck, pairsFound, score, consecutiveWrongs, wrongLimit, config, onFinish])

  const handleExpire = useCallback(() => {
    clearTimeout(lockTimer.current)
    setExpired(true)
    playSound('gameOver')
    setTimeout(() => onFinish?.(score), 500)
  }, [score, onFinish])

  useEffect(() => () => clearTimeout(lockTimer.current), [])

  return (
    <div className="flex flex-col h-full" style={{ background: '#1A1028' }}>
      <div className="px-4 pt-4 pb-2">
        <Timer duration={config.timeLimit + timerBonus} onExpire={handleExpire} paused={expired} enableTick={enableTick} />
        <div className="flex justify-between items-center mt-3">
          <span className="text-purple-400 text-sm">Pairs: {pairsFound}/{pairs}</span>
          <span className="text-white text-2xl font-bold tabular-nums">{score}</span>
        </div>
        {consecutiveWrongs > 0 && (
          <div className="flex gap-1 mt-1 justify-end">
            {Array.from({ length: wrongLimit }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < consecutiveWrongs ? 'bg-red-400' : 'bg-white/20'}`} />
            ))}
          </div>
        )}
        <p className="text-purple-500 text-xs text-center mt-1">Cards flip back in {flipBackDelay / 1000}s!</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-3">
        <div
          className="grid gap-2 w-full"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {deck.map((card, idx) => {
            const isFaceUp      = flipped.includes(idx) || matched.has(idx)
            const isMatchedCard = matched.has(idx)

            return (
              <div key={card.id} className="memory-scene aspect-square" onClick={() => handleCardTap(idx)}>
                <div className={`memory-card-inner ${isFaceUp ? 'flipped' : ''}`}>
                  {/* Back face — dark obsidian */}
                  <div
                    className="memory-face border-2"
                    style={{ backgroundColor: '#2D1B50', borderColor: '#4A2A7C' }}
                  >
                    <span className="text-lg font-bold" style={{ color: '#8B5CF6' }}>?</span>
                  </div>
                  {/* Front face */}
                  <div
                    className="memory-face memory-face-back border-2"
                    style={{
                      borderColor: isMatchedCard ? '#8B5CF6' : '#3D1F6E',
                      backgroundColor: isMatchedCard ? '#2D1B50' : '#1A0A3A',
                    }}
                  >
                    <span className="text-3xl leading-none">{card.emoji}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
