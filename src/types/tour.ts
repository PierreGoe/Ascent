export interface Tour {
  id: string
  name: string
  date: string
  sport: string
  duration_s: number
  time_h: number
  time_m: number
  distance_km: number
  speed_kmh: number
  ascent_m: number
  descent_m: number
}

export interface ToursData {
  user_id: string
  display_name: string
  fetched_at: string
  tours: Tour[]
}
