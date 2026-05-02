import React from 'react'
import useGameStore from '../store/gameStore'
import { LEVEL_CONFIG, GAMES } from '../utils/levelConfig'
import Crown from '../components/ui/Crown'

export default function PassPlayResultsScreen() {
  const { crownLevel, ppPlayers, ppAllScores, goHome, navigateTo } = useGameStore()
  const cfg = LEVEL_CONFIG[crownLevel]

  const playerTotals = ppPlayers.map((name, i) => ({
    name,
    scores: ppAllScores[i] || [],
    total: (ppAllScores[i] || []).reduce((a, b) => a + b, 0),
  })).sort((a, b) => b.total - a.total)

  const winner = playerTotals[0]

  return (
    <div className={`flex flex-col h-full ${cfg.theme.bg} screen-enter`}>
      <div className="flex-1 overflow-y-auto px-4 pt-6">
        {/* Winner banner */}
        <div className="text-center mb-6">
          <div className="animate-float inline-block mb-3">
            <Crown level={crownLevel} size={70} animated />
          </div>
          <h1 className="text-[#2C2C2A] font-extrabold text-3xl mb-1">
            🏆 {winner.name} Wins!
          </h1>
          <p className="text-[#6B6878] text-sm">{winner.total} total points</p>
        </div>

        {/* Leaderboard */}
        <div className="flex flex-col gap-3 mb-6">
          {playerTotals.map((player, rank) => (
            <div
              key={player.name}
              className={`rounded-2xl p-4 border transition-all ${
                rank === 0
                  ? `bg-gradient-to-r ${cfg.theme.gradient} border-transparent shadow-sm`
                  : 'bg-white border-[#E8E4F0]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  rank === 0 ? 'bg-[#2C2C2A]/10 text-[#2C2C2A]' : 'bg-[#EAE7F5] text-[#6B6878]'
                }`}>
                  {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : rank + 1}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-base ${rank === 0 ? 'text-[#2C2C2A]' : 'text-[#2C2C2A]'}`}>
                    {player.name}
                  </p>
                  <div className="flex gap-2 mt-1">
                    {GAMES.map((g, gi) => (
                      <span key={g.id} className={`text-xs ${rank === 0 ? 'text-[#2C2C2A]/60' : 'text-[#9D9AA8]'}`}>
                        {g.emoji} {player.scores[gi] || 0}
                      </span>
                    ))}
                  </div>
                </div>
                <p className={`font-extrabold text-xl tabular-nums ${rank === 0 ? 'text-[#2C2C2A]' : 'text-[#2C2C2A]'}`}>
                  {player.total}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-6 flex flex-col gap-3">
        <button
          onClick={() => navigateTo('passplay-setup')}
          className="w-full py-4 rounded-2xl font-bold text-xl text-[#1A4D1A] bg-[#A8D5A2] active:scale-95 transition-transform"
        >
          Play Again
        </button>
        <button
          onClick={goHome}
          className="w-full py-3 rounded-xl font-medium text-[#9D9AA8] text-sm active:scale-95 transition-transform"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
