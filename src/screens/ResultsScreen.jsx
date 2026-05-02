import React, { useState, useRef, useEffect } from 'react'
import useGameStore from '../store/gameStore'
import Crown from '../components/ui/Crown'
import LevelUpCelebration from '../components/ui/LevelUpCelebration'
import PrestigeScreen from '../components/ui/PrestigeScreen'
import { LEVEL_CONFIG, GAMES } from '../utils/levelConfig'
import { buildShareText, shareToLINE, shareToFacebook, shareNative, copyToClipboard, shareChallengeToLINE, shareChallengeToFacebook } from '../utils/shareUtils'
import { buildChallengeUrl } from '../utils/challengeUtils'
import { getBrainAgeLabel, getBrainAgeColor, getZapiqLabel, getZapiqColor } from '../utils/brainAnalysis'
import { getPrestigeBonus, getPrestigeBonusLabel } from '../utils/prestigeUtils'
import { playSound } from '../utils/soundPlayer'

// ── Gradient map for html2canvas (needs inline styles, not Tailwind classes) ──
const CROWN_GRADIENT = {
  silver:  'linear-gradient(to right, #C8C4DC, #A8A4C0)',
  gold:    'linear-gradient(to right, #D4B840, #EDD890)',
  diamond: 'linear-gradient(to right, #80C0E8, #A0B0F0)',
}

// ── Off-screen card captured by html2canvas ──────────────────────────────────
function CaptureCard({ playerName, crownLevel, sessionScores, brainAge, zapiqScore, gameMode }) {
  const cfg  = LEVEL_CONFIG[crownLevel] || LEVEL_CONFIG.silver
  const bc   = brainAge   ? getBrainAgeColor(brainAge)   : null
  const zc   = zapiqScore ? getZapiqColor(zapiqScore)    : null
  const grad = CROWN_GRADIENT[crownLevel] || CROWN_GRADIENT.silver
  const total = sessionScores ? sessionScores.reduce((a, b) => a + b, 0) : 0

  return (
    <div style={{
      width: 375,
      background: '#FAF8FF',
      borderRadius: 24,
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
    }}>
      {/* Header */}
      <div style={{ background: grad, padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <Crown level={crownLevel} size={52} animated={false} />
        <div>
          <p style={{ fontWeight: 700, fontSize: 20, color: '#2C2C2A', margin: 0 }}>{playerName}</p>
          <p style={{ fontSize: 13, color: 'rgba(44,44,42,0.6)', margin: '2px 0 0' }}>{cfg.label}</p>
        </div>
      </div>

      {/* Brain Analysis */}
      {bc && zc && (
        <div style={{ display: 'flex', gap: 10, padding: '14px 16px 0' }}>
          <div style={{ flex: 1, background: bc.bg, border: `2px solid ${bc.border}`, borderRadius: 14, padding: '10px 12px' }}>
            <p style={{ color: '#9D9AA8', fontSize: 11, margin: '0 0 3px' }}>Brain Age</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
              <span style={{ fontSize: 38, fontWeight: 900, color: bc.text, lineHeight: 1 }}>{brainAge}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: bc.text, paddingBottom: 3 }}>ปี</span>
            </div>
            <p style={{ color: '#6B6878', fontSize: 11, margin: '4px 0 0', lineHeight: 1.3 }}>{getBrainAgeLabel(brainAge)}</p>
          </div>
          <div style={{ flex: 1, background: zc.bg, border: `2px solid ${zc.border}`, borderRadius: 14, padding: '10px 12px' }}>
            <p style={{ color: '#9D9AA8', fontSize: 11, margin: '0 0 3px' }}>ZAPIQ Score</p>
            <p style={{ fontSize: 38, fontWeight: 900, color: zc.text, lineHeight: 1, margin: 0 }}>{zapiqScore}</p>
            <p style={{ color: '#6B6878', fontSize: 11, margin: '4px 0 0', lineHeight: 1.3 }}>{getZapiqLabel(zapiqScore)}</p>
          </div>
        </div>
      )}

      {/* Game breakdown */}
      {gameMode === 'combo' && sessionScores?.length > 0 && (
        <div style={{ padding: '14px 16px 0' }}>
          {GAMES.map((g, i) => (
            <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#6B6878', fontSize: 14 }}>{g.emoji} {g.name}</span>
              <span style={{ color: '#2C2C2A', fontWeight: 700, fontSize: 14 }}>+{sessionScores[i] || 0}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #E8E4F0', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6B6878', fontSize: 14, fontWeight: 600 }}>Total</span>
            <span style={{ color: '#2C2C2A', fontSize: 18, fontWeight: 900 }}>{total} pts</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#9D9AA8', fontSize: 12 }}>🎮 zapiq-taupe.vercel.app</span>
        <span style={{ color: '#9D9AA8', fontSize: 14, fontWeight: 800, letterSpacing: 2 }}>ZAPIQ</span>
      </div>
      <div style={{ padding: '0 16px 14px', textAlign: 'center' }}>
        <span style={{ color: '#C8C4DC', fontSize: 9 }}>For entertainment purposes only • zapiq-taupe.vercel.app</span>
      </div>
    </div>
  )
}

// ── Visual score card (shown in UI) ──────────────────────────────────────────
function ScoreCard({ playerName, crownLevel, sessionScores, totalScore, gameMode, selectedGame, isNew }) {
  const cfg = LEVEL_CONFIG[crownLevel]
  const isBoss = gameMode === 'boss'
  const gameNames = (gameMode === 'combo' || isBoss)
    ? GAMES.map(g => g.name)
    : [GAMES.find(g => g.id === selectedGame)?.name || 'Game']

  if (isBoss) {
    return (
      <div className="rounded-3xl overflow-hidden border-2 border-purple-700 shadow-lg"
           style={{ background: 'linear-gradient(135deg, #1A0A3A, #2D1B50)' }}>
        <div className="p-4 flex items-center gap-3 border-b border-purple-800">
          <Crown level="obsidian" size={44} animated={false} />
          <div>
            <p className="font-syne font-bold text-white text-lg">{playerName}</p>
            <p className="shimmer-obsidian font-bold text-xs">Boss Stage Clear!</p>
          </div>
          {isNew && (
            <span className="ml-auto text-xs font-bold text-purple-200 bg-purple-900/60 px-2 py-1 rounded-full">
              🏆 NEW BEST!
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="mb-4 space-y-2">
            {GAMES.map((g, i) => (
              <div key={g.id} className="flex justify-between items-center">
                <span className="text-purple-300 text-sm">{g.emoji} {g.name}</span>
                <span className="text-white font-bold tabular-nums">+{sessionScores[i] || 0}</span>
              </div>
            ))}
            <div className="border-t border-purple-800 pt-2 flex justify-between items-center">
              <span className="text-purple-300 text-sm font-medium">Total</span>
              <span className="text-white font-extrabold text-lg tabular-nums">{totalScore}</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-3 text-center">
          <p className="font-syne font-bold text-purple-500 text-sm tracking-widest">ZAPIQ · OBSIDIAN</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-3xl overflow-hidden border ${cfg.theme.accentBorder} bg-white shadow-sm`}>
      <div className={`bg-gradient-to-r ${cfg.theme.gradient} p-4 flex items-center gap-3`}>
        <Crown level={crownLevel} size={40} animated={false} />
        <div>
          <p className="font-syne font-bold text-[#2C2C2A] text-lg">{playerName}</p>
          <p className="text-[#2C2C2A]/70 text-xs">{cfg.label}</p>
        </div>
        {isNew && (
          <span className="ml-auto text-xs font-bold text-[#2C2C2A] bg-white/40 px-2 py-1 rounded-full">
            🏆 NEW BEST!
          </span>
        )}
      </div>
      <div className="p-4">
        {gameMode === 'combo' && sessionScores.length > 0 && (
          <div className="mb-4 space-y-2">
            {GAMES.map((g, i) => (
              <div key={g.id} className="flex justify-between items-center">
                <span className="text-[#6B6878] text-sm">{g.emoji} {g.name}</span>
                <span className="text-[#2C2C2A] font-bold tabular-nums">+{sessionScores[i] || 0}</span>
              </div>
            ))}
            <div className="border-t border-[#E8E4F0] pt-2 flex justify-between items-center">
              <span className="text-[#6B6878] text-sm font-medium">Total</span>
              <span className="text-[#2C2C2A] font-extrabold text-lg tabular-nums">{totalScore}</span>
            </div>
          </div>
        )}
        {gameMode === 'single' && (
          <div className="text-center py-2">
            <p className="text-[#9D9AA8] text-sm mb-1">{gameNames[0]} Score</p>
            <p className="text-[#2C2C2A] font-extrabold text-5xl tabular-nums">{totalScore}</p>
          </div>
        )}
      </div>
      <div className="px-4 pb-3 text-center">
        <p className="font-syne font-bold text-[#9D9AA8] text-sm tracking-widest">ZAPIQ</p>
      </div>
    </div>
  )
}

function BrainAnalysisCard({ brainAge, zapiqScore, breakdown }) {
  const bc = getBrainAgeColor(brainAge)
  const zc = getZapiqColor(zapiqScore)
  return (
    <div className="mb-3 bg-white border border-[#E8E4F0] rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🧠</span>
        <span className="text-[#2C2C2A] font-bold text-base">Brain Analysis</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-xl p-3 border-2" style={{ backgroundColor: bc.bg, borderColor: bc.border }}>
          <p className="text-[#9D9AA8] text-xs mb-0.5">Brain Age</p>
          <div className="flex items-end gap-1 mb-0.5">
            <p className="font-extrabold tabular-nums leading-none" style={{ fontSize: 40, color: bc.text }}>{brainAge}</p>
            <p className="text-sm font-bold pb-0.5" style={{ color: bc.text }}>ปี</p>
          </div>
          <p className="text-xs leading-tight text-[#6B6878] mt-1">{getBrainAgeLabel(brainAge)}</p>
        </div>
        <div className="rounded-xl p-3 border-2" style={{ backgroundColor: zc.bg, borderColor: zc.border }}>
          <p className="text-[#9D9AA8] text-xs mb-0.5">ZAPIQ Score</p>
          <p className="font-extrabold tabular-nums leading-none mb-0.5" style={{ fontSize: 40, color: zc.text }}>{zapiqScore}</p>
          <p className="text-xs leading-tight text-[#6B6878] mt-1">{getZapiqLabel(zapiqScore)}</p>
        </div>
      </div>

      {/* Score Breakdown */}
      {breakdown && (
        <div className="bg-[#F7F5FC] border border-[#E8E4F0] rounded-xl px-3 py-2.5">
          <p className="text-[#9D9AA8] uppercase tracking-wider mb-2" style={{ fontSize: 10 }}>Score Breakdown</p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[#6B6878]" style={{ fontSize: 12 }}>⚡ Reaction (Tap สี)</span>
              <span className="text-[#2C2C2A] font-bold tabular-nums" style={{ fontSize: 12 }}>{breakdown.reactionScore} pts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B6878]" style={{ fontSize: 12 }}>🧮 Reasoning (Math)</span>
              <span className="text-[#2C2C2A] font-bold tabular-nums" style={{ fontSize: 12 }}>{breakdown.reasoningScore} pts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B6878]" style={{ fontSize: 12 }}>🧠 Retention (Memory)</span>
              <span className="text-[#2C2C2A] font-bold tabular-nums" style={{ fontSize: 12 }}>{breakdown.retentionScore} pts</span>
            </div>
            <div className="border-t border-[#E8E4F0] pt-1.5 flex justify-between items-center">
              <span className="text-[#6B6878]" style={{ fontSize: 12 }}>👑 Crown Bonus</span>
              <span className="text-[#2C2C2A] font-bold tabular-nums" style={{ fontSize: 12 }}>×{breakdown.crownMultiplier.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Challenge comparison ──────────────────────────────────────────────────────
function ChallengeComparison({ playerName, playerScores, playerTotal, challengeData }) {
  const cScores = [challengeData.t || 0, challengeData.m || 0, challengeData.mem || 0]
  const cTotal  = cScores.reduce((a, b) => a + b, 0)
  const diff    = playerTotal - cTotal
  const tied    = diff === 0

  return (
    <div className="mb-3 bg-white border border-[#E8E4F0] rounded-2xl p-4">
      <p className="text-[#9D9AA8] text-xs uppercase tracking-wider mb-3">Challenge Result</p>

      <div className={`rounded-xl px-3 py-2 mb-3 text-center ${
        tied      ? 'bg-blue-50 border border-blue-200'
        : diff > 0 ? 'bg-green-50 border border-green-200'
        :            'bg-orange-50 border border-orange-200'
      }`}>
        <p className={`font-bold text-sm ${
          tied      ? 'text-blue-700'
          : diff > 0 ? 'text-green-700'
          :            'text-orange-700'
        }`}>
          {tied ? '🤝 เสมอกัน!' : diff > 0 ? '🏆 คุณชนะ!' : '😤 แพ้แค่นิดเดียว! ลองใหม่?'}
        </p>
        {!tied && <p className="text-xs mt-0.5 opacity-70">{diff > 0 ? `+${diff}` : diff} pts</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <p className="text-[#9D9AA8] text-xs mb-1 truncate">คุณ</p>
          <p className="text-[#2C2C2A] font-extrabold text-2xl tabular-nums">{playerTotal}</p>
          <div className="mt-1 space-y-0.5">
            {GAMES.map((g, i) => (
              <p key={g.id} className="text-[#9D9AA8] text-xs tabular-nums">{g.emoji} {playerScores[i] || 0}</p>
            ))}
          </div>
        </div>
        <div className="text-center">
          <p className="text-[#9D9AA8] text-xs mb-1 truncate">{challengeData.n || 'Challenger'}</p>
          <p className="text-[#2C2C2A] font-extrabold text-2xl tabular-nums">{cTotal}</p>
          <div className="mt-1 space-y-0.5">
            {GAMES.map((g, i) => (
              <p key={g.id} className="text-[#9D9AA8] text-xs tabular-nums">{g.emoji} {cScores[i]}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Share modal ───────────────────────────────────────────────────────────────
function ShareModal({ text, shareData, onClose }) {
  const [copied, setCopied]       = useState(false)
  const [saveState, setSaveState] = useState('idle') // 'idle' | 'loading' | 'done'
  const captureRef = useRef(null)

  const handleCopy = async () => {
    await copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveImage = async () => {
    if (saveState !== 'idle') return
    setSaveState('loading')
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#FAF8FF',
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      })
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'ZAPIQ-scorecard.png'
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setSaveState('done')
      setTimeout(() => setSaveState('idle'), 2500)
    } catch {
      setSaveState('idle')
    }
  }

  return (
    <>
      {/* Off-screen capture target */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
        <div ref={captureRef}>
          <CaptureCard {...shareData} />
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2C2C2A]/50 animate-fade-in">
        <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 animate-slide-up">
          <div className="w-10 h-1 bg-[#E8E4F0] rounded-full mx-auto mb-5" />
          <h3 className="text-[#2C2C2A] font-bold text-lg mb-4 text-center">Share Your Score</h3>

          {/* Preview text */}
          <div className="bg-gray-50 rounded-2xl p-3 mb-4">
            <p className="text-[#6B6878] text-sm leading-relaxed">{text}</p>
          </div>

          {/* Row 1: LINE + Facebook */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={() => shareToLINE(text)}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#06C755] active:scale-90 transition-transform"
            >
              <span className="text-xl">💬</span>
              <span className="text-white text-sm font-bold">LINE</span>
            </button>
            <button
              onClick={() => shareToFacebook()}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#1877F2] active:scale-90 transition-transform"
            >
              <span className="text-white text-xl font-black">f</span>
              <span className="text-white text-sm font-bold">Facebook</span>
            </button>
          </div>

          {/* Row 2: Save Image */}
          <button
            onClick={handleSaveImage}
            disabled={saveState === 'loading'}
            className={`w-full py-3 rounded-2xl text-white text-sm font-bold mb-3 active:scale-95 transition-transform ${
              saveState === 'done'
                ? 'bg-green-500'
                : 'bg-indigo-500 active:bg-indigo-600'
            }`}
          >
            {saveState === 'loading' ? '⏳ กำลังบันทึก...'
             : saveState === 'done'  ? '✓ บันทึกแล้ว!'
             :                         '💾 บันทึกรูปภาพ'}
          </button>

          {/* Row 3: Copy text */}
          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-2xl bg-white border border-[#E8E4F0] text-[#6B6878] text-sm font-medium active:scale-95 transition-transform mb-3"
          >
            {copied ? '✓ Copied!' : '📋 Copy Text'}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl text-[#9D9AA8] text-sm active:scale-95 transition-transform"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ResultsScreen() {
  const {
    playerName, crownLevel, sessionScores,
    lastSessionScore, lastGameMode, lastSelectedGame,
    lastPlayedLevel, lastIsNewHighScore, lastPreviousBest,
    highScores, obsidianUnlocked, obsidianCount,
    brainAnalysis, prestigeLevel,
    levelUpTriggered, bossUnlockTriggered,
    clearLevelUp, clearBossUnlock,
    confirmPrestige,
    isChallenge, challengeData,
    goHome, navigateTo,
  } = useGameStore()
  const [showShare, setShowShare]             = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showPrestige, setShowPrestige]       = useState(false)
  const [challengeUrlState, setChallengeUrlState] = useState(null) // null | { url, copied }
  const [savedToast, setSavedToast]           = useState(false)
  const celebTimerRef = useRef(null)

  const isCelebrating    = levelUpTriggered || bossUnlockTriggered
  const celebrationLevel = bossUnlockTriggered ? 'obsidian' : crownLevel

  useEffect(() => {
    if (!isCelebrating) return
    celebTimerRef.current = setTimeout(() => {
      setShowCelebration(true)
      playSound(bossUnlockTriggered ? 'bossUnlock' : 'levelUp')
    }, 1500)
    return () => clearTimeout(celebTimerRef.current)
  }, [isCelebrating, bossUnlockTriggered])

  const zapiqScore  = brainAnalysis?.zapiqScore ?? 0
  const brainAge    = brainAnalysis?.brainAge   ?? null
  const tapScore    = sessionScores[0] || 0
  const mathScore   = sessionScores[1] || 0
  const memoryScore = sessionScores[2] || 0

  // Auto-save to leaderboard after every combo game
  useEffect(() => {
    const saveToFirebase = async () => {
      try {
        const { db }               = await import('../firebase')
        const { doc, setDoc, getDoc } = await import('firebase/firestore')

        const silverBest   = highScores?.silver?.combo  || 0
        const goldBest     = highScores?.gold?.combo    || 0
        const diamondBest  = highScores?.diamond?.combo || 0
        const prestigeScore = silverBest + goldBest + diamondBest + ((obsidianCount || 0) * 2)

        const playerData = {
          playerName:    playerName || 'Anonymous',
          zapiqScore:    zapiqScore  || 0,
          brainAge:      brainAge    || 0,
          crownLevel:    crownLevel  || 'silver',
          obsidianCount: obsidianCount || 0,
          tapScore,
          mathScore,
          memoryScore,
          silverBest,
          goldBest,
          diamondBest,
          prestigeScore,
          updatedAt: new Date().toISOString(),
        }

        console.log('[FIREBASE] Saving player data:', playerData)

        const playerRef = doc(db, 'leaderboard', playerName || 'Anonymous')
        const existing  = await getDoc(playerRef)

        if (!existing.exists() || (existing.data().prestigeScore || 0) < prestigeScore) {
          await setDoc(playerRef, playerData)
          console.log('[FIREBASE] Score saved successfully!')
          setSavedToast(true)
          setTimeout(() => setSavedToast(false), 2500)
        } else {
          console.log('[FIREBASE] Existing score is higher, not updating')
        }
      } catch (err) {
        console.error('[FIREBASE] Save error:', err.code, err.message)
      }
    }

    if (zapiqScore > 0 && playerName) saveToFirebase()
    else console.log('[FIREBASE] skipping save — zapiqScore:', zapiqScore, 'playerName:', playerName)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDismissCelebration = () => {
    setShowCelebration(false)
    if (bossUnlockTriggered) {
      clearBossUnlock()
      setShowPrestige(true)   // every boss completion → prestige screen
    } else {
      clearLevelUp()
    }
  }

  const handlePrestigeConfirm = () => {
    confirmPrestige()
    // confirmPrestige navigates to home; PrestigeScreen shows success state then onCancel closes
  }

  const handlePrestigeCancel = () => {
    setShowPrestige(false)
  }

  const handleChallengeShare = async () => {
    const payload = {
      n:   playerName,
      c:   crownLevel,
      o:   obsidianCount,
      t:   sessionScores[0] || 0,
      m:   sessionScores[1] || 0,
      mem: sessionScores[2] || 0,
      b:   brainAnalysis?.brainAge,
      z:   brainAnalysis?.zapiqScore,
    }
    const url = buildChallengeUrl(payload)
    if (!url) return
    const challengeText = `${playerName} ท้าคุณใน ZAPIQ! 🧠⚡\n${url}`
    setChallengeUrlState({ url, copied: false })
    await copyToClipboard(url)
    setChallengeUrlState({ url, copied: true })
    shareNative(challengeText)
  }

  const isBoss       = lastGameMode === 'boss'
  const playedLevel  = lastPlayedLevel || crownLevel
  const cfg          = isBoss ? LEVEL_CONFIG.boss : (LEVEL_CONFIG[playedLevel] || LEVEL_CONFIG[crownLevel])
  const total        = lastSessionScore
  const progressScore = highScores[crownLevel]?.combo || 0
  const nextCfg       = (LEVEL_CONFIG[crownLevel] || {}).nextLevel
    ? LEVEL_CONFIG[LEVEL_CONFIG[crownLevel].nextLevel]
    : null

  const shareText = buildShareText({
    playerName,
    score: total,
    crownLevel: isBoss ? 'boss' : crownLevel,
    gameMode: lastGameMode,
    gameName: GAMES.find(g => g.id === lastSelectedGame)?.name,
    brainAge:   brainAnalysis?.brainAge,
    zapiqScore: brainAnalysis?.zapiqScore,
  })

  const shareData = {
    playerName,
    crownLevel,
    sessionScores,
    brainAge:   brainAnalysis?.brainAge,
    zapiqScore: brainAnalysis?.zapiqScore,
    gameMode: lastGameMode,
  }

  const headingEmoji = total > 30 ? '🏆' : total > 15 ? '🎉' : '💪'
  const headingText  = total > 30 ? 'Incredible!' : total > 15 ? 'Great Job!' : 'Keep Going!'

  return (
    <div
      className={`flex flex-col h-full screen-enter ${isBoss ? '' : cfg.theme.bg}`}
      style={isBoss ? { background: '#1A1028' } : undefined}
    >
      <div className="flex-1 overflow-y-auto px-4 pt-6">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2 animate-bounce-in">{headingEmoji}</div>
          <h1 className={`font-extrabold text-3xl mb-1 ${isBoss ? 'text-white' : 'text-[#2C2C2A]'}`}>
            {isBoss ? (obsidianUnlocked ? '⚡ Obsidian Earned!' : headingText) : headingText}
          </h1>
          {isBoss && obsidianUnlocked && (
            <p className="shimmer-obsidian font-syne font-bold text-lg">Obsidian Crown Unlocked</p>
          )}
          {!isBoss && lastGameMode === 'combo' && playedLevel === crownLevel && cfg.nextLevel && (
            <p className="text-[#6B6878] text-sm">
              {total >= cfg.upgradeScore
                ? `🚀 You've advanced to ${LEVEL_CONFIG[cfg.nextLevel].name}!`
                : `${cfg.upgradeScore - total} more points to reach ${LEVEL_CONFIG[cfg.nextLevel].name}`}
            </p>
          )}
          {/* Active prestige bonus indicator */}
          {prestigeLevel > 0 && (
            <p className="text-purple-500 text-xs mt-1 font-medium">
              ✦ Prestige ×{prestigeLevel}: {getPrestigeBonusLabel(prestigeLevel)}
            </p>
          )}
        </div>

        {/* New high score banner */}
        {lastIsNewHighScore && total > 0 && (
          <div className={`rounded-2xl px-4 py-3 mb-4 text-center ${
            isBoss ? 'bg-purple-900/60 border border-purple-600' : 'bg-[#A8D5A2]/30 border border-[#A8D5A2]'
          }`}>
            <p className={`font-extrabold text-base ${isBoss ? 'text-purple-200' : 'text-[#1A4D1A]'}`}>
              🏆 New High Score!
            </p>
            {lastPreviousBest > 0 && (
              <p className={`text-xs mt-0.5 ${isBoss ? 'text-purple-400' : 'text-[#6B6878]'}`}>
                {lastPreviousBest} → {total} pts
              </p>
            )}
          </div>
        )}

        <div className="mb-4 animate-slide-up">
          <ScoreCard
            playerName={playerName}
            crownLevel={isBoss ? 'obsidian' : playedLevel}
            sessionScores={sessionScores}
            totalScore={total}
            gameMode={lastGameMode}
            selectedGame={lastSelectedGame}
            isNew={lastIsNewHighScore}
          />
        </div>

        {/* Brain Analysis — combo only */}
        {!isBoss && lastGameMode === 'combo' && brainAnalysis && (
          <BrainAnalysisCard
            brainAge={brainAnalysis.brainAge}
            zapiqScore={brainAnalysis.zapiqScore}
            breakdown={brainAnalysis.breakdown}
          />
        )}

        {/* Challenge comparison panel */}
        {!isBoss && isChallenge && challengeData && lastGameMode === 'combo' && (
          <ChallengeComparison
            playerName={playerName}
            playerScores={sessionScores}
            playerTotal={total}
            challengeData={challengeData}
          />
        )}

        {/* Level progress bar */}
        {!isBoss && nextCfg && (
          <div className="mb-3 bg-white border border-[#E8E4F0] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Crown level={crownLevel} size={18} animated={false} />
                <span className="text-[#6B6878] text-xs font-medium">{cfg.label}</span>
              </div>
              <span className="text-[#C8C4DC] text-xs font-bold">→</span>
              <div className="flex items-center gap-1.5">
                <Crown level={cfg.nextLevel} size={18} animated={false} />
                <span className="text-[#6B6878] text-xs font-medium">{nextCfg.label}</span>
              </div>
            </div>
            <div className="h-2.5 bg-[#E8E4F0] rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${cfg.theme.gradient} transition-all duration-700`}
                style={{ width: `${Math.min(100, (progressScore / cfg.upgradeScore) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#2C2C2A] text-xs font-bold tabular-nums">
                {progressScore} / {cfg.upgradeScore} pts
              </span>
              {progressScore >= cfg.upgradeScore ? (
                <span className="text-[#A8D5A2] text-xs font-semibold">✓ Ready to advance!</span>
              ) : (
                <span className="text-[#9D9AA8] text-xs">
                  {cfg.upgradeScore - progressScore} more pts to reach {nextCfg.name}
                </span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowShare(true)}
          className={`w-full py-4 rounded-2xl font-bold text-base mb-3 active:scale-95 transition-transform ${
            isBoss
              ? 'bg-purple-900/60 border border-purple-700 text-purple-200'
              : 'bg-white border border-[#E8E4F0] text-[#6B6878]'
          }`}
        >
          📤 Share Score
        </button>
      </div>

      <div className="px-4 pb-6 flex flex-col gap-3">
        <button
          onClick={() => navigateTo('mode-select')}
          className={`w-full py-4 rounded-2xl font-bold text-xl active:scale-95 transition-transform ${
            isBoss ? 'bg-purple-700 text-white' : 'text-[#1A4D1A] bg-[#A8D5A2]'
          }`}
        >
          {isChallenge ? '🔄 เล่นอีกครั้ง' : 'Play Again'}
        </button>
        {!isBoss && lastGameMode === 'combo' && (
          <>
            <button
              onClick={handleChallengeShare}
              className="w-full py-4 rounded-2xl font-bold text-xl text-white bg-[#6B4EFF] active:scale-95 transition-transform shadow-sm"
            >
              {isChallenge ? '⚡ ท้าคืน!' : '⚡ ท้าเพื่อน!'}
            </button>
            {challengeUrlState && (
              <div className="rounded-2xl bg-[#F0EDF8] border border-[#D5CFF0] px-4 py-3">
                <p className="text-[#6B4EFF] text-xs font-semibold mb-2">
                  {challengeUrlState.copied ? '✓ คัดลอกลิงก์แล้ว!' : 'กำลังคัดลอก...'}
                </p>
                <p className="text-[#9D9AA8] break-all mb-3" style={{ fontSize: 11 }}>
                  {challengeUrlState.url}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => shareChallengeToLINE(challengeUrlState.url)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#06C755] active:scale-90 transition-transform"
                  >
                    <span className="text-base">💬</span>
                    <span className="text-white text-sm font-bold">LINE</span>
                  </button>
                  <button
                    onClick={() => shareChallengeToFacebook(challengeUrlState.url)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1877F2] active:scale-90 transition-transform"
                  >
                    <span className="text-white text-base font-black">f</span>
                    <span className="text-white text-sm font-bold">Facebook</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        <button
          onClick={goHome}
          className={`w-full py-3 rounded-xl font-medium text-sm active:scale-95 transition-transform ${
            isBoss ? 'text-purple-400' : 'text-[#9D9AA8]'
          }`}
        >
          Back to Home
        </button>
      </div>

      {/* Leaderboard saved toast */}
      {savedToast && (
        <div className="mx-4 mb-2 px-4 py-2 rounded-xl bg-[#A8D5A2]/30 border border-[#A8D5A2] text-center">
          <p className="text-[#1A4D1A] text-xs font-semibold">บันทึกคะแนนแล้ว ✓</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-6 pb-5 text-center">
        <p className="text-[#B8B4C4] leading-snug" style={{ fontSize: 11 }}>
          ⚠️ ZAPIQ Score และ Brain Age คำนวณจากความเร็วและความแม่นยำในเกมเท่านั้น ไม่ใช่การทดสอบ IQ หรือสติปัญญาที่ได้มาตรฐานทางวิทยาศาสตร์ ใช้เพื่อความสนุกเท่านั้น
        </p>
      </div>

      {showShare && (
        <ShareModal
          text={shareText}
          shareData={shareData}
          onClose={() => setShowShare(false)}
        />
      )}

      {showCelebration && (
        <LevelUpCelebration
          level={celebrationLevel}
          onDismiss={handleDismissCelebration}
        />
      )}

      {showPrestige && (
        <PrestigeScreen
          obsidianCount={obsidianCount}
          onConfirm={handlePrestigeConfirm}
          onCancel={handlePrestigeCancel}
        />
      )}

    </div>
  )
}
