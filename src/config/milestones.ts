export const START_DATE = '2026-05-02'

export interface Milestone {
  m: number
  e: string
  n: string
  desc: string
}

export interface DistanceMilestone {
  km: number
  e: string
  n: string
}

export const MILESTONES: Milestone[] = [
  {
    m: 3000,
    e: '🪂',
    n: 'Hauteur de vol - Parachutisme civil',
    desc: "Hauteur classique d'un saut en tandem (~40s de chute libre)",
  },
  //mont blanc 4808m
  {
    m: 4808,
    e: '⛰️',
    n: 'Mont Blanc',
    desc: "Le toit de l'Europe occidentale, un défi pour les alpinistes et les parapentistes",
  },
  // everest 8848m
  {
    m: 8848,
    e: '🏔️',
    n: 'Everest',
    desc: "Le toit du monde, un défi ultime pour les alpinistes et les aventuriers",
  },
  {
    m: 10000,
    e: '✈️',
    n: 'Hauteur de vol - Avions de ligne',
    desc: "Vous survolez l'Everest ; l'air est si pur qu'on voit la courbure de l'horizon",
  },
  {
    m: 12000,
    e: '🛩️',
    n: "Hauteur de vol - Jet d'affaires",
    desc: 'Les jets privés volent un peu plus haut pour éviter les embouteillages du ciel',
  },
  {
    m: 18000,
    e: '🦅',
    n: 'Hauteur de vol - Le Concorde',
    desc: 'Les passagers voyaient le ciel devenir bleu marine foncé, presque noir, même en plein jour',
  },
  {
    m: 21000,
    e: '🛩️',
    n: 'Hauteur de vol - SR-71 Blackbird',
    desc: "Capable de traverser les États-Unis en 1h, volant là où l'air est trop rare pour les chasseurs",
  },
  {
    m: 31000,
    e: '🎈',
    n: 'Hauteur de vol - Ballons Google Loon',
    desc: 'Des ballons géants diffusant internet, flottant bien au-dessus des tempêtes',
  },
  {
    m: 39000,
    e: '💥',
    n: 'Hauteur de vol - Capsule Red Bull Stratos',
    desc: "Felix Baumgartner s'élance ; sans combinaison, le sang se mettrait à bouillir",
  },
  {
    m: 50000,
    e: '🌌',
    n: 'Fin de la stratosphère',
    desc: "L'air est un million de fois moins dense qu'au sol, bienvenue dans la mésosphère",
  },
  {
    m: 60000,
    e: '🚀',
    n: 'Hauteur de vol - Fusées-sondes',
    desc: 'Petites fusées scientifiques qui font un bond vertical pour des mesures avant de retomber',
  },
  {
    m: 70000,
    e: '⚡',
    n: 'Hauteur de vol - Avions-fusées (X-15)',
    desc: "Prototypes à moteurs de fusée atteignant des vitesses hypersoniques aux limites de l'espace",
  },
]

export const DISTANCE_MILESTONES: DistanceMilestone[] = [
  { km: 1000, e: '🇫🇷', n: 'Paris → Marseille' },
  { km: 2000, e: '🇪🇸', n: 'Paris → Marseille x2 (ou Paris → Barcelone AR)' },
  { km: 3000, e: '🚴', n: "Distance d'un Tour de France" },
  { km: 3500, e: '🚴', n: 'Lille - Cap Nord en voiture par autoroute !' },
  { km: 4000, e: '🇹🇷', n: 'Paris → Istanbul' },
  { km: 5000, e: '🇫🇷', n: 'Paris → Marseille x6' },
  { km: 6000, e: '🇷🇺', n: 'Paris → Moscou' },
  { km: 7000, e: '🌍', n: 'Paris → Marseille x9' },
  { km: 8000, e: '🏁', n: 'Objectif final – Cap Nord atteint !' },
]

export function zoneOf(m: number) {
  if (m >= 50000) return { lbl: 'Au-delà de la stratosphère', e: '🌠', col: '#7c3aed' }
  if (m >= 15000) return { lbl: 'Dans la stratosphère', e: '🎈', col: '#0f766e' }
  if (m >= 3000) return { lbl: 'Basse atmosphère', e: '🚁', col: '#15803d' }
  return { lbl: 'En route !', e: '🚵', col: '#b45309' }
}
