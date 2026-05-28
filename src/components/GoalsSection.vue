<script setup lang="ts">
import { computed } from 'vue'
import type { Milestone, DistanceMilestone } from '@/config/milestones'

const props = defineProps<{
  title: string
  subtitle: string
  milestones: Milestone[] | DistanceMilestone[]
  currentValue: number
  type: 'distance' | 'elevation'
}>()

const fmtM = (m: number) => (m >= 1000 ? (m / 1000).toFixed(1) + '\u202fkm' : Math.round(m).toLocaleString('fr-FR') + '\u202fm')

const items = computed(() => {
  return props.milestones.map((ms) => {
    const target = props.type === 'distance' ? (ms as DistanceMilestone).km : (ms as Milestone).m
    const pct = Math.min(1, props.currentValue / target)
    const done = pct >= 1
    const desc = props.type === 'elevation' ? (ms as Milestone).desc : undefined
    const val = props.type === 'distance'
      ? `${(ms as DistanceMilestone).km.toLocaleString('fr-FR')}\u202fkm`
      : fmtM((ms as Milestone).m)
    return { ...ms, pct, done, desc, val, target }
  })
})
</script>

<template>
  <section class="goals-section">
    <h3 class="goals-title">{{ title }}</h3>
    <p class="goals-subtitle">{{ subtitle }}</p>
    <div class="goals-list">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="goal-item"
        :class="{ done: item.done }"
      >
        <span class="goal-emoji">{{ item.e }}</span>
        <div class="goal-info">
          <div class="goal-name">{{ item.n }}{{ type === 'elevation' ? ` · ${item.val}` : '' }}</div>
          <div v-if="item.desc" class="goal-desc">{{ item.desc }}</div>
          <div v-else class="goal-desc">{{ item.val }}</div>
        </div>
        <span class="goal-val">{{ item.val }}</span>
        <div class="goal-bar">
          <div
            class="goal-fill"
            :class="type === 'distance' ? 'dist-fill' : 'elev-fill'"
            :style="{ width: `${(item.pct * 100).toFixed(1)}%` }"
          />
        </div>
        <span class="goal-check">{{ item.done ? '✅' : '' }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.goals-section {
  padding: 1.2rem 1.25rem;
  border-bottom: 1px solid var(--border);
}

.goals-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.goals-subtitle {
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin-bottom: 0.8rem;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.7rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.8rem;
}

.goal-item.done {
  border-color: rgba(10, 124, 110, 0.3);
  background: rgba(10, 124, 110, 0.04);
}

.goal-emoji {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.goal-info {
  flex: 1;
  min-width: 0;
}

.goal-name {
  font-weight: 600;
  font-size: 0.78rem;
}

.goal-desc {
  font-size: 0.68rem;
  color: var(--muted-foreground);
}

.goal-val {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--muted-foreground);
  min-width: 4.5rem;
  text-align: right;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.goal-bar {
  width: 60px;
  height: 5px;
  background: var(--border);
  border-radius: 99px;
  overflow: hidden;
  flex-shrink: 0;
}

.goal-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s ease;
}

.dist-fill {
  background: linear-gradient(90deg, #0a7c6e, #38d9c0);
}

.elev-fill {
  background: linear-gradient(90deg, #e04800, #c97800);
}

.goal-check {
  font-size: 0.85rem;
  flex-shrink: 0;
}
</style>
