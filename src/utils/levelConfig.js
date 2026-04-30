export const CROWN_LEVELS = ['silver', 'gold', 'diamond']

export const LEVEL_CONFIG = {
  silver: {
    id: 'silver',
    name: 'Silver',
    label: 'Silver Crown',
    theme: {
      primary: '#C0C0C0',
      accent: '#F0F0F0',
      bg: 'bg-silver-theme',
      glow: 'glow-silver',
      shimmer: 'shimmer-silver',
      crownClass: 'crown-silver',
      gradient: 'from-gray-400 to-gray-200',
      buttonBg: 'bg-gray-600 hover:bg-gray-500',
      cardBg: 'bg-gray-800/80',
      border: 'border-gray-500/40',
    },
    tapColor: {
      colorCount: 4,
      timeLimit: 10,
      wrongPenalty: 0,
    },
    math: {
      operations: ['+'],
      timeLimit: 30,
      wrongPenalty: 0,
      numRange: [1, 10],
    },
    memory: {
      pairs: 8,
      timeLimit: 70,
      wrongPenalty: 0,
    },
    comboTarget: 25,
    upgradeThreshold: 0.80,
    nextLevel: 'gold',
    upgradeScore: 20,
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    label: 'Gold Crown',
    theme: {
      primary: '#FFD700',
      accent: '#FFF176',
      bg: 'bg-gold-theme',
      glow: 'glow-gold',
      shimmer: 'shimmer-gold',
      crownClass: 'crown-gold',
      gradient: 'from-yellow-400 to-amber-300',
      buttonBg: 'bg-amber-700 hover:bg-amber-600',
      cardBg: 'bg-amber-950/80',
      border: 'border-yellow-500/40',
    },
    tapColor: {
      colorCount: 6,
      timeLimit: 10,
      wrongPenalty: -1,
    },
    math: {
      operations: ['+', '-', '×'],
      timeLimit: 35,
      wrongPenalty: -1,
      numRange: [1, 20],
    },
    memory: {
      pairs: 10,
      timeLimit: 90,
      wrongPenalty: -1,
    },
    comboTarget: 30,
    upgradeThreshold: 0.90,
    nextLevel: 'diamond',
    upgradeScore: 27,
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    label: 'Diamond Crown',
    theme: {
      primary: '#00BCD4',
      accent: '#A855F7',
      bg: 'bg-diamond-theme',
      glow: 'glow-diamond',
      shimmer: 'shimmer-diamond',
      crownClass: 'crown-diamond',
      gradient: 'from-cyan-400 to-purple-400',
      buttonBg: 'bg-cyan-900 hover:bg-cyan-800',
      cardBg: 'bg-slate-900/80',
      border: 'border-cyan-500/40',
    },
    tapColor: {
      colorCount: 6,
      timeLimit: 8,
      wrongPenalty: -1,
    },
    math: {
      operations: ['+', '-', '×', '÷'],
      timeLimit: 28,
      wrongPenalty: -1,
      numRange: [1, 30],
    },
    memory: {
      pairs: 10,
      timeLimit: 75,
      wrongPenalty: -1,
    },
    comboTarget: null,
    upgradeThreshold: null,
    nextLevel: null,
    upgradeScore: null,
  },
}

export const GAME_COLORS = [
  { name: 'Red',    bg: 'bg-red-500',    text: 'text-red-500',    hex: '#ef4444', border: 'border-red-400' },
  { name: 'Blue',   bg: 'bg-blue-500',   text: 'text-blue-500',   hex: '#3b82f6', border: 'border-blue-400' },
  { name: 'Green',  bg: 'bg-green-500',  text: 'text-green-500',  hex: '#22c55e', border: 'border-green-400' },
  { name: 'Yellow', bg: 'bg-yellow-400', text: 'text-yellow-400', hex: '#facc15', border: 'border-yellow-300' },
  { name: 'Purple', bg: 'bg-purple-500', text: 'text-purple-500', hex: '#a855f7', border: 'border-purple-400' },
  { name: 'Orange', bg: 'bg-orange-500', text: 'text-orange-500', hex: '#f97316', border: 'border-orange-400' },
]

export const MEMORY_EMOJIS = [
  '🎯', '🎮', '🎲', '🎪', '🎨', '🎭', '🎬', '🎤', '🚀', '⭐',
]

export const GAMES = [
  { id: 'tapcolor', name: 'Tap Color', emoji: '🎨', desc: 'Tap the right color fast!' },
  { id: 'math',     name: 'Math Blitz', emoji: '🧮', desc: 'Solve equations quickly!' },
  { id: 'memory',   name: 'Memory Match', emoji: '🧠', desc: 'Find all matching pairs!' },
]
