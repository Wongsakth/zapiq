import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useSoundStore = create(
  persist(
    (set) => ({
      soundEnabled: true,
      toggleSound: () => set(s => ({ soundEnabled: !s.soundEnabled })),
    }),
    { name: 'zapiq-sound' }
  )
)

export default useSoundStore
