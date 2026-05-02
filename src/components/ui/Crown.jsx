import React from 'react'

function SilverCrown({ size = 80, animated = true }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 100 85" fill="none" className={animated ? 'crown-silver' : ''}>
      <defs>
        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="30%" stopColor="#f8f8f8" />
          <stop offset="60%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#a8a8a8" />
        </linearGradient>
        <linearGradient id="silverShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M10 75 L90 75 L90 65 L10 65 Z" fill="url(#silverGrad)" />
      <path d="M10 65 L15 25 L35 50 L50 15 L65 50 L85 25 L90 65 Z" fill="url(#silverGrad)" />
      <path d="M10 65 L15 25 L35 50 L50 15 L65 50 L85 25 L90 65 Z" fill="url(#silverShine)" />
      <circle cx="50" cy="15" r="5" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="1" />
      <circle cx="15" cy="25" r="4" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="1" />
      <circle cx="85" cy="25" r="4" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="1" />
      <rect x="10" y="65" width="80" height="10" rx="3" fill="url(#silverGrad)" />
    </svg>
  )
}

function GoldCrown({ size = 80, animated = true }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 100 85" fill="none" className={animated ? 'crown-gold' : ''}>
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="30%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="goldBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <path d="M10 65 L15 25 L35 50 L50 15 L65 50 L85 25 L90 65 Z" fill="url(#goldGrad)" />
      <path d="M10 65 L15 25 L35 50 L50 15 L65 50 L85 25 L90 65 Z" fill="url(#goldShine)" />
      <circle cx="50" cy="15" r="6" fill="#fef08a" stroke="#fbbf24" strokeWidth="1.5" />
      <circle cx="15" cy="25" r="4.5" fill="#fef08a" stroke="#fbbf24" strokeWidth="1" />
      <circle cx="85" cy="25" r="4.5" fill="#fef08a" stroke="#fbbf24" strokeWidth="1" />
      <rect x="10" y="65" width="80" height="11" rx="4" fill="url(#goldBase)" />
      <text x="38" y="72" fontSize="6" fill="#fef08a">★</text>
      <text x="55" y="72" fontSize="6" fill="#fef08a">★</text>
    </svg>
  )
}

function DiamondCrown({ size = 80, animated = true }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 100 85" fill="none" className={animated ? 'crown-diamond' : ''}>
      <defs>
        <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="25%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="75%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <linearGradient id="diamondShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="diamondBase" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0e7490" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d="M10 65 L15 22 L35 48 L50 12 L65 48 L85 22 L90 65 Z" fill="url(#diamondGrad)" filter="url(#glow)" />
      <path d="M10 65 L15 22 L35 48 L50 12 L65 48 L85 22 L90 65 Z" fill="url(#diamondShine)" />
      <polygon points="50,8 54,14 50,18 46,14" fill="#e0f2fe" stroke="#22d3ee" strokeWidth="1" />
      <polygon points="15,18 18,23 15,28 12,23" fill="#e0f2fe" stroke="#22d3ee" strokeWidth="1" />
      <polygon points="85,18 88,23 85,28 82,23" fill="#e0f2fe" stroke="#22d3ee" strokeWidth="1" />
      <text x="29" y="44" fontSize="8" fill="#e0f2fe" opacity="0.9">✦</text>
      <text x="62" y="44" fontSize="8" fill="#e0f2fe" opacity="0.9">✦</text>
      <rect x="10" y="65" width="80" height="12" rx="4" fill="url(#diamondBase)" />
      <text x="44" y="74" fontSize="8" fill="#e0f2fe" opacity="0.9">✦✦✦</text>
    </svg>
  )
}

function ObsidianCrown({ size = 80, animated = true }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 100 85" fill="none" className={animated ? 'crown-obsidian' : ''}>
      <defs>
        <linearGradient id="obsidianGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A0A3A" />
          <stop offset="30%" stopColor="#3D1F6E" />
          <stop offset="60%" stopColor="#0F0620" />
          <stop offset="100%" stopColor="#2A1050" />
        </linearGradient>
        <linearGradient id="obsidianShine" x1="0%" y1="0%" x2="100%" y2="30%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="35%" stopColor="#A78BFA" stopOpacity="0.45" />
          <stop offset="65%" stopColor="#8B5CF6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6D28D9" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="obsidianBase" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0F0620" />
          <stop offset="50%" stopColor="#3D1F6E" />
          <stop offset="100%" stopColor="#0F0620" />
        </linearGradient>
        <filter id="obsidianGlow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* More jagged crown tips for boss feel */}
      <path d="M10 65 L13 20 L30 46 L42 10 L50 25 L58 10 L70 46 L87 20 L90 65 Z"
        fill="url(#obsidianGrad)" filter="url(#obsidianGlow)" />
      <path d="M10 65 L13 20 L30 46 L42 10 L50 25 L58 10 L70 46 L87 20 L90 65 Z"
        fill="url(#obsidianShine)" />
      {/* Gems: dark amethyst */}
      <polygon points="42,7 47,13 42,18 37,13" fill="#3D1F6E" stroke="#8B5CF6" strokeWidth="1.5" />
      <polygon points="58,7 63,13 58,18 53,13" fill="#3D1F6E" stroke="#8B5CF6" strokeWidth="1.5" />
      <polygon points="13,16 17,21 13,26 9,21"  fill="#2A1050" stroke="#7C3AED" strokeWidth="1" />
      <polygon points="87,16 91,21 87,26 83,21" fill="#2A1050" stroke="#7C3AED" strokeWidth="1" />
      {/* Subtle sparkles */}
      <text x="28" y="43" fontSize="7" fill="#8B5CF6" opacity="0.75">✦</text>
      <text x="63" y="43" fontSize="7" fill="#8B5CF6" opacity="0.75">✦</text>
      <text x="45" y="56" fontSize="5" fill="#A78BFA" opacity="0.5">✦</text>
      {/* Base */}
      <rect x="10" y="65" width="80" height="12" rx="4" fill="url(#obsidianBase)" />
      <text x="40" y="74" fontSize="7" fill="#8B5CF6" opacity="0.7">✦✦✦✦</text>
    </svg>
  )
}

export default function Crown({ level = 'silver', size = 80, animated = true }) {
  if (level === 'gold')     return <GoldCrown     size={size} animated={animated} />
  if (level === 'diamond')  return <DiamondCrown  size={size} animated={animated} />
  if (level === 'boss' || level === 'obsidian') return <ObsidianCrown size={size} animated={animated} />
  return <SilverCrown size={size} animated={animated} />
}
