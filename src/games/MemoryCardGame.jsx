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

// Pastel card-back colours per crown level
const CARD_BACK_COLORS = {
  silver:  { bg: '#DED8F0', border: '#C4BDE0' },
  gold:    { bg: '#F0E8C0', border: '#E0D498' },
  diamond: { bg: '#C0D8F0', border: '#A0C0E4' },
}

export default function MemoryCardGame({ crownLevel, onFinish, isDemo = false, timerBonus = 0, enableTick = false }) {
  const config      = LEVEL_CONFIG[crownLevel].memory
  const pairs       = isDemo ? 3 : config.pairs
  const cols        = 4
  const totalTime   = config.timeLimit + timerBonus

  const [deck]      = useState(() => buildDeck(pairs, MEMORY_EMOJIS))
  const [flipped, setFlipped]     = useState([])
  const [matched, setMatched]     = useState(new Set())
  const [score, setScore]         = useState(0)
  const [expired, setExpired]     = useState(false)
  const [locked, setLocked]       = useState(false)
  const [pairsFound, setPairsFound] = useState(0)
  const lockTimer     = useRef(null)
  const mismatchRef   = useRef(0)
  const pairsFoundRef = useRef(0)
  const gameStartRef  = useRef(Date.now())

  const { bg: cardBackBg, border: cardBackBorder } = CARD_BACK_COLORS[crownLevel] || CARD_BACK_COLORS.silver

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
      pairsFoundRef.current = newFound
      playSound('pop')

      lockTimer.current = setTimeout(() => {
        setFlipped([])
        setLocked(false)
        if (isDemo && newFound >= 2) { setTimeout(() => onFinish?.(newScore), 400); return }
        if (newMatched.size === deck.length) {
          const elapsed  = Math.floor((Date.now() - gameStartRef.current) / 1000)
          const timeLeft = Math.max(0, totalTime - elapsed)
          setTimeout(() => onFinish?.(newScore, {
            pairsMatched: newFound,
            totalPairs: pairs,
            mismatches: mismatchRef.current,
            completed: true,
            timeLeft,
            totalTime,
          }), 400)
        }
      }, 500)
    } else {
      mismatchRef.current += 1
      if (config.wrongPenalty < 0) setScore(s => Math.max(0, s - 1))
      playSound('buzz')
      lockTimer.current = setTimeout(() => { setFlipped([]); setLocked(false) }, 900)
    }
  }, [locked, expired, matched, flipped, deck, pairsFound, score, isDemo, config, onFinish])

  const handleExpire = useCallback(() => {
    clearTimeout(lockTimer.current)
    setExpired(true)
    playSound('gameOver')
    setTimeout(() => onFinish?.(score, {
      pairsMatched: pairsFoundRef.current,
      totalPairs: pairs,
      mismatches: mismatchRef.current,
      completed: false,
      timeLeft: 0,
      totalTime,
    }), 500)
  }, [score, pairs, totalTime, onFinish])

  useEffect(() => () => clearTimeout(lockTimer.current), [])

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2">
        {!isDemo && (
          <Timer duration={config.timeLimit + timerBonus} onExpire={handleExpire} paused={expired} enableTick={enableTick} />
        )}
        <div className="flex justify-between items-center mt-3">
          <span className="text-[#9D9AA8] text-sm">Pairs: {pairsFound}/{pairs}</span>
          <span className="text-[#2C2C2A] text-2xl font-bold tabular-nums">{score}</span>
        </div>
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
                  {/* Back face */}
                  <div
                    className="memory-face border-2 shadow-sm"
                    style={{ backgroundColor: cardBackBg, borderColor: cardBackBorder }}
                  >
                    <span className="text-lg font-bold" style={{ color: cardBackBorder }}>?</span>
                  </div>
                  {/* Front face */}
                  <div
                    className="memory-face memory-face-back border-2 bg-white shadow-sm"
                    style={{
                      borderColor: isMatchedCard ? '#A0D8B0' : '#E8E4F0',
                      backgroundColor: isMatchedCard ? '#E8F8EC' : '#FFFFFF',
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

      {isDemo && (
        <p className="text-center text-[#9D9AA8] text-sm pb-4">Tap cards to find matching pairs!</p>
      )}
    </div>
  )
}
