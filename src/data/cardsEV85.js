import rarities from "./ev8.5-rarities.json"; // même dossier que cardsEV85.js

// Libellés canoniques par code
const RARITY_LABELS = {
  C: "Commune",
  U: "Peu commune",
  R: "Holo",
  RR: "Double Rare",
  IR: "Illustration Rare",
  SIR: "Illustration Spéciale Rare",
  UR: "Ultra-rare",
  HR: "Hyper Rare",
  ACE: "High-Tech",
  UNK: "Inconnue",
};

// Normalise les clés texte du JSON -> codes internes
const KEY_TO_CODE = {
  Commune: "C",
  Unco: "U",
  Holo: "R",
  "Double Rare": "RR",
  "Illustration Rare": "IR",
  "Illustration Special Rare": "SIR",
  "Illustration Spéciale Rare": "SIR",
  "Ultra-rare": "UR",
  "Ultra Rare": "UR",
  "Hyper Rare": "HR",
  "High-Tech": "ACE",
};

// "1-3,5,8-10" -> [1,2,3,5,8,9,10]
function expandIds(spec) {
  if (!spec || !spec.trim()) return [];
  return spec
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .flatMap((part) => {
      const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) {
        let a = Number(m[1]),
          b = Number(m[2]);
        if (!Number.isFinite(a) || !Number.isFinite(b)) return [];
        if (a > b) [a, b] = [b, a];
        return Array.from({ length: b - a + 1 }, (_, i) => a + i);
      }
      const n = Number(part);
      return Number.isFinite(n) ? [n] : [];
    });
}

// Construit: Map id -> { code, label }
function buildRarityIndex(groups, maxId = 180) {
  const byId = new Map();
  for (const [key, spec] of Object.entries(groups)) {
    const code = KEY_TO_CODE[key] ?? "UNK";
    const label = RARITY_LABELS[code] ?? key;
    for (const id of expandIds(spec)) {
      if (id < 1 || id > maxId) continue;
      byId.set(id, { code, label }); // dernier gagnant si chevauchement
    }
  }
  return byId;
}

const rarityById = buildRarityIndex(rarities, 180);

const names = [
  "Noeunoeuf",
  "Noadkoko",
  "Scarabrute",
  "Rozbouton",
  "Phyllali",
  "Phyllali ex",
  "Doudouvet",
  "Farfaduvet",
  "Verpom",
  "Pomdramour",
  "Pomdorochi ex",
  "Ogerpon Masque Turquoise ex",
  "Pyroli",
  "Pyroli ex",
  "Hélionceau",
  "Némélios",
  "Ogerpon Masque du Fourneau ex",
  "Ramoloss",
  "Roigada",
  "Poissirène",
  "Poissoroy",
  "Aquali",
  "Aquali ex",
  "Suicune",
  "Givrali",
  "Givrali ex",
  "Ogerpon Masque du Puits ex",
  "Pikachu ex",
  "Voltali",
  "Voltali ex",
  "Paume-de-Fer ex",
  "Épine-de-Fer ex",
  "Mentali",
  "Mentali ex",
  "Skelénox",
  "Téraclope",
  "Noctunoir",
  "Fluvetin",
  "Cocotine",
  "Nymphali",
  "Nymphali ex",
  "Hurle-Queue",
  "Flotte-Mèche",
  "Fortusimia",
  "Favianos",
  "Roc-de-Fer",
  "Embrylex",
  "Ymphect",
  "Groudon",
  "Riolu",
  "Lucario ex",
  "Hippopotas",
  "Hippodocus",
  "Ursaking Lune Vermeille",
  "Fort-Ivoire",
  "Pelage-Sablé ex",
  "Félicanis",
  "Ogerpon Masque de la Pierre ex",
  "Noctali",
  "Noctali ex",
  "Farfuret",
  "Malosse",
  "Démolosse",
  "Tyranocif ex",
  "Rugit-Lune",
  "Archéomire",
  "Archéodong",
  "Heatran",
  "Duralugon",
  "Pondralugon",
  "Fantyrm",
  "Dispareptil",
  "Lanssorien ex",
  "Évoli",
  "Évoli ex",
  "Ronflex ex",
  "Hoothoot",
  "Noarfang",
  "Insolourdo",
  "Deusolourdo",
  "Écrémeuh",
  "Lugia ex",
  "Laporeille",
  "Lockpin",
  "Motisma Hélice",
  "Regigigas",
  "Shaymin",
  "Couafarel",
  "Brutalibré",
  "Sonistrelle",
  "Bruyverne ex",
  "Terapagos ex",
  "Nérine",
  "Abîme Zéro",
  "Mochi de Servitude",
  "Entraînement de Karatéka",
  "Entraînement de Karatéka",
  "Entraînement de Karatéka",
  "Entraînement de Karatéka",
  "Bria",
  "Poffin Copain-Copain",
  "Kit Attrape-Insecte",
  "Roseille",
  "Décodage de Décryptomane",
  "Rubépin",
  "Urne Terrestre",
  "Guide d'Exploration",
  "Lieu de la Fête",
  "Amis de Paldea",
  "Trompette de Verre",
  "Baie Fraigo",
  "Art Secret de Jeannine",
  "Kassis",
  "Taro",
  "Compétence d'Okuba",
  "Max Canne",
  "Ceinture Maximale",
  "Masque de Monstre",
  "Attrape-Ultime",
  "Vitalité de la Professeure Olim",
  "Plan du Professeur Turum",
  "Recherches Professorales Professeur Chen",
  "Recherches Professorales Professeur Orme",
  "Recherches Professorales Professeur Sorbier",
  "Recherches Professorales Professeur Platane",
  "Planche de Sauvetage",
  "Perche à Motismart",
  "Rappel Cyclone",
  "Cristal Scintillant",
  "Techno-Radar",
  "Détecteur de Trésors",
  "Nérine",
  "Erio",
  "Erio",
  "Colza",
  "Nèflie",
  "Amis de Paldea",
  "Brome",
  "Compétence d'Okuba",
  "Meloco",
  "Ortiga",
  "Mora",
  "Thaïm",
  "Phyllali ex",
  "Ogerpon Masque Turquoise ex",
  "Pyroli ex",
  "Malvalame ex",
  "Ogerpon Masque du Fourneau ex",
  "Aquali ex",
  "Givrali ex",
  "Superdofin ex",
  "Ogerpon Masque du Puits ex",
  "Voltali ex",
  "Paume-de-Fer ex",
  "Mentali ex",
  "Nymphali ex",
  "Garde-de-Fer ex",
  "Chef-de-Fer ex",
  "Pelage-Sablé ex",
  "Ogerpon Masque de la Pierre ex",
  "Noctali ex",
  "Rugit-Lune ex",
  "Pêchaminus ex",
  "Gromago ex",
  "Lanssorien ex",
  "Ire-Foudre ex",
  "Évoli ex",
  "Ursaking Lune Vermeille ex",
  "Terapagos ex",
  "Nérine",
  "Rubépin",
  "Irido",
  "Art Secret de Jeannine",
  "Kassis",
  "Taro",
  "Vert-de-Fer ex",
  "Ogerpon Masque Turquoise ex",
  "Serpente-Eau ex",
  "Pikachu ex",
  "Terapagos ex",
];

export const cardsEV85 = Array.from({ length: 180 }, (_, i) => {
  const id = i + 1;
  const r = rarityById.get(id) ?? { code: "UNK", label: "Inconnue" };

  return {
    id,
    name: names[i],
    image: `https://dz3we2x72f7ol.cloudfront.net/expansions/prismatic-evolutions/fr-fr/SV8pt5_FR_${id}.png`,
    owned: false,
    rarityCode: r.code, // ex. "IR", "RR", "HR", "ACE"…
    rarity: r.label, // ex. "Illustration Rare", "Double Rare"…
  };
});
