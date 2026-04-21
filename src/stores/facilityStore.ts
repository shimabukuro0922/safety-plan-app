import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Facility } from '@/types'

interface FacilityState {
  facility: Facility | null
  setFacility: (f: Facility) => void
}

export const useFacilityStore = create<FacilityState>()(
  persist(
    (set) => ({
      facility: {
        id: 'fac1',
        name: 'さくら保育園',
        capacity: 60,
        staff_count: 12,
        age_range_min: 0,
        age_range_max: 5,
        director_name: '山田 園長',
        address: '沖縄県南城市○○1-2-3',
        phone: '098-000-0000',
      },
      setFacility: (f) => set({ facility: f }),
    }),
    { name: 'facility-store' }
  )
)
