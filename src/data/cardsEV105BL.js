const names = [
  "Vipélierre",
  "Lianaja",
  "Majaspic ex",
  "Feuillajou",
  "Feuiloutan",
  "Chlorobule",
  "Fragilady",
  "Maracachi",
  "Carabing",
  "Trompignon",
  "Gaulet",
  "Victini",
  "Darumarond",
  "Darumacho",
  "Pyronille",
  "Pyrax",
  "Flotajou",
  "Flotoutan",
  "Tritonde",
  "Batracné",
  "Crapustule",
  "Carapagos",
  "Mégapagos",
  "Mamanbo",
  "Polarhume",
  "Polagriffe",
  "Hexagel",
  "Kyurem ex",
  "Emolga",
  "Anchwatt",
  "Lampéroie",
  "Ohmassacre",
  "Fulguris",
  "Zekrom ex",
  "Munna",
  "Mushana",
  "Nucléos",
  "Méios",
  "Symbios",
  "Lewsor",
  "Neitram",
  "Gringolem",
  "Golemastoc",
  "Meloetta ex",
  "Rototaupe",
  "Minotaupe ex",
  "Charpenti",
  "Ouvrifier",
  "Bétochef",
  "Judokrak",
  "Crabicoque",
  "Crabaraque",
  "Démétéros",
  "Venipatte",
  "Scobolide",
  "Brutapode",
  "Mascaïman",
  "Escroco",
  "Crocorible",
  "Lançargot",
  "Tic",
  "Clic",
  "Cliticlic",
  "Scalpion",
  "Scalproie",
  "Cobaltium",
  "Genesect ex",
  "Coupenotte",
  "Incisache",
  "Tranchodon",
  "Poichigeon",
  "Colombeau",
  "Déflaisan",
  "Nanméouïe",
  "Chinchidou",
  "Pashmilla",
  "Furaiglon",
  "Gueriaigle",
  "Ballon",
  "Fossile Plaque Ancien",
  "Pièce Énergie",
  "Oryse",
  "Plan de N",
  "Pokématos 3.0",
  "Recherches Professorales Professeure Keteleeria",
  "Énergie Prisme",
  "Vipélierre",
  "Lianaja",
  "Feuillajou",
  "Feuiloutan",
  "Chlorobule",
  "Fragilady",
  "Maracachi",
  "Carabing",
  "Trompignon",
  "Gaulet",
  "Darumarond",
  "Darumacho",
  "Pyronille",
  "Pyrax",
  "Flotajou",
  "Flotoutan",
  "Tritonde",
  "Batracné",
  "Crapustule",
  "Carapagos",
  "Mégapagos",
  "Mamanbo",
  "Polarhume",
  "Polagriffe",
  "Hexagel",
  "Emolga",
  "Anchwatt",
  "Lampéroie",
  "Ohmassacre",
  "Munna",
  "Mushana",
  "Nucléos",
  "Méios",
  "Lewsor",
  "Neitram",
  "Gringolem",
  "Golemastoc",
  "Rototaupe",
  "Charpenti",
  "Ouvrifier",
  "Bétochef",
  "Judokrak",
  "Crabicoque",
  "Crabaraque",
  "Démétéros",
  "Venipatte",
  "Scobolide",
  "Brutapode",
  "Mascaïman",
  "Escroco",
  "Crocorible",
  "Lançargot",
  "Tic",
  "Clic",
  "Cliticlic",
  "Scalpion",
  "Scalproie",
  "Cobaltium",
  "Coupenotte",
  "Incisache",
  "Tranchodon",
  "Poichigeon",
  "Colombeau",
  "Déflaisan",
  "Nanméouïe",
  "Chinchidou",
  "Pashmilla",
  "Furaiglon",
  "Gueriaigle",
  "Majaspic ex",
  "Kyurem ex",
  "Zekrom ex",
  "Meloetta ex",
  "Minotaupe ex",
  "Genesect ex",
  "Oryse",
  "Plan de N",
  "Majaspic ex",
  "Kyurem ex",
  "Zekrom ex",
  "Meloetta ex",
  "Minotaupe ex",
  "Genesect ex",
  "Plan de N",
  "Victini",
  "Zekrom ex",
];

import rarities from "./ev10-5b-rarities.json";

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

// Normalisation clés JSON -> codes
const KEY_TO_CODE = {
  Commune: "C",
  Unco: "U",
  Holo: "R",
  "Double Rare": "RR",
  "Illustration Rare": "IR",
  "Ultra-rare": "UR",
  "Ultra Rare": "UR",
  "Illustration Special Rare": "SIR",
  "Illustration Spéciale Rare": "SIR",
  "Hyper Rare": "HR",
  "High-Tech": "ACE",
  "Noir Blanc Rare": "NBR",
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
const maxId = Math.max(names.length, getMaxIdFromGroups(rarities)); // gère 1..172

export const cardsEV105BL = Array.from({ length: maxId }, (_, i) => {
  const id = i + 1;
  const r = rarityById.get(id) ?? { code: "UNK", label: "Inconnue" };

  return {
    id,
    name: names[i] ?? `#${id}`,
    image: `https://dz3we2x72f7ol.cloudfront.net/expansions/black-white/fr-fr/SV10pt5_ZSV_FR_${id}.png`,
    owned: false,
    rarityCode: r.code, // ex: "NBR", "IR", "RR"…
    rarity: r.label, // ex: "Noir Blanc Rare", "Illustration Rare"…
  };
});
