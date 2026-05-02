// Brain Age and ZAPIQ Score calculations from per-game stats

export function computeBrainAge(tapStats, mathStats, memStats) {
  let age = 30

  // Tap Color — Processing Speed
  const tap = tapStats || {}
  age -= (tap.correct ?? 0) * 0.3
  age += (tap.wrong   ?? 0) * 0.5
  const tapAttempts = (tap.correct ?? 0) + (tap.wrong ?? 0)
  if (tapAttempts > 0 && (tap.correct ?? 0) / tapAttempts >= 0.75) age -= 2

  // Math Blitz — Numerical Reasoning
  const math = mathStats || {}
  age -= (math.correct  ?? 0) * 0.4
  age += (math.wrong    ?? 0) * 0.6
  age -= Math.floor((math.maxStreak ?? 0) / 3)

  // Memory Match — Short-term Memory
  const mem = memStats || {}
  age -= (mem.pairsMatched ?? 0) * 0.5
  age += (mem.mismatches   ?? 0) * 0.3
  if (mem.completed) age -= 3

  return Math.max(16, Math.min(65, Math.round(age)))
}

// Returns full breakdown + final score
export function computeZapiqBreakdown(tapStats, mathStats, memStats, crownLevel) {
  const tap  = tapStats  || {}
  const math = mathStats || {}
  const mem  = memStats  || {}

  // 1. Reaction Score (Tap Color) — accuracy only
  const tapCorrect = tap.correct ?? 0
  const tapTotal   = tapCorrect + (tap.wrong ?? 0)
  const reactionScore = tapTotal > 0 ? (tapCorrect / tapTotal) * 100 : 0

  // 2. Reasoning Score (Math) — accuracy + streak bonus, cap 120
  const mathCorrect = math.correct ?? 0
  const mathTotal   = mathCorrect + (math.wrong ?? 0)
  const mathAcc     = mathTotal > 0 ? mathCorrect / mathTotal : 0
  const streakBonus = Math.min(20, (math.maxStreak ?? 0) * 2)
  const reasoningScore = mathTotal > 0
    ? Math.min(120, (mathAcc * 100) + streakBonus)
    : 0

  // 3. Retention Score (Memory) — completion ratio × time bonus, cap 120
  const pairsFound = mem.pairsMatched ?? 0
  const totalPairs = mem.totalPairs   || 1
  const timeLeft   = mem.timeLeft     ?? 0
  const totalTime  = mem.totalTime    || 1
  const timeBonus  = 1 + (timeLeft / totalTime)
  const retentionScore = totalPairs > 0
    ? Math.min(120, (pairsFound / totalPairs) * 100 * timeBonus)
    : 0

  // 4. Crown multiplier
  const crownMultiplier = { silver: 1.0, gold: 1.05, diamond: 1.10, obsidian: 1.15 }[crownLevel] || 1.0

  // 5. Final ZAPIQ Score
  const raw       = (reactionScore * 0.3) + (reasoningScore * 0.4) + (retentionScore * 0.3)
  const zapiqScore = Math.max(0, Math.min(145, Math.round(raw * crownMultiplier)))

  return {
    reactionScore:   Math.round(reactionScore),
    reasoningScore:  Math.round(reasoningScore),
    retentionScore:  Math.round(retentionScore),
    crownMultiplier,
    zapiqScore,
  }
}

export function computeZapiqScore(tapStats, mathStats, memStats, crownLevel) {
  return computeZapiqBreakdown(tapStats, mathStats, memStats, crownLevel).zapiqScore
}

export function getBrainAgeLabel(age) {
  if (age <= 20) return 'สมองระดับอัจฉริยะ! 🚀'
  if (age <= 25) return 'สมองเด็กมาก! ⚡'
  if (age <= 30) return 'สมองเยาว์วัย 🌟'
  if (age <= 35) return 'ดีกว่าค่าเฉลี่ย 👍'
  if (age <= 45) return 'ค่าเฉลี่ยปกติ'
  return 'ลองฝึกสมองเพิ่มนะ 💪'
}

export function getZapiqLabel(score) {
  if (score >= 120) return 'อัจฉริยะระดับ Top 1% 🏆'
  if (score >= 100) return 'เหนือค่าเฉลี่ยมาก ⭐'
  if (score >= 80)  return 'ดีกว่าค่าเฉลี่ย 👍'
  if (score >= 60)  return 'ค่าเฉลี่ยปกติ'
  return 'ฝึกเพิ่มได้นะ 💪'
}

export function getBrainAgeColor(age) {
  if (age <= 25) return { text: '#16A34A', bg: '#DCFCE7', border: '#86EFAC' }
  if (age <= 35) return { text: '#B45309', bg: '#FEF9C3', border: '#FDE68A' }
  return           { text: '#EA580C', bg: '#FFEDD5', border: '#FED7AA' }
}

export function getZapiqColor(score) {
  if (score >= 120) return { text: '#7C3AED', bg: '#EDE9FE', border: '#C4B5FD' }
  if (score >= 100) return { text: '#B45309', bg: '#FEF9C3', border: '#FDE68A' }
  if (score >= 80)  return { text: '#16A34A', bg: '#DCFCE7', border: '#86EFAC' }
  if (score >= 60)  return { text: '#1D4ED8', bg: '#DBEAFE', border: '#93C5FD' }
  return             { text: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' }
}
