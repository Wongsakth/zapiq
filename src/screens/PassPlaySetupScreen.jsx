import React, { useState } from 'react'
import useGameStore from '../store/gameStore'
import { LEVEL_CONFIG } from '../utils/levelConfig'

export default function PassPlaySetupScreen() {
  const { crownLevel, startPassPlay, navigateTo } = useGameStore()
  const cfg = LEVEL_CONFIG[crownLevel]
  const [players, setPlayers] = useState(['', ''])

  const addPlayer = () => {
    if (players.length < 4) setPlayers(p => [...p, ''])
  }

  const removePlayer = (i) => {
    if (players.length > 2) setPlayers(p => p.filter((_, idx) => idx !== i))
  }

  const updatePlayer = (i, val) => {
    setPlayers(p => p.map((name, idx) => idx === i ? val : name))
  }

  const canStart = players.every(p => p.trim().length > 0)

  const handleStart = () => {
    const names = players.map((p, i) => p.trim() || `Player ${i + 1}`)
    startPassPlay(names)
  }

  return (
    <div className={`flex flex-col h-full ${cfg.theme.bg} screen-enter`}>
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <button
          onClick={() => navigateTo('home')}
          className="w-10 h-10 rounded-full bg-white border border-[#E8E4F0] flex items-center justify-center text-[#6B6878] active:scale-90 transition-transform"
        >
          ‹
        </button>
        <div>
          <h1 className="text-[#2C2C2A] font-bold text-xl">Pass & Play</h1>
          <p className="text-[#9D9AA8] text-xs">Take turns on the same device</p>
        </div>
      </div>

      <div className="flex-1 px-4 overflow-y-auto">
        <div className="bg-white rounded-2xl p-4 mb-5 border border-[#E8E4F0]">
          <p className="text-[#6B6878] text-sm">
            👥 2–4 players take turns playing all 3 games.<br />
            Highest total score wins!
          </p>
        </div>

        <p className="text-[#9D9AA8] text-xs uppercase tracking-wider mb-3">Players</p>
        <div className="flex flex-col gap-3 mb-4">
          {players.map((name, i) => (
            <div key={i} className="flex gap-2 items-center">
              <div className="w-8 h-8 rounded-full bg-[#EAE7F5] flex items-center justify-center text-[#6B6878] text-sm font-bold flex-shrink-0">
                {i + 1}
              </div>
              <input
                type="text"
                value={name}
                onChange={e => updatePlayer(i, e.target.value)}
                placeholder={`Player ${i + 1} name`}
                maxLength={15}
                className="
                  flex-1 bg-white border border-[#E8E4F0] rounded-xl
                  px-4 py-3 text-[#2C2C2A] text-sm font-medium
                  placeholder-[#9D9AA8] outline-none
                  focus:border-[#A8D5A2] transition-colors
                "
              />
              {players.length > 2 && (
                <button
                  onClick={() => removePlayer(i)}
                  className="w-8 h-8 rounded-full bg-red-100 text-red-400 flex items-center justify-center active:scale-90 transition-transform"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {players.length < 4 && (
          <button
            onClick={addPlayer}
            className="w-full py-3 rounded-xl border border-dashed border-[#D0CCDC] text-[#9D9AA8] text-sm font-medium active:scale-95 transition-transform"
          >
            + Add Player
          </button>
        )}
      </div>

      <div className="px-4 pb-6">
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`
            w-full py-4 rounded-2xl font-bold text-xl
            transition-all duration-150 active:scale-95
            ${canStart
              ? 'bg-[#A8D5A2] text-[#1A4D1A]'
              : 'bg-[#E8E4F0] text-[#9D9AA8] cursor-not-allowed'
            }
          `}
        >
          Start Game 🎮
        </button>
      </div>
    </div>
  )
}
