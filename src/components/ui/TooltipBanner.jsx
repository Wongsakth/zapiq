import React, { useEffect } from 'react'

export default function TooltipBanner({ text, autoDismissMs = 0, onDismiss, variant = 'light' }) {
  useEffect(() => {
    if (!autoDismissMs) return
    const t = setTimeout(onDismiss, autoDismissMs)
    return () => clearTimeout(t)
  }, [autoDismissMs, onDismiss])

  const style = variant === 'dark'
    ? 'bg-[#2D1B50] border border-purple-700 text-purple-100'
    : 'bg-[#2C2C2A]/90 border border-[#4A4844] text-white'

  return (
    <div
      className={`fixed bottom-24 left-4 right-4 z-40 rounded-2xl px-4 py-3 shadow-xl animate-slide-up ${style}`}
      onClick={onDismiss}
    >
      <p className="text-sm text-center leading-snug">{text}</p>
      <p className="text-xs text-center mt-1 opacity-50">แตะเพื่อปิด</p>
    </div>
  )
}
