import React from 'react'
import Crown from './Crown'

export default function BossWarning({ onReady }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(10,4,24,0.97)' }}
    >
      <div className="w-full max-w-[340px] text-center">
        <div className="flex justify-center mb-4">
          <Crown level="obsidian" size={64} animated />
        </div>

        <h2 className="font-syne font-extrabold text-white text-2xl mb-1 tracking-tight">
          ⚠️ BOSS STAGE
        </h2>
        <p className="text-purple-400 text-sm mb-6">อ่านกฎให้ดีก่อนเริ่ม!</p>

        <div className="bg-[#2D1B50] border border-purple-800 rounded-2xl p-4 mb-6 text-left space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">🌀</span>
            <div>
              <p className="text-white font-bold text-sm">Tap สี</p>
              <p className="text-purple-300 text-xs">อ่านคำ ไม่ใช่สีตัวอักษร!</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">⚔️</span>
            <div>
              <p className="text-white font-bold text-sm">Math</p>
              <p className="text-purple-300 text-xs">โจทย์ 2 ขั้นตอน คิดให้ดี!</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">💀</span>
            <div>
              <p className="text-white font-bold text-sm">Memory</p>
              <p className="text-purple-300 text-xs">การ์ดปิดใน 0.5 วิ จำให้แม่น!</p>
            </div>
          </div>
          <div className="border-t border-purple-800 pt-3 flex items-center gap-2">
            <span className="text-red-400 text-base">⚠️</span>
            <p className="text-red-300 text-sm font-bold">ผิด 3 ครั้งติด = Game Over ทันที!</p>
          </div>
        </div>

        <button
          onClick={onReady}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg active:scale-95 transition-transform shadow-xl"
          style={{ background: 'linear-gradient(135deg, #6B21A8, #7C3AED)' }}
        >
          รับมือแล้ว! 💪
        </button>
      </div>
    </div>
  )
}
