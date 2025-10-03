const names = [
  "Bulbizarre", // 1
  "Herbizarre", // 2
  "Méga-Florizarre ex", // 3
  "Noeunoeuf", // 4
  "Noadkoko", // 5
  "Saquedeneu", // 6
  "Bouldeneu", // 7
  "Germignon", // 8
  "Macronium", // 9
  "Méganium", // 10
  "Caratroc", // 11
  "Celebi", // 12
  "Grainipiot", // 13
  "Pifeuil", // 14
  "Tengalice", // 15
  "Ningale", // 16
  "Ninjask", // 17
  "Sinistrail", // 18
  "Goupix", // 19
  "Feunard", // 20
  "Chamallot", // 21
  "Méga-Camérupt ex", // 22
  "Hélionceau", // 23
  "Némélios", // 24
  "Volcanion", // 25
  "Flambino", // 26
  "Lapyro", // 27
  "Pyrobut", // 28
  "Grillepattes", // 29
  "Scolocendre", // 30
  "Yuyu", // 31
  "Démanta", // 32
  "Écrapince", // 33
  "Kyogre", // 34
  "Blizzi", // 35
  "Méga-Blizzaroi ex", // 36
  "Flingouste", // 37
  "Gamblast", // 38
  "Larméléon", // 39
  "Arrozard", // 40
  "Lézargus", // 41
  "Frissonille", // 42
  "Beldeneige", // 43
  "Bekaglaçon", // 44
  "Magnéti", // 45
  "Magnéton", // 46
  "Magnézone", // 47
  "Raikou", // 48
  "Dynavolt", // 49
  "Méga-Élecsprint ex", // 50
  "Pachirisu", // 51
  "Galvaran", // 52
  "Iguolta", // 53
  "Abra", // 54
  "Kadabra", // 55
  "Alakazam", // 56
  "Lippoutou", // 57
  "Tarsal", // 58
  "Kirlia", // 59
  "Méga-Gardevoir ex", // 60
  "Munja", // 61
  "Spoink", // 62
  "Groret", // 63
  "Xerneas", // 64
  "Toutombe", // 65
  "Tomberro", // 66
  "Mordudor", // 67
  "Sabelette", // 68
  "Sablaireau", // 69
  "Onix", // 70
  "Debugant", // 71
  "Makuhita", // 72
  "Hariyama", // 73
  "Séléroc", // 74
  "Solaroc", // 75
  "Riolu", // 76
  "Méga-Lucario ex", // 77
  "Cradopaud", // 78
  "Coatox", // 79
  "Marshadow", // 80
  "Dolman", // 81
  "Selutin", // 82
  "Amassel", // 83
  "Gigansel", // 84
  "Colhomard", // 85
  "Méga-Absol ex", // 86
  "Spiritomb", // 87
  "Yveltal", // 88
  "Goupilou", // 89
  "Roublenard", // 90
  "Gribouraigne", // 91
  "Tag-Tag", // 92
  "Steelix", // 93
  "Méga-Mysdibule ex", // 94
  "Dialga", // 95
  "Forgerette", // 96
  "Forgella", // 97
  "Forgelina", // 98
  "Gromago", // 99
  "Méga-Latias ex", // 100
  "Latios", // 101
  "Piafabec", // 102
  "Rapasdepic", // 103
  "Méga-Kangourex ex", // 104
  "Cadoizo", // 105
  "Écrémeuh", // 106
  "Laporeille", // 107
  "Lockpin", // 108
  "Manglouton", // 109
  "Argouste", // 110
  "Nounourson", // 111
  "Chelours", // 112
  "Espièglerie de Margie", // 113
  "Ordres du Boss Ghetis", // 114
  "Échange d'Énergie", // 115
  "Gong de Combat", // 116
  "Forêt de Vitalité", // 117
  "Défense de Fer", // 118
  "Détermination de Lilie", // 119
  "Négociation de Major Bob", // 120
  "Méga Signal", // 121
  "Jardin Mystère", // 122
  "Dame du Centre Pokémon", // 123
  "Puissance Premium Pro", // 124
  "Super bonbon", // 125
  "Repousse", // 126
  "Ruines Risquées", // 127
  "Compteur de Temps Étrange", // 128
  "Plage de Surf", // 129
  "Échange", // 130
  "Hyper Ball", // 131
  "Compassion de Timmy", // 132
  "Bulbizarre", // 133
  "Herbizarre", // 134
  "Noadkoko", // 135
  "Caratroc", // 136
  "Ninjask", // 137
  "Goupix", // 138
  "Hélionceau", // 139
  "Blizzi", // 140
  "Gamblast", // 141
  "Lézargus", // 142
  "Galvaran", // 143
  "Munja", // 144
  "Tomberro", // 145
  "Marshadow", // 146
  "Gigansel", // 147
  "Spiritomb", // 148
  "Gribouraigne", // 149
  "Steelix", // 150
  "Piafabec", // 151
  "Cadoizo", // 152
  "Argouste", // 153
  "Nounourson", // 154
  "Méga-Florizarre ex", // 155
  "Méga-Camérupt ex", // 156
  "Méga-Blizzaroi ex", // 157
  "Méga-Élecsprint ex", // 158
  "Méga-Gardevoir ex", // 159
  "Méga-Lucario ex", // 160
  "Méga-Absol ex", // 161
  "Méga-Mysdibule ex", // 162
  "Méga-Latias ex", // 163
  "Méga-Kangourex ex", // 164
  "Espièglerie de Margie", // 165
  "Ballon", // 166
  "Poffin Copain-Copain", // 167
  "Gong de Combat", // 168
  "Détermination de Lilie", // 169
  "Négociation de Major Bob", // 170
  "Méga Signal", // 171
  "Jardin Mystère", // 172
  "Civière Nocturne", // 173
  "Puissance Premium Pro", // 174
  "Super bonbon", // 175
  "Compassion de Timmy", // 176
  "Méga-Florizarre ex", // 177
  "Méga-Gardevoir ex", // 178
  "Méga-Lucario ex", // 179
  "Méga-Absol ex", // 180
  "Méga-Latias ex", // 181
  "Méga-Kangourex ex", // 182
  "Espièglerie de Margie", // 183
  "Détermination de Lilie", // 184
  "Négociation de Major Bob", // 185
  "Compassion de Timmy", // 186
  "Méga-Gardevoir ex", // 187
  "Méga-Lucario ex", // 188
];

import rarities from "./me1-rarities.json";

// Libellés par code
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
  NBR: "Noir Blanc Rare",
  UNK: "Inconnue",
};

// Normalisation clés JSON -> codes internes
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
  "Noir Blanc Rare": "NBR",
  "Noir blanc Rare": "NBR", // alias toléré
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
        let a = +m[1],
          b = +m[2];
        if (a > b) [a, b] = [b, a];
        return Array.from({ length: b - a + 1 }, (_, i) => a + i);
      }
      const n = +part;
      return Number.isFinite(n) ? [n] : [];
    });
}

function buildRarityIndex(groups) {
  const byId = new Map();
  for (const [key, spec] of Object.entries(groups)) {
    const code = KEY_TO_CODE[key] ?? "UNK";
    const label = RARITY_LABELS[code] ?? key;
    for (const id of expandIds(spec)) byId.set(id, { code, label });
  }
  return byId;
}

function getMaxIdFromGroups(groups) {
  let max = 0;
  for (const spec of Object.values(groups)) {
    for (const id of expandIds(spec)) max = Math.max(max, id);
  }
  return max;
}

const rarityById = buildRarityIndex(rarities);
const maxId = Math.max(names.length, getMaxIdFromGroups(rarities)); // gère 1..173

export const cardsME1 = Array.from({ length: maxId }, (_, i) => {
  const id = i + 1;
  const r = rarityById.get(id) ?? { code: "UNK", label: "Inconnue" };
  return {
    id,
    name: names[i] ?? `#${id}`,
    image: `https://dz3we2x72f7ol.cloudfront.net/expansions/mega-evolution/fr-fr/JL2G_FR_${id}.png`,
    owned: false,
    rarityCode: r.code, // ex: "NBR", "IR", "RR", ...
    rarity: r.label, // ex: "Noir Blanc Rare", "Illustration Rare", ...
  };
});
