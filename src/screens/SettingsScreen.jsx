import React, { useState } from 'react'
import useGameStore from '../store/gameStore'
import useSoundStore from '../store/soundStore'
import { LEVEL_CONFIG } from '../utils/levelConfig'
import Crown from '../components/ui/Crown'

export default function SettingsScreen() {
  const {
    playerName, crownLevel, currentStreak, longestStreak,
    highScores, weeklyBonusUnlocked, obsidianUnlocked,
    setPlayerName, resetProgress, navigateTo,
  } = useGameStore()
  const cfg = LEVEL_CONFIG[crownLevel]
  const { soundEnabled, toggleSound } = useSoundStore()
  const [editName, setEditName] = useState(playerName)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [saved, setSaved] = useState(false)
  const [nameError, setNameError] = useState('')

  const handleSaveName = () => {
    const trimmed = editName.trim()
    if (!trimmed) {
      setNameError('กรุณาใส่ชื่อ')
      return
    }
    setNameError('')
    setPlayerName(trimmed)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const handleReset = () => {
    resetProgress()
    setShowResetConfirm(false)
    navigateTo('home')
  }

  return (
    <div className={`flex flex-col h-full overflow-x-hidden ${cfg.theme.bg} screen-enter`}>
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <button
          onClick={() => navigateTo('home')}
          className="w-10 h-10 rounded-full bg-white border border-[#E8E4F0] flex items-center justify-center text-[#6B6878] active:scale-90 transition-transform flex-shrink-0"
        >
          ‹
        </button>
        <h1 className="text-[#2C2C2A] font-bold text-xl">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 space-y-4">
        {/* Profile */}
        <div className="bg-white border border-[#E8E4F0] rounded-2xl p-4">
          <p className="text-[#9D9AA8] text-xs uppercase tracking-wider mb-3">Profile</p>
          <input
            type="text"
            value={editName}
            onChange={e => { setEditName(e.target.value); setNameError('') }}
            maxLength={8}
            className="
              w-full bg-white border border-[#E8E4F0] rounded-xl
              px-4 py-3 text-[#2C2C2A] text-sm font-medium
              placeholder-[#9D9AA8] outline-none
              focus:border-[#A8D5A2] transition-colors mb-1
            "
          />
          <div className="flex justify-between items-center mb-2">
            {nameError
              ? <p style={{ fontSize: 11, color: 'var(--color-accent-red)' }}>{nameError}</p>
              : <span />
            }
            <p style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{editName.length}/8</p>
          </div>
          <button
            onClick={handleSaveName}
            className="w-full h-11 rounded-xl bg-[#A8D5A2] text-[#1A4D1A] text-sm font-medium active:scale-95 transition-transform truncate px-4"
          >
            {saved ? '✓ Saved!' : 'Save Name'}
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white border border-[#E8E4F0] rounded-2xl p-4">
          <p className="text-[#9D9AA8] text-xs uppercase tracking-wider mb-3">Stats</p>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#6B6878] text-sm">Current Level</span>
              <div className="flex items-center gap-2">
                <Crown level={crownLevel} size={20} animated={false} />
                <span className="text-[#2C2C2A] font-medium text-sm">{cfg.label}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6878] text-sm">Current Streak</span>
              <span className="text-[#2C2C2A] font-medium text-sm">🔥 {currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6878] text-sm">Longest Streak</span>
              <span className="text-[#2C2C2A] font-medium text-sm">⚡ {longestStreak} days</span>
            </div>
            {['silver', 'gold', 'diamond', 'obsidian'].map(level => {
              const combo = highScores[level]?.combo || 0
              return combo > 0 ? (
                <div key={level} className="flex justify-between">
                  <span className="text-[#6B6878] text-sm capitalize">{level} Best Combo</span>
                  <span className="text-[#2C2C2A] font-medium text-sm">{combo} pts</span>
                </div>
              ) : null
            })}
            <div className="flex justify-between">
              <span className="text-[#6B6878] text-sm">Weekly Bonus</span>
              <span className={`text-sm font-medium ${weeklyBonusUnlocked ? 'text-orange-500' : 'text-[#9D9AA8]'}`}>
                {weeklyBonusUnlocked ? '🎁 Unlocked' : '🔒 Locked'}
              </span>
            </div>
          </div>
        </div>

        {/* Sound */}
        <div className="bg-white border border-[#E8E4F0] rounded-2xl p-4">
          <p className="text-[#9D9AA8] text-xs uppercase tracking-wider mb-3">Sound</p>
          <div className="flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl flex-shrink-0">{soundEnabled ? '🔊' : '🔇'}</span>
              <span className="text-[#2C2C2A] text-sm font-medium truncate">Sound Effects</span>
            </div>
            <button
              onClick={toggleSound}
              className={`relative flex-shrink-0 rounded-full transition-colors duration-200 ${soundEnabled ? 'bg-[#A8D5A2]' : 'bg-[#E8E4F0]'}`}
              style={{ width: 51, height: 31 }}
            >
              <span
                className={`absolute top-0.5 w-[27px] h-[27px] rounded-full bg-white shadow transition-transform duration-200 ${soundEnabled ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
        </div>

        {/* How to Play */}
        <div className="bg-white border border-[#E8E4F0] rounded-2xl p-4">
          <p className="text-[#9D9AA8] text-xs uppercase tracking-wider mb-3">How to Play</p>
          <div className="space-y-2 text-[#6B6878] text-sm">
            <p>🎨 <strong className="text-[#2C2C2A]">Tap Color</strong> — Tap the button matching the color name</p>
            <p>🧮 <strong className="text-[#2C2C2A]">Math Blitz</strong> — Solve equations before time runs out</p>
            <p>🧠 <strong className="text-[#2C2C2A]">Memory Match</strong> — Find all matching pairs</p>
            <p>⚡ <strong className="text-[#2C2C2A]">Combo Mode</strong> — Play all 3 for maximum points</p>
          </div>
        </div>

        {/* Crown levels info */}
        <div className="bg-white border border-[#E8E4F0] rounded-2xl p-4">
          <p className="text-[#9D9AA8] text-xs uppercase tracking-wider mb-3">Crown Levels</p>
          {['silver', 'gold', 'diamond'].map(lvl => {
            const c = LEVEL_CONFIG[lvl]
            return (
              <div key={lvl} className="flex items-center gap-3 mb-3">
                <Crown level={lvl} size={28} animated={false} />
                <div>
                  <p className="text-[#2C2C2A] text-sm font-medium">{c.label}</p>
                  <p className="text-[#9D9AA8] text-xs">
                    {c.comboTarget ? `Target ${c.upgradeScore}pts combo to advance` : 'Maximum level'}
                  </p>
                </div>
              </div>
            )
          })}

          {/* Obsidian — locked until Boss Stage completion */}
          <div className={`flex items-center gap-3 pt-3 mt-1 border-t border-[#E8E4F0] ${obsidianUnlocked ? '' : 'opacity-70'}`}>
            {obsidianUnlocked ? (
              <Crown level="obsidian" size={28} animated={false} />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#1A0A3A] border border-[#3D1F6E] flex items-center justify-center flex-shrink-0">
                <span className="text-xs">🔒</span>
              </div>
            )}
            <div className="flex-1">
              {obsidianUnlocked ? (
                <>
                  <p className="shimmer-obsidian font-syne font-bold text-sm">Obsidian Crown</p>
                  <p className="text-[#9D9AA8] text-xs">Secret stage mastered</p>
                </>
              ) : (
                <>
                  <p className="text-[#3D2A5A] text-sm font-semibold">??? Crown</p>
                  <p className="text-[#9D9AA8] text-xs">🔒 Secret stage — find the way</p>
                </>
              )}
            </div>
            {!obsidianUnlocked && (
              <span className="text-[#9D9AA8] text-xs font-mono">???</span>
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-red-400 text-xs uppercase tracking-wider mb-3">Danger Zone</p>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-3 rounded-xl border border-red-300 text-red-500 text-sm font-medium active:scale-95 transition-transform"
            >
              Reset All Progress
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-red-500 text-sm text-center">Are you sure? This cannot be undone.</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="py-3 rounded-xl bg-white border border-[#E8E4F0] text-[#6B6878] text-sm active:scale-95 transition-transform"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="py-3 rounded-xl bg-red-100 text-red-500 text-sm font-bold active:scale-95 transition-transform"
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
