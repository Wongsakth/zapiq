import React, { useState } from 'react'
import useGameStore from '../store/gameStore'
import { LEVEL_CONFIG, GAMES } from '../utils/levelConfig'
import TapColorGame from '../games/TapColorGame'
import MathGame from '../games/MathGame'
import MemoryCardGame from '../games/MemoryCardGame'

const GAME_ORDER = ['tapcolor', 'math', 'memory']

function GameBadge({ games, current }) {
  return (
    <div className="flex gap-2 justify-center">
      {games.map((g, i) => (
        <div
          key={g.id}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
            i === current
              ? 'bg-white/20 text-white scale-110'
              : i < current
              ? 'bg-white/10 text-white/50 line-through'
              : 'bg-white/5 text-white/30'
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
    crownLevel, gameMode, selectedGame,
    comboGameIndex, sessionScores,
    submitGameScore, navigateTo,
  } = useGameStore()
  const cfg = LEVEL_CONFIG[crownLevel]

  const [transitioning, setTransitioning] = useState(false)

  const gameId = gameMode === 'combo'
    ? GAME_ORDER[comboGameIndex]
    : selectedGame

  const currentGame = GAMES.find(g => g.id === gameId)

  const handleGameFinish = (score) => {
    setTransitioning(true)
    setTimeout(() => {
      submitGameScore(score)
      setTransitioning(false)
    }, 400)
  }

  const GameComp = gameId === 'tapcolor' ? TapColorGame
    : gameId === 'math' ? MathGame
    : MemoryCardGame

  const totalSoFar = sessionScores.reduce((a, b) => a + b, 0)

  return (
    <div className={`flex flex-col h-full ${cfg.theme.bg}`}>
      {/* Top nav */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-white/5">
        <button
          onClick={() => navigateTo('home')}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-lg active:scale-90 transition-transform"
        >
          ✕
        </button>

        {gameMode === 'combo' && (
          <div className="flex-1 mx-2">
            <GameBadge games={GAMES} current={comboGameIndex} />
          </div>
        )}

        {gameMode === 'single' && (
          <span className="text-white font-bold">{currentGame?.emoji} {currentGame?.name}</span>
        )}

        {gameMode === 'combo' && (
          <div className="text-right min-w-[48px]">
            <p className="text-white/40 text-xs">Total</p>
            <p className="text-white font-bold tabular-nums">{totalSoFar}</p>
          </div>
        )}
        {gameMode === 'single' && <div className="w-9" />}
      </div>

      {/* Game area */}
      <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
        {GameComp && (
          <GameComp
            key={`${gameId}-${comboGameIndex}`}
            crownLevel={crownLevel}
            onFinish={handleGameFinish}
          />
        )}
      </div>
    </div>
  )
}
