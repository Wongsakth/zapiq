import React from 'react'
import useGameStore from '../store/gameStore'
import Crown from '../components/ui/Crown'
import { LEVEL_CONFIG, GAMES } from '../utils/levelConfig'
import { getBrainAgeColor, getZapiqColor } from '../utils/brainAnalysis'

export default function ChallengeScreen() {
  const { challengeData, acceptChallenge, clearChallenge, navigateTo } = useGameStore()

  if (!challengeData) {
    navigateTo('home')
    return null
  }

  // Field names: n=name, c=crownLevel, o=obsidianCount, t=tap, m=math, mem=memory, b=brainAge, z=zapiqScore
  const { n, c, o, t, m, mem, b, z } = challengeData
  const cfg        = LEVEL_CONFIG[c] || LEVEL_CONFIG.silver
  const totalScore = (t || 0) + (m || 0) + (mem || 0)
  const scores     = [t || 0, m || 0, mem || 0]

  const handleCancel = () => {
    clearChallenge()
    navigateTo('home')
  }

  return (
    <div className="flex flex-col h-full bg-[#FAF8FF] screen-enter">
      <div className="flex-1 overflow-y-auto px-4 pt-8">

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-[#9D9AA8] text-xs uppercase tracking-widest mb-3">Challenge</p>
          <div className="flex justify-center mb-3">
            <Crown level={c || 'silver'} size={64} animated />
          </div>
          <h1 className="font-syne font-extrabold text-2xl text-[#2C2C2A] mb-1">
            {n || 'Someone'} ท้าคุณ!
          </h1>
          <p className={`font-bold text-sm ${cfg.theme.shimmer}`}>{cfg.label}</p>
          {o > 0 && (
            <p className="text-purple-500 text-xs mt-1">👑 ×{o} Obsidian</p>
          )}
        </div>

        {/* Score card */}
        <div className="bg-white border border-[#E8E4F0] rounded-2xl p-4 mb-4">
          <p className="text-[#9D9AA8] text-xs uppercase tracking-wider mb-3">Combo Scores</p>
          <div className="space-y-2 mb-3">
            {GAMES.map((g, i) => (
              <div key={g.id} className="flex justify-between items-center">
                <span className="text-[#6B6878] text-sm">{g.emoji} {g.name}</span>
                <span className="text-[#2C2C2A] font-bold tabular-nums">+{scores[i]}</span>
              </div>
            ))}
            <div className="border-t border-[#E8E4F0] pt-2 flex justify-between items-center">
              <span className="text-[#6B6878] text-sm font-medium">Total</span>
              <span className="text-[#2C2C2A] font-extrabold text-lg tabular-nums">{totalScore} pts</span>
            </div>
          </div>

          {/* Brain analysis */}
          {b && z && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="rounded-xl p-2 text-center" style={{ backgroundColor: getBrainAgeColor(b).bg, border: `1px solid ${getBrainAgeColor(b).border}` }}>
                <p className="text-[#9D9AA8] text-xs">Brain Age</p>
                <p className="font-extrabold text-xl" style={{ color: getBrainAgeColor(b).text }}>{b} ปี</p>
              </div>
              <div className="rounded-xl p-2 text-center" style={{ backgroundColor: getZapiqColor(z).bg, border: `1px solid ${getZapiqColor(z).border}` }}>
                <p className="text-[#9D9AA8] text-xs">ZAPIQ Score</p>
                <p className="font-extrabold text-xl" style={{ color: getZapiqColor(z).text }}>{z}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 mb-6 text-center">
          <p className="text-orange-700 text-sm font-medium">เล่น Combo Mode เพื่อวัดผลกับ {n}!</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-4 pb-8 flex flex-col gap-3">
        <button
          onClick={acceptChallenge}
          className="w-full py-5 rounded-2xl font-bold text-xl text-[#1A4D1A] bg-[#A8D5A2] active:scale-95 transition-transform shadow-sm"
        >
          รับการท้า! ⚡
        </button>
        <button
          onClick={handleCancel}
          className="w-full py-3 rounded-xl font-medium text-sm text-[#9D9AA8] active:scale-95 transition-transform"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  )
}
