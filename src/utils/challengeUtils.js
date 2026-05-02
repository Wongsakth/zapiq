const APP_URL = 'https://zapiq-taupe.vercel.app'

// URL-safe Base64 that handles Unicode player names
export function encodeChallenge(data) {
  try {
    const json = JSON.stringify(data)
    const b64  = btoa(unescape(encodeURIComponent(json)))
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  } catch {
    return null
  }
}

export function decodeChallenge(encoded) {
  try {
    const b64  = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(atob(b64)))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function buildChallengeUrl(data) {
  const encoded = encodeChallenge(data)
  // /api/c serves OG meta tags for social previews, then redirects to /?c=...
  return encoded ? `${APP_URL}/api/c?c=${encoded}` : null
}

export function parseChallengeFromUrl() {
  try {
    const params  = new URLSearchParams(window.location.search)
    const encoded = params.get('c')
    if (!encoded) return null
    return decodeChallenge(encoded)
  } catch {
    return null
  }
}

export function clearChallengeFromUrl() {
  window.history.replaceState({}, '', window.location.pathname)
}
