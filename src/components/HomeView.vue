<script setup lang="ts">
import { useToursStore } from '@/stores/tours'
import HeroSection from '@/components/HeroSection.vue'
import GoalsSection from '@/components/GoalsSection.vue'
import ChartSection from '@/components/ChartSection.vue'
import DaysSection from '@/components/DaysSection.vue'

const store = useToursStore()

const fmtD = (s: string) =>
  new Date(s).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
</script>

<template>
  <div class="app-shell">
    <header class="hdr">
      <div class="hdr-logo">🏔️ <em>PROJET 2026</em> · Charles GOEMANS</div>
      <div class="hdr-meta">
        <a href="https://associationstepbystep.com" target="_blank" rel="noopener noreferrer" class="hdr-link">Step by Step ↗</a>
        <br />Depuis {{ store.days.length ? fmtD(store.days[0].date) : '' }} · {{ store.dayCount }} jours
      </div>
    </header>

    <div class="intro">
      🚵 <strong>Charles voyage actuellement de France jusqu'au Cap Nord en Norvège, à l'aide d'un vélo couché.</strong>
      Pour le soutenir et vous aider à vous représenter l'effort, voilà une petite démonstration fun de l'ampleur du projet :
      chaque mètre de dénivelé positif est additionné et projeté <strong>à la verticale</strong> — comme s'il grimpait sans jamais redescendre.
    </div>

    <HeroSection />

    <GoalsSection
      title="🎯 Objectifs Distance"
      subtitle="Objectif final : 8 000 km — France → Cap Nord"
      :milestones="store.DISTANCE_MILESTONES"
      :current-value="store.totalDistance"
      type="distance"
    />

    <GoalsSection
      title="🏔️ Objectifs Dénivelé"
      subtitle="Dénivelé positif cumulé projeté à la verticale"
      :milestones="store.MILESTONES"
      :current-value="store.totalAscent"
      type="elevation"
    />

    <ChartSection />

    <DaysSection />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: var(--background);
}

.hdr {
  background: var(--card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1.25rem;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 20;
  gap: 0.5rem;
}

.hdr-logo {
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
}

.hdr-logo em {
  color: #e04800;
  font-style: normal;
}

.hdr-meta {
  font-size: 0.68rem;
  color: var(--muted-foreground);
  text-align: right;
  line-height: 1.4;
}

.hdr-link {
  color: #e04800;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.72rem;
}

.intro {
  padding: 0.9rem 1.25rem;
  background: linear-gradient(135deg, rgba(224, 72, 0, 0.03), rgba(201, 120, 0, 0.05));
  border-bottom: 1px solid var(--border);
  font-size: 0.82rem;
  line-height: 1.65;
  color: var(--muted-foreground);
  text-align: center;
}

.intro strong {
  color: var(--foreground);
  font-weight: 600;
}
</style>
