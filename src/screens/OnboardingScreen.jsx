import React, { useState } from 'react'
import useGameStore from '../store/gameStore'
import Crown from '../components/ui/Crown'
import TapColorGame from '../games/TapColorGame'
import MathGame from '../games/MathGame'
import MemoryCardGame from '../games/MemoryCardGame'
import { getUsers, saveUser } from '../utils/userStorage'

const STEPS = [
  { id: 'welcome', title: null },
  { id: 'tapcolor', title: 'Tap the Right Color!' },
  { id: 'math', title: 'Math Blitz!' },
  { id: 'memory', title: 'Memory Match!' },
]

function StepDots({ current, total }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current ? 'w-6 h-2 bg-[#A8D5A2]' : 'w-2 h-2 bg-[#E8E4F0]'
          }`}
        />
      ))}
    </div>
  )
}

function WelcomeStep({ name, onNameChange, onNext }) {
  const [nameError, setNameError] = useState('')
  const prevUsers = getUsers()
  const hasPrev   = prevUsers.length > 0

  const handleNext = () => {
    if (!name.trim()) { setNameError('กรุณาใส่ชื่อ'); return }
    setNameError('')
    onNext()
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 gap-6 animate-fade-in">
      {/* Large animated gold crown */}
      <div className="animate-float">
        <Crown level="gold" size={120} animated />
      </div>

      {/* Logo in pastel frame */}
      <div style={{
        display: 'inline-block',
        background: '#E8F4F0',
        border: '1.5px solid #A8D8CC',
        borderRadius: 16,
        padding: '12px 28px',
        textAlign: 'center',
      }}>
        <h1 className="font-syne font-bold" style={{ fontSize: 48, letterSpacing: '0.05em', margin: 0, lineHeight: 1 }}>
          <span style={{ color: 'var(--color-text-primary)' }}>ZAP</span>
          <span style={{ color: 'var(--color-accent-red)' }}>IQ</span>
        </h1>
      </div>

      {/* Slogan */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
          3 Games. 1 Champion.
        </p>
        <p style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-text-secondary)', margin: 0 }}>
          Think fast. Tap faster.
        </p>
      </div>

      {/* Previous users */}
      {hasPrev && (
        <div className="w-full">
          <p className="text-[#9D9AA8] text-xs uppercase tracking-wider mb-2 text-center">เล่นต่อจากเดิม</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {prevUsers.map(u => (
              <button
                key={u.name}
                onClick={() => { onNameChange(u.name); setNameError('') }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border transition-all active:scale-95 ${
                  name === u.name
                    ? 'bg-[#A8D5A2]/30 border-[#A8D5A2] shadow-sm'
                    : 'bg-white border-[#E8E4F0]'
                }`}
              >
                <Crown level={u.crownLevel || 'silver'} size={16} animated={false} />
                <span className="text-[#2C2C2A] font-medium text-sm">{u.name}</span>
                {u.obsidianCount > 0 && (
                  <span className="text-purple-500 text-xs font-bold">👑</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Name input */}
      <div className="w-full">
        {hasPrev && (
          <p className="text-[#9D9AA8] text-xs uppercase tracking-wider mb-2">หรือใส่ชื่อใหม่</p>
        )}
        {!hasPrev && (
          <label className="text-[#9D9AA8] text-sm uppercase tracking-wider block mb-2">Your Name</label>
        )}
        <input
          type="text"
          value={name}
          onChange={(e) => { onNameChange(e.target.value); setNameError('') }}
          placeholder="Enter your name…"
          maxLength={8}
          className="w-full bg-white border border-[#E8E4F0] rounded-2xl px-5 py-4 text-[#2C2C2A] text-lg font-medium placeholder-[#9D9AA8] outline-none focus:border-[#A8D5A2] transition-colors"
        />
        <div className="flex justify-between items-center mt-1">
          {nameError
            ? <p style={{ fontSize: 11, color: 'var(--color-accent-red)' }}>{nameError}</p>
            : <span />
          }
          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{name.length}/8</p>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full py-4 rounded-2xl font-bold text-xl bg-[#A8D5A2] text-[#1A4D1A] active:scale-95 transition-transform shadow-sm"
      >
        Let's Play! 🎮
      </button>
    </div>
  )
}

function GameDemoStep({ gameId, title, subtitle, demoLevel, onDone }) {
  const [completed, setCompleted] = useState(false)

  const handleFinish = () => {
    setCompleted(true)
    setTimeout(onDone, 600)
  }

  const GameComp = gameId === 'tapcolor' ? TapColorGame
    : gameId === 'math' ? MathGame
    : MemoryCardGame

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2 text-center">
        <h2 className="text-[#2C2C2A] font-bold text-xl">{title}</h2>
        <p className="text-[#9D9AA8] text-sm mt-1">{subtitle}</p>
      </div>

      <div className="flex-1 relative">
        <GameComp
          crownLevel={demoLevel}
          onFinish={handleFinish}
          isDemo
        />
        {completed && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#2C2C2A]/70 animate-fade-in rounded-2xl">
            <div className="text-center animate-scale-in">
              <div className="text-5xl mb-2">🎉</div>
              <p className="text-white font-bold text-xl">Great job!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OnboardingScreen() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const completeOnboarding = useGameStore(s => s.completeOnboarding)
  const crownLevel         = useGameStore(s => s.crownLevel)

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      const trimmed = name.trim()
      saveUser(trimmed, crownLevel, 0)
      completeOnboarding(trimmed)
    }
  }

  const canSkip = step > 0

  return (
    <div className="flex flex-col h-full bg-[#FAF8FF]">
      {/* Top nav */}
      <div className="flex justify-between items-center px-4 pt-4">
        <StepDots current={step} total={STEPS.length} />
        {canSkip && (
          <button
            onClick={() => completeOnboarding(name.trim() || 'Player')}
            className="text-[#9D9AA8] text-sm hover:text-[#6B6878] transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {step === 0 && (
          <WelcomeStep
            name={name}
            onNameChange={setName}
            onNext={handleNext}
          />
        )}

        {step === 1 && (
          <GameDemoStep
            gameId="tapcolor"
            title="Tap the Right Color!"
            subtitle="Tap 3 correct colors to continue →"
            demoLevel="silver"
            onDone={handleNext}
          />
        )}

        {step === 2 && (
          <GameDemoStep
            gameId="math"
            title="Math Blitz!"
            subtitle="Solve 2 equations to continue →"
            demoLevel="silver"
            onDone={handleNext}
          />
        )}

        {step === 3 && (
          <GameDemoStep
            gameId="memory"
            title="Memory Match!"
            subtitle="Find 2 pairs to continue →"
            demoLevel="silver"
            onDone={handleNext}
          />
        )}
      </div>

      {step === 0 && (
        <div className="px-4 pb-8">
          <div className="flex gap-2 justify-center text-[#9D9AA8] text-xs">
            <span>🥈 Silver</span>
            <span>→</span>
            <span>🥇 Gold</span>
            <span>→</span>
            <span>💎 Diamond</span>
          </div>
        </div>
      )}
    </div>
  )
}
