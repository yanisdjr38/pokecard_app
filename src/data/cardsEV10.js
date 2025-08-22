// cardsEV10.js
import rarities from "./ev10-rarities.json"; // ← ton JSON de raretés

const names = [
  "Scarabrute de Luth",
  "Yanma",
  "Yanmega ex",
  "Pomdepik",
  "Balignon",
  "Chapignon",
  "Rosélia de Cynthia",
  "Roserade de Cynthia",
  "Motisma Tonte",
  "Shaymin",
  "Crabicoque",
  "Crabaraque",
  "Mimantis",
  "Floramantis",
  "Larvadar de la Team Rocket",
  "Verpom",
  "Pomdramour",
  "Pomdorochi",
  "Tissenboule de la Team Rocket",
  "Filentrappe de la Team Rocket",
  "Olivini",
  "Olivado",
  "Arboliva ex",
  "Léboulérou",
  "Bérasca ex",
  "Ogerpon Masque Turquoise",
  "Caninos",
  "Arcanin",
  "Ponyta",
  "Galopa",
  "Sulfura ex de la Team Rocket",
  "Héricendre de Luth",
  "Feurisson de Luth",
  "Typhlosion de Luth",
  "Limagma de Luth",
  "Volcaropod de Luth",
  "Malosse de la Team Rocket",
  "Démolosse de la Team Rocket",
  "Ho-Oh ex de Luth",
  "Poussifeu",
  "Galifeu",
  "Braségali",
  "Motisma Chaleur",
  "Ogerpon Masque du Fourneau",
  "Psykokwak d'Ondine",
  "Stari d'Ondine",
  "Staross d'Ondine",
  "Magicarpe d'Ondine",
  "Léviator d'Ondine",
  "Lokhlass d'Ondine",
  "Artikodin de la Team Rocket",
  "Barpau de Cynthia",
  "Milobellus de Cynthia",
  "Coquiperl",
  "Serpang",
  "Rosabyss",
  "Mustébouée",
  "Mustéflott",
  "Blizzi",
  "Blizzaroi",
  "Motisma Lavage",
  "Embrochet",
  "Hastacuda",
  "Piétacé",
  "Balbalèze ex",
  "Oyacata ex",
  "Ogerpon Masque du Puits",
  "Élektek",
  "Élekable ex",
  "Électhor de la Team Rocket",
  "Pichu de Luth",
  "Wattouat de la Team Rocket",
  "Lainergie de la Team Rocket",
  "Pharamp de la Team Rocket",
  "Dynavolt",
  "Élecsprint",
  "Motisma",
  "Zeraora",
  "Soporifik de la Team Rocket",
  "Hypnomade de la Team Rocket",
  "Mewtwo ex de la Team Rocket",
  "Qulbutoké de la Team Rocket",
  "Balbuto de Pierre",
  "Kaorine de Pierre",
  "Korillon de la Team Rocket",
  "Strassie de Pierre",
  "Mimiqui de la Team Rocket",
  "Coléodôme de la Team Rocket",
  "Astronelle de la Team Rocket",
  "Férosinge",
  "Colossinge",
  "Courrousinge",
  "Simularbre de Luth",
  "Embrylex de la Team Rocket",
  "Ymphect de la Team Rocket",
  "Tyranocif de la Team Rocket",
  "Tarinor",
  "Tarinorme",
  "Meditikka",
  "Charmina",
  "Regirock ex",
  "Griknot de Cynthia",
  "Carmache de Cynthia",
  "Carchacrok ex de Cynthia",
  "Hippopotas",
  "Hippodocus",
  "Tiboudet",
  "Bourrinos",
  "Terracool de Pepper",
  "Terracruel de Pepper",
  "Ogerpon Masque de la Pierre",
  "Abo de la Team Rocket",
  "Arbok de la Team Rocket",
  "Nidoran♀ de la Team Rocket",
  "Nidorina de la Team Rocket",
  "Nidoqueen de la Team Rocket",
  "Nidoran♂ de la Team Rocket",
  "Nidorino de la Team Rocket",
  "Nidoking ex de la Team Rocket",
  "Nosferapti de la Team Rocket",
  "Nosferalto de la Team Rocket",
  "Nostenfer ex de la Team Rocket",
  "Tadmorv de la Team Rocket",
  "Grotadmorv de la Team Rocket",
  "Smogo de la Team Rocket",
  "Smogogo de la Team Rocket",
  "Cornèbre de la Team Rocket",
  "Farfuret de la Team Rocket",
  "Spiritomb de Cynthia",
  "Chacripan de Rosemary",
  "Léopardus de Rosemary",
  "Baggiguane de Rosemary",
  "Baggaïd de Rosemary",
  "Grimalin de Rosemary",
  "Fourbelin de Rosemary",
  "Angoliath ex de Rosemary",
  "Morpeko de Rosemary",
  "Grondogue de Pepper",
  "Dogrino ex de Pepper",
  "Foretress",
  "Airmure",
  "Airmure de Pierre",
  "Terhal de Pierre",
  "Métang de Pierre",
  "Métalosse ex de Pierre",
  "Zamazenta",
  "Rattata de la Team Rocket",
  "Rattatac de la Team Rocket",
  "Miaouss de la Team Rocket",
  "Persian ex de la Team Rocket",
  "Kangourex",
  "Tauros",
  "Porygon de la Team Rocket",
  "Porygon2 de la Team Rocket",
  "Porygon-Z de la Team Rocket",
  "Nirondelle",
  "Hélédelle",
  "Rongourmand de Pepper",
  "Rongrigou de Pepper",
  "Tapatoès",
  "Sandwich de Pepper",
  "Poids Pouvoir de Cynthia",
  "Engouement de la MC",
  "Recycleur d'Énergie",
  "Aventure de Luth",
  "Grotte Granite",
  "Juge",
  "Cendre Sacrée",
  "Arène de Smashings",
  "Amos de la Team Rocket",
  "Ariane de la Team Rocket",
  "Robot-bêtant de la Team Rocket",
  "Usine de la Team Rocket",
  "Giovanni de la Team Rocket",
  "Super Ball de la Team Rocket",
  "Lambda de la Team Rocket",
  "Lance de la Team Rocket",
  "Émetteur-Récepteur de la Team Rocket",
  "Bombe Risquée de la Team Rocket",
  "Tour d'Observation de la Team Rocket",
  "Machine à CT",
  "Énergie de la Team Rocket",
  "Tour de Brouillage",
  "Levalendura",
];

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
  UNK: "Inconnue",
};

// Normalisation clé JSON -> code
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

function getMaxIdFromGroups(groups) {
  let max = 0;
  for (const spec of Object.values(groups)) {
    for (const id of expandIds(spec)) max = Math.max(max, id);
  }
  return max;
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

const rarityById = buildRarityIndex(rarities);
const maxId = Math.max(names.length, getMaxIdFromGroups(rarities)); // ← prend en compte 1..244 (JSON)

export const cardsEV10 = Array.from({ length: maxId }, (_, i) => {
  const id = i + 1;
  const r = rarityById.get(id) ?? { code: "UNK", label: "Inconnue" };

  return {
    id,
    name: names[i] ?? `#${id}`,
    image: `https://dz3we2x72f7ol.cloudfront.net/expansions/destined-rivals/fr-fr/SV10_FR_${id}.png`,
    owned: false,
    rarityCode: r.code,
    rarity: r.label,
  };
});
