// src/pages/CollectionSet.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { cardsEV10 } from "../data/cardsEV10";
import { cardsEV105BL } from "../data/cardsEV105BL";
import { cardsEV105WH } from "../data/cardsEV105WH";
import { cardsEV8 } from "../data/cardsEV8";
import { cardsEV85 } from "../data/cardsEV85";
import { cardsEV9 } from "../data/cardsEV9";

import { getSetByNorm, normalizeCode } from "../api/content";

/* Constantes */
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
  const normalizedCode = normalizeCode(code || "");

  // Cartes du set
  const cards = useMemo(
    () => CARDS_BY_SET[normalizedCode] || EMPTY_ARRAY,
    [normalizedCode]
  );

  // Meta set (logo + nom depuis Supabase)
  const [meta, setMeta] = useState(null);
  useEffect(() => {
    let alive = true;
    getSetByNorm(normalizedCode).then((m) => {
      if (alive) setMeta(m);
    });
    return () => {
      alive = false;
    };
  }, [normalizedCode]);

  // États UI
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCodes, setActiveCodes] = useState([]); // filtres rareté, ex: ["IR","RR"]
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [viewMode, setViewMode] = useState("detail"); // "detail" | "mini"
  const [missingTypes, setMissingTypes] = useState(variants);

  // Checklist locale par set
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem(`checklist_${normalizedCode}`);
    return saved ? JSON.parse(saved) : {};
  });
  useEffect(() => {
    localStorage.setItem(
      `checklist_${normalizedCode}`,
      JSON.stringify(checklist)
    );
  }, [checklist, normalizedCode]);

  // Index rapide id -> card
  const cardById = useMemo(() => {
    const m = new Map();
    for (const c of cards) m.set(c.id, c);
    return m;
  }, [cards]);

  // Raretés présentes et comptage
  const rarities = useMemo(() => {
    const order = ["C", "U", "R", "RR", "IR", "SIR", "UR", "HR", "ACE"];
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
      (a, b) => order.indexOf(a.code) - order.indexOf(b.code)
    );
  }, [cards]);

  // Variantes permises selon set/rareté
  const allowedVariants = useCallback(
    (card) => {
      const rc = card?.rarityCode || "";

      // EV8, EV9, EV10
      if (
        normalizedCode === "ev8" ||
        normalizedCode === "ev9" ||
        normalizedCode === "ev10"
      ) {
        if (rc === "C" || rc === "U") return ["normal", "reverse"];
        if (rc === "R") return ["holo"];
        return ["normal"];
      }

      // EV8.5 et EV10.5 BL/WH
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

      // autres
      return variants;
    },
    [normalizedCode]
  );

  // Actions checklist
  const toggle = (id, type) =>
    setChecklist((prev) => {
      const cur = prev[id] || {};
      return { ...prev, [id]: { ...cur, [type]: !cur[type] } };
    });

  const setAllForCard = (id, on) =>
    setChecklist((prev) => {
      const card = cardById.get(id);
      const allowed = allowedVariants(card);
      const next = { ...(prev[id] || {}) };
      for (const v of allowed) next[v] = on;
      return { ...prev, [id]: next };
    });

  // Filtres
  const matchesSearch = (card) =>
    card.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(card.id).includes(searchTerm);

  const matchesRarity = (card) =>
    !rarities.length || !activeCodes.length
      ? true
      : activeCodes.includes(card.rarityCode);

  const isMissingByTypes = (card) => {
    if (!showMissingOnly && missingTypes.length === variants.length)
      return true;
    const allowed = allowedVariants(card);
    const checks = checklist[card.id] || {};
    // si missingTypes est réduit, on retient la carte uniquement si
    // au moins un type sélectionné est manquant
    const typesToCheck =
      missingTypes.length === variants.length
        ? allowed
        : allowed.filter((t) => missingTypes.includes(t));
    return typesToCheck.some((t) => !checks[t]);
  };

  const filteredCards =
    cards.length > 0
      ? cards.filter(
          (c) => matchesSearch(c) && matchesRarity(c) && isMissingByTypes(c)
        )
      : EMPTY_ARRAY;

  // Progression globale du set
  const progress = useMemo(() => {
    let have = 0,
      need = 0;
    for (const c of cards) {
      const allowed = allowedVariants(c);
      need += allowed.length;
      const state = checklist[c.id] || {};
      for (const v of allowed) if (state[v]) have++;
    }
    const pct = need ? Math.round((have / need) * 100) : 0;
    return { have, need, pct };
  }, [cards, checklist, allowedVariants]);

  // UI helpers
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

  const seg = (on) =>
    `px-3 py-1.5 text-sm rounded-lg border ${
      on
        ? "bg-blue-600 text-blue-900 border-blue-700"
        : "bg-white text-gray-900 border-gray-300"
    }`;

  const checkWrap = (on) =>
    `flex items-center gap-2 text-xs sm:text-sm px-2 py-1 rounded-lg border ${
      on ? "bg-amber-50 border-amber-300" : "bg-white border-gray-300"
    }`;

  const toggleCode = (c) =>
    setActiveCodes((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const clearRarities = () => setActiveCodes([]);
  const toggleMissingType = (t) =>
    setMissingTypes((arr) =>
      arr.includes(t) ? arr.filter((x) => x !== t) : [...arr, t]
    );
  const clearMissingTypes = () => setMissingTypes(variants);

  return (
    <div className="px-3 pt-3 pb-40 max-w-screen-sm sm:max-w-4xl mx-auto">
      {/* Titre/logo set */}
      <div className="mb-2 text-center">
        {meta && (
          <img
            src={meta.logo_url}
            alt={meta.name || code}
            className="h-16 mx-auto"
          />
        )}
        <div className="mt-1 text-[11px] text-gray-600">
          {progress.have}/{progress.need} · {progress.pct}%
        </div>
        <div className="w-full bg-gray-200 h-2 mt-1 rounded-full">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
      </div>

      {/* Barre d’outils */}
      <div className="mt-3 bg-white border rounded-xl p-3">
        {/* Recherche */}
        <input
          type="text"
          placeholder="Rechercher par nom ou ID…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {/* Filtres rareté */}
        {rarities.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-3">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
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
                onClick={clearRarities}
                className="ml-auto text-xs underline text-blue-600"
              >
                Réinitialiser raretés
              </button>
            )}
          </div>
        )}

        {/* Manquantes uniquement */}
        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={showMissingOnly}
              onChange={() => setShowMissingOnly((x) => !x)}
            />
            Afficher uniquement les cartes incomplètes
          </label>
        </div>

        {/* Types manquants à suivre */}
        <div className="mt-2">
          <p className="text-xs text-gray-700 mb-1">
            Types à suivre quand “incomplètes” est actif:
          </p>
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

        {/* Segment: Détail / Mini */}
        <div className="mt-2 grid grid-cols-2 gap-2 ">
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
                  complete ? "border-emerald-400" : "border-gray-200"
                }`}
              >
                {/* Carte */}
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-[200px] md:w-[240px] h-auto rounded-lg mx-auto"
                  loading="lazy"
                />

                {/* Infos */}
                <div className="text-center mt-2">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {card.name}
                  </p>
                  <p className="text-[11px] text-gray-600">ID: {card.id}</p>
                  {card.rarity && (
                    <span className={badgeClass(card.rarityCode)}>
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

                {/* Cases */}
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
