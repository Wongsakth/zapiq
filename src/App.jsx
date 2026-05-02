import React, { useEffect } from 'react'
import useGameStore from './store/gameStore'
import OnboardingScreen from './screens/OnboardingScreen'
import HomeScreen from './screens/HomeScreen'
import ModeScreen from './screens/ModeScreen'
import GameScreen from './screens/GameScreen'
import ResultsScreen from './screens/ResultsScreen'
import ChallengeScreen from './screens/ChallengeScreen'
import PassPlaySetupScreen from './screens/PassPlaySetupScreen'
import PassPlayGameScreen from './screens/PassPlayGameScreen'
import PassPlayHandoffScreen from './screens/PassPlayHandoffScreen'
import PassPlayResultsScreen from './screens/PassPlayResultsScreen'
import SettingsScreen from './screens/SettingsScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import { parseChallengeFromUrl, clearChallengeFromUrl } from './utils/challengeUtils'
import Header from './components/ui/Header'
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'

function Screen({ children }) {
  return (
    <div className="screen-enter w-full h-full">
      {children}
    </div>
  )
}

export default function App() {
  const { screen, onboardingComplete, setChallenge } = useGameStore()

  useEffect(() => {
    console.log('[ZAPIQ] href:', window.location.href)
    console.log('[ZAPIQ] search:', window.location.search)
    const data = parseChallengeFromUrl()
    console.log('[ZAPIQ] challenge data:', data)
    if (data) {
      clearChallengeFromUrl()
      setChallenge(data)
    }

    // Firebase connection test
    const test = async () => {
      try {
        console.log('[FIREBASE TEST] Starting...')
        const docRef = await addDoc(collection(db, 'test'), {
          hello: 'world',
          time: new Date().toISOString(),
        })
        console.log('[FIREBASE TEST] SUCCESS - doc id:', docRef.id)
      } catch (e) {
        console.error('[FIREBASE TEST] FAILED:', e.message, e.code)
      }
    }
    test()
  }, [])

  // Redirect to onboarding if not complete
  const activeScreen = !onboardingComplete ? 'onboarding' : screen

  const renderScreen = () => {
    switch (activeScreen) {
      case 'onboarding':      return <OnboardingScreen />
      case 'home':            return <HomeScreen />
      case 'mode-select':     return <ModeScreen />
      case 'game':            return <GameScreen />
      case 'results':         return <ResultsScreen />
      case 'passplay-setup':  return <PassPlaySetupScreen />
      case 'passplay-game':   return <PassPlayGameScreen />
      case 'passplay-handoff':return <PassPlayHandoffScreen />
      case 'passplay-results':return <PassPlayResultsScreen />
      case 'challenge':       return <ChallengeScreen />
      case 'settings':        return <SettingsScreen />
      case 'leaderboard':     return <LeaderboardScreen />
      default:                return <HomeScreen />
    }
  }

  const showHeader = ['home', 'mode-select', 'results', 'settings', 'challenge',
                       'passplay-setup', 'passplay-results'].includes(activeScreen)

  return (
    <div className="app-shell">
      {showHeader && <Header />}
      <Screen key={activeScreen}>
        {renderScreen()}
      </Screen>
    </div>
  )
}
