import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Tour, ToursData } from '@/types/tour'
import { START_DATE, MILESTONES, DISTANCE_MILESTONES, zoneOf } from '@/config/milestones'
import toursJson from '../../data/tours.json'

export interface DayData {
  date: string
  ascent: number
  dist: number
  cumul: number
  ids: string[]
}

export const useToursStore = defineStore('tours', () => {
  const data = ref<ToursData>(toursJson as ToursData)

  const tours = computed(() => data.value.tours)
  const displayName = computed(() => data.value.display_name)

  // Filtered tours from START_DATE, sorted chronologically
  const filteredTours = computed(() =>
    tours.value
      .filter((t) => t.date.slice(0, 10) >= START_DATE)
      .sort((a, b) => a.date.localeCompare(b.date)),
  )

  // Group by day
  const days = computed<DayData[]>(() => {
    const byDay: Record<string, DayData> = {}
    for (const t of filteredTours.value) {
      const d = t.date.slice(0, 10)
      if (!byDay[d]) byDay[d] = { date: d, ascent: 0, dist: 0, cumul: 0, ids: [] }
      byDay[d].ascent += t.ascent_m
      byDay[d].dist += t.distance_km
      if (t.id) byDay[d].ids.push(t.id)
    }
    const sorted = Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date))
    let c = 0
    for (const day of sorted) {
      c += day.ascent
      day.cumul = c
    }
    return sorted
  })

  const totalAscent = computed(() => days.value.length ? days.value[days.value.length - 1].cumul : 0)
  const totalDistance = computed(() => days.value.reduce((s, d) => s + d.dist, 0))
  const totalDuration = computed(() =>
    filteredTours.value.reduce((sum, t) => sum + t.duration_s, 0),
  )
  const dayCount = computed(() => days.value.length)
  const maxDayAscent = computed(() => Math.max(...days.value.map((d) => d.ascent)))

  const zone = computed(() => zoneOf(totalAscent.value))
  const reachedMilestones = computed(() => MILESTONES.filter((ms) => totalAscent.value >= ms.m))
  const lastMilestone = computed(() =>
    reachedMilestones.value.length ? reachedMilestones.value[reachedMilestones.value.length - 1] : null,
  )
  const nextMilestone = computed(() => MILESTONES.find((ms) => totalAscent.value < ms.m) ?? null)

  return {
    data,
    tours,
    displayName,
    filteredTours,
    days,
    totalAscent,
    totalDistance,
    totalDuration,
    dayCount,
    maxDayAscent,
    zone,
    reachedMilestones,
    lastMilestone,
    nextMilestone,
    MILESTONES,
    DISTANCE_MILESTONES,
  }
})
