import { create } from 'zustand'

interface FilterState {
  capMax: number
  ratioMin: number
  ageWindow: 'all' | '24h' | '7d'
  setCapMax: (n: number) => void
  setRatioMin: (n: number) => void
  setAgeWindow: (a: 'all' | '24h' | '7d') => void
}

export const useTokenFilters = create<FilterState>((set) => ({
  capMax: 300000,
  ratioMin: 0.3,
  ageWindow: 'all',
  setCapMax: (n) => set({ capMax: n }),
  setRatioMin: (n) => set({ ratioMin: n }),
  setAgeWindow: (a) => set({ ageWindow: a })
}))