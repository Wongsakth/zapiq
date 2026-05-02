import React, { useEffect } from 'react'
import useGameStore from '../store/gameStore'
import { LEVEL_CONFIG, GAMES, CROWN_LEVELS } from '../utils/levelConfig'
import Crown from '../components/ui/Crown'

const PLAYABLE_LEVELS = CROWN_LEVELS

function LevelSelector({ unlockedLevels, activeLevel, highScores, onSelect }) {
  return (
    <div className="mb-4">
      <p className="text-[#9D9AA8] text-xs uppercase tracking-wider mb-2">Play Level</p>
      <div className="flex gap-2">
        {unlockedLevels.map(lvl => {
          const cfg  = LEVEL_CONFIG[lvl]
          const best = highScores[lvl]?.combo || 0
          const active = lvl === activeLevel
          return (
            <button
              key={lvl}
              onClick={() => onSelect(lvl)}
              className={`flex-1 flex flex-col items-center py-3 px-2 rounded-2xl border-2 transition-all duration-150 active:scale-95 ${
                active
                  ? 'border-[#A8D5A2] bg-white shadow-sm'
                  : 'border-[#E8E4F0] bg-white/60'
              }`}
            >
              <Crown level={lvl} size={28} animated={false} />
              <p className={`text-xs font-bold mt-1 ${active ? 'text-[#2C2C2A]' : 'text-[#9D9AA8]'}`}>
                {cfg.name}
              </p>
              <p className={`tabular-nums mt-0.5 ${active ? 'text-[#6B6878]' : 'text-[#B8B4C4]'}`} style={{ fontSize: 10 }}>
                {best > 0 ? `Best: ${best}pt` : 'ยังไม่มีคะแนน'}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function GameCard({ game, best, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full flex items-center gap-4 p-4 rounded-2xl
        bg-white border border-[#E8E4F0]
        active:scale-95 transition-all duration-150
        hover:border-[#D0CCDC]
      "
    >
      <div className="w-14 h-14 rounded-xl bg-[#F0EDF8] flex items-center justify-center text-3xl flex-shrink-0">
        {game.emoji}
      </div>
      <div className="text-left min-w-0">
        <p className="text-[#2C2C2A] font-bold text-base">{game.name}</p>
        <p className="text-[#9D9AA8] text-sm">{game.desc}</p>
      </div>
      <div className="ml-auto text-right flex-shrink-0">
        {best > 0
          ? <p className="text-[#6B6878] font-bold tabular-nums" style={{ fontSize: 11 }}>🏆 {best}pt</p>
          : <p className="text-[#B8B4C4]" style={{ fontSize: 11 }}>—</p>
        }
        <span className="text-[#9D9AA8] text-xl">›</span>
      </div>
    </button>
  )
}

export default function ModeScreen() {
  const {
    crownLevel, selectedLevel, setSelectedLevel,
    highScores, bossUnlocked,
    startCombo, startSingleGame, startBossCombo,
    navigateTo,
  } = useGameStore()

  const crownIdx      = PLAYABLE_LEVELS.indexOf(crownLevel)
  const unlockedLevels = PLAYABLE_LEVELS.slice(0, Math.max(crownIdx + 1, 1))
  const activeLevel   = CROWN_LEVELS.includes(selectedLevel) ? selectedLevel : crownLevel
  const cfg           = LEVEL_CONFIG[activeLevel]
  const showSelector  = unlockedLevels.length > 1

  // Default selectedLevel to crownLevel when entering this screen
  useEffect(() => {
    if (!selectedLevel) setSelectedLevel(crownLevel)
  }, [])

  const activeLevelHs = highScores[activeLevel] || {}

  return (
    <div className={`flex flex-col h-full ${cfg.theme.bg} screen-enter`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <button
          onClick={() => navigateTo('home')}
          className="w-10 h-10 rounded-full bg-white border border-[#E8E4F0] flex items-center justify-center text-[#6B6878] active:scale-90 transition-transform"
        >
          ‹
        </button>
        <h1 className="text-[#2C2C2A] font-bold text-xl">Choose Mode</h1>
      </div>

      <div className="flex-1 px-4 overflow-y-auto">
        {/* Level selector */}
        {showSelector && (
          <LevelSelector
            unlockedLevels={unlockedLevels}
            activeLevel={activeLevel}
            highScores={highScores}
            onSelect={setSelectedLevel}
          />
        )}

        {/* Combo mode */}
        <button
          onClick={startCombo}
          className={`
            w-full p-5 rounded-3xl mb-4
            bg-gradient-to-br ${cfg.theme.gradient}
            active:scale-95 transition-transform duration-150
            shadow-md
          `}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Crown level={activeLevel} size={24} animated={false} />
              <span className="font-syne font-extrabold text-[#2C2C2A] text-[14px] tracking-tight">Combo Mode</span>
            </div>
            {activeLevelHs.combo > 0 && (
              <span className="text-[#2C2C2A]/60 font-bold tabular-nums block mb-1" style={{ fontSize: 11 }}>
                🏆 {activeLevelHs.combo}pt
              </span>
            )}
            <p className="text-[#2C2C2A]/70 text-sm font-medium">
              Play all 3 games in a row. Earn the most points!
            </p>
            <div className="mt-3 flex gap-2 justify-center">
              {GAMES.map(g => (
                <span key={g.id} className="bg-[#2C2C2A]/10 text-[#2C2C2A] text-xs px-2 py-1 rounded-full font-medium">
                  {g.emoji} {g.name}
                </span>
              ))}
            </div>
            {activeLevel === crownLevel && cfg.comboTarget && (
              <p className="text-[#2C2C2A]/60 text-xs mt-2">
                Target: {cfg.upgradeScore} pts to advance to {LEVEL_CONFIG[cfg.nextLevel]?.name}
              </p>
            )}
            {activeLevel === 'diamond' && cfg.bossUnlockScore && !bossUnlocked && (
              <p className="text-[#2C2C2A]/60 text-xs mt-1">
                Score {cfg.bossUnlockScore}+ pts to unlock Boss Stage
              </p>
            )}
          </div>
        </button>

        {/* Boss Stage */}
        {bossUnlocked && (
          <button
            onClick={startBossCombo}
            className="w-full p-5 rounded-3xl mb-4 active:scale-95 transition-transform duration-150 shadow-xl border-2 border-purple-700"
            style={{ background: 'linear-gradient(135deg, #1A0A3A, #3D1F6E, #0F0620)' }}
          >
            <div className="text-left">
              <div className="flex items-center gap-3 mb-1">
                <Crown level="obsidian" size={32} animated />
                <span className="font-syne font-extrabold text-white text-2xl tracking-tight">Boss Stage</span>
                {(highScores.obsidian?.combo || 0) > 0 && (
                  <span className="ml-auto text-purple-300 font-bold tabular-nums" style={{ fontSize: 11 }}>
                    🏆 {highScores.obsidian.combo}pt
                  </span>
                )}
              </div>
              <p className="text-purple-300 text-sm font-medium mb-2">
                The ultimate challenge. One mistake costs you.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-purple-900/60 text-purple-300 text-xs px-2 py-1 rounded-full">🌀 Stroop Color</span>
                <span className="bg-purple-900/60 text-purple-300 text-xs px-2 py-1 rounded-full">⚔️ 2-Step Math</span>
                <span className="bg-purple-900/60 text-purple-300 text-xs px-2 py-1 rounded-full">💀 Speed Memory</span>
              </div>
              <p className="text-red-400 text-xs mt-2 font-medium">⚠️ 3 wrong in a row = Game Over</p>
            </div>
          </button>
        )}

        {/* Single games */}
        <p className="text-[#9D9AA8] text-xs uppercase tracking-wider mb-3">Single Mode</p>
        <div className="flex flex-col gap-2">
          {GAMES.map(game => {
            const gameKey = { tapcolor: 'tap', math: 'math', memory: 'memory' }[game.id]
            const best    = activeLevelHs[gameKey] || 0
            return (
              <GameCard
                key={game.id}
                game={game}
                best={best}
                onClick={() => startSingleGame(game.id)}
              />
            )
          })}
        </div>

        {/* Daily streak bonus info */}
        <div className="mt-4 mb-4 p-4 rounded-2xl bg-orange-50 border border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <span>🎁</span>
            <span className="text-orange-600 font-bold text-sm">Daily Streak Bonus</span>
          </div>
          <p className="text-[#6B6878] text-xs">
            Maintain a 7-day streak to unlock a special weekly bonus round with boosted points!
          </p>
        </div>
      </div>
    </div>
  )
}
