import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LEVEL_CONFIG } from '../utils/levelConfig'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

const useGameStore = create(
  persist(
    (set, get) => ({
      // ── Onboarding ────────────────────────────────────────
      onboardingComplete: false,
      playerName: 'Player',

      // ── Crown / level ────────────────────────────────────
      crownLevel: 'silver',
      bestComboScores: { silver: 0, gold: 0, diamond: 0 },

      // ── Streak ───────────────────────────────────────────
      lastPlayDate: null,
      currentStreak: 0,
      longestStreak: 0,
      weeklyBonusUnlocked: false,
      playedToday: false,

      // ── Unlocked content ─────────────────────────────────
      unlockedSkins: ['default'],

      // ── Navigation ───────────────────────────────────────
      screen: 'onboarding',

      // ── Current session ──────────────────────────────────
      gameMode: null,        // 'single' | 'combo' | 'passplay'
      selectedGame: null,    // 'tapcolor' | 'math' | 'memory'
      comboGameIndex: 0,     // 0=tapcolor, 1=math, 2=memory
      sessionScores: [],     // scores per combo game
      lastSessionScore: 0,
      lastGameMode: null,
      lastSelectedGame: null,
      levelUpTriggered: false,

      // ── Pass & Play ──────────────────────────────────────
      ppPlayers: [],
      ppCurrentPlayer: 0,
      ppCurrentGameIndex: 0,
      ppAllScores: [],       // [[scores of p0], [scores of p1], ...]

      // ── Actions ──────────────────────────────────────────
      completeOnboarding: (name) => {
        const state = get()
        set({
          onboardingComplete: true,
          playerName: name || state.playerName,
          screen: 'home',
        })
        get().checkAndUpdateStreak()
      },

      setPlayerName: (name) => set({ playerName: name }),

      navigateTo: (screen) => set({ screen }),

      startSingleGame: (gameId) => {
        set({
          gameMode: 'single',
          selectedGame: gameId,
          sessionScores: [],
          comboGameIndex: 0,
          screen: 'game',
        })
      },

      startCombo: () => {
        set({
          gameMode: 'combo',
          selectedGame: null,
          sessionScores: [],
          comboGameIndex: 0,
          screen: 'game',
        })
      },

      startPassPlay: (playerNames) => {
        const ppAllScores = playerNames.map(() => [])
        set({
          gameMode: 'passplay',
          ppPlayers: playerNames,
          ppCurrentPlayer: 0,
          ppCurrentGameIndex: 0,
          ppAllScores,
          sessionScores: [],
          screen: 'passplay-game',
        })
      },

      submitGameScore: (score) => {
        const state = get()
        const newScores = [...state.sessionScores, score]

        if (state.gameMode === 'combo') {
          if (state.comboGameIndex < 2) {
            set({ sessionScores: newScores, comboGameIndex: state.comboGameIndex + 1 })
          } else {
            const totalScore = newScores.reduce((a, b) => a + b, 0)
            const level = state.crownLevel
            const config = LEVEL_CONFIG[level]
            const prevBest = state.bestComboScores[level]
            const newBest = Math.max(prevBest, totalScore)
            const bestComboScores = { ...state.bestComboScores, [level]: newBest }

            let newLevel = level
            let levelUpTriggered = false
            if (config.nextLevel && totalScore >= config.upgradeScore) {
              newLevel = config.nextLevel
              levelUpTriggered = true
            }

            get().checkAndUpdateStreak()
            set({
              sessionScores: newScores,
              lastSessionScore: totalScore,
              lastGameMode: 'combo',
              lastSelectedGame: null,
              bestComboScores,
              crownLevel: newLevel,
              levelUpTriggered,
              screen: 'results',
            })
          }
        } else if (state.gameMode === 'single') {
          get().checkAndUpdateStreak()
          set({
            sessionScores: newScores,
            lastSessionScore: score,
            lastGameMode: 'single',
            lastSelectedGame: state.selectedGame,
            screen: 'results',
          })
        }
      },

      submitPPGameScore: (score) => {
        const state = get()
        const { ppCurrentPlayer, ppCurrentGameIndex, ppPlayers, ppAllScores } = state
        const newAllScores = ppAllScores.map((s, i) =>
          i === ppCurrentPlayer ? [...s, score] : s
        )

        // Determine next player / next game
        let nextPlayer = ppCurrentPlayer + 1
        let nextGameIndex = ppCurrentGameIndex

        if (nextPlayer >= ppPlayers.length) {
          nextPlayer = 0
          nextGameIndex += 1
        }

        if (nextGameIndex >= 3) {
          // All games done for all players
          get().checkAndUpdateStreak()
          set({
            ppAllScores: newAllScores,
            screen: 'passplay-results',
          })
        } else {
          set({
            ppAllScores: newAllScores,
            ppCurrentPlayer: nextPlayer,
            ppCurrentGameIndex: nextGameIndex,
            screen: 'passplay-handoff',
          })
        }
      },

      resumePassPlay: () => {
        set({ screen: 'passplay-game' })
      },

      clearLevelUp: () => set({ levelUpTriggered: false }),

      checkAndUpdateStreak: () => {
        const state = get()
        const today = todayStr()
        if (state.playedToday && state.lastPlayDate === today) return

        let { currentStreak, longestStreak } = state
        const last = state.lastPlayDate

        if (last === yesterday()) {
          currentStreak += 1
        } else if (last !== today) {
          currentStreak = 1
        }

        longestStreak = Math.max(longestStreak, currentStreak)
        const weeklyBonusUnlocked = currentStreak >= 7

        set({
          lastPlayDate: today,
          currentStreak,
          longestStreak,
          weeklyBonusUnlocked,
          playedToday: true,
        })
      },

      resetProgress: () => {
        set({
          crownLevel: 'silver',
          bestComboScores: { silver: 0, gold: 0, diamond: 0 },
          currentStreak: 0,
          longestStreak: 0,
          lastPlayDate: null,
          playedToday: false,
          weeklyBonusUnlocked: false,
          unlockedSkins: ['default'],
        })
      },

      goHome: () => {
        set({
          screen: 'home',
          gameMode: null,
          selectedGame: null,
          sessionScores: [],
          comboGameIndex: 0,
          levelUpTriggered: false,
        })
      },
    }),
    {
      name: 'zapiq-v1',
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        playerName: state.playerName,
        crownLevel: state.crownLevel,
        bestComboScores: state.bestComboScores,
        lastPlayDate: state.lastPlayDate,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        weeklyBonusUnlocked: state.weeklyBonusUnlocked,
        playedToday: state.playedToday,
        unlockedSkins: state.unlockedSkins,
      }),
    }
  )
)

function yesterday() {
  return yesterdayStr()
}

export default useGameStore
