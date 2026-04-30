import React, { useState } from 'react'
import useGameStore from '../store/gameStore'
import { LEVEL_CONFIG, GAMES } from '../utils/levelConfig'
import TapColorGame from '../games/TapColorGame'
import MathGame from '../games/MathGame'
import MemoryCardGame from '../games/MemoryCardGame'

const GAME_ORDER = ['tapcolor', 'math', 'memory']

export default function PassPlayGameScreen() {
  const {
    crownLevel,
    ppPlayers, ppCurrentPlayer, ppCurrentGameIndex,
    submitPPGameScore, navigateTo,
  } = useGameStore()
  const cfg = LEVEL_CONFIG[crownLevel]
  const [transitioning, setTransitioning] = useState(false)

  const gameId = GAME_ORDER[ppCurrentGameIndex]
  const currentGame = GAMES.find(g => g.id === gameId)
  const playerName = ppPlayers[ppCurrentPlayer]

  const GameComp = gameId === 'tapcolor' ? TapColorGame
    : gameId === 'math' ? MathGame
    : MemoryCardGame

  const handleFinish = (score) => {
    setTransitioning(true)
    setTimeout(() => {
      submitPPGameScore(score)
      setTransitioning(false)
    }, 400)
  }

  return (
    <div className={`flex flex-col h-full ${cfg.theme.bg}`}>
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-white/5">
        <button
          onClick={() => navigateTo('home')}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          ✕
        </button>
        <div className="text-center">
          <p className="text-white font-bold">{playerName}'s Turn</p>
          <p className="text-white/40 text-xs">{currentGame?.emoji} {currentGame?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-xs">Game {ppCurrentGameIndex + 1}/3</p>
          <p className="text-white/40 text-xs">P{ppCurrentPlayer + 1}/{ppPlayers.length}</p>
        </div>
      </div>

      <div className={`flex-1 transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
        <GameComp
          key={`pp-${ppCurrentPlayer}-${ppCurrentGameIndex}`}
          crownLevel={crownLevel}
          onFinish={handleFinish}
        />
      </div>
    </div>
  )
}
