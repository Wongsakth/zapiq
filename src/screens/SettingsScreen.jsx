import React, { useState } from 'react'
import useGameStore from '../store/gameStore'
import { LEVEL_CONFIG } from '../utils/levelConfig'
import Crown from '../components/ui/Crown'

export default function SettingsScreen() {
  const {
    playerName, crownLevel, currentStreak, longestStreak,
    bestComboScores, weeklyBonusUnlocked,
    setPlayerName, resetProgress, navigateTo,
  } = useGameStore()
  const cfg = LEVEL_CONFIG[crownLevel]
  const [editName, setEditName] = useState(playerName)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveName = () => {
    const trimmed = editName.trim()
    if (trimmed) {
      setPlayerName(trimmed)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }
  }

  const handleReset = () => {
    resetProgress()
    setShowResetConfirm(false)
    navigateTo('home')
  }

  return (
    <div className={`flex flex-col h-full ${cfg.theme.bg} screen-enter`}>
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <button
          onClick={() => navigateTo('home')}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          ‹
        </button>
        <h1 className="text-white font-bold text-xl">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        {/* Profile */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Profile</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              maxLength={20}
              className="
                flex-1 bg-white/10 border border-white/15 rounded-xl
                px-4 py-3 text-white text-sm font-medium
                placeholder-white/25 outline-none
                focus:border-white/40 transition-colors
              "
            />
            <button
              onClick={handleSaveName}
              className="px-4 py-3 rounded-xl bg-white/10 text-white text-sm font-medium active:scale-90 transition-transform"
            >
              {saved ? '✓' : 'Save'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Stats</p>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60 text-sm">Current Level</span>
              <div className="flex items-center gap-2">
                <Crown level={crownLevel} size={20} animated={false} />
                <span className="text-white font-medium text-sm">{cfg.label}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 text-sm">Current Streak</span>
              <span className="text-white font-medium text-sm">🔥 {currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 text-sm">Longest Streak</span>
              <span className="text-white font-medium text-sm">⚡ {longestStreak} days</span>
            </div>
            {Object.entries(bestComboScores).map(([level, score]) => (
              score > 0 && (
                <div key={level} className="flex justify-between">
                  <span className="text-white/60 text-sm capitalize">{level} Best Combo</span>
                  <span className="text-white font-medium text-sm">{score} pts</span>
                </div>
              )
            ))}
            <div className="flex justify-between">
              <span className="text-white/60 text-sm">Weekly Bonus</span>
              <span className={`text-sm font-medium ${weeklyBonusUnlocked ? 'text-orange-400' : 'text-white/30'}`}>
                {weeklyBonusUnlocked ? '🎁 Unlocked' : '🔒 Locked'}
              </span>
            </div>
          </div>
        </div>

        {/* How to Play */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">How to Play</p>
          <div className="space-y-2 text-white/60 text-sm">
            <p>🎨 <strong className="text-white/80">Tap Color</strong> — Tap the button matching the color name</p>
            <p>🧮 <strong className="text-white/80">Math Blitz</strong> — Solve equations before time runs out</p>
            <p>🧠 <strong className="text-white/80">Memory Match</strong> — Find all matching pairs</p>
            <p>⚡ <strong className="text-white/80">Combo Mode</strong> — Play all 3 for maximum points</p>
          </div>
        </div>

        {/* Crown levels info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Crown Levels</p>
          {['silver', 'gold', 'diamond'].map(lvl => {
            const c = LEVEL_CONFIG[lvl]
            return (
              <div key={lvl} className="flex items-center gap-3 mb-3">
                <Crown level={lvl} size={28} animated={false} />
                <div>
                  <p className="text-white text-sm font-medium">{c.label}</p>
                  <p className="text-white/40 text-xs">
                    {c.comboTarget ? `Target ${c.upgradeScore}pts combo to advance` : 'Maximum level'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Danger zone */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
          <p className="text-red-400 text-xs uppercase tracking-wider mb-3">Danger Zone</p>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium active:scale-95 transition-transform"
            >
              Reset All Progress
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-red-300 text-sm text-center">Are you sure? This cannot be undone.</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="py-3 rounded-xl bg-white/10 text-white text-sm active:scale-95 transition-transform"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="py-3 rounded-xl bg-red-500/20 text-red-400 text-sm font-bold active:scale-95 transition-transform"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
