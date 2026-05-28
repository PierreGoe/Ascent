<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToursStore, type DayData } from '@/stores/tours'
import { MILESTONES, zoneOf } from '@/config/milestones'

const store = useToursStore()

const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR')
const fmtM = (m: number) => (m >= 1000 ? (m / 1000).toFixed(1) + '\u202fkm' : fmt(m) + '\u202fm')
const fmtD = (s: string) =>
  new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

// Log scale
const L0 = Math.log10(80)
const L1 = Math.log10(80000)
function lp(m: number) {
  return (Math.log10(Math.max(80, m)) - L0) / (L1 - L0)
}

// Cardinal spline
function cardinal(pts: { x: number; y: number }[], t = 0.3) {
  if (pts.length < 2) return pts.length ? `M${pts[0].x},${pts[0].y}` : ''
  let d = `M${pts[0].x},${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const a = pts[Math.max(i - 2, 0)]
    const b = pts[i - 1]
    const c = pts[i]
    const e = pts[Math.min(i + 1, pts.length - 1)]
    d += ` C${(b.x + (c.x - a.x) * t).toFixed(1)},${(b.y + (c.y - a.y) * t).toFixed(1)}`
    d += ` ${(c.x - (e.x - b.x) * t).toFixed(1)},${(c.y - (e.y - b.y) * t).toFixed(1)}`
    d += ` ${c.x.toFixed(1)},${c.y.toFixed(1)}`
  }
  return d
}

// SVG dimensions
const mob = ref(typeof window !== 'undefined' ? window.innerWidth < 600 : false)
const W = computed(() => (mob.value ? 390 : 900))
const H = computed(() => (mob.value ? 620 : 520))
const PL = 10, PR = 10, PT = 16, PB = 28
const cW = computed(() => W.value - PL - PR)
const cH = computed(() => H.value - PT - PB)
const FS = computed(() => (mob.value ? 10.5 : 9.5))
const MGAP = computed(() => (mob.value ? 16 : 13))

const tx = (i: number) => PL + (store.days.length > 1 ? (i / (store.days.length - 1)) * cW.value : cW.value / 2)
const ty = (m: number) => PT + cH.value * (1 - lp(m))

const pts = computed(() => store.days.map((d, i) => ({ x: tx(i), y: ty(d.cumul), d, i })))

const linePath = computed(() => cardinal(pts.value))
const areaPath = computed(() => {
  if (!pts.value.length) return ''
  return (
    linePath.value +
    ` L${pts.value[pts.value.length - 1].x.toFixed(1)},${(PT + cH.value).toFixed(1)}` +
    ` L${pts.value[0].x.toFixed(1)},${(PT + cH.value).toFixed(1)} Z`
  )
})

// Zones
const ZONES = [
  { from: 0, to: 15000, bg: 'rgba(76,153,59,.1)' },
  { from: 15000, to: 50000, bg: 'rgba(56,126,209,.1)' },
  { from: 50000, to: 80000, bg: 'rgba(44,82,200,.12)' },
]
const ZONE_LBLS = [
  { from: 0, to: 15000, lbl: 'Basse Atmosphère' },
  { from: 15000, to: 50000, lbl: 'Stratosphère' },
  { from: 50000, to: 80000, lbl: 'Mésosphère' },
]

const zoneRects = computed(() =>
  ZONES.map((z) => {
    const yT = Math.max(PT, ty(z.to))
    const yB = Math.min(PT + cH.value, ty(Math.max(80, z.from)))
    const h = yB - yT
    return { x: PL, y: yT, w: cW.value, h, bg: z.bg, visible: h > 0 }
  }),
)

const zoneLbls = computed(() =>
  ZONE_LBLS.map((z) => {
    const yT = Math.max(PT, ty(z.to))
    const yB = Math.min(PT + cH.value, ty(Math.max(80, z.from)))
    const h = yB - yT
    return { x: PL + cW.value - 5, y: yT + h / 2, lbl: z.lbl.toUpperCase(), visible: h > 14 }
  }),
)

// Milestone lines
const msLines = computed(() => {
  let lastY = PT + cH.value + 40
  return MILESTONES.map((ms) => {
    const y = ty(ms.m)
    if (y < PT - 2 || y > PT + cH.value + 2) return null
    if (lastY - y < MGAP.value) return null
    lastY = y
    const ok = store.totalAscent >= ms.m
    return { y, ok, label: `${ms.e} ${ms.n} · ${fmtM(ms.m)}${ok ? ' ✓' : ''}` }
  }).filter(Boolean) as { y: number; ok: boolean; label: string }[]
})

// X-axis labels
const xLabels = computed(() => {
  const step = Math.max(1, Math.ceil(store.days.length / (mob.value ? 6 : 13)))
  return store.days
    .map((d, i) => {
      if (i % step !== 0 && i !== store.days.length - 1) return null
      return { x: tx(i), label: fmtD(d.date) }
    })
    .filter(Boolean) as { x: number; label: string }[]
})

const lastPt = computed(() => (pts.value.length ? pts.value[pts.value.length - 1] : null))

// Tooltip
const tooltip = ref<{ visible: boolean; html: string; x: number; y: number }>({
  visible: false,
  html: '',
  x: 0,
  y: 0,
})

function showTip(event: MouseEvent | TouchEvent) {
  const wrap = document.getElementById('cWrap')
  const svg = wrap?.querySelector('svg')
  if (!wrap || !svg) return

  const rect = svg.getBoundingClientRect()
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  const frac = Math.max(0, Math.min(1, ((clientX - rect.left) / rect.width * W.value - PL) / cW.value))
  const idx = Math.round(frac * (store.days.length - 1))
  const d = store.days[idx]
  if (!d) return

  tooltip.value.html = `<div class="tt-day">${new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} · Jour ${idx + 1}</div><div class="tt-cum">${fmt(d.cumul)} m</div><div class="tt-asc">↑ ${fmt(d.ascent)} m ce jour ${zoneOf(d.cumul).e}</div>`

  let x = clientX - rect.left + 14
  let y = clientY - rect.top - 65
  if (x + 188 > rect.width) x = clientX - rect.left - 202
  if (y < 4) y = clientY - rect.top + 14

  tooltip.value.x = Math.max(0, x)
  tooltip.value.y = Math.max(0, y)
  tooltip.value.visible = true
}

function hideTip() {
  tooltip.value.visible = false
}

function hideTipDelayed() {
  setTimeout(hideTip, 1400)
}
</script>

<template>
  <section class="chart-section">
    <div class="chart-lbl">Dénivelé positif cumulé · échelle logarithmique</div>
    <div
      id="cWrap"
      class="chart-wrap"
      @mousemove="showTip"
      @mouseleave="hideTip"
      @touchmove.prevent="showTip"
      @touchend="hideTipDelayed"
    >
      <div
        class="tt"
        :class="{ on: tooltip.visible }"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        v-html="tooltip.html"
      />
      <svg class="chart-svg" :viewBox="`0 0 ${W} ${H}`" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chartBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#eef2ff" />
            <stop offset="35%" stop-color="#eff6ff" />
            <stop offset="68%" stop-color="#f0f9ff" />
            <stop offset="88%" stop-color="#f0fdf4" />
            <stop offset="100%" stop-color="#f8f8f6" />
          </linearGradient>
          <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FF6B35" stop-opacity=".22" />
            <stop offset="55%" stop-color="#FFD166" stop-opacity=".07" />
            <stop offset="100%" stop-color="#FFD166" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="lG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#FF6B35" />
            <stop offset="100%" stop-color="#FFD166" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="cp">
            <rect :x="PL" :y="PT" :width="cW" :height="cH" />
          </clipPath>
        </defs>

        <!-- Background -->
        <rect :x="PL" :y="PT" :width="cW" :height="cH" fill="url(#chartBg)" />

        <!-- Zone rects -->
        <rect
          v-for="(z, i) in zoneRects"
          v-show="z.visible"
          :key="'z' + i"
          :x="z.x"
          :y="z.y"
          :width="z.w"
          :height="z.h"
          :fill="z.bg"
        />

        <!-- Zone labels -->
        <text
          v-for="(z, i) in zoneLbls"
          v-show="z.visible"
          :key="'zl' + i"
          :x="z.x"
          :y="z.y"
          fill="rgba(0,0,0,.2)"
          :font-size="FS - 1"
          font-weight="600"
          text-anchor="end"
          font-family="system-ui"
          dominant-baseline="middle"
        >
          {{ z.lbl }}
        </text>

        <!-- Milestone lines -->
        <g v-for="(ms, i) in msLines" :key="'ms' + i">
          <line
            :x1="PL"
            :y1="ms.y"
            :x2="PL + cW"
            :y2="ms.y"
            :stroke="ms.ok ? 'rgba(21,128,61,.45)' : 'rgba(107,114,128,.28)'"
            stroke-width=".9"
            stroke-dasharray="3,5"
          />
          <text
            :x="PL + 4"
            :y="ms.y - 2.5"
            :fill="ms.ok ? '#166534' : '#374151'"
            :font-size="FS"
            font-family="system-ui"
            :font-weight="ms.ok ? '600' : '400'"
          >
            {{ ms.label }}
          </text>
        </g>

        <!-- Area + curve -->
        <path :d="areaPath" fill="url(#aG)" clip-path="url(#cp)" />
        <path
          :d="linePath"
          fill="none"
          stroke="url(#lG)"
          :stroke-width="mob ? 2.8 : 2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          filter="url(#glow)"
          clip-path="url(#cp)"
        />

        <!-- Day dots -->
        <g v-for="(p, i) in pts" :key="'dot' + i">
          <circle :cx="p.x" :cy="p.y" :r="mob ? 14 : 11" fill="transparent" />
          <circle :cx="p.x" :cy="p.y" :r="mob ? 3 : 2.5" fill="#e04800" opacity=".8" />
        </g>

        <!-- Current marker -->
        <g v-if="lastPt">
          <circle
            :cx="lastPt.x"
            :cy="lastPt.y"
            r="5"
            fill="none"
            stroke="#e04800"
            stroke-width="1.8"
            class="cur-dot"
          />
          <text :x="lastPt.x" :y="lastPt.y - 14" :font-size="mob ? 17 : 15" text-anchor="middle">
            🚴
          </text>
        </g>

        <!-- X-axis labels -->
        <text
          v-for="(lbl, i) in xLabels"
          :key="'xl' + i"
          :x="lbl.x"
          :y="H - PB + 16"
          fill="#6b7a99"
          :font-size="FS - 1"
          text-anchor="middle"
          font-family="system-ui"
        >
          {{ lbl.label }}
        </text>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.chart-section {
  padding: 1.1rem 0 0;
}

.chart-lbl {
  text-align: center;
  font-size: 0.63rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted-foreground);
  margin-bottom: 0.55rem;
}

.chart-wrap {
  position: relative;
  margin: 0 0.75rem;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.07);
  border: 1px solid var(--border);
}

.chart-svg {
  width: 100%;
  height: auto;
  display: block;
}

.tt {
  position: absolute;
  background: rgba(4, 8, 22, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 0.45rem 0.7rem;
  font-size: 0.76rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.1s;
  white-space: nowrap;
  z-index: 10;
  color: #fff;
}

.tt.on {
  opacity: 1;
}

:deep(.tt-day) {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
}

:deep(.tt-cum) {
  font-size: 0.98rem;
  font-weight: 700;
  color: #ffd166;
}

:deep(.tt-asc) {
  font-size: 0.7rem;
  color: #38d9c0;
  margin-top: 1px;
}

.cur-dot {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    r: 5;
    opacity: 0.9;
  }
  50% {
    r: 7.5;
    opacity: 0.5;
  }
}

@media (min-width: 600px) {
  .chart-wrap {
    margin: 0 1.5rem;
  }
}

@media (min-width: 960px) {
  .chart-wrap {
    margin: 0 2.5rem;
  }
}
</style>
