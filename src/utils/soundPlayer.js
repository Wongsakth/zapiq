import useSoundStore from '../store/soundStore'
import {
  playDing, playBuzz, playLevelUp, playFlip,
  playPop, playGameOver, playTap, playBossUnlock, playTick,
  playCountdownTick, playCountdownGo,
} from './soundEngine'

const SOUNDS = { ding: playDing, buzz: playBuzz, levelUp: playLevelUp, flip: playFlip, pop: playPop, gameOver: playGameOver, tap: playTap, bossUnlock: playBossUnlock, tick: playTick, countdownTick: playCountdownTick, countdownGo: playCountdownGo }

export function playSound(name) {
  if (!useSoundStore.getState().soundEnabled) return
  try { SOUNDS[name]?.() } catch {}
}
