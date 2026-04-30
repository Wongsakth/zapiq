import React from 'react'
import useGameStore from '../store/gameStore'
import { LEVEL_CONFIG, GAMES } from '../utils/levelConfig'

function GameCard({ game, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full flex items-center gap-4 p-4 rounded-2xl
        bg-white/5 border border-white/10
        active:scale-95 transition-all duration-150
        hover:bg-white/10
      "
    >
      <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-3xl flex-shrink-0">
        {game.emoji}
      </div>
      <div className="text-left">
        <p className="text-white font-bold text-base">{game.name}</p>
        <p className="text-white/50 text-sm">{game.desc}</p>
      </div>
      <span className="text-white/30 ml-auto text-xl">›</span>
    </button>
  )
}

export default function ModeScreen() {
  const { crownLevel, startCombo, startSingleGame, navigateTo } = useGameStore()
  const cfg = LEVEL_CONFIG[crownLevel]

  return (
    <div className={`flex flex-col h-full ${cfg.theme.bg} screen-enter`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <button
          onClick={() => navigateTo('home')}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          ‹
        </button>
        <h1 className="text-white font-bold text-xl">Choose Mode</h1>
      </div>

      <div className="flex-1 px-4 overflow-y-auto">
        {/* Combo mode highlight */}
        <button
          onClick={startCombo}
          className={`
            w-full p-5 rounded-3xl mb-4
            bg-gradient-to-br ${cfg.theme.gradient}
            active:scale-95 transition-transform duration-150
            shadow-xl
          `}
          style={{ boxShadow: `0 8px 40px ${cfg.theme.primary}50` }}
        >
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-black text-3xl">⚡</span>
              <span className="font-syne font-extrabold text-black text-2xl">Combo Mode</span>
            </div>
            <p className="text-black/70 text-sm font-medium">
              Play all 3 games in a row. Earn the most points!
            </p>
            <div className="mt-3 flex gap-2">
              {GAMES.map(g => (
                <span key={g.id} className="bg-black/20 text-black text-xs px-2 py-1 rounded-full font-medium">
                  {g.emoji} {g.name}
                </span>
              ))}
            </div>
            {cfg.comboTarget && (
              <p className="text-black/60 text-xs mt-2">
                Target: {cfg.upgradeScore} pts to advance to {LEVEL_CONFIG[cfg.nextLevel]?.name}
              </p>
            )}
          </div>
        </button>

        {/* Single games */}
        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Single Game</p>
        <div className="flex flex-col gap-2">
          {GAMES.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onClick={() => startSingleGame(game.id)}
            />
          ))}
        </div>

        {/* Weekly bonus */}
        <div className="mt-4 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-1">
            <span>🎁</span>
            <span className="text-orange-400 font-bold text-sm">Daily Streak Bonus</span>
          </div>
          <p className="text-white/50 text-xs">
            Maintain a 7-day streak to unlock a special weekly bonus round with boosted points!
          </p>
        </div>
      </div>
    </div>
  )
}
