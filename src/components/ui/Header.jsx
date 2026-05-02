import React from 'react'
import useGameStore from '../../store/gameStore'
import Crown from './Crown'

const LEVEL_NAME = { silver: 'Silver', gold: 'Gold', diamond: 'Diamond' }

export default function Header() {
  const { playerName, crownLevel, obsidianUnlocked, obsidianCount } = useGameStore()

  return (
    <header style={{
      height: 52,
      minHeight: 52,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 16,
      paddingRight: 16,
      background: 'var(--color-background-primary)',
      borderBottom: '1.5px solid var(--color-accent-red)',
      flexShrink: 0,
      zIndex: 10,
    }}>

      {/* Left: player name */}
      <div style={{
        maxWidth: 80,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: 12,
        color: 'var(--color-text-secondary)',
        fontWeight: 500,
        flexShrink: 0,
      }}>
        {playerName}
      </div>

      {/* Center: ZAPIQ logo — absolutely centered */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        fontSize: 20,
        letterSpacing: '0.04em',
        userSelect: 'none',
      }}>
        <span style={{ color: 'var(--color-text-primary)' }}>ZAP</span>
        <span style={{ color: 'var(--color-accent-red)' }}>IQ</span>
      </div>

      {/* Right: crown icon only */}
      <div style={{ flexShrink: 0 }}>
        <Crown level={obsidianUnlocked ? 'obsidian' : crownLevel} size={22} animated={false} />
      </div>
    </header>
  )
}
