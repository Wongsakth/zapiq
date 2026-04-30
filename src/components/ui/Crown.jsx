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
      {/* Crown base */}
      <path d="M10 75 L90 75 L90 65 L10 65 Z" fill="url(#silverGrad)" />
      {/* Crown body */}
      <path d="M10 65 L15 25 L35 50 L50 15 L65 50 L85 25 L90 65 Z" fill="url(#silverGrad)" />
      {/* Crown shine overlay */}
      <path d="M10 65 L15 25 L35 50 L50 15 L65 50 L85 25 L90 65 Z" fill="url(#silverShine)" />
      {/* Gems */}
      <circle cx="50" cy="15" r="5" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="1" />
      <circle cx="15" cy="25" r="4" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="1" />
      <circle cx="85" cy="25" r="4" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="1" />
      {/* Base line */}
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
      {/* Small stars */}
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
      {/* Diamond gems */}
      <polygon points="50,8 54,14 50,18 46,14" fill="#e0f2fe" stroke="#22d3ee" strokeWidth="1" />
      <polygon points="15,18 18,23 15,28 12,23" fill="#e0f2fe" stroke="#22d3ee" strokeWidth="1" />
      <polygon points="85,18 88,23 85,28 82,23" fill="#e0f2fe" stroke="#22d3ee" strokeWidth="1" />
      {/* Sparkles */}
      <text x="29" y="44" fontSize="8" fill="#e0f2fe" opacity="0.9">✦</text>
      <text x="62" y="44" fontSize="8" fill="#e0f2fe" opacity="0.9">✦</text>
      <rect x="10" y="65" width="80" height="12" rx="4" fill="url(#diamondBase)" />
      <text x="44" y="74" fontSize="8" fill="#e0f2fe" opacity="0.9">✦✦✦</text>
    </svg>
  )
}

export default function Crown({ level = 'silver', size = 80, animated = true }) {
  if (level === 'gold') return <GoldCrown size={size} animated={animated} />
  if (level === 'diamond') return <DiamondCrown size={size} animated={animated} />
  return <SilverCrown size={size} animated={animated} />
}
