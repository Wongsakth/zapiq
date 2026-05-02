import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LEVEL_CONFIG } from '../utils/levelConfig'
import { computeBrainAge, computeZapiqBreakdown } from '../utils/brainAnalysis'
import { getPrestigeBonus } from '../utils/prestigeUtils'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function emptyLevelScore() {
  return { combo: 0, tap: 0, math: 0, memory: 0, zapiqScore: 0, brainAge: null }
}

const GAME_KEY = { tapcolor: 'tap', math: 'math', memory: 'memory' }
const REGULAR_LEVELS = ['silver', 'gold', 'diamond']

const useGameStore = create(
  persist(
    (set, get) => ({
      // ── Onboarding ────────────────────────────────────────
      onboardingComplete: false,
      playerName: 'Player',

      // ── Crown / level ────────────────────────────────────
      crownLevel: 'silver',

      // ── High scores (per-level, persisted) ───────────────
      highScores: {
        silver:   emptyLevelScore(),
        gold:     emptyLevelScore(),
        diamond:  emptyLevelScore(),
        obsidian: emptyLevelScore(),
      },

      // ── Boss stage ───────────────────────────────────────
      bossUnlocked: false,
      obsidianUnlocked: false,

      // ── Prestige ─────────────────────────────────────────
      obsidianCount: 0,
      prestigeLevel: 0,

      // ── Streak ───────────────────────────────────────────
      lastPlayDate: null,
      currentStreak: 0,
      longestStreak: 0,
      weeklyBonusUnlocked: false,
      playedToday: false,

      // ── Unlocked content ─────────────────────────────────
      unlockedSkins: ['default'],

      // ── Celebration tracking (persisted) ─────────────────
      celebratedLevels: [],

      // ── Navigation ───────────────────────────────────────
      screen: 'onboarding',

      // ── Current session (ephemeral) ──────────────────────
      gameMode: null,
      selectedGame: null,
      selectedLevel: null,    // null = use crownLevel; set by ModeScreen level selector
      comboGameIndex: 0,
      sessionScores: [],
      lastSessionScore: 0,
      lastGameMode: null,
      lastSelectedGame: null,
      lastPlayedLevel: null,  // which level was actually played (for results display)
      levelUpTriggered: false,
      bossUnlockTriggered: false,

      // ── Last session high score info (ephemeral) ─────────
      lastIsNewHighScore: false,
      lastPreviousBest: 0,

      // ── Brain analysis (combo only, ephemeral) ────────────
      gameStats: [],
      brainAnalysis: null,

      // ── Challenge mode (ephemeral) ────────────────────────
      challengeData: null,
      isChallenge: false,

      // ── Pass & Play ──────────────────────────────────────
      ppPlayers: [],
      ppCurrentPlayer: 0,
      ppCurrentGameIndex: 0,
      ppAllScores: [],

      // ── Actions ──────────────────────────────────────────
      completeOnboarding: (name) => {
        const state = get()
        set({
          onboardingComplete: true,
          playerName: name || state.playerName,
          screen: state.challengeData ? 'challenge' : 'home',
        })
        get().checkAndUpdateStreak()
      },

      setPlayerName: (name) => set({ playerName: name }),

      navigateTo: (screen) => set({ screen }),

      setSelectedLevel: (level) => set({ selectedLevel: level }),

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
          gameStats: [],
          brainAnalysis: null,
          screen: 'game',
        })
      },

      startBossCombo: () => {
        set({
          gameMode: 'boss',
          selectedGame: null,
          sessionScores: [],
          comboGameIndex: 0,
          gameStats: [],
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

      submitGameScore: (score, stats = null) => {
        const state = get()
        const newScores    = [...state.sessionScores, score]
        const newGameStats = [...state.gameStats]
        newGameStats[state.comboGameIndex] = stats
        const prestige = getPrestigeBonus(state.prestigeLevel)

        // ── Boss combo ────────────────────────────────────
        if (state.gameMode === 'boss') {
          if (state.comboGameIndex < 2) {
            set({ sessionScores: newScores, comboGameIndex: state.comboGameIndex + 1 })
          } else {
            const rawTotal       = newScores.reduce((a, b) => a + b, 0)
            const totalScore     = Math.round(rawTotal * prestige.scoreMultiplier)
            const newObsidianCount = state.obsidianCount + 1
            const hs             = state.highScores.obsidian
            const isNewHighScore = totalScore > hs.combo
            const newHs          = { ...hs, combo: Math.max(hs.combo, totalScore) }
            get().checkAndUpdateStreak()
            set({
              sessionScores: newScores,
              lastSessionScore: totalScore,
              lastGameMode: 'boss',
              lastSelectedGame: null,
              lastPlayedLevel: 'obsidian',
              lastIsNewHighScore: isNewHighScore,
              lastPreviousBest: hs.combo,
              obsidianUnlocked: true,
              obsidianCount: newObsidianCount,
              bossUnlockTriggered: true,
              selectedLevel: 'obsidian',
              highScores: { ...state.highScores, obsidian: newHs },
              screen: 'results',
            })
          }
          return
        }

        // ── Regular combo ─────────────────────────────────
        if (state.gameMode === 'combo') {
          if (state.comboGameIndex < 2) {
            set({
              sessionScores: newScores,
              comboGameIndex: state.comboGameIndex + 1,
              gameStats: newGameStats,
            })
          } else {
            const rawTotal   = newScores.reduce((a, b) => a + b, 0)
            const totalScore = Math.round(rawTotal * prestige.scoreMultiplier)

            // Play level: use selectedLevel, fallback to crownLevel; 'obsidian' is boss-only
            const playLevel  = REGULAR_LEVELS.includes(state.selectedLevel) ? state.selectedLevel : state.crownLevel
            const config     = LEVEL_CONFIG[playLevel]

            // High score update for played level
            const hs             = state.highScores[playLevel] || emptyLevelScore()
            const isNewHighScore = totalScore > hs.combo

            const breakdown    = computeZapiqBreakdown(newGameStats[0], newGameStats[1], newGameStats[2], playLevel)
            const brainAnalysis = {
              brainAge:   computeBrainAge(newGameStats[0], newGameStats[1], newGameStats[2]),
              zapiqScore: breakdown.zapiqScore,
              breakdown,
            }
            const newHs = {
              ...hs,
              combo:      Math.max(hs.combo, totalScore),
              zapiqScore: Math.max(hs.zapiqScore, brainAnalysis.zapiqScore),
              brainAge:   hs.brainAge === null
                ? brainAnalysis.brainAge
                : Math.min(hs.brainAge, brainAnalysis.brainAge),
            }
            const highScores = { ...state.highScores, [playLevel]: newHs }

            // Crown progression only when playing at own level
            let newCrownLevel    = state.crownLevel
            let levelUpTriggered = false
            let newSelectedLevel = state.selectedLevel
            if (playLevel === state.crownLevel) {
              if (config.nextLevel && totalScore >= config.upgradeScore) {
                newCrownLevel    = config.nextLevel
                newSelectedLevel = newCrownLevel  // auto-advance selected level
                if (!state.celebratedLevels.includes(newCrownLevel)) {
                  levelUpTriggered = true
                }
              }
            }

            // Boss unlock only when playing at diamond level
            let bossUnlocked = state.bossUnlocked
            if (!bossUnlocked && playLevel === 'diamond' && config.bossUnlockScore && totalScore >= config.bossUnlockScore) {
              bossUnlocked = true
            }

            get().checkAndUpdateStreak()
            set({
              sessionScores: newScores,
              lastSessionScore: totalScore,
              lastGameMode: 'combo',
              lastSelectedGame: null,
              lastPlayedLevel: playLevel,
              lastIsNewHighScore: isNewHighScore,
              lastPreviousBest: hs.combo,
              highScores,
              crownLevel: newCrownLevel,
              selectedLevel: newSelectedLevel,
              levelUpTriggered,
              bossUnlocked,
              bossUnlockTriggered: false,
              gameStats: newGameStats,
              brainAnalysis,
              screen: 'results',
            })
          }
          return
        }

        // ── Single game ───────────────────────────────────
        if (state.gameMode === 'single') {
          const totalScore = Math.round(score * prestige.scoreMultiplier)
          const playLevel  = state.selectedLevel || state.crownLevel
          const gameKey    = GAME_KEY[state.selectedGame]
          const hs         = state.highScores[playLevel] || emptyLevelScore()
          const prevBest   = gameKey ? (hs[gameKey] || 0) : 0
          const isNewHighScore = gameKey ? totalScore > prevBest : false
          const newHs      = gameKey ? { ...hs, [gameKey]: Math.max(hs[gameKey] || 0, totalScore) } : hs
          get().checkAndUpdateStreak()
          set({
            sessionScores: newScores,
            lastSessionScore: totalScore,
            lastGameMode: 'single',
            lastSelectedGame: state.selectedGame,
            lastPlayedLevel: playLevel,
            lastIsNewHighScore: isNewHighScore,
            lastPreviousBest: prevBest,
            highScores: { ...state.highScores, [playLevel]: newHs },
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

        let nextPlayer    = ppCurrentPlayer + 1
        let nextGameIndex = ppCurrentGameIndex

        if (nextPlayer >= ppPlayers.length) {
          nextPlayer = 0
          nextGameIndex += 1
        }

        if (nextGameIndex >= 3) {
          get().checkAndUpdateStreak()
          set({ ppAllScores: newAllScores, screen: 'passplay-results' })
        } else {
          set({
            ppAllScores: newAllScores,
            ppCurrentPlayer: nextPlayer,
            ppCurrentGameIndex: nextGameIndex,
            screen: 'passplay-handoff',
          })
        }
      },

      resumePassPlay: () => set({ screen: 'passplay-game' }),

      clearLevelUp: () => {
        const state = get()
        const already = state.celebratedLevels.includes(state.crownLevel)
        set({
          levelUpTriggered: false,
          celebratedLevels: already ? state.celebratedLevels : [...state.celebratedLevels, state.crownLevel],
        })
      },

      clearBossUnlock: () => set({ bossUnlockTriggered: false }),

      confirmPrestige: () => {
        const state = get()
        set({
          crownLevel: 'silver',
          highScores: {
            silver:   emptyLevelScore(),
            gold:     emptyLevelScore(),
            diamond:  emptyLevelScore(),
            obsidian: emptyLevelScore(),
          },
          bossUnlocked: false,
          obsidianUnlocked: false,
          celebratedLevels: [],
          currentStreak: 0,
          longestStreak: 0,
          lastPlayDate: null,
          playedToday: false,
          weeklyBonusUnlocked: false,
          prestigeLevel: state.obsidianCount,
          screen: 'home',
          gameMode: null,
          selectedGame: null,
          selectedLevel: null,
          sessionScores: [],
          comboGameIndex: 0,
          gameStats: [],
          brainAnalysis: null,
          levelUpTriggered: false,
          bossUnlockTriggered: false,
        })
      },

      setChallenge: (data) => {
        const state = get()
        set({
          challengeData: data,
          screen: state.onboardingComplete ? 'challenge' : state.screen,
        })
      },

      acceptChallenge: () => {
        get().startCombo()
        set({ isChallenge: true })
      },

      clearChallenge: () => set({ challengeData: null, isChallenge: false }),

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
          highScores: {
            silver:   emptyLevelScore(),
            gold:     emptyLevelScore(),
            diamond:  emptyLevelScore(),
            obsidian: emptyLevelScore(),
          },
          bossUnlocked: false,
          obsidianUnlocked: false,
          obsidianCount: 0,
          prestigeLevel: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastPlayDate: null,
          playedToday: false,
          weeklyBonusUnlocked: false,
          unlockedSkins: ['default'],
          celebratedLevels: [],
          gameStats: [],
          brainAnalysis: null,
          selectedLevel: null,
        })
      },

      goHome: () => {
        set({
          screen: 'home',
          gameMode: null,
          selectedGame: null,
          sessionScores: [],
          comboGameIndex: 0,
          gameStats: [],
          brainAnalysis: null,
          challengeData: null,
          isChallenge: false,
        })
      },
    }),
    {
      name: 'zapiq-v2',
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        playerName: state.playerName,
        crownLevel: state.crownLevel,
        highScores: state.highScores,
        bossUnlocked: state.bossUnlocked,
        obsidianUnlocked: state.obsidianUnlocked,
        obsidianCount: state.obsidianCount,
        prestigeLevel: state.prestigeLevel,
        lastPlayDate: state.lastPlayDate,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        weeklyBonusUnlocked: state.weeklyBonusUnlocked,
        playedToday: state.playedToday,
        unlockedSkins: state.unlockedSkins,
        celebratedLevels: state.celebratedLevels,
        selectedLevel: state.selectedLevel,
      }),
    }
  )
)

function yesterday() {
  return yesterdayStr()
}

export default useGameStore
