<script setup lang="ts">
import { useToursStore } from '@/stores/tours'

const store = useToursStore()

const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR')
const fmtM = (m: number) => (m >= 1000 ? (m / 1000).toFixed(1) + '\u202fkm' : fmt(m) + '\u202fm')

function generateShareImage() {
  const W = 1080
  const H = 1920
  const cvs = document.createElement('canvas')
  cvs.width = W
  cvs.height = H
  const ctx = cvs.getContext('2d')!

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#010a1a')
  bg.addColorStop(0.45, '#0c1b3a')
  bg.addColorStop(0.75, '#18082a')
  bg.addColorStop(1, '#260810')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Stars
  for (let i = 0; i < 110; i++) {
    const sx = (i * 137491 + 31) % W
    const sy = (i * 98765 + 53) % Math.round(H * 0.52)
    const sr = i % 5 === 0 ? 2.8 : 1.3
    ctx.fillStyle = `rgba(255,255,255,${i % 3 === 0 ? 0.8 : 0.4})`
    ctx.beginPath()
    ctx.arc(sx, sy, sr, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.textAlign = 'center'

  // Top branding
  ctx.fillStyle = 'rgba(255,255,255,.3)'
  ctx.font = '500 36px -apple-system, system-ui, sans-serif'
  ctx.fillText('🏔️  PROJET 2026  ·  Charles GOEMANS', W / 2, 100)

  // Thin divider helper
  const divider = (y: number) => {
    ctx.strokeStyle = 'rgba(255,255,255,.08)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(W * 0.12, y)
    ctx.lineTo(W * 0.88, y)
    ctx.stroke()
  }

  divider(140)

  // Main message - "Salut !"
  ctx.fillStyle = 'rgba(255,255,255,.95)'
  ctx.font = '700 52px -apple-system, system-ui, sans-serif'
  ctx.fillText('Salut ! 👋', W / 2, 240)

  // Description text - wrap manually
  ctx.font = '400 38px -apple-system, system-ui, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,.85)'
  const lines = [
    'Je suis Charles Goemans',
    'dans son aventure à vélo couché',
    'de la France au Cap Nord ! 🚴',
  ]
  let y = 320
  for (const line of lines) {
    ctx.fillText(line, W / 2, y)
    y += 54
  }

  divider(y + 20)

  // Stats section
  y += 90
  ctx.fillStyle = 'rgba(255,255,255,.3)'
  ctx.font = '600 30px -apple-system, system-ui, sans-serif'
  ctx.fillText('IL A DÉJÀ PARCOURU', W / 2, y)

  y += 90
  const numGrad = ctx.createLinearGradient(W * 0.15, 0, W * 0.85, 0)
  numGrad.addColorStop(0, '#38d9c0')
  numGrad.addColorStop(1, '#0a7c6e')
  ctx.fillStyle = numGrad
  ctx.font = '900 110px -apple-system, system-ui, sans-serif'
  ctx.fillText(`${fmt(Math.round(store.totalDistance))} km`, W / 2, y)

  y += 130
  ctx.fillStyle = 'rgba(255,255,255,.3)'
  ctx.font = '600 30px -apple-system, system-ui, sans-serif'
  ctx.fillText("ET GRIMPÉ L'ÉQUIVALENT DE", W / 2, y)

  y += 90
  const elevGrad = ctx.createLinearGradient(W * 0.15, 0, W * 0.85, 0)
  elevGrad.addColorStop(0, '#e04800')
  elevGrad.addColorStop(1, '#c97800')
  ctx.fillStyle = elevGrad
  ctx.font = '900 110px -apple-system, system-ui, sans-serif'
  ctx.fillText(`${fmt(store.totalAscent)} m`, W / 2, y)

  y += 70
  ctx.fillStyle = 'rgba(255,255,255,.7)'
  ctx.font = '500 40px -apple-system, system-ui, sans-serif'
  const equiv = store.lastMilestone
    ? `Ça représente ${(store.totalAscent / store.lastMilestone.m).toFixed(1)}× ${store.lastMilestone.n} ${store.lastMilestone.e}`
    : `Ça représente ${(store.totalAscent / 8849).toFixed(1)}× l'Everest 🏔️`
  // Wrap equiv if too long
  const equivLines = wrapText(ctx, equiv, W * 0.8)
  for (const el of equivLines) {
    y += 56
    ctx.fillText(el, W / 2, y)
  }

  divider(y + 50)
  y += 120

  // Zone badge
  const zone = store.zone
  ctx.fillStyle = zone.col
  ctx.font = '700 44px -apple-system, system-ui, sans-serif'
  ctx.fillText(`${zone.e}  ${zone.lbl}`, W / 2, y)

  y += 40
  ctx.fillStyle = 'rgba(255,255,255,.5)'
  ctx.font = '400 34px -apple-system, system-ui, sans-serif'
  ctx.fillText(`📅 ${store.dayCount} jours d'aventure`, W / 2, y + 50)

  divider(y + 110)

  // Follow section
  y += 180
  ctx.fillStyle = 'rgba(255,255,255,.9)'
  ctx.font = '700 42px -apple-system, system-ui, sans-serif'
  ctx.fillText('Si comme moi tu veux le suivre :', W / 2, y)

  y += 80
  ctx.fillStyle = 'rgba(255,255,255,.7)'
  ctx.font = '400 34px -apple-system, system-ui, sans-serif'
  ctx.fillText('📷  @step_by_step_road_trip', W / 2, y)

  y += 60
  ctx.fillText('📘  facebook.com/share/1594pkjMtz', W / 2, y)

  // Bottom branding
  ctx.fillStyle = 'rgba(255,255,255,.15)'
  ctx.font = '400 26px -apple-system, system-ui, sans-serif'
  ctx.fillText('associationstepbystep.com', W / 2, H - 60)

  // Export
  const shareText = `🏔️ Je suis l'aventure de Charles Goemans ! Il a déjà parcouru ${fmt(Math.round(store.totalDistance))} km et grimpé l'équivalent de ${fmt(store.totalAscent)} m de dénivelé positif cumulé. ${equiv}

Si comme moi tu veux le suivre :
📷 https://www.instagram.com/step_by_step_road_trip/
📘 https://www.facebook.com/share/1594pkjMtz/

Et pour voir tous les détails de son projet fou de rejoindre le Cap Nord à vélo couché :
 🌐 https://associationstepbystep.com
 🌐 https://pierregoe.github.io/Ascent/
`
  // Note: "Je suis" ici = verbe suivre (je suis = I follow)

  cvs.toBlob(async (blob) => {
    if (!blob) return
    const file = new File([blob], 'ascent-partage.png', { type: 'image/png' })
    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Projet 2026 – Charles Goemans',
          text: shareText,
        })
        return
      }
    } catch {
      /* fall through to download */
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ascent-partage.png'
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}
</script>

<template>
  <button class="share-btn" @click="generateShareImage">
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
    Partager l'aventure
  </button>
</template>

<style scoped>
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.3rem;
  padding: 0.7rem 1.6rem;
  background: linear-gradient(135deg, #e04800, #c97800);
  color: #fff;
  font-size: 0.88rem;
  font-weight: 700;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(224, 72, 0, 0.25);
  transition:
    opacity 0.15s,
    transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}

.share-btn:hover {
  opacity: 0.88;
}

.share-btn:active {
  transform: scale(0.95);
}
</style>
