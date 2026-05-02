import React, { useState } from 'react'
import Crown from './Crown'
import { getPrestigeBonus, getPrestigeBonusLabel } from '../../utils/prestigeUtils'

export default function PrestigeScreen({ obsidianCount, onConfirm, onCancel }) {
  const [confirmed, setConfirmed] = useState(false)
  const bonus = getPrestigeBonus(obsidianCount)
  const bonusLabel = getPrestigeBonusLabel(obsidianCount)
  const isFirstPrestige = obsidianCount === 1

  const handleConfirm = () => {
    setConfirmed(true)
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(10,4,24,0.92)' }}>
      <div
        className="w-full max-w-[340px] rounded-3xl border-2 border-purple-700 p-6 text-center"
        style={{ background: 'linear-gradient(160deg, #1A0A3A 0%, #2D1B50 100%)' }}
      >
        {confirmed ? (
          // ── Success state (first prestige only shows tip) ──────────────
          <>
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="font-syne font-extrabold text-white text-2xl mb-3">Prestige สำเร็จ!</h2>
            <p className="text-purple-200 text-sm leading-relaxed mb-2">
              คุณได้ <span className="text-white font-bold">+{bonus.timerBonus} วิ</span> ทุกเกม
            </p>
            <p className="text-purple-300 text-xs leading-relaxed mb-6">
              ยิ่งสะสม Obsidian ยิ่งได้ bonus มากขึ้น!
            </p>
            <div className="bg-purple-900/50 rounded-2xl px-4 py-3 mb-5 border border-purple-700">
              <p className="text-purple-300 text-xs mb-1">Active Bonus</p>
              <p className="text-white font-bold text-sm">{bonusLabel}</p>
            </div>
            <button
              onClick={onCancel}
              className="w-full py-4 rounded-2xl font-bold text-white text-base active:scale-95 transition-transform bg-purple-700"
            >
              เข้าใจแล้ว! 👑
            </button>
          </>
        ) : (
          // ── Prestige confirmation ──────────────────────────────────────
          <>
            <div className="flex justify-center mb-2">
              <Crown level="obsidian" size={64} animated />
            </div>
            <h2 className="font-syne font-extrabold text-white text-3xl mb-1 tracking-tight">PRESTIGE?</h2>

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">👑</span>
              <span className="text-purple-200 font-bold text-lg">Obsidian ×{obsidianCount}</span>
            </div>

            <p className="text-purple-200 text-sm leading-relaxed mb-5">
              รีเซ็ตกลับ Silver และรับ Prestige Bonus ติดตัวไว้?
            </p>

            {/* Bonus preview */}
            <div className="bg-purple-900/50 rounded-2xl px-4 py-3 mb-2 border border-purple-700 text-left">
              <p className="text-purple-400 text-xs uppercase tracking-wider mb-2">Bonus ที่จะได้รับ</p>
              <p className="text-white font-bold text-sm">{bonusLabel || 'No bonus yet'}</p>
            </div>

            {/* Reset info */}
            <div className="mb-5 text-left px-1">
              <p className="text-purple-500 text-xs">จะถูกรีเซ็ต: Crown level, scores, streak</p>
              <p className="text-purple-400 text-xs">จะคงไว้: ชื่อ, Obsidian count, Prestige bonus</p>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-4 rounded-2xl font-bold text-white text-base active:scale-95 transition-transform mb-3 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6B21A8, #7C3AED)' }}
            >
              รับ Prestige! 👑
            </button>
            <button
              onClick={onCancel}
              className="w-full py-3 rounded-2xl text-purple-400 text-sm font-medium active:scale-95 transition-transform border border-purple-800"
            >
              ยังไม่ตอนนี้
            </button>
          </>
        )}
      </div>
    </div>
  )
}
