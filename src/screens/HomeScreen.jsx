import React, { useEffect, useState } from 'react'
import useGameStore from '../store/gameStore'
import Crown from '../components/ui/Crown'
import { LEVEL_CONFIG } from '../utils/levelConfig'

function StreakDots({ streak }) {
  return (
    <div className="flex gap-1.5 justify-center">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            i < streak
              ? 'bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.7)]'
              : 'bg-white/15'
          }`}
        />
      ))}
    </div>
  )
}

function LevelUpBanner({ level, onDismiss }) {
  const cfg = LEVEL_CONFIG[level]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
      <div className="text-center animate-level-up px-8">
        <div className="animate-float mb-4">
          <Crown level={level} size={100} animated />
        </div>
        <h2 className="font-syne text-4xl font-extrabold text-white mb-2">
          Level Up!
        </h2>
        <p className={`text-2xl font-bold mb-6 ${cfg.theme.shimmer}`}>
          {cfg.label}
        </p>
        <button
          onClick={onDismiss}
          className="px-8 py-3 rounded-2xl bg-white/20 text-white font-bold active:scale-95 transition-transform"
        >
          Awesome! 🎉
        </button>
      </div>
    </div>
  )
}

export default function HomeScreen() {
  const {
    playerName, crownLevel, currentStreak, weeklyBonusUnlocked,
    bestComboScores, levelUpTriggered, clearLevelUp, navigateTo,
  } = useGameStore()
  const cfg = LEVEL_CONFIG[crownLevel]
  const [showLevelUp, setShowLevelUp] = useState(false)

  useEffect(() => {
    if (levelUpTriggered) {
      setShowLevelUp(true)
    }
  }, [levelUpTriggered])

  const handleDismissLevelUp = () => {
    setShowLevelUp(false)
    clearLevelUp()
  }

  const bestScore = bestComboScores[crownLevel] || 0
  const target = cfg.comboTarget
  const progress = target ? Math.min(100, (bestScore / cfg.upgradeScore) * 100) : 100

  return (
    <div className={`flex flex-col h-full ${cfg.theme.bg} screen-enter`}>
      {showLevelUp && (
        <LevelUpBanner level={crownLevel} onDismiss={handleDismissLevelUp} />
      )}

      {/* Top bar */}
      <div className="flex justify-between items-center px-5 pt-5">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-wider">Player</p>
          <p className="text-white font-bold text-lg leading-tight">{playerName}</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-xs uppercase tracking-wider">Streak</p>
          <p className="text-white font-bold text-lg leading-tight flex items-center gap-1">
            {currentStreak > 0 && <span className="animate-streak-fire">🔥</span>}
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      {/* Crown section */}
      <div className="flex flex-col items-center py-6 gap-3">
        <div className="animate-float">
          <Crown level={crownLevel} size={90} animated />
        </div>
        <div className="text-center">
          <h2 className={`font-syne font-extrabold text-3xl ${cfg.theme.shimmer}`}>
            {cfg.label}
          </h2>
          {cfg.nextLevel && (
            <p className="text-white/40 text-xs mt-1">
              Best Combo: {bestScore} pts
            </p>
          )}
        </div>

        {/* Upgrade progress */}
        {cfg.nextLevel && (
          <div className="w-full max-w-xs px-4">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Next: {LEVEL_CONFIG[cfg.nextLevel].name}</span>
              <span>{bestScore} / {cfg.upgradeScore}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${cfg.theme.gradient} transition-all duration-700`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {!cfg.nextLevel && (
          <div className="px-4 py-2 rounded-full bg-white/10 border border-white/20">
            <span className="text-white/70 text-sm">✦ Maximum Crown Achieved ✦</span>
          </div>
        )}
      </div>

      {/* Weekly streak */}
      <div className="mx-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex justify-between items-center mb-3">
          <span className="text-white/70 text-sm font-medium">Weekly Streak</span>
          {weeklyBonusUnlocked && (
            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">
              🎁 Bonus Unlocked!
            </span>
          )}
        </div>
        <StreakDots streak={Math.min(currentStreak, 7)} />
        <p className="text-white/30 text-xs text-center mt-2">
          {currentStreak < 7
            ? `${7 - Math.min(currentStreak, 7)} more days for weekly bonus`
            : '🎉 Weekly bonus active!'}
        </p>
      </div>

      {/* Play buttons */}
      <div className="flex-1 flex flex-col justify-end p-4 gap-3 pb-6">
        <button
          onClick={() => navigateTo('mode-select')}
          className={`
            w-full py-5 rounded-2xl font-bold text-xl text-black
            bg-gradient-to-r ${cfg.theme.gradient}
            active:scale-95 transition-transform duration-150
            shadow-lg
          `}
          style={{ boxShadow: `0 8px 30px ${cfg.theme.primary}40` }}
        >
          ▶ Play
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigateTo('passplay-setup')}
            className="py-4 rounded-2xl font-semibold text-white bg-white/10 border border-white/15 active:scale-95 transition-transform"
          >
            👥 Pass & Play
          </button>
          <button
            onClick={() => navigateTo('settings')}
            className="py-4 rounded-2xl font-semibold text-white bg-white/10 border border-white/15 active:scale-95 transition-transform"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>
    </div>
  )
}
