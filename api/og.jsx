import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

const APP_URL = 'https://zapiq-taupe.vercel.app'

const CROWN = {
  silver:   { bg: '#F2F0FA', card: '#FFFFFF', accent: '#8880A8', text: '#5A5070', name: 'Silver',  emoji: '🥈' },
  gold:     { bg: '#FFFBEF', card: '#FFFFFF', accent: '#C09830', text: '#8A6820', name: 'Gold',    emoji: '🥇' },
  diamond:  { bg: '#F0F6FF', card: '#FFFFFF', accent: '#0090B8', text: '#006080', name: 'Diamond', emoji: '💎' },
  obsidian: { bg: '#1A0A3A', card: '#2D1B50', accent: '#8B5CF6', text: '#C4B5FD', name: 'Obsidian',emoji: '👑' },
}

// Load Noto Sans Thai for Thai text support
async function loadThaiFont() {
  try {
    // Google Fonts with legacy UA returns format('truetype')
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;700',
      { headers: { 'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)' } }
    ).then(r => r.text())

    const match = css.match(/url\(([^)]+\.ttf)\)/)
    if (!match) return null
    return fetch(match[1]).then(r => r.arrayBuffer())
  } catch {
    return null
  }
}

// Decode the same URL-safe base64 format as challengeUtils.js
function decodeChallenge(encoded) {
  try {
    const b64  = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(atob(b64)))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url)

  // Parse challenge data from encoded `c` param
  let name = 'Someone', brainAge = null, zapiqScore = null
  let crown = 'silver', tap = 0, math = 0, mem = 0

  const c = searchParams.get('c')
  if (c) {
    const data = decodeChallenge(c)
    if (data) {
      name       = data.n   || name
      brainAge   = data.b   ?? null
      zapiqScore = data.z   ?? null
      crown      = data.c   || crown
      tap        = data.t   || 0
      math       = data.m   || 0
      mem        = data.mem || 0
    }
  }

  const col        = CROWN[crown] || CROWN.silver
  const total      = tap + math + mem
  const isObsidian = crown === 'obsidian'
  const textColor  = isObsidian ? '#E2E8F0' : '#2C2C2A'
  const subColor   = isObsidian ? '#9D9AA8' : '#6B6878'

  const fontData = await loadThaiFont()
  const fonts    = fontData ? [
    { name: 'NotoThai', data: fontData, weight: 400, style: 'normal' },
    { name: 'NotoThai', data: fontData, weight: 700, style: 'normal' },
  ] : []
  const fontFamily = fontData ? 'NotoThai, sans-serif' : 'sans-serif'

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: col.bg,
        padding: '56px 64px',
        fontFamily,
      }}
    >
      {/* ── Top bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
        {/* ZAPIQ logo */}
        <div style={{ display: 'flex', fontSize: 52, fontWeight: 800, letterSpacing: '0.04em' }}>
          <span style={{ color: textColor }}>ZAP</span>
          <span style={{ color: '#E24B4A' }}>IQ</span>
        </div>

        {/* Crown badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: isObsidian ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.75)',
          border: `2px solid ${col.accent}`,
          borderRadius: 50,
          paddingLeft: 18, paddingRight: 24, paddingTop: 10, paddingBottom: 10,
        }}>
          <span style={{ fontSize: 30 }}>{col.emoji}</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: col.text }}>{col.name}</span>
        </div>
      </div>

      {/* ── Name ── */}
      <div style={{
        display: 'flex', fontSize: 54, fontWeight: 700,
        color: textColor, marginBottom: 32, lineHeight: 1.1,
      }}>
        {name}
      </div>

      {/* ── Score cards ── */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
        {zapiqScore !== null && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            background: isObsidian ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.85)',
            border: `2.5px solid ${col.accent}`,
            borderRadius: 22, padding: '18px 28px', flex: 1,
          }}>
            <span style={{ fontSize: 15, color: '#9D9AA8', marginBottom: 6 }}>ZAPIQ Score</span>
            <span style={{ fontSize: 76, fontWeight: 900, color: col.accent, lineHeight: 1 }}>{zapiqScore}</span>
          </div>
        )}
        {brainAge !== null && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            background: isObsidian ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.85)',
            border: `2.5px solid ${col.accent}`,
            borderRadius: 22, padding: '18px 28px', flex: 1,
          }}>
            <span style={{ fontSize: 15, color: '#9D9AA8', marginBottom: 6 }}>Brain Age</span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <span style={{ fontSize: 76, fontWeight: 900, color: col.accent, lineHeight: 1 }}>{brainAge}</span>
              <span style={{ fontSize: 26, fontWeight: 700, color: col.accent, paddingBottom: 8 }}>ปี</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Game score pills ── */}
      {total > 0 && (
        <div style={{ display: 'flex', gap: 14, marginBottom: 'auto' }}>
          {[['🎨', 'Tap Color', tap], ['🧮', 'Math Blitz', math], ['🧠', 'Memory', mem]].map(([emoji, label, score]) => (
            <div key={label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: isObsidian ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.6)',
              border: `1.5px solid ${isObsidian ? 'rgba(139,92,246,0.3)' : '#E8E4F0'}`,
              borderRadius: 18, padding: '14px 20px', flex: 1,
            }}>
              <span style={{ fontSize: 26 }}>{emoji}</span>
              <span style={{ fontSize: 13, color: '#9D9AA8', marginTop: 4 }}>{label}</span>
              <span style={{ fontSize: 30, fontWeight: 800, color: textColor, marginTop: 4 }}>+{score}</span>
            </div>
          ))}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: isObsidian ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.85)',
            border: `2.5px solid ${col.accent}`,
            borderRadius: 18, padding: '14px 20px', flex: 1,
          }}>
            <span style={{ fontSize: 13, color: '#9D9AA8' }}>Total</span>
            <span style={{ fontSize: 38, fontWeight: 900, color: col.accent, marginTop: 4 }}>{total}</span>
            <span style={{ fontSize: 13, color: '#9D9AA8' }}>pts</span>
          </div>
        </div>
      )}

      {/* ── Bottom CTA ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 28, paddingTop: 20,
        borderTop: `1.5px solid ${isObsidian ? 'rgba(139,92,246,0.3)' : 'rgba(0,0,0,0.08)'}`,
      }}>
        <span style={{ fontSize: 34, fontWeight: 800, color: col.accent }}>
          {fontData ? 'ท้าให้ชนะฉันได้!' : 'Beat my score!'}
        </span>
        <span style={{ fontSize: 18, color: subColor }}>zapiq-taupe.vercel.app</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts,
    }
  )
}
