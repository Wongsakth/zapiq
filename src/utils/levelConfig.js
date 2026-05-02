export const CROWN_LEVELS = ['silver', 'gold', 'diamond']

export const LEVEL_CONFIG = {
  silver: {
    id: 'silver',
    name: 'Silver',
    label: 'Silver Crown',
    theme: {
      primary: '#8878B0',
      bg: 'bg-silver-theme',
      gradient: 'from-[#C8C4DC] to-[#A8A4C0]',
      shimmer: 'shimmer-silver',
      crownClass: 'crown-silver',
      accentBorder: 'border-[#D8D4EC]',
      accentBg: 'bg-[#EAE7F5]',
    },
    tapColor: {
      colorCount: 4,
      timeLimit: 10,
      wrongPenalty: 0,
    },
    math: {
      operations: ['+'],
      timeLimit: 10,
      wrongPenalty: 0,
      numRange: [1, 10],
    },
    memory: {
      pairs: 8,
      timeLimit: 30,
      wrongPenalty: 0,
    },
    comboTarget: 25,
    upgradeThreshold: 0.80,
    nextLevel: 'gold',
    upgradeScore: 21,
    bossUnlockScore: null,
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    label: 'Gold Crown',
    theme: {
      primary: '#C8A030',
      bg: 'bg-gold-theme',
      gradient: 'from-[#D4B840] to-[#EDD890]',
      shimmer: 'shimmer-gold',
      crownClass: 'crown-gold',
      accentBorder: 'border-[#EDD890]',
      accentBg: 'bg-[#FFF4D0]',
    },
    tapColor: {
      colorCount: 6,
      timeLimit: 10,
      wrongPenalty: -1,
    },
    math: {
      operations: ['+', '-', '×'],
      timeLimit: 10,
      wrongPenalty: -1,
      numRange: [1, 20],
    },
    memory: {
      pairs: 10,
      timeLimit: 35,
      wrongPenalty: 0,
    },
    comboTarget: 30,
    upgradeThreshold: 0.90,
    nextLevel: 'diamond',
    upgradeScore: 27,
    bossUnlockScore: null,
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    label: 'Diamond Crown',
    theme: {
      primary: '#4090C8',
      bg: 'bg-diamond-theme',
      gradient: 'from-[#80C0E8] to-[#A0B0F0]',
      shimmer: 'shimmer-diamond',
      crownClass: 'crown-diamond',
      accentBorder: 'border-[#B0C8E8]',
      accentBg: 'bg-[#E0EFFA]',
    },
    tapColor: {
      colorCount: 6,
      timeLimit: 8,
      wrongPenalty: -1,
    },
    math: {
      // pow = a^b, sqrt = √(perfect square) — handled in MathGame
      operations: ['+', '-', '×', '÷', 'pow', 'sqrt'],
      timeLimit: 8,
      wrongPenalty: -1,
      numRange: [1, 30],
    },
    memory: {
      pairs: 10,
      timeLimit: 28,
      wrongPenalty: 0,
    },
    comboTarget: null,
    upgradeThreshold: null,
    nextLevel: null,
    upgradeScore: null,
    bossUnlockScore: 30,  // combo score threshold to unlock Boss Stage
  },
  boss: {
    id: 'boss',
    name: 'Boss',
    label: 'Obsidian Crown',
    theme: {
      primary: '#6B3FA0',
      bg: 'bg-boss-theme',
      gradient: 'from-[#2D1B69] to-[#1A0A3A]',
      shimmer: 'shimmer-obsidian',
      crownClass: 'crown-obsidian',
      accentBorder: 'border-[#4A2A7C]',
      accentBg: 'bg-[#2D1B40]',
    },
    tapColor: {
      colorCount: 6,
      timeLimit: 10,
      wrongPenalty: -1,
      stroop: true,      // Stroop effect: tap by WORD not color
    },
    math: {
      twoStep: true,     // 2-step equations
      timeLimit: 10,
      wrongPenalty: -1,
    },
    memory: {
      pairs: 10,
      timeLimit: 30,
      wrongPenalty: -1,
      flipBackDelay: 500,  // ultra-fast flip-back (normal = 900ms)
    },
    wrongLimit: 3,         // 3 consecutive wrongs = instant game over
    comboTarget: null,
    upgradeScore: null,
    nextLevel: null,
    bossUnlockScore: null,
  },
}

// Pastel game colors: bg hex, dark text hex, border hex
export const GAME_COLORS = [
  { name: 'Red',    bg: '#FFD0D0', textColor: '#8B2020', borderColor: '#F0AAAA' },
  { name: 'Blue',   bg: '#C8DCFF', textColor: '#1A3D7A', borderColor: '#A8C4F0' },
  { name: 'Green',  bg: '#C0ECCC', textColor: '#1A5A28', borderColor: '#A0D8B0' },
  { name: 'Orange', bg: '#FFD8B0', textColor: '#7A3A10', borderColor: '#F0C090' },
  { name: 'Purple', bg: '#E0C8FF', textColor: '#4A1A7A', borderColor: '#C8A8F0' },
  { name: 'Pink',   bg: '#FFD0E8', textColor: '#8B1A4A', borderColor: '#F0AAC8' },
]

export const MEMORY_EMOJIS = [
  '🎯', '🎮', '🎲', '🎪', '🎨', '🎭', '🎬', '🎤', '🚀', '⭐',
]

export const GAMES = [
  { id: 'tapcolor', name: 'Tap Color',    emoji: '🎨', desc: 'Tap the right color fast!' },
  { id: 'math',     name: 'Math Blitz',   emoji: '🧮', desc: 'Solve equations quickly!' },
  { id: 'memory',   name: 'Memory Match', emoji: '🧠', desc: 'Find all matching pairs!' },
]
