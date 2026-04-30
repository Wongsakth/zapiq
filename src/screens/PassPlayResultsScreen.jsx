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
          <h1 className="text-white font-extrabold text-3xl mb-1">
            🏆 {winner.name} Wins!
          </h1>
          <p className="text-white/50 text-sm">{winner.total} total points</p>
        </div>

        {/* Leaderboard */}
        <div className="flex flex-col gap-3 mb-6">
          {playerTotals.map((player, rank) => (
            <div
              key={player.name}
              className={`rounded-2xl p-4 border transition-all ${
                rank === 0
                  ? `bg-gradient-to-r ${cfg.theme.gradient} border-transparent`
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  rank === 0 ? 'bg-black/20 text-black' : 'bg-white/10 text-white'
                }`}>
                  {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : rank + 1}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-base ${rank === 0 ? 'text-black' : 'text-white'}`}>
                    {player.name}
                  </p>
                  <div className="flex gap-2 mt-1">
                    {GAMES.map((g, gi) => (
                      <span key={g.id} className={`text-xs ${rank === 0 ? 'text-black/60' : 'text-white/40'}`}>
                        {g.emoji} {player.scores[gi] || 0}
                      </span>
                    ))}
                  </div>
                </div>
                <p className={`font-extrabold text-xl tabular-nums ${rank === 0 ? 'text-black' : 'text-white'}`}>
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
          className={`
            w-full py-4 rounded-2xl font-bold text-xl text-black
            bg-gradient-to-r ${cfg.theme.gradient}
            active:scale-95 transition-transform
          `}
        >
          Play Again
        </button>
        <button
          onClick={goHome}
          className="w-full py-3 rounded-xl font-medium text-white/60 text-sm active:scale-95 transition-transform"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
