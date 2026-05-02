import React from 'react'
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

  const prevPlayer = ppCurrentPlayer === 0 ? ppPlayers.length - 1 : ppCurrentPlayer - 1
  const prevPlayerName = ppPlayers[prevPlayer]
  const prevGameIndex = ppCurrentPlayer === 0 ? ppCurrentGameIndex - 1 : ppCurrentGameIndex
  const prevGame = GAMES.find(g => g.id === GAME_ORDER[prevGameIndex])
  const prevScore = ppAllScores[prevPlayer]?.[prevGameIndex] ?? 0

  return (
    <div className={`flex flex-col items-center justify-center h-full ${cfg.theme.bg} px-8 gap-6`}>
      {/* Previous player result */}
      <div className="bg-white border border-[#E8E4F0] rounded-2xl p-5 w-full text-center animate-fade-in shadow-sm">
        <p className="text-[#9D9AA8] text-sm mb-1">{prevPlayerName} scored</p>
        <p className="text-[#2C2C2A] font-extrabold text-5xl tabular-nums">{prevScore}</p>
        <p className="text-[#9D9AA8] text-xs mt-1">{prevGame?.emoji} {prevGame?.name}</p>
      </div>

      {/* Handoff instruction */}
      <div className="text-center">
        <div className="text-5xl mb-3 animate-bounce-in">📱</div>
        <h2 className="text-[#2C2C2A] font-bold text-2xl mb-1">
          Pass to {nextPlayerName}!
        </h2>
        <p className="text-[#6B6878] text-sm">
          Next up: {nextGame?.emoji} {nextGame?.name}
        </p>
      </div>

      <button
        onClick={resumePassPlay}
        className="w-full py-5 rounded-2xl font-bold text-xl text-[#1A4D1A] bg-[#A8D5A2] active:scale-95 transition-transform shadow-sm"
      >
        I'm Ready! 🎮
      </button>
    </div>
  )
}
