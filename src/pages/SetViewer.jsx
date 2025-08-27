// src/pages/SetViewer.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getSetByNorm, normalizeCode } from "../api/content";

import { cardsEV10 } from "../data/cardsEV10";
import { cardsEV105BL } from "../data/cardsEV105BL";
import { cardsEV105WH } from "../data/cardsEV105WH";
import { cardsEV8 } from "../data/cardsEV8";
import { cardsEV85 } from "../data/cardsEV85";
import { cardsEV9 } from "../data/cardsEV9";

// Map jeux de données locaux
const CARDS_BY_SET = {
  ev105bl: cardsEV105BL,
  ev105wh: cardsEV105WH,
  ev10: cardsEV10,
  ev9: cardsEV9,
  ev85: cardsEV85,
  ev8: cardsEV8,
};

export default function SetViewer() {
  const { code } = useParams();
  const normalizedCode = normalizeCode(code || "");

  // Cartes du set
  const cards = useMemo(() => {
    const list = CARDS_BY_SET[normalizedCode] || [];
    return Array.isArray(list)
      ? [...list].sort((a, b) => Number(a.id) - Number(b.id))
      : [];
  }, [normalizedCode]);

  // Métadonnées du set depuis Supabase (logo, nom)
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

  // Recherche + rareté
  const [q, setQ] = useState("");
  const [rarityFilter, setRarityFilter] = useState("");
  const rarityOptions = useMemo(() => {
    const set = new Set();
    for (const c of cards) if (c?.rarityCode) set.add(c.rarityCode);
    return Array.from(set);
  }, [cards]);

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      const byText =
        !q ||
        c.name?.toLowerCase().includes(q.toLowerCase()) ||
        String(c.id).includes(q);
      const byRarity = !rarityFilter || c.rarityCode === rarityFilter;
      return byText && byRarity;
    });
  }, [cards, q, rarityFilter]);

  return (
    <div className="px-4 py-6 pb-24 w-full max-w-screen-sm sm:max-w-4xl mx-auto">
      {/* Titre/logo set */}
      <div className="mb-4 text-center">
        {meta && (
          <img
            src={meta.logo_url}
            alt={meta?.name || code}
            className="h-16 mx-auto"
          />
        )}
        {meta?.name && (
          <p className="text-xs text-gray-500 mt-1">{meta.name}</p>
        )}
      </div>

      {/* Outils */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher par nom ou ID…"
            className="w-full p-2 border border-gray-300 rounded"
            aria-label="Recherche"
          />
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            aria-label="Filtrer par rareté"
          >
            <option value="">Toutes raretés</option>
            {rarityOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setRarityFilter("");
            }}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Réinitialiser
          </button>
        </div>
        <p className="text-[11px] text-gray-600 mt-2">
          {filtered.length}/{cards.length} cartes affichées
        </p>
      </div>

      {/* Grille de cartes */}
      {filtered.length === 0 ? (
        <p className="text-gray-600 text-center">Aucune carte.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 text-center"
              title={`${card.id} · ${card.name}`}
            >
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
              <p className="mt-1 text-xs text-gray-700 font-medium truncate">
                {card.name}
              </p>
              {card.rarity && (
                <p className="text-[11px] text-gray-500">{card.rarity}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
