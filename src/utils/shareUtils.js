export function buildShareText({ playerName, score, crownLevel, gameMode, gameName }) {
  const crownEmoji = { silver: '🥈', gold: '🥇', diamond: '💎' }[crownLevel] || '🏆'
  const modeLabel = gameMode === 'combo' ? 'Combo Mode' : gameName || 'Quick Game'
  return `${crownEmoji} I scored ${score} pts in ZAPIQ ${modeLabel} (${crownLevel.toUpperCase()} Crown)!\nCan you beat me? Play ZAPIQ now 🎮`
}

export function shareToLINE(text) {
  const encoded = encodeURIComponent(text)
  window.open(`https://social-plugins.line.me/lineit/share?text=${encoded}`, '_blank', 'noopener')
}

export function shareToFacebook(text) {
  const encoded = encodeURIComponent(text)
  window.open(
    `https://www.facebook.com/sharer/sharer.php?quote=${encoded}&u=${encodeURIComponent('https://zapiq.app')}`,
    '_blank',
    'noopener'
  )
}

export function shareNative(text) {
  if (navigator.share) {
    navigator.share({ title: 'ZAPIQ', text }).catch(() => {})
    return true
  }
  return false
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  const el = document.createElement('textarea')
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  return Promise.resolve()
}
