const APP_URL = 'https://zapiq-taupe.vercel.app'

export function buildShareText({ playerName, score, crownLevel, gameMode, gameName, brainAge, zapiqScore }) {
  const crownEmoji = { silver: '🥈', gold: '🥇', diamond: '💎', boss: '🔮' }[crownLevel] || '🏆'
  const modeLabel  = gameMode === 'combo' ? 'Combo Mode' : gameName || 'Quick Game'
  let text = `${crownEmoji} I scored ${score} pts in ZAPIQ ${modeLabel} (${(crownLevel || '').toUpperCase()} Crown)!`
  if (gameMode === 'combo' && brainAge && zapiqScore) {
    text += `\n🧠 Brain Age: ${brainAge} ปี | ZAPIQ Score: ${zapiqScore}`
  }
  text += `\nCan you beat me? ▶ ${APP_URL}`
  text += `\n(เล่นเพื่อความสนุกเท่านั้น ไม่ใช่ผล IQ จริง)`
  return text
}

export function shareToLINE(text) {
  const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(APP_URL)}&text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener')
}

export function shareToFacebook() {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}`
  window.open(url, '_blank', 'noopener')
}

// Challenge-specific share: use the /api/c URL so social crawlers see the OG preview image
export function shareChallengeToLINE(challengeUrl) {
  const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(challengeUrl)}`
  window.open(url, '_blank', 'noopener')
}

export function shareChallengeToFacebook(challengeUrl) {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(challengeUrl)}`
  window.open(url, '_blank', 'noopener')
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
