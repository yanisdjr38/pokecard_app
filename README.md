# 📱 CardTrackr

Une application mobile-friendly construite avec **React**, **Vite** et **Tailwind CSS** pour suivre sa collection de cartes Pokémon et exporter facilement les cartes manquantes d’un master set.

Retrouver l'APK en debug directment en téléchargement ici !

---

## ✨ Fonctionnalités

- 📂 **Affichage par série** (Foudre Noire, Flamme Blanche, etc.)
- ✅ **Checklist** avec variantes :
  - Normal
  - reverse
  - Pokéball
  - Master Ball
- 💾 Sauvegarde automatique dans `localStorage`
- 📤 **Export des cartes manquantes** :
  - En **TXT** (format lisible)
  - En **CSV** (compatible Excel)
- ⚙️ Interface 100% optimisée mobile
- 📱 Possibilité de transformer en APK Android via Capacitor

---

## 🚀 Installation

```bash
git clone https://github.com/ton-user/pokecard-tracker.git
cd pokecard-tracker
npm install
npm run dev
```

---

## 📦 Génération APK (Android)

> Prérequis : Android Studio + Capacitor installé

```bash
npx cap add android
npx cap copy
npx cap open android
```

Puis dans Android Studio :

- Clique sur **Build > Build Bundle(s) / APK(s) > Build APK**
- Récupère l’APK dans le dossier `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📁 Structure des données

Les cartes sont stockées dans `src/data/` sous forme de tableau d’objets :

```js
{
  id: 1,
  name: "Vipélierre",
  image: "https://...",
}
```

---

## ✍️ Auteurs

- Développement : [@yanis](https://github.com/yanis)
- UI & conseils : ChatGPT (OpenAI)

---

## 📜 Licence

Ce projet est open-source. Utilisation libre à des fins personnelles ou communautaires.
