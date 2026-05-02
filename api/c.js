export const config = { runtime: 'edge' }

const APP_URL = 'https://zapiq-taupe.vercel.app'

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function decodeChallenge(encoded) {
  try {
    const b64  = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(atob(b64)))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export default function handler(req) {
  const { searchParams } = new URL(req.url)
  const c = searchParams.get('c') || ''

  // Decode challenger info for OG description
  let name = 'Someone', zapiqScore = null, brainAge = null
  if (c) {
    const data = decodeChallenge(c)
    if (data) {
      name       = data.n || name
      zapiqScore = data.z ?? null
      brainAge   = data.b ?? null
    }
  }

  const safeC    = encodeURIComponent(c)
  const ogImage  = `${APP_URL}/api/og?c=${safeC}`
  const spaUrl   = `${APP_URL}/?c=${safeC}`
  const title    = escapeHtml(`${name} ท้าคุณใน ZAPIQ! 🧠⚡`)
  const desc     = escapeHtml(
    zapiqScore
      ? `ZAPIQ Score: ${zapiqScore}${brainAge ? ` | Brain Age: ${brainAge} ปี` : ''} — รับการท้าได้เลย!`
      : 'ลองวัดความสามารถของคุณกับฉันในเกม ZAPIQ!'
  )

  const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>

  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:title"       content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image"       content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height"content="630" />
  <meta property="og:url"         content="${spaUrl}" />
  <meta property="og:site_name"   content="ZAPIQ" />

  <!-- Twitter / LINE uses og: tags too -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image"       content="${ogImage}" />

  <!-- Instant redirect for real browsers -->
  <meta http-equiv="refresh" content="0;url=${spaUrl}" />
</head>
<body style="margin:0;background:#FAF8FF;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#2C2C2A">
  <p>กำลังโหลด ZAPIQ...</p>
  <script>window.location.replace('${spaUrl}')</script>
</body>
</html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  })
}
