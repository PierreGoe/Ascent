# 🏔️ Ascent Tracker — Charles GOEMANS

Visualisation interactive des données Komoot avec compteur de dénivelé cumulé et comparaison aux monuments du monde.

## Structure du projet

```
Ascent/
├── index.html      ← Page visuelle (ouvrir dans un navigateur)
├── scraper.py      ← Script Python de récupération quotidienne
├── data/
│   ├── tours.js    ← Données JS (généré par scraper.py)
│   └── tours.json  ← Données JSON brutes
└── README.md
```

## Lancement rapide

### 1. Récupérer les données (première fois)
```bash
cd /Users/pierre/Code/Perso/Ascent
pip3 install requests
python3 scraper.py
```

### 2. Ouvrir le visuel
```bash
open index.html
```
Ou glisse `index.html` dans ton navigateur.

---

## Mise à jour quotidienne automatique (cron)

Pour lancer le scraper automatiquement chaque matin à 8h :

```bash
crontab -e
```

Ajoute cette ligne :
```
0 8 * * * cd /Users/pierre/Code/Perso/Ascent && /usr/bin/python3 scraper.py >> scraper.log 2>&1
```

Le fichier `data/tours.js` sera mis à jour, il suffit de rafraîchir `index.html`.

---

## Ce que montre le visuel

### Barre latérale
- **Dénivelé cumulé total** en mètres
- **Équivalent Everest** (combien de fois tu as gravi l'Everest !)
- **Prochain objectif** avec barre de progression
- **Jauge logarithmique** avec tous les monuments : immeuble, Notre-Dame, Tour Eiffel, Burj Khalifa, Mont Blanc, Everest × N...

### Cartes d'activité (chaque sortie)
- ⏱️ Temps
- 📏 Distance (km)
- ⚡ Vitesse (km/h)
- ⬆️ Dénivelé positif (m)
- ⬇️ Dénivelé négatif (m)
- Dénivelé cumulé après cette sortie + monument atteint 🎉

---

## Source des données

API publique Komoot :
`https://api.komoot.de/v007/users/1939029710958/tours/`

Aucune authentification requise pour les activités publiques.
