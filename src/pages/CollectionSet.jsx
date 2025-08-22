import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { cardsEV10 } from "../data/cardsEV10";
import { cardsEV105BL } from "../data/cardsEV105BL";
import { cardsEV105WH } from "../data/cardsEV105WH";
import { cardsEV8 } from "../data/cardsEV8";
import { cardsEV85 } from "../data/cardsEV85";
import { cardsEV9 } from "../data/cardsEV9";

const variants = ["normal", "holo", "reverse", "pokeball", "masterball"];

export default function CollectionSet() {
  const { code } = useParams();

  const normalizedCode = code
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\./g, "");

  const cardsBySet = {
    ev105bl: cardsEV105BL,
    ev105wh: cardsEV105WH,
    ev10: cardsEV10,
    ev9: cardsEV9,
    ev85: cardsEV85,
    ev8: cardsEV8,
  };

  const cards = cardsBySet[normalizedCode] || [];

  // --- États ---
  const [searchTerm, setSearchTerm] = useState("");
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem(`checklist_${normalizedCode}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Filtres par rareté (mêmes codes/ordre que SetViewer)
  const [activeCodes, setActiveCodes] = useState([]); // ex: ["IR","RR"]
  const rarityOrder = ["C", "U", "R", "RR", "IR", "SIR", "UR", "HR", "ACE"];

  // Affichage : toutes vs manquantes
  const [showMissingOnly, setShowMissingOnly] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      `checklist_${normalizedCode}`,
      JSON.stringify(checklist)
    );
  }, [checklist, normalizedCode]);

  // --- Helpers checklist ---
  const toggle = (cardId, type) => {
    setChecklist((prev) => {
      const current = prev[cardId] || {};
      return {
        ...prev,
        [cardId]: { ...current, [type]: !current[type] },
      };
    });
  };

  const setAllForCard = (cardId, value) => {
    setChecklist((prev) => ({
      ...prev,
      [cardId]: variants.reduce((acc, v) => {
        acc[v] = !!value;
        return acc;
      }, {}),
    }));
  };

  const hasAllVariants = (cardId) =>
    variants.every((v) => !!(checklist[cardId] && checklist[cardId][v]));

  // --- Raretés présentes + counts (repris de SetViewer) ---
  const rarities = useMemo(() => {
    const map = new Map();
    for (const c of cards) {
      if (!c?.rarityCode || !c?.rarity) continue;
      const prev = map.get(c.rarityCode) || {
        code: c.rarityCode,
        label: c.rarity,
        count: 0,
      };
      prev.count++;
      if (c.rarity.length > prev.label.length) prev.label = c.rarity;
      map.set(c.rarityCode, prev);
    }
    return Array.from(map.values()).sort(
      (a, b) => rarityOrder.indexOf(a.code) - rarityOrder.indexOf(b.code)
    );
    // On inclut rarityOrder pour satisfaire eslint (dépendances explicites)
  }, [cards, rarityOrder]);

  const toggleCode = (code) =>
    setActiveCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  const clearFilters = () => setActiveCodes([]);

  // --- Matchers ---
  const matchesSearch = (card) =>
    card.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.id?.toString().includes(searchTerm);

  const matchesRarity = (card) => {
    if (!rarities.length) return true; // sets sans rareté → pas de filtre
    if (!activeCodes.length) return true; // aucun filtre sélectionné
    return activeCodes.includes(card.rarityCode);
  };

  const matchesMissing = (card) =>
    showMissingOnly ? !hasAllVariants(card.id) : true;

  const filteredCards =
    cards.length > 0
      ? cards.filter(
          (c) => matchesSearch(c) && matchesRarity(c) && matchesMissing(c)
        )
      : [];

  // --- UI helpers (mêmes styles que SetViewer) ---
  const rarityChipClass = (code, active) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-medium border transition whitespace-nowrap";
    const on = active ? " ring-2 ring-offset-1" : " opacity-80";
    const color =
      code === "C"
        ? "bg-gray-100 border-gray-300"
        : code === "U"
        ? "bg-green-100 border-green-300"
        : code === "R"
        ? "bg-amber-100 border-amber-300"
        : code === "RR"
        ? "bg-blue-100 border-blue-300"
        : code === "IR"
        ? "bg-pink-100 border-pink-300"
        : code === "SIR"
        ? "bg-rose-100 border-rose-300"
        : code === "UR"
        ? "bg-violet-100 border-violet-300"
        : code === "HR"
        ? "bg-yellow-100 border-yellow-300"
        : code === "ACE"
        ? "bg-emerald-100 border-emerald-300"
        : "bg-slate-100 border-slate-300";
    return `${base} ${color}${on}`;
  };

  const badgeClass = (code) =>
    `inline-block mt-1 px-2 py-0.5 rounded text-[10px] border 
    ${
      code === "C"
        ? "bg-gray-100 border-gray-300"
        : code === "U"
        ? "bg-green-100 border-green-300"
        : code === "R"
        ? "bg-amber-100 border-amber-300"
        : code === "RR"
        ? "bg-blue-100 border-blue-300"
        : code === "IR"
        ? "bg-pink-100 border-pink-300"
        : code === "SIR"
        ? "bg-rose-100 border-rose-300"
        : code === "UR"
        ? "bg-violet-100 border-violet-300"
        : code === "HR"
        ? "bg-yellow-100 border-yellow-300"
        : code === "ACE"
        ? "bg-emerald-100 border-emerald-300"
        : "bg-slate-100 border-slate-300"
    }`;

  return (
    <div className="px-4 py-6 pb-24 w-full max-w-screen-sm sm:max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        Checklist - {code}
      </h1>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom ou ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />

      {/* Filtres par rareté (identique à SetViewer) */}
      {rarities.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {rarities.map((r) => {
              const active = activeCodes.includes(r.code);
              return (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => toggleCode(r.code)}
                  className={rarityChipClass(r.code, active)}
                  title={r.label}
                >
                  {r.label} <span className="opacity-60">· {r.count}</span>
                </button>
              );
            })}
          </div>
          {activeCodes.length > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-xs underline text-blue-600"
            >
              Réinitialiser
            </button>
          )}
        </div>
      )}

      {/* Catégorie d’affichage : Toutes / Manquantes */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          className={`px-3 py-1 text-sm rounded border ${
            !showMissingOnly ? "bg-white" : "bg-gray-50 opacity-70"
          }`}
          onClick={() => setShowMissingOnly(false)}
          type="button"
        >
          Toutes
        </button>
        <button
          className={`px-3 py-1 text-sm rounded border ${
            showMissingOnly ? "bg-white" : "bg-gray-50 opacity-70"
          }`}
          onClick={() => setShowMissingOnly(true)}
          type="button"
        >
          Manquantes
        </button>
      </div>

      {/* ⚠️ Export supprimé comme demandé */}

      {filteredCards.length === 0 ? (
        <p className="text-gray-500 text-center">Aucune carte trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center"
            >
              <img
                src={card.image}
                alt={card.name}
                className="w-full max-w-[250px] h-auto mx-auto rounded mb-2"
                loading="lazy"
              />
              <p className="font-semibold text-sm">{card.name}</p>
              <p className="text-xs text-gray-500">ID: {card.id}</p>
              {card.rarity && (
                <span className={badgeClass(card.rarityCode)}>
                  {card.rarity}
                </span>
              )}

              {/* Actions rapides */}
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border"
                  onClick={() => setAllForCard(card.id, true)}
                >
                  Tout cocher
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border"
                  onClick={() => setAllForCard(card.id, false)}
                >
                  Tout décocher
                </button>
              </div>

              {/* Variantes (checkbox) */}
              <div className="grid grid-cols-2 gap-2 w-full text-xs px-2 mt-3">
                {variants.map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!checklist[card.id]?.[type]}
                      onChange={() => toggle(card.id, type)}
                      className="accent-blue-600"
                    />
                    {type === "normal" && "Normal"}
                    {type === "holo" && "Holo"}
                    {type === "reverse" && "reverse"}
                    {type === "pokeball" && "Pokéball"}
                    {type === "masterball" && "Master Ball"}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
