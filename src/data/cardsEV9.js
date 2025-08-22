import rarities from "./ev9-rarities.json";

const names = [
  "Chenipan",
  "Chrysacier",
  "Papilusion",
  "Paras",
  "Parasect",
  "Chlorobule",
  "Fragilady",
  "Maracachi",
  "Carabing",
  "Trompignon",
  "Gaulet ex",
  "Escargaume",
  "Limaspeed",
  "Fermite",
  "Viridium",
  "Poussacha",
  "Matourgeon",
  "Miascarade",
  "Lilliterelle",
  "Magmar",
  "Maganon",
  "Poussifeu",
  "Galifeu",
  "Braségali ex",
  "Chartor",
  "Darumarond de N",
  "Darumacho de N",
  "Pyronille",
  "Pyrax",
  "Reshiram ex",
  "Volcanion ex",
  "Artikodin",
  "Rémoraid",
  "Octillery",
  "Nénupiot",
  "Lombre",
  "Ludicolo",
  "Goélise",
  "Bekipan",
  "Wailmer",
  "Wailord",
  "Regice",
  "Délestin ex",
  "Racaillou d'Alola",
  "Gravalanch d'Alola",
  "Grolem d'Alola",
  "Voltorbe de Mashynn",
  "Électrode de Mashynn",
  "Statitik de N",
  "Togedemaru",
  "Tokorico ex",
  "Têtampoule de Mashynn",
  "Ampibidou ex de Mashynn",
  "Zapétrel de Mashynn",
  "Fulgulairo de Mashynn",
  "Mélofée ex de Lilie",
  "Ossatueur d'Alola",
  "M. Mime",
  "Polichombr",
  "Branette",
  "Terhal",
  "Métang",
  "Métalosse",
  "Cryptéro de N",
  "Plumeline",
  "Bombydou de Lilie",
  "Rubombelle de Lilie",
  "Guérilande de Lilie",
  "Mimiqui ex",
  "Sinistrail",
  "Grimalin",
  "Fourbelin",
  "Angoliath",
  "Crèmy",
  "Charmilly ex",
  "Osselait",
  "Marcacrin",
  "Cochignon",
  "Mammochon ex",
  "Embrylex",
  "Ymphect",
  "Regirock",
  "Pandespiègle",
  "Rocabot",
  "Lougaroc",
  "Dunaja de Nabil",
  "Dunaconda de Nabil",
  "Terracool",
  "Terracruel",
  "Craparoi",
  "Smogo",
  "Smogogo",
  "Axoloto de Paldea",
  "Terraiste de Paldea-ex",
  "Tyranocif",
  "Chacripan de N",
  "Zorua de N",
  "Zoroark ex de N",
  "Pandarbare",
  "Gambex",
  "Lestombaile",
  "Lançargot",
  "Tic de N",
  "Clic de N",
  "Cliticlic de N",
  "Limonde de Galar",
  "Magearna",
  "Corvaillus de Nabil",
  "Charibari",
  "Pachyradjah",
  "Zacian ex de Nabil",
  "Draby",
  "Drackhaus",
  "Drattak ex",
  "Drakkarmin",
  "Reshiram de N",
  "Ronflex de Nabil",
  "Fouinette",
  "Fouinar",
  "Insolourdo",
  "Deusolourdo ex",
  "Kecleon",
  "Tropius",
  "Nanméouïe",
  "Chinchidou",
  "Pashmilla",
  "Sonistrelle",
  "Bruyverne",
  "Dodoala",
  "Draïeul",
  "Rongourmand",
  "Rongrigou",
  "Minisange de Nabil",
  "Bleuseille de Nabil",
  "Moumouton de Nabil",
  "Moumouflon de Nabil",
  "Nigosier",
  "Nigosier de Nabil",
  "Gourmelet",
  "Fragroin",
  "Tapatoès",
  "Milio et Naire",
  "Entraînement de Karatéka",
  "Entraînement de Karatéka",
  "Entraînement de Karatéka",
  "Exploration de Pierre",
  "Sac de Nabil",
  "Bandeau Choix de Nabil",
  "Esprit Combatif d'Iris",
  "Levalendura",
  "Perle de Lilie",
  "Palais de N",
  "PP Plus de N",
  "Paddoxton",
  "Recherches Professorales Professeur Olim",
  "Billet à Échanger",
  "Petite Frappe",
  "Super Potion",
  "Énergie Piquante",
  "Maracachi",
  "Artikodin",
  "Wailord",
  "Fulgulairo de Mashynn",
  "Rubombelle de Lilie",
  "Marcacrin",
  "Lougaroc",
  "Reshiram de N",
  "Fouinar",
  "Sonistrelle",
  "Moumouton de Nabil",
  "Volcanion ex",
  "Ampibidou ex de Mashynn",
  "Mélofée ex de Lilie",
  "Mammochon ex",
  "Zoroark ex de N",
  "Zacian ex de Nabil",
  "Drattak ex",
  "Deusolourdo ex",
  "Exploration de Pierre",
  "Esprit Combatif d'Iris",
  "Petite Frappe",
  "Volcanion ex",
  "Ampibidou ex de Mashynn",
  "Mélofée ex de Lilie",
  "Zoroark ex de N",
  "Zacian ex de Nabil",
  "Drattak ex",
  "Ampibidou ex de Mashynn",
  "Zoroark ex de N",
  "Énergie Piquante",
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

// Normalisation clé JSON -> code interne
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
const maxId = Math.max(names.length, getMaxIdFromGroups(rarities)); // gère 1..190

export const cardsEV9 = Array.from({ length: maxId }, (_, i) => {
  const id = i + 1;
  const r = rarityById.get(id) ?? { code: "UNK", label: "Inconnue" };

  return {
    id,
    name: names[i] ?? `#${id}`,
    image: `https://dz3we2x72f7ol.cloudfront.net/expansions/journey-together/fr-fr/SV09_FR_${id}.png`,
    owned: false,
    rarityCode: r.code,
    rarity: r.label,
  };
});
