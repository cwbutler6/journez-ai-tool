import { exportRecommendationsToCSV } from '@/lib/api'
import { create } from 'zustand'

interface AppState {
  thinking: boolean
  showResults: boolean
  location: string
  results: unknown[]
  categories: string[]
  numberOfLocations: number
  search: () => void
  resetSearch: () => void
  exportResults: (data: any[]) => void
  updateLocation: (location: string) => void
  updateCategories: (categories: string[]) => void
  updateNumberOfLocations: (numberOfLocations: number) => void
}

const useAppStore = create<AppState>()((set, get) => ({
  thinking: false,
  showResults: false,
  location: '',
  results: [],
  categories: [],
  numberOfLocations: 0,
  search: () => {
    set({ thinking: true })
    setTimeout(() => {
      set({ thinking: false, showResults: true, results: [] })
    }, 3000);
  },
  resetSearch: () => {
    set({ thinking: false, location: '', numberOfLocations: 0, categories: [], showResults: false, results: [] })
  },
  exportResults: async (data: any[]) => {
    set({ thinking: true })
    exportRecommendationsToCSV(data)
    set({ thinking: false })
  },
  updateLocation: (location: string) => {
    set({ location })
  },
  updateCategories: (categories: string[]) => {
    set({ categories })
  },
  updateNumberOfLocations: (numberOfLocations: number) => {
    set({ numberOfLocations })
  }
}))

export default useAppStore
