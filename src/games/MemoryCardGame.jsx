import React, { useState, useEffect, useCallback, useRef } from 'react'
import { LEVEL_CONFIG, MEMORY_EMOJIS } from '../utils/levelConfig'
import Timer from '../components/ui/Timer'

function buildDeck(pairs, emojis) {
  const items = emojis.slice(0, pairs).flatMap((e, i) => [
    { id: i * 2, emoji: e, pairId: i },
    { id: i * 2 + 1, emoji: e, pairId: i },
  ])
  // Fisher-Yates shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

const CARD_BACKS = [
  'from-violet-600 to-purple-700',
  'from-blue-600 to-indigo-700',
  'from-cyan-600 to-teal-700',
]

export default function MemoryCardGame({ crownLevel, onFinish, isDemo = false }) {
  const config = LEVEL_CONFIG[crownLevel].memory
  const pairs = isDemo ? 3 : config.pairs
  const cols = pairs <= 8 ? 4 : 4

  const [deck, setDeck] = useState(() => buildDeck(pairs, MEMORY_EMOJIS))
  const [flipped, setFlipped] = useState([])     // indices of face-up (not matched) cards
  const [matched, setMatched] = useState(new Set())
  const [score, setScore] = useState(0)
  const [expired, setExpired] = useState(false)
  const [locked, setLocked] = useState(false)
  const [pairsFound, setPairsFound] = useState(0)
  const lockTimer = useRef(null)
  const backStyle = CARD_BACKS[['silver', 'gold', 'diamond'].indexOf(crownLevel)] || CARD_BACKS[0]

  const handleCardTap = useCallback((idx) => {
    if (locked || expired || matched.has(idx) || flipped.includes(idx)) return

    const newFlipped = [...flipped, idx]

    if (newFlipped.length === 1) {
      setFlipped(newFlipped)
      return
    }

    // Two cards flipped
    setFlipped(newFlipped)
    setLocked(true)

    const [a, b] = newFlipped
    if (deck[a].pairId === deck[b].pairId) {
      // Match!
      const newMatched = new Set([...matched, a, b])
      const newFound = pairsFound + 1
      const newScore = score + 2

      setMatched(newMatched)
      setScore(newScore)
      setPairsFound(newFound)

      lockTimer.current = setTimeout(() => {
        setFlipped([])
        setLocked(false)

        if (isDemo && newFound >= 2) {
          setTimeout(() => onFinish?.(newScore), 400)
          return
        }

        if (newMatched.size === deck.length) {
          setTimeout(() => onFinish?.(newScore), 400)
        }
      }, 500)
    } else {
      // No match
      const penalty = config.wrongPenalty
      setScore(s => Math.max(0, s + penalty))

      lockTimer.current = setTimeout(() => {
        setFlipped([])
        setLocked(false)
      }, 900)
    }
  }, [locked, expired, matched, flipped, deck, pairsFound, score, isDemo, config, onFinish])

  const handleExpire = useCallback(() => {
    clearTimeout(lockTimer.current)
    setExpired(true)
    setTimeout(() => onFinish?.(score), 500)
  }, [score, onFinish])

  useEffect(() => () => clearTimeout(lockTimer.current), [])

  const rows = Math.ceil(deck.length / cols)

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2">
        {!isDemo && (
          <Timer duration={config.timeLimit} onExpire={handleExpire} paused={expired} />
        )}
        <div className="flex justify-between items-center mt-3">
          <span className="text-white/60 text-sm">Pairs: {pairsFound}/{pairs}</span>
          <span className="text-white text-2xl font-bold tabular-nums">{score}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-3">
        <div
          className="grid gap-2 w-full"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {deck.map((card, idx) => {
            const isFaceUp = flipped.includes(idx) || matched.has(idx)
            const isMatchedCard = matched.has(idx)

            return (
              <div
                key={card.id}
                className="memory-scene aspect-square"
                onClick={() => handleCardTap(idx)}
              >
                <div className={`memory-card-inner ${isFaceUp ? 'flipped' : ''}`}>
                  {/* Face down (back) */}
                  <div className={`memory-face bg-gradient-to-br ${backStyle} shadow-lg`}>
                    <span className="text-white/40 text-xl">?</span>
                  </div>
                  {/* Face up (front) */}
                  <div
                    className={`memory-face memory-face-back ${
                      isMatchedCard
                        ? 'bg-emerald-800/60 border-2 border-emerald-400'
                        : 'bg-gray-800 border-2 border-white/20'
                    } shadow-lg`}
                  >
                    <span className="text-3xl leading-none">{card.emoji}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {isDemo && (
        <p className="text-center text-white/50 text-sm pb-4">Tap cards to find matching pairs!</p>
      )}
    </div>
  )
}
