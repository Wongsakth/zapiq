import React, { useEffect } from 'react'
import useGameStore from '../store/gameStore'
import { LEVEL_CONFIG, GAMES } from '../utils/levelConfig'

const GAME_ORDER = ['tapcolor', 'math', 'memory']

export default function PassPlayHandoffScreen() {
  const {
    crownLevel,
    ppPlayers, ppCurrentPlayer, ppCurrentGameIndex,
    ppAllScores, resumePassPlay,
  } = useGameStore()
  const cfg = LEVEL_CONFIG[crownLevel]
  const nextPlayerName = ppPlayers[ppCurrentPlayer]
  const nextGame = GAMES.find(g => g.id === GAME_ORDER[ppCurrentGameIndex])

  // Previous player (who just played)
  const prevPlayer = ppCurrentPlayer === 0 ? ppPlayers.length - 1 : ppCurrentPlayer - 1
  const prevPlayerName = ppPlayers[prevPlayer]
  const prevGameIndex = ppCurrentPlayer === 0 ? ppCurrentGameIndex - 1 : ppCurrentGameIndex
  const prevGame = GAMES.find(g => g.id === GAME_ORDER[prevGameIndex])
  const prevScore = ppAllScores[prevPlayer]?.[prevGameIndex] ?? 0

  return (
    <div className={`flex flex-col items-center justify-center h-full ${cfg.theme.bg} px-8 gap-6`}>
      {/* Previous player result */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 w-full text-center animate-fade-in">
        <p className="text-white/50 text-sm mb-1">{prevPlayerName} scored</p>
        <p className="text-white font-extrabold text-5xl tabular-nums">{prevScore}</p>
        <p className="text-white/40 text-xs mt-1">{prevGame?.emoji} {prevGame?.name}</p>
      </div>

      {/* Handoff instruction */}
      <div className="text-center">
        <div className="text-5xl mb-3 animate-bounce-in">📱</div>
        <h2 className="text-white font-bold text-2xl mb-1">
          Pass to {nextPlayerName}!
        </h2>
        <p className="text-white/50 text-sm">
          Next up: {nextGame?.emoji} {nextGame?.name}
        </p>
      </div>

      <button
        onClick={resumePassPlay}
        className={`
          w-full py-5 rounded-2xl font-bold text-xl text-black
          bg-gradient-to-r ${cfg.theme.gradient}
          active:scale-95 transition-transform
          shadow-lg
        `}
        style={{ boxShadow: `0 8px 30px ${cfg.theme.primary}40` }}
      >
        I'm Ready! 🎮
      </button>
    </div>
  )
}
