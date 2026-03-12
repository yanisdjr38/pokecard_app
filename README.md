# 📱 CardTrackr

**CardTrackr** est une application web et mobile dédiée aux collectionneurs de cartes Pokémon. Elle permet de suivre sa collection, visualiser les cartes par sets, et identifier facilement les cartes manquantes pour compléter un master set.

---

## 🎯 Objectif du projet

L'objectif principal de CardTrackr est de fournir aux collectionneurs de cartes Pokémon un outil simple et efficace pour :

- **Centraliser** le suivi de leur collection en un seul endroit
- **Visualiser** leur progression vers le master set de chaque série
- **Identifier** rapidement les cartes manquantes (par variante : Normal, Holo, Reverse, Pokéball, Master Ball)
- **Accéder** à leur collection depuis n'importe quel appareil (web ou mobile Android)

---

## 🧩 Concept

CardTrackr fonctionne comme une **checklist interactive** organisée par sets Pokémon (extensions). Chaque carte peut être marquée selon plusieurs variantes possibles en fonction de sa rareté :

| Rareté | Variantes disponibles |
|--------|----------------------|
| Commune (C) / Peu commune (U) | Normal, Reverse, Pokéball*, Master Ball* |
| Rare (R) | Holo, Reverse*, Pokéball*, Master Ball* |
| Ultra Rare (RR, IR, SIR, UR, HR, ACE) | Normal uniquement |

*\* Selon le set (disponible sur EV8.5 et EV10.5)*

L'application calcule automatiquement votre progression et affiche des barres visuelles pour chaque set.

---

## ⚡ Stack technique

| Technologie | Utilisation |
|-------------|-------------|
| **React 19** | Framework frontend |
| **Vite 7** | Bundler et serveur de développement |
| **Tailwind CSS 4** | Styling utilitaire |
| **DaisyUI** | Composants UI pré-stylés |
| **React Router DOM** | Navigation SPA |
| **Supabase** | Backend (blog, actualités, métadonnées des sets) |
| **Capacitor** | Build APK Android |
| **localStorage** | Persistance locale de la collection |

---

## ✨ Fonctionnalités

### 📂 Gestion par sets
- Affichage de tous les sets disponibles avec leur logo
- Progression visuelle (barre + pourcentage) pour chaque set
- Navigation intuitive entre les sets

### ✅ Checklist avancée
- Cases à cocher par variante (Normal, Holo, Reverse, Pokéball, Master Ball)
- Variantes adaptées automatiquement selon la rareté de la carte
- Boutons "Tout cocher" / "Tout décocher" par carte
- Indicateur visuel pour les cartes complètes (bordure verte)

### 🔍 Filtres et recherche
- Recherche par nom ou numéro de carte
- Filtrage par rareté (C, U, R, RR, IR, SIR, UR, HR, ACE)
- Mode "Cartes incomplètes uniquement"
- Filtrage par type de variante manquante

### 👁️ Modes d'affichage
- **Mode Détail** : Grande image, toutes les infos et checkboxes
- **Mode Mini** : Grille compacte avec miniatures

### 💾 Sauvegarde automatique
- Persistance dans le `localStorage` du navigateur
- Aucune création de compte requise
- Synchronisation entre onglets

### 📱 Application mobile
- Interface 100% responsive et optimisée tactile
- Export en APK Android via Capacitor
- Splash screen au démarrage

### 📰 Contenu dynamique
- Section Blog avec articles
- Actualités Pokémon
- Formulaire de feedback intégré

---

## 📦 Sets supportés

| Code | Nom du set |
|------|------------|
| EV8 | Foudre Noire |
| EV8.5 | Destinées de Paldea |
| EV9 | Flamme Argentée |
| EV10 | Frontières Stellaires |
| EV10.5 BL | Frontières Stellaires (Blasteroise) |
| EV10.5 WH | Frontières Stellaires (Dracaufeu) |
| ME1 | Collection Match |

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Démarrage local

```bash
git clone https://github.com/ton-user/pokecard-tracker.git
cd pokecard-tracker
npm install
npm run dev
```

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
VITE_SB_URL=https://votre-projet.supabase.co
VITE_SB_ANON=votre-clé-anon-supabase
```

---

## 📱 Génération APK Android

### Prérequis
- Android Studio installé
- Capacitor configuré

### Étapes

```bash
# Synchroniser le build web avec Android
npx cap copy

# Ouvrir dans Android Studio
npx cap open android
```

Dans Android Studio :
1. **Build > Build Bundle(s) / APK(s) > Build APK**
2. Récupérer l'APK : `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📁 Structure du projet

```
src/
├── api/          # Appels Supabase (blog, news, sets)
├── components/   # Composants React réutilisables
├── data/         # Données des cartes par set (JSON/JS)
├── lib/          # Configuration Supabase
├── pages/        # Pages de l'application
│   ├── Home.jsx          # Accueil (blog, actus, séries)
│   ├── Collection.jsx    # Vue globale de la collection
│   ├── CollectionSet.jsx # Checklist détaillée d'un set
│   └── SetViewer.jsx     # Visualiseur de cartes d'un set
└── App.jsx       # Routes et layout principal
```

### Format des données de cartes

```js
{
  id: "001",
  name: "Pikachu",
  image: "https://...",
  rarity: "Commune",
  rarityCode: "C"
}
```

---

## 🛠️ Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualiser le build |
| `npm run lint` | Vérification ESLint |

---

## ✍️ Auteur

- Développement : [@yanis](https://github.com/yanis)

---

## 📜 Licence

Ce projet est open-source. Utilisation libre à des fins personnelles ou communautaires.
