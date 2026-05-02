export function getPrestigeBonus(prestigeLevel) {
  if (prestigeLevel >= 10) return { timerBonus: 2, scoreMultiplier: 1.2, bossFlipDelay: 700, specialCrown: false, legendTitle: true }
  if (prestigeLevel >= 5)  return { timerBonus: 2, scoreMultiplier: 1.15, bossFlipDelay: 700, specialCrown: true, legendTitle: false }
  if (prestigeLevel >= 3)  return { timerBonus: 1, scoreMultiplier: 1.1, bossFlipDelay: 700, specialCrown: false, legendTitle: false }
  if (prestigeLevel >= 2)  return { timerBonus: 1, scoreMultiplier: 1.1, bossFlipDelay: 500, specialCrown: false, legendTitle: false }
  if (prestigeLevel >= 1)  return { timerBonus: 1, scoreMultiplier: 1.0, bossFlipDelay: 500, specialCrown: false, legendTitle: false }
  return { timerBonus: 0, scoreMultiplier: 1.0, bossFlipDelay: 500, specialCrown: false, legendTitle: false }
}

export function getPrestigeBonusLabel(prestigeLevel) {
  const b = getPrestigeBonus(prestigeLevel)
  const parts = []
  if (b.timerBonus > 0)         parts.push(`+${b.timerBonus}s timer`)
  if (b.scoreMultiplier > 1.0)  parts.push(`score ×${b.scoreMultiplier}`)
  if (b.bossFlipDelay === 700)  parts.push(`flip 0.7s`)
  if (b.specialCrown)           parts.push('Obsidian V crown')
  if (b.legendTitle)            parts.push('ZAPIQ Legend title')
  return parts.length > 0 ? parts.join(' · ') : 'No bonus'
}
