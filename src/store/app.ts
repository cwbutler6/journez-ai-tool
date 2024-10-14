import { CategoryRecommendations, exportRecommendationsToCSV } from '@/lib/api'
import { create } from 'zustand'

interface AppState {
  thinking: boolean
  showResults: boolean
  location: string
  results: CategoryRecommendations[]
  categories: string[]
  numberOfLocations: number
  resetSearch: () => void
  exportResults: (data: CategoryRecommendations[]) => void
  updateLocation: (location: string) => void
  updateCategories: (categories: string[]) => void
  updateNumberOfLocations: (numberOfLocations: number) => void
}

const useAppStore = create<AppState>()((set) => ({
  thinking: false,
  showResults: false,
  location: '',
  results: [],
  categories: [],
  numberOfLocations: 0,
  resetSearch: () => {
    set({ thinking: false, location: '', numberOfLocations: 0, categories: [], showResults: false, results: [] })
  },
  exportResults: async (data: CategoryRecommendations[]) => {
    set({ thinking: true })
    try {
      exportRecommendationsToCSV(data)
    } catch (error) {
      console.error('Error exporting results:', error)
    } finally {
      set({ thinking: false })
    }
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