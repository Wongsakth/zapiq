import React, { useState } from 'react'
import useGameStore from '../store/gameStore'
import Crown from '../components/ui/Crown'
import { LEVEL_CONFIG, GAMES } from '../utils/levelConfig'
import { buildShareText, shareToLINE, shareToFacebook, shareNative, copyToClipboard } from '../utils/shareUtils'

function ScoreCard({ playerName, crownLevel, sessionScores, totalScore, gameMode, selectedGame, isNew }) {
  const cfg = LEVEL_CONFIG[crownLevel]
  const gameNames = gameMode === 'combo'
    ? GAMES.map(g => g.name)
    : [GAMES.find(g => g.id === selectedGame)?.name || 'Game']

  return (
    <div
      className={`rounded-3xl overflow-hidden border ${cfg.theme.border}`}
      style={{ background: `linear-gradient(135deg, ${cfg.theme.primary}15, ${cfg.theme.primary}05)` }}
    >
      {/* Crown header */}
      <div className={`bg-gradient-to-r ${cfg.theme.gradient} p-4 flex items-center gap-3`}>
        <Crown level={crownLevel} size={40} animated={false} />
        <div>
          <p className="font-syne font-bold text-black text-lg">{playerName}</p>
          <p className="text-black/70 text-xs">{cfg.label}</p>
        </div>
        {isNew && (
          <span className="ml-auto text-xs font-bold text-black bg-white/30 px-2 py-1 rounded-full">
            🏆 NEW BEST!
          </span>
        )}
      </div>

      {/* Score breakdown */}
      <div className="p-4">
        {gameMode === 'combo' && sessionScores.length > 0 && (
          <div className="mb-4 space-y-2">
            {GAMES.map((g, i) => (
              <div key={g.id} className="flex justify-between items-center">
                <span className="text-white/60 text-sm">{g.emoji} {g.name}</span>
                <span className="text-white font-bold tabular-nums">+{sessionScores[i] || 0}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-2 flex justify-between items-center">
              <span className="text-white/60 text-sm font-medium">Total</span>
              <span className="text-white font-extrabold text-lg tabular-nums">{totalScore}</span>
            </div>
          </div>
        )}

        {gameMode === 'single' && (
          <div className="text-center py-2">
            <p className="text-white/50 text-sm mb-1">{gameNames[0]} Score</p>
            <p className="text-white font-extrabold text-5xl tabular-nums">{totalScore}</p>
          </div>
        )}
      </div>

      {/* ZAPIQ branding */}
      <div className="px-4 pb-3 text-center">
        <p className="font-syne font-bold text-white/20 text-sm tracking-widest">ZAPIQ</p>
      </div>
    </div>
  )
}

function ShareModal({ text, onClose }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 animate-fade-in">
      <div className="w-full max-w-[430px] bg-gray-900 rounded-t-3xl p-6 animate-slide-up">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
        <h3 className="text-white font-bold text-lg mb-4 text-center">Share Your Score</h3>

        <div className="bg-white/5 rounded-2xl p-4 mb-4">
          <p className="text-white/70 text-sm leading-relaxed">{text}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            onClick={() => shareToLINE(text)}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-green-600 active:scale-90 transition-transform"
          >
            <span className="text-2xl">💬</span>
            <span className="text-white text-xs font-medium">LINE</span>
          </button>
          <button
            onClick={() => shareToFacebook(text)}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-blue-600 active:scale-90 transition-transform"
          >
            <span className="text-2xl">f</span>
            <span className="text-white text-xs font-medium">Facebook</span>
          </button>
          <button
            onClick={() => { if (!shareNative(text)) handleCopy() }}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/10 active:scale-90 transition-transform"
          >
            <span className="text-2xl">📤</span>
            <span className="text-white text-xs font-medium">More</span>
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-3 rounded-xl bg-white/10 text-white text-sm font-medium active:scale-95 transition-transform mb-3"
        >
          {copied ? '✓ Copied!' : 'Copy Text'}
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl text-white/50 text-sm active:scale-95 transition-transform"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default function ResultsScreen() {
  const {
    playerName, crownLevel, sessionScores,
    lastSessionScore, lastGameMode, lastSelectedGame,
    bestComboScores, goHome, navigateTo,
  } = useGameStore()
  const [showShare, setShowShare] = useState(false)

  const cfg = LEVEL_CONFIG[crownLevel]
  const total = lastSessionScore
  const isNewBest = lastGameMode === 'combo' && total > 0 &&
    total === bestComboScores[crownLevel]

  const shareText = buildShareText({
    playerName,
    score: total,
    crownLevel,
    gameMode: lastGameMode,
    gameName: GAMES.find(g => g.id === lastSelectedGame)?.name,
  })

  return (
    <div className={`flex flex-col h-full ${cfg.theme.bg} screen-enter`}>
      <div className="flex-1 overflow-y-auto px-4 pt-6">
        {/* Result header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2 animate-bounce-in">
            {total >= (cfg.upgradeScore || 999) ? '🏆' : total > 10 ? '🎉' : '💪'}
          </div>
          <h1 className="text-white font-extrabold text-3xl mb-1">
            {total >= (cfg.upgradeScore || 999) ? 'Incredible!' : total > 10 ? 'Great Job!' : 'Keep Going!'}
          </h1>
          {lastGameMode === 'combo' && cfg.nextLevel && (
            <p className="text-white/50 text-sm">
              {total >= cfg.upgradeScore
                ? `🚀 You've advanced to ${LEVEL_CONFIG[cfg.nextLevel].name}!`
                : `${cfg.upgradeScore - total} more points to reach ${LEVEL_CONFIG[cfg.nextLevel].name}`}
            </p>
          )}
        </div>

        {/* Score card */}
        <div className="mb-6 animate-slide-up">
          <ScoreCard
            playerName={playerName}
            crownLevel={crownLevel}
            sessionScores={sessionScores}
            totalScore={total}
            gameMode={lastGameMode}
            selectedGame={lastSelectedGame}
            isNew={isNewBest}
          />
        </div>

        {/* Share button */}
        <button
          onClick={() => setShowShare(true)}
          className="w-full py-4 rounded-2xl font-bold text-base mb-3
            bg-white/10 border border-white/20 text-white
            active:scale-95 transition-transform"
        >
          📤 Share Score
        </button>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-6 flex flex-col gap-3">
        <button
          onClick={() => navigateTo('mode-select')}
          className={`
            w-full py-4 rounded-2xl font-bold text-xl text-black
            bg-gradient-to-r ${cfg.theme.gradient}
            active:scale-95 transition-transform
          `}
        >
          Play Again
        </button>
        <button
          onClick={goHome}
          className="w-full py-3 rounded-xl font-medium text-white/60 text-sm active:scale-95 transition-transform"
        >
          Back to Home
        </button>
      </div>

      {showShare && (
        <ShareModal text={shareText} onClose={() => setShowShare(false)} />
      )}
    </div>
  )
}
