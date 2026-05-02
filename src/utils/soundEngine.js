// Programmatic sound synthesis via Web Audio API — no audio files needed

let _ctx = null

function getCtx() {
  if (typeof window === 'undefined') return null
  try {
    if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)()
    if (_ctx.state === 'suspended') _ctx.resume()
    return _ctx
  } catch {
    return null
  }
}

// Schedule a simple oscillator note
function osc(ctx, { freq = 440, type = 'sine', t = 0, dur = 0.2, vol = 0.3, freqEnd = null }) {
  const now = ctx.currentTime + t
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.connect(g); g.connect(ctx.destination)
  o.type = type
  o.frequency.setValueAtTime(freq, now)
  if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, now + dur)
  g.gain.setValueAtTime(vol, now)
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
  o.start(now); o.stop(now + dur + 0.05)
}

// Short noise burst (clicks, flips)
function noise(ctx, { t = 0, dur = 0.05, vol = 0.2, filterFreq = 1000, filterType = 'bandpass' }) {
  const now = ctx.currentTime + t
  const samples = Math.ceil(ctx.sampleRate * dur)
  const buf = ctx.createBuffer(1, samples, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < samples; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / samples, 1.8)
  }
  const src = ctx.createBufferSource()
  const filt = ctx.createBiquadFilter()
  const g = ctx.createGain()
  src.buffer = buf
  src.connect(filt); filt.connect(g); g.connect(ctx.destination)
  filt.type = filterType
  filt.frequency.value = filterFreq
  g.gain.setValueAtTime(vol, now)
  src.start(now)
}

// ── Sounds ──────────────────────────────────────────────────────────────────

export function playDing() {
  const ctx = getCtx(); if (!ctx) return
  // Pleasant two-tone ding: fundamental + fifth
  osc(ctx, { freq: 880, freqEnd: 1050, dur: 0.18, vol: 0.28 })
  osc(ctx, { freq: 1320, dur: 0.13, vol: 0.12, t: 0.02 })
}

export function playBuzz() {
  const ctx = getCtx(); if (!ctx) return
  // Low sawtooth buzz — game-show buzzer feel
  osc(ctx, { freq: 170, freqEnd: 120, type: 'sawtooth', dur: 0.22, vol: 0.2 })
}

export function playLevelUp() {
  const ctx = getCtx(); if (!ctx) return
  // Ascending C5-E5-G5-C6 arpeggio then chord
  const scale = [523.2, 659.3, 784, 1046.5]
  scale.forEach((f, i) => osc(ctx, { freq: f, dur: 0.22, vol: 0.18, t: i * 0.1 }))
  scale.forEach(f  => osc(ctx, { freq: f, dur: 0.4,  vol: 0.12, t: 0.44 }))
}

export function playFlip() {
  const ctx = getCtx(); if (!ctx) return
  // Card-flip click: short bandpass noise
  noise(ctx, { dur: 0.05, vol: 0.13, filterFreq: 1600, filterType: 'bandpass' })
}

export function playPop() {
  const ctx = getCtx(); if (!ctx) return
  // Cheerful upward sweep — bubble pop
  osc(ctx, { freq: 220, freqEnd: 700, dur: 0.12, vol: 0.28 })
  osc(ctx, { freq: 440, freqEnd: 1100, dur: 0.09, vol: 0.12, t: 0.02 })
}

export function playGameOver() {
  const ctx = getCtx(); if (!ctx) return
  // Two-voice descending tone
  osc(ctx, { freq: 440, freqEnd: 200, dur: 0.5, vol: 0.25 })
  osc(ctx, { freq: 330, freqEnd: 160, dur: 0.4, vol: 0.12, t: 0.12 })
}

export function playTap() {
  const ctx = getCtx(); if (!ctx) return
  // Ultra-subtle high click for UI buttons
  noise(ctx, { dur: 0.022, vol: 0.055, filterFreq: 2400, filterType: 'highpass' })
}

export function playTick() {
  const ctx = getCtx(); if (!ctx) return
  // Sharp metallic clock tick: 800Hz square → 500Hz, 50ms
  osc(ctx, { freq: 800, freqEnd: 500, type: 'square', dur: 0.05, vol: 0.14 })
  noise(ctx, { dur: 0.025, vol: 0.06, filterFreq: 2000, filterType: 'highpass' })
}

export function playCountdownTick() {
  const ctx = getCtx(); if (!ctx) return
  // Crisp high-pitched click — higher than game tick (800Hz)
  osc(ctx, { freq: 1500, freqEnd: 1100, type: 'square', dur: 0.055, vol: 0.18 })
  noise(ctx, { dur: 0.025, vol: 0.08, filterFreq: 4000, filterType: 'highpass' })
}

export function playCountdownGo() {
  const ctx = getCtx(); if (!ctx) return
  // Punchy ascending burst — energetic game-start signal
  osc(ctx, { freq: 350, freqEnd: 900,  type: 'sine', dur: 0.18, vol: 0.32 })
  osc(ctx, { freq: 700, freqEnd: 1400, type: 'sine', dur: 0.15, vol: 0.20, t: 0.02 })
  osc(ctx, { freq: 1050,freqEnd: 2000, type: 'sine', dur: 0.12, vol: 0.12, t: 0.04 })
  noise(ctx, { dur: 0.06, vol: 0.10, filterFreq: 1800, filterType: 'bandpass' })
}

export function playBossUnlock() {
  const ctx = getCtx(); if (!ctx) return
  // Dramatic ascending power arpeggio
  const freqs = [110, 165, 220, 330, 440, 660]
  freqs.forEach((f, i) => {
    osc(ctx, { freq: f,     type: 'sawtooth', dur: 0.18, vol: 0.1,  t: i * 0.07 })
    osc(ctx, { freq: f * 2, type: 'sine',     dur: 0.18, vol: 0.06, t: i * 0.07 })
  })
  // Final triumphant chord
  ;[220, 277.2, 330, 440].forEach(f =>
    osc(ctx, { freq: f, dur: 0.55, vol: 0.09, t: 0.5 })
  )
}
