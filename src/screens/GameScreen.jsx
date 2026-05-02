import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import useGameStore from '../store/gameStore'
import { LEVEL_CONFIG, GAMES, CROWN_LEVELS } from '../utils/levelConfig'
import { getPrestigeBonus } from '../utils/prestigeUtils'
import TapColorGame from '../games/TapColorGame'
import MathGame from '../games/MathGame'
import MemoryCardGame from '../games/MemoryCardGame'
import BossTapColorGame from '../games/BossTapColorGame'
import BossMathGame from '../games/BossMathGame'
import BossMemoryGame from '../games/BossMemoryGame'
import CountdownOverlay from '../components/ui/CountdownOverlay'

const GAME_ORDER = ['tapcolor', 'math', 'memory']

function GameBadge({ games, current, isBoss }) {
  return (
    <div className="flex gap-2 justify-center">
      {games.map((g, i) => (
        <div
          key={g.id}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
            i === current
              ? isBoss
                ? 'bg-purple-800 text-purple-100 scale-110'
                : 'bg-[#A8D5A2]/40 text-[#1A4D1A] scale-110'
              : i < current
              ? isBoss
                ? 'bg-white/10 text-white/40 line-through'
                : 'bg-[#E8E4F0] text-[#9D9AA8] line-through'
              : isBoss
              ? 'bg-white/5 text-white/30'
              : 'bg-gray-50 text-[#9D9AA8]'
          }`}
        >
          {g.emoji} {g.name}
        </div>
      ))}
    </div>
  )
}

export default function GameScreen() {
  const {
    crownLevel, selectedLevel, gameMode, selectedGame,
    comboGameIndex, sessionScores,
    submitGameScore, navigateTo,
    prestigeLevel,
  } = useGameStore()

  const isBoss     = gameMode === 'boss'
  const isCombo    = gameMode === 'combo' || isBoss
  const playLevel  = isBoss ? crownLevel : (CROWN_LEVELS.includes(selectedLevel) ? selectedLevel : crownLevel)
  const cfg        = isBoss ? LEVEL_CONFIG.boss : LEVEL_CONFIG[playLevel]
  const prestige   = getPrestigeBonus(prestigeLevel)
  const enableTick = isBoss || playLevel !== 'silver'

  const [transitioning, setTransitioning] = useState(false)
  const [countingDown, setCountingDown]   = useState(true)

  const finishedRef = useRef(false)
  useEffect(() => {
    finishedRef.current = false
  }, [comboGameIndex, selectedGame, gameMode])

  // Reset countdown before every new game — useLayoutEffect prevents a 1-frame flash
  useLayoutEffect(() => {
    setCountingDown(true)
  }, [comboGameIndex, selectedGame, gameMode])

  const gameId      = isCombo ? GAME_ORDER[comboGameIndex] : selectedGame
  const currentGame = GAMES.find(g => g.id === gameId)


  const handleGameFinish = useCallback((score, stats = null) => {
    if (finishedRef.current) return
    finishedRef.current = true
    setTransitioning(true)
    setTimeout(() => {
      submitGameScore(score, stats)
      setTransitioning(false)
    }, 300)
  }, [submitGameScore])

  // Select game component — boss mode uses boss variants
  let GameComp
  if (isBoss) {
    GameComp = gameId === 'tapcolor' ? BossTapColorGame
             : gameId === 'math'     ? BossMathGame
             :                         BossMemoryGame
  } else {
    GameComp = gameId === 'tapcolor' ? TapColorGame
             : gameId === 'math'     ? MathGame
             :                         MemoryCardGame
  }

  const totalSoFar = sessionScores.reduce((a, b) => a + b, 0)

  const navBg    = isBoss ? 'bg-[#120C20]'          : cfg.theme.bg
  const borderCl = isBoss ? 'border-purple-900'     : 'border-[#E8E4F0]'
  const closeCl  = isBoss
    ? 'bg-[#2D1B50] border border-purple-800 text-purple-300'
    : 'bg-white border border-[#E8E4F0] text-[#6B6878]'
  const titleCl  = isBoss ? 'text-white'            : 'text-[#2C2C2A]'
  const labelCl  = isBoss ? 'text-purple-400'       : 'text-[#9D9AA8]'
  const valueCl  = isBoss ? 'text-white'            : 'text-[#2C2C2A]'

  // Extra props for boss memory (prestige flip delay)
  const extraProps = isBoss && gameId === 'memory'
    ? { flipBackDelay: prestige.bossFlipDelay }
    : {}

  return (
    <div className={`flex flex-col h-full relative ${isBoss ? '' : cfg.theme.bg}`}
         style={isBoss ? { background: '#1A1028' } : {}}>
      {/* Top nav */}
      <div className={`flex items-center justify-between px-4 pt-4 pb-2 border-b ${borderCl} ${isBoss ? navBg : ''}`}>
        <button
          onClick={() => navigateTo('home')}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-lg active:scale-90 transition-transform ${closeCl}`}
        >
          ✕
        </button>

        {isCombo && (
          <div className="flex-1 mx-2">
            <GameBadge games={GAMES} current={comboGameIndex} isBoss={isBoss} />
          </div>
        )}

        {!isCombo && (
          <span className={`font-bold ${titleCl}`}>{currentGame?.emoji} {currentGame?.name}</span>
        )}

        {isCombo && (
          <div className="text-right min-w-[48px]">
            <p className={`text-xs ${labelCl}`}>Total</p>
            <p className={`font-bold tabular-nums ${valueCl}`}>{totalSoFar}</p>
          </div>
        )}
        {!isCombo && <div className="w-9" />}
      </div>

      {/* Game area */}
      <div
        className={`flex-1 overflow-hidden transition-opacity duration-300 ${
          transitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {!countingDown && (
          <GameComp
            key={`${isBoss ? 'boss' : playLevel}-${gameId}-${comboGameIndex}`}
            crownLevel={playLevel}
            onFinish={handleGameFinish}
            timerBonus={prestige.timerBonus}
            enableTick={enableTick}
            {...extraProps}
          />
        )}
      </div>

      {/* Countdown overlay — mounts before each game, blocks all interaction */}
      {countingDown && (
        <CountdownOverlay
          onDone={() => setCountingDown(false)}
          isBoss={isBoss}
        />
      )}
    </div>
  )
}
