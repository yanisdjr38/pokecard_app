import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { cardsEV10 } from "../data/cardsEV10";
import { cardsEV105BL } from "../data/cardsEV105BL";
import { cardsEV105WH } from "../data/cardsEV105WH";
import { cardsEV8 } from "../data/cardsEV8";
import { cardsEV85 } from "../data/cardsEV85";
import { cardsEV9 } from "../data/cardsEV9";

// Variantes gérées
const variants = ["normal", "holo", "reverse", "pokeball", "masterball"];

const EMPTY_ARRAY = [];
const CARDS_BY_SET = {
  ev105bl: cardsEV105BL,
  ev105wh: cardsEV105WH,
  ev10: cardsEV10,
  ev9: cardsEV9,
  ev85: cardsEV85,
  ev8: cardsEV8,
};

export default function CollectionSet() {
  const { code } = useParams();

  const normalizedCode = String(code || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\./g, "");

  const cards = useMemo(
    () => CARDS_BY_SET[normalizedCode] || EMPTY_ARRAY,
    [normalizedCode]
  );

  // --- États ---
  const [searchTerm, setSearchTerm] = useState("");
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem(`checklist_${normalizedCode}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [activeCodes, setActiveCodes] = useState([]); // ex: ["IR","RR"]
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [viewMode, setViewMode] = useState("detail"); // mobile-first
  const [missingTypes, setMissingTypes] = useState(variants);

  useEffect(() => {
    localStorage.setItem(
      `checklist_${normalizedCode}`,
      JSON.stringify(checklist)
    );
  }, [checklist, normalizedCode]);

  // --- Index rapide ---
  const cardById = useMemo(() => {
    const m = new Map();
    for (const c of cards) m.set(c.id, c);
    return m;
  }, [cards]);

  // --- Variantes autorisées par set/rareté ---
  const allowedVariants = useCallback(
    (card) => {
      const rc = card?.rarityCode || "";

      // EV8-like: EV8, EV9, EV10
      if (
        normalizedCode === "ev8" ||
        normalizedCode === "ev9" ||
        normalizedCode === "ev10"
      ) {
        if (rc === "C" || rc === "U") return ["normal", "reverse"];
        if (rc === "R") return ["holo"];
        return ["normal"];
      }

      // EV8.5 et EV10.5BL/WH
      if (
        normalizedCode === "ev85" ||
        normalizedCode === "ev105bl" ||
        normalizedCode === "ev105wh"
      ) {
        if (rc === "C" || rc === "U")
          return ["normal", "reverse", "pokeball", "masterball"];
        if (rc === "R") return ["holo", "reverse", "pokeball", "masterball"];
        return ["normal"];
      }

      // autres sets
      return variants;
    },
    [normalizedCode]
  );

  const allowedForId = useCallback(
    (id) => allowedVariants(cardById.get(id)),
    [allowedVariants, cardById]
  );

  // --- Checklist (respecte variantes autorisées) ---
  const toggle = (cardId, type) => {
    const allowed = new Set(allowedForId(cardId));
    if (!allowed.has(type)) return;
    setChecklist((prev) => {
      const current = prev[cardId] || {};
      return { ...prev, [cardId]: { ...current, [type]: !current[type] } };
    });
  };

  const setAllForCard = (cardId, value) => {
    const allowed = new Set(allowedForId(cardId));
    setChecklist((prev) => {
      const base = { ...(prev[cardId] || {}) };
      for (const v of variants) if (!allowed.has(v)) delete base[v];
      for (const v of allowed) base[v] = !!value;
      return { ...prev, [cardId]: base };
    });
  };

  const hasAllVariants = (cardId) => {
    const allowed = allowedForId(cardId);
    const checks = checklist[cardId] || {};
    return allowed.every((v) => !!checks[v]);
  };

  // --- Raretés présentes + counts ---
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
    const order = ["C", "U", "R", "RR", "IR", "SIR", "UR", "HR", "ACE"];
    return Array.from(map.values()).sort(
      (a, b) => order.indexOf(a.code) - order.indexOf(b.code)
    );
  }, [cards]);

  // --- Matchers ---
  const matchesSearch = (card) =>
    card.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.id?.toString().includes(searchTerm);

  const matchesRarity = (card) =>
    !rarities.length || !activeCodes.length
      ? true
      : activeCodes.includes(card.rarityCode);

  // Filtre "manquantes" + sous-filtre par variante autorisée
  const matchesMissing = (card) => {
    if (!showMissingOnly) return true;
    const checks = checklist[card.id] || {};
    const allowed = new Set(allowedVariants(card));

    // Si aucun type sélectionné, on affiche toute carte incomplète.
    if (missingTypes.length === 0) return !hasAllVariants(card.id);

    // Sinon on limite aux variantes pertinentes.
    const relevant = missingTypes.filter((t) => allowed.has(t));
    if (relevant.length === 0) return false;
    return relevant.some((t) => !checks[t]);
  };

  const filteredCards =
    cards.length > 0
      ? cards.filter(
          (c) => matchesSearch(c) && matchesRarity(c) && matchesMissing(c)
        )
      : EMPTY_ARRAY;

  // --- Progress global ---
  const progress = useMemo(() => {
    let have = 0;
    let need = 0;
    for (const c of cards) {
      const allowed = allowedVariants(c);
      need += allowed.length;
      const checks = checklist[c.id] || {};
      for (const v of allowed) if (checks[v]) have++;
    }
    return { have, need, pct: need ? Math.round((have / need) * 100) : 0 };
  }, [cards, checklist, allowedVariants]);

  // --- UI helpers (contrastes élevés) ---
  const chip = (active) =>
    `px-2.5 py-1 rounded-full text-[12px] font-medium border whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
      active
        ? "bg-amber-50 border-amber-400 text-gray-900 ring-2 ring-amber-400"
        : "bg-white border-gray-300 text-gray-900"
    }`;

  const seg = (active) =>
    `px-3 py-1 text-sm rounded-md border font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
      active
        ? "bg-amber-50 border-amber-400 text-gray-900 ring-2 ring-amber-400"
        : "bg-white border-gray-300 text-gray-900"
    }`;

  const checkWrap = (checked) =>
    `inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-sm ${
      checked
        ? "bg-amber-50 border-amber-400 text-gray-900 ring-2 ring-amber-400"
        : "bg-white border-gray-300 text-gray-900"
    }`;

  const toggleCode = (c) =>
    setActiveCodes((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  const clearRarityFilters = () => setActiveCodes([]);

  const toggleMissingType = (t) =>
    setMissingTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  const clearMissingTypes = () => setMissingTypes([]);

  const resetFilters = () => {
    setSearchTerm("");
    setActiveCodes([]);
    setShowMissingOnly(false);
    setMissingTypes(variants);
  };

  // --- Rendu ---
  return (
    <div className="px-3 pt-3 pb-40 max-w-screen-sm sm:max-w-4xl mx-auto">
      {/* Titre + progression */}
      <div className="mb-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Checklist - {code}
        </h1>
        <div className="mt-1 text-[11px] text-gray-600">
          {progress.have}/{progress.need} · {progress.pct}%
        </div>
      </div>

      {/* Barre outils collante */}
      <div className="sticky top-0 z-20 -mx-3 px-3 py-2 bg-white/95 backdrop-blur border-b">
        {/* Ligne 1: recherche + reset */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Rechercher par nom ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
          />
          <button
            type="button"
            onClick={resetFilters}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-900"
            title="Réinitialiser recherche et filtres"
          >
            Réinitialiser
          </button>
        </div>

        {/* Chips rareté (défilables) */}
        {rarities.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {rarities.map((r) => {
                const active = activeCodes.includes(r.code);
                return (
                  <button
                    key={r.code}
                    type="button"
                    onClick={() => toggleCode(r.code)}
                    className={chip(active)}
                    title={r.label}
                    aria-pressed={active}
                  >
                    {r.label} <span className="opacity-60">· {r.count}</span>
                  </button>
                );
              })}
            </div>
            {activeCodes.length > 0 && (
              <button
                type="button"
                onClick={clearRarityFilters}
                className="ml-auto text-[11px] underline text-blue-700"
              >
                Réinitialiser raretés
              </button>
            )}
          </div>
        )}

        {/* Segment: Toutes / Manquantes */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            className={seg(!showMissingOnly)}
            onClick={() => setShowMissingOnly(false)}
            type="button"
            aria-pressed={!showMissingOnly}
          >
            Toutes
          </button>
          <button
            className={seg(showMissingOnly)}
            onClick={() => setShowMissingOnly(true)}
            type="button"
            aria-pressed={showMissingOnly}
          >
            Manquantes
          </button>
        </div>

        {/* Sous-filtres variantes visibles seulement si Manquantes */}
        {showMissingOnly && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <div className="flex flex-wrap gap-2">
              {variants.map((t) => {
                const checked = missingTypes.includes(t);
                return (
                  <label key={t} className={checkWrap(checked)}>
                    <input
                      type="checkbox"
                      className="accent-amber-600"
                      checked={checked}
                      onChange={() => toggleMissingType(t)}
                    />
                    <span>
                      {t === "normal" && "Normal"}
                      {t === "holo" && "Holo"}
                      {t === "reverse" && "Reverse"}
                      {t === "pokeball" && "Pokéball"}
                      {t === "masterball" && "Master Ball"}
                    </span>
                  </label>
                );
              })}
            </div>
            {missingTypes.length > 0 && (
              <button
                type="button"
                onClick={clearMissingTypes}
                className="ml-auto text-[11px] underline text-blue-700"
              >
                Réinitialiser types
              </button>
            )}
          </div>
        )}

        {/* Segment: Détail / Mini */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            className={seg(viewMode === "detail")}
            onClick={() => setViewMode("detail")}
            type="button"
            aria-pressed={viewMode === "detail"}
          >
            Détail
          </button>
          <button
            className={seg(viewMode === "mini")}
            onClick={() => setViewMode("mini")}
            type="button"
            aria-pressed={viewMode === "mini"}
          >
            Mini (image + ID)
          </button>
        </div>
      </div>

      {/* Liste */}
      {filteredCards.length === 0 ? (
        <p className="text-gray-600 text-center mt-6">Aucune carte trouvée.</p>
      ) : viewMode === "mini" ? (
        // MINI: 3 colonnes, badge ID, bord vert si complète
        <div className="mt-3 grid grid-cols-3 gap-3">
          {filteredCards.map((card) => {
            const allowed = allowedVariants(card);
            const checks = checklist[card.id] || {};
            const complete = allowed.every((v) => checks[v]);
            return (
              <div
                key={card.id}
                className={`relative bg-white rounded-xl shadow-sm border ${
                  complete ? "border-emerald-400" : "border-gray-200"
                }`}
                title={`#${card.id} · ${card.name}`}
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-auto rounded-xl"
                  loading="lazy"
                />
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[11px] font-semibold rounded bg-white/95 border text-gray-900">
                  {card.id}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // DÉTAIL: 1 colonne, cases limitées aux variantes autorisées
        <div className="mt-3 grid grid-cols-1 gap-3">
          {filteredCards.map((card) => {
            const allowed = allowedVariants(card);
            const checks = checklist[card.id] || {};
            const complete = allowed.every((v) => checks[v]);

            return (
              <div
                key={card.id}
                className={`bg-white rounded-xl shadow p-3 border ${
                  complete ? "border-emerald-400" : "border-gray-2 00"
                }`}
              >
                {/* Carte plus grande */}
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-[200px] md:w-[240px] h-auto rounded-lg mx-auto"
                  loading="lazy"
                />

                {/* Infos */}
                <div className="text-center mt-2">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    #{card.id} {card.name}
                  </p>
                  <p className="text-[11px] text-gray-600">ID: {card.id}</p>
                  {card.rarity && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] border bg-slate-50 text-gray-900">
                      {card.rarity}
                    </span>
                  )}
                </div>

                {/* Boutons sous la carte */}
                <div className="mt-3 flex justify-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs border rounded text-gray-900"
                    onClick={() => setAllForCard(card.id, true)}
                    title="Cocher variantes permises"
                  >
                    Tout cocher
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs border rounded text-gray-900"
                    onClick={() => setAllForCard(card.id, false)}
                    title="Tout décocher"
                  >
                    Tout décocher
                  </button>
                </div>

                {/* Cases sous les boutons */}
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allowed.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-sm text-gray-900"
                    >
                      <input
                        type="checkbox"
                        checked={!!checks[type]}
                        onChange={() => toggle(card.id, type)}
                        className="accent-blue-600"
                      />
                      {type === "normal" && "Normal"}
                      {type === "holo" && "Holo"}
                      {type === "reverse" && "Reverse"}
                      {type === "pokeball" && "Pokéball"}
                      {type === "masterball" && "Master Ball"}
                    </label>
                  ))}
                </div>

                {/* État */}
                <div className="mt-2 text-center text-[11px] text-gray-600">
                  {complete
                    ? "Complète pour les variantes permises"
                    : "Incomplète"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* CSS optionnel pour masquer la scrollbar horizontale des chips
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/
