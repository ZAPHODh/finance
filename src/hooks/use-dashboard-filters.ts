import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface DashboardFilters {
  period: string
  driverId: string | null
  vehicleId: string | null
  platformId: string | null
}

interface DashboardFiltersStore {
  filters: DashboardFilters
  setFilter: <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => void
  resetFilters: () => void
}

const defaultFilters: DashboardFilters = {
  period: 'thisMonth',
  driverId: null,
  vehicleId: null,
  platformId: null,
}

export const useDashboardFilters = create<DashboardFiltersStore>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: 'dashboard-filters',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
