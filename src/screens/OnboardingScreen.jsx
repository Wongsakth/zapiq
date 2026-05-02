import React, { useState } from 'react'
import useGameStore from '../store/gameStore'
import Crown from '../components/ui/Crown'
import TapColorGame from '../games/TapColorGame'
import MathGame from '../games/MathGame'
import MemoryCardGame from '../games/MemoryCardGame'

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

  const handleNext = () => {
    if (!name.trim()) {
      setNameError('กรุณาใส่ชื่อ')
      return
    }
    setNameError('')
    onNext()
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 gap-8 animate-fade-in">
      <div className="animate-float">
        <Crown level="gold" size={100} animated />
      </div>

      <div className="text-center">
        <h1
          className="font-syne font-bold text-5xl mb-2"
          style={{
            background: 'linear-gradient(180deg, #1E1E1C 0%, #4A4844 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.05em',
          }}
        >
          ZAPIQ
        </h1>
        <p className="text-[#6B6878] text-lg">3 Games. 1 Champion.</p>
      </div>

      <div className="w-full">
        <label className="text-[#9D9AA8] text-sm uppercase tracking-wider block mb-2">Your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => { onNameChange(e.target.value); setNameError('') }}
          placeholder="Enter your name…"
          maxLength={8}
          className="
            w-full bg-white border border-[#E8E4F0] rounded-2xl
            px-5 py-4 text-[#2C2C2A] text-lg font-medium
            placeholder-[#9D9AA8] outline-none
            focus:border-[#A8D5A2] transition-colors
          "
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
        className="
          w-full py-4 rounded-2xl font-bold text-xl
          bg-[#A8D5A2] text-[#1A4D1A]
          active:scale-95 transition-transform
          shadow-sm
        "
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

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      completeOnboarding(name.trim())
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
