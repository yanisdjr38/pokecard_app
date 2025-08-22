const names = [
  "Larveyette",
  "Couverdure",
  "Manternel",
  "Doudouvet",
  "Farfaduvet ex",
  "Vivaldaim",
  "Haydaim",
  "Escargaume",
  "Limaspeed",
  "Viridium",
  "Gruikui",
  "Grotichon",
  "Roitiflam",
  "Flamajou",
  "Flamoutan",
  "Funécire",
  "Mélancolux",
  "Lugulabre",
  "Aflamanoir",
  "Reshiram ex",
  "Moustillon",
  "Mateloutre",
  "Clamiral",
  "Bargantua",
  "Couaneton",
  "Lakmécygne",
  "Sorbébé",
  "Sorboul",
  "Sorbouboul",
  "Keldeo ex",
  "Zébibron",
  "Zéblitz",
  "Statitik",
  "Mygavolt",
  "Limonde",
  "Chovsourir",
  "Rhinolove",
  "Cryptéro",
  "Tutafeh",
  "Tutankafer",
  "Scrutella",
  "Mesmérella",
  "Sidérella",
  "Viskuse",
  "Moyade ex",
  "Nodulithe",
  "Géolithe",
  "Gigalithe",
  "Karaclée",
  "Arkéapti",
  "Aéroptéryx",
  "Kungfouine",
  "Shaofouine",
  "Terrakium",
  "Chacripan",
  "Léopardus",
  "Baggiguane",
  "Baggaïd",
  "Miamiasme",
  "Miasmax",
  "Zorua",
  "Zoroark",
  "Vostourno",
  "Vaututrice",
  "Solochi",
  "Diamat",
  "Trioxhydre ex",
  "Grindur",
  "Noacier",
  "Fermite",
  "Drakkarmin",
  "Ratentif",
  "Miradar",
  "Ponchiot",
  "Ponchien",
  "Mastouffe",
  "Frison ex",
  "Boréas",
  "Fossile Plume Ancien",
  "Bracelet Vaillant",
  "Tcheren",
  "Récupération d'Énergie",
  "Clown",
  "Ludvina",
  "Arrache-Outil",
  "Énergie Amorce",
  "Larveyette",
  "Couverdure",
  "Manternel",
  "Doudouvet",
  "Vivaldaim",
  "Haydaim",
  "Escargaume",
  "Limaspeed",
  "Viridium",
  "Gruikui",
  "Grotichon",
  "Roitiflam",
  "Flamajou",
  "Flamoutan",
  "Funécire",
  "Mélancolux",
  "Lugulabre",
  "Aflamanoir",
  "Moustillon",
  "Mateloutre",
  "Clamiral",
  "Bargantua",
  "Couaneton",
  "Lakmécygne",
  "Sorbébé",
  "Sorboul",
  "Sorbouboul",
  "Zébibron",
  "Zéblitz",
  "Statitik",
  "Mygavolt",
  "Limonde",
  "Chovsourir",
  "Rhinolove",
  "Cryptéro",
  "Tutafeh",
  "Tutankafer",
  "Scrutella",
  "Mesmérella",
  "Viskuse",
  "Nodulithe",
  "Géolithe",
  "Gigalithe",
  "Karaclée",
  "Arkéapti",
  "Aéroptéryx",
  "Kungfouine",
  "Shaofouine",
  "Terrakium",
  "Chacripan",
  "Léopardus",
  "Baggiguane",
  "Baggaïd",
  "Miamiasme",
  "Miasmax",
  "Zorua",
  "Zoroark",
  "Vostourno",
  "Vaututrice",
  "Solochi",
  "Diamat",
  "Grindur",
  "Noacier",
  "Fermite",
  "Drakkarmin",
  "Ratentif",
  "Miradar",
  "Ponchiot",
  "Ponchien",
  "Mastouffe",
  "Farfaduvet ex",
  "Reshiram ex",
  "Keldeo ex",
  "Moyade ex",
  "Trioxhydre ex",
  "Frison ex",
  "Clown",
  "Ludvina",
  "Farfaduvet ex",
  "Reshiram ex",
  "Keldeo ex",
  "Moyade ex",
  "Trioxhydre ex",
  "Frison ex",
  "Ludvina",
  "Victini",
  "Reshiram ex",
];

import rarities from "./ev10-5w-rarities.json";

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

export const cardsEV105WH = Array.from({ length: maxId }, (_, i) => {
  const id = i + 1;
  const r = rarityById.get(id) ?? { code: "UNK", label: "Inconnue" };
  return {
    id,
    name: names[i] ?? `#${id}`,
    image: `https://dz3we2x72f7ol.cloudfront.net/expansions/black-white/fr-fr/SV10pt5_RSV_FR_${id}.png`,
    owned: false,
    rarityCode: r.code, // ex: "NBR", "IR", "RR", ...
    rarity: r.label, // ex: "Noir Blanc Rare", "Illustration Rare", ...
  };
});
