import React, { useEffect } from 'react'
import useGameStore from './store/gameStore'
import OnboardingScreen from './screens/OnboardingScreen'
import HomeScreen from './screens/HomeScreen'
import ModeScreen from './screens/ModeScreen'
import GameScreen from './screens/GameScreen'
import ResultsScreen from './screens/ResultsScreen'
import PassPlaySetupScreen from './screens/PassPlaySetupScreen'
import PassPlayGameScreen from './screens/PassPlayGameScreen'
import PassPlayHandoffScreen from './screens/PassPlayHandoffScreen'
import PassPlayResultsScreen from './screens/PassPlayResultsScreen'
import SettingsScreen from './screens/SettingsScreen'

function Screen({ children }) {
  return (
    <div className="screen-enter w-full h-full">
      {children}
    </div>
  )
}

export default function App() {
  const { screen, onboardingComplete } = useGameStore()

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
      case 'settings':        return <SettingsScreen />
      default:                return <HomeScreen />
    }
  }

  return (
    <div className="app-shell">
      <Screen key={activeScreen}>
        {renderScreen()}
      </Screen>
    </div>
  )
}
