import React from 'react'
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
              ? 'bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.6)]'
              : 'bg-[#E8E4F0]'
          }`}
        />
      ))}
    </div>
  )
}


export default function HomeScreen() {
  const {
    playerName, crownLevel, currentStreak, weeklyBonusUnlocked,
    highScores, bossUnlocked, obsidianUnlocked,
    obsidianCount, prestigeLevel,
    navigateTo,
  } = useGameStore()
  const cfg = LEVEL_CONFIG[crownLevel]

  const bestScore = highScores[crownLevel]?.combo || 0
  const progress  = cfg.upgradeScore ? Math.min(100, (bestScore / cfg.upgradeScore) * 100) : 100

  return (
    <div className={`flex flex-col h-full ${cfg.theme.bg} screen-enter`}>
      {/* Top bar */}
      <div className="flex justify-between items-center px-5 pt-5">
        <div>
          {prestigeLevel >= 10 && (
            <p className="text-purple-500 text-xs font-bold tracking-wider mb-0.5">✦ ZAPIQ Legend</p>
          )}
          <div className="flex items-center gap-1.5">
            {prestigeLevel >= 1 && (
              <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold border border-purple-200">
                P{prestigeLevel}
              </span>
            )}
            <p className="text-[#2C2C2A] font-bold text-lg leading-tight">{playerName}</p>
          </div>
          <p className="text-[#9D9AA8] text-xs uppercase tracking-wider">Player</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          {obsidianCount > 0 && (
            <div className="flex items-center gap-1 bg-purple-900/10 border border-purple-200 rounded-full px-2 py-0.5">
              <span className="text-sm">👑</span>
              <span className="text-purple-700 font-bold text-xs">×{obsidianCount}</span>
            </div>
          )}
          <div className="text-right">
            <p className="text-[#9D9AA8] text-xs uppercase tracking-wider">Streak</p>
            <p className="text-[#2C2C2A] font-bold text-lg leading-tight flex items-center gap-1 justify-end">
              {currentStreak > 0 && <span className="animate-streak-fire">🔥</span>}
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>
      </div>

      {/* Crown section */}
      <div className="flex flex-col items-center py-6 gap-3">
        <div className="animate-float relative">
          <Crown level={crownLevel} size={90} animated />
          {/* Obsidian badge overlay when earned */}
          {obsidianUnlocked && crownLevel !== 'boss' && (
            <div className="absolute -bottom-2 -right-2">
              <Crown level="obsidian" size={28} animated={false} />
            </div>
          )}
        </div>
        <div className="text-center">
          <p className="text-[#9D9AA8] text-xs uppercase tracking-widest mb-1">Level</p>
          <h2 className={`font-syne font-extrabold text-3xl ${cfg.theme.shimmer}`}>
            {cfg.label}
          </h2>
          {obsidianUnlocked && (
            <p className="shimmer-obsidian font-syne font-bold text-sm mt-0.5">✦ Obsidian Champion ✦</p>
          )}
          {cfg.nextLevel && (
            <p className="text-[#9D9AA8] text-xs mt-1">Best Combo: {bestScore} pts</p>
          )}
        </div>

        {/* Upgrade progress */}
        {cfg.nextLevel && (
          <div className="w-full max-w-xs px-4">
            <div className="flex justify-between text-xs text-[#9D9AA8] mb-1">
              <span>Next: {LEVEL_CONFIG[cfg.nextLevel].name}</span>
              <span>{bestScore} / {cfg.upgradeScore}</span>
            </div>
            <div className="h-2 bg-[#E8E4F0] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${cfg.theme.gradient} transition-all duration-700`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Boss unlock progress for diamond */}
        {crownLevel === 'diamond' && !bossUnlocked && cfg.bossUnlockScore && (
          <div className="w-full max-w-xs px-4">
            <div className="flex justify-between text-xs text-[#9D9AA8] mb-1">
              <span>Boss Stage</span>
              <span>{bestScore} / {cfg.bossUnlockScore}</span>
            </div>
            <div className="h-2 bg-[#E8E4F0] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full shimmer-obsidian transition-all duration-700"
                style={{
                  width: `${Math.min(100, (bestScore / cfg.bossUnlockScore) * 100)}%`,
                  background: 'linear-gradient(90deg,#2D1B69,#6B3FA0,#2D1B69)',
                }}
              />
            </div>
          </div>
        )}

        {!cfg.nextLevel && !bossUnlocked && (
          <div className={`px-4 py-2 rounded-full ${cfg.theme.accentBg} ${cfg.theme.accentBorder} border`}>
            <span className="text-[#6B6878] text-sm">✦ Maximum Crown Achieved ✦</span>
          </div>
        )}

        {bossUnlocked && (
          <div className="px-4 py-2 rounded-full bg-[#2D1B50] border border-purple-700">
            <span className="shimmer-obsidian font-bold text-sm">⚡ Boss Stage Available ⚡</span>
          </div>
        )}
      </div>

      {/* Weekly streak */}
      <div className="mx-4 p-4 rounded-2xl bg-white border border-[#E8E4F0]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[#6B6878] text-sm font-medium">Weekly Streak</span>
          {weeklyBonusUnlocked && (
            <span className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full border border-orange-200">
              🎁 Bonus Unlocked!
            </span>
          )}
        </div>
        <StreakDots streak={Math.min(currentStreak, 7)} />
        <p className="text-[#9D9AA8] text-xs text-center mt-2">
          {currentStreak < 7
            ? `${7 - Math.min(currentStreak, 7)} more days for weekly bonus`
            : '🎉 Weekly bonus active!'}
        </p>
      </div>

      {/* Play buttons */}
      <div className="flex-1 flex flex-col justify-end p-4 gap-3 pb-2">
        <button
          onClick={() => navigateTo('mode-select')}
          className="w-full py-5 rounded-2xl font-bold text-xl text-[#1A4D1A] bg-[#A8D5A2] active:scale-95 transition-transform duration-150 shadow-sm"
        >
          ▶ Play
        </button>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigateTo('leaderboard')}
            className="py-4 rounded-2xl font-semibold text-[#6B6878] bg-white border border-[#E8E4F0] active:scale-95 transition-transform"
          >
            🏆<br /><span className="text-xs">Rank</span>
          </button>
          <button
            onClick={() => navigateTo('passplay-setup')}
            className="py-4 rounded-2xl font-semibold text-[#6B6878] bg-white border border-[#E8E4F0] active:scale-95 transition-transform"
          >
            👥<br /><span className="text-xs">Pass & Play</span>
          </button>
          <button
            onClick={() => navigateTo('settings')}
            className="py-4 rounded-2xl font-semibold text-[#6B6878] bg-white border border-[#E8E4F0] active:scale-95 transition-transform"
          >
            ⚙️<br /><span className="text-xs">Settings</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: '8px 0 4px', fontSize: '10px', color: '#ccc' }}>
          Build: {new Date(__BUILD_TIME__).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}
