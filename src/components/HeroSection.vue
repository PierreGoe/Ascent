<script setup lang="ts">
import { useToursStore } from '@/stores/tours'
import { Badge } from '@/components/ui/badge'
import ShareButton from '@/components/ShareButton.vue'

const store = useToursStore()

const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR')
const fmtM = (m: number) => (m >= 1000 ? (m / 1000).toFixed(1) + '\u202fkm' : fmt(m) + '\u202fm')
</script>

<template>
  <section class="hero">
    <Badge class="hero-badge" :style="{ color: store.zone.col }">
      {{ store.zone.e }} {{ store.zone.lbl }}
    </Badge>
    <div class="hero-num">
      <span>{{ fmt(store.totalAscent) }}</span><span class="hero-unit"> m</span>
    </div>
    <div v-if="store.lastMilestone" class="hero-equiv">
      {{ store.lastMilestone.e }} {{ (store.totalAscent / store.lastMilestone.m).toFixed(2) }}×
      {{ store.lastMilestone.n }}
    </div>
    <div class="hero-next">
      <template v-if="store.nextMilestone">
        Prochain palier → {{ store.nextMilestone.e }} {{ store.nextMilestone.n }}
        (encore {{ fmtM(store.nextMilestone.m - store.totalAscent) }})
      </template>
      <template v-else>🎉 Tous les paliers sont dépassés !</template>
    </div>
    <div class="pills">
      <span class="pill">📏 <strong>{{ fmt(Math.round(store.totalDistance)) }} km</strong> parcourus</span>
      <span class="pill">📅 <strong>{{ store.dayCount }}</strong> jours</span>
      <span class="pill">🏔️ <strong>{{ (store.totalAscent / 8849).toFixed(2) }}×</strong> l'Everest</span>
    </div>
    <ShareButton />
  </section>
</template>

<style scoped>
.hero {
  background: var(--card);
  border-bottom: 1px solid var(--border);
  text-align: center;
  padding: 2rem 1.25rem 1.75rem;
}

.hero-badge {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.9rem;
}

.hero-num {
  font-size: clamp(3rem, 13vw, 8rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1;
  background: linear-gradient(135deg, #e04800 25%, #c97800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-unit {
  font-size: 0.28em;
  letter-spacing: -0.01em;
}

.hero-equiv {
  margin-top: 0.55rem;
  font-size: clamp(0.9rem, 3vw, 1.35rem);
  font-weight: 700;
  color: #0a7c6e;
}

.hero-next {
  margin-top: 0.3rem;
  font-size: 0.8rem;
  color: var(--muted-foreground);
}

.pills {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 1.2rem;
}

.pill {
  padding: 0.28rem 0.8rem;
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 0.76rem;
  color: var(--muted-foreground);
}

.pill strong {
  color: var(--foreground);
  font-weight: 600;
}
</style>
