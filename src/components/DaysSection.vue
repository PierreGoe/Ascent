<script setup lang="ts">
import { useToursStore } from '@/stores/tours'

const store = useToursStore()

const fmtD = (s: string) =>
  new Date(s).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })

const fmt = (n: number) => n.toLocaleString('fr-FR')
</script>

<template>
  <section class="days-section">
    <div class="days-lbl">Chaque journée</div>
    <div class="days-row">
      <div
        v-for="(day, i) in store.days"
        :key="day.date"
        class="dc"
      >
        <div class="dc-head">
          <span class="dc-badge">J{{ i + 1 }}</span>
          <span class="dc-date">{{ fmtD(day.date) }}</span>
        </div>

        <div class="dc-stats">
          <div class="dc-stat">
            <span class="dc-stat-val">↑ {{ fmt(Math.round(day.ascent)) }}&nbsp;m</span>
            <span class="dc-stat-lbl">D+</span>
          </div>
          <div class="dc-stat">
            <span class="dc-stat-val">{{ day.dist.toFixed(1) }}&nbsp;km</span>
            <span class="dc-stat-lbl">Distance</span>
          </div>
        </div>

        <div class="dc-bar">
          <div class="dc-bar-fill" :style="{ width: `${(day.ascent / store.maxDayAscent * 100).toFixed(1)}%` }" />
        </div>

        <div v-if="day.ids.length" class="dc-links">
          <a
            v-for="(id, j) in day.ids"
            :key="id"
            class="dc-komoot"
            :href="`https://www.komoot.com/tour/${id}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            {{ day.ids.length > 1 ? `Sortie ${j + 1}` : 'Voir sur Komoot' }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.days-section {
  padding: 1.1rem 0.75rem 3rem;
}

.days-lbl {
  font-size: 0.63rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--muted-foreground);
  margin-bottom: 0.6rem;
}

.days-row {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.dc {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 0.7rem 0.85rem;
  transition: border-color 0.12s, box-shadow 0.12s;
}

.dc:hover {
  border-color: #e04800;
  box-shadow: 0 0 0 3px rgba(224, 72, 0, 0.08);
}

.dc-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.45rem;
}

.dc-badge {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #fff;
  background: #e04800;
  border-radius: 4px;
  padding: 0.12rem 0.4rem;
  line-height: 1.3;
}

.dc-date {
  font-size: 0.72rem;
  color: var(--muted-foreground);
  text-transform: capitalize;
}

.dc-stats {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 0.4rem;
}

.dc-stat {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
}

.dc-stat-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--foreground);
  font-variant-numeric: tabular-nums;
}

.dc-stat-lbl {
  font-size: 0.6rem;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dc-bar {
  height: 4px;
  background: var(--border);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 0.45rem;
}

.dc-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #e04800, #c97800);
  border-radius: 99px;
}

.dc-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.dc-komoot {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--muted-foreground);
  text-decoration: none;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  transition: color 0.12s, border-color 0.12s, background 0.12s;
}

.dc-komoot:hover {
  color: #e04800;
  border-color: #e04800;
  background: rgba(224, 72, 0, 0.04);
}
</style>
