// src/pages/Collection.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listSets, normalizeCode } from "../api/content";

import { cardsEV10 } from "../data/cardsEV10";
import { cardsEV105BL } from "../data/cardsEV105BL";
import { cardsEV105WH } from "../data/cardsEV105WH";
import { cardsEV8 } from "../data/cardsEV8";
import { cardsEV85 } from "../data/cardsEV85";
import { cardsEV9 } from "../data/cardsEV9";

const LOGO = "/ctlogo.png";

const VARIANTS = ["normal", "holo", "reverse", "pokeball", "masterball"];

const CARDS_BY_SET = {
  ev105bl: cardsEV105BL,
  ev105wh: cardsEV105WH,
  ev10: cardsEV10,
  ev9: cardsEV9,
  ev85: cardsEV85,
  ev8: cardsEV8,
};

function allowedVariantsForSet(normalizedCode, card) {
  const rc = card?.rarityCode || "";
  if (
    normalizedCode === "ev8" ||
    normalizedCode === "ev9" ||
    normalizedCode === "ev10"
  ) {
    if (rc === "C" || rc === "U") return ["normal", "reverse"];
    if (rc === "R") return ["holo"];
    return ["normal"];
  }
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
  return VARIANTS;
}

function computeProgress(normalizedCode, cards) {
  const raw = localStorage.getItem(`checklist_${normalizedCode}`);
  const checklist = raw ? JSON.parse(raw) : {};
  let have = 0;
  let need = 0;
  for (const c of cards) {
    const allowed = allowedVariantsForSet(normalizedCode, c);
    need += allowed.length;
    const st = checklist[c.id] || {};
    for (const v of allowed) if (st[v]) have++;
  }
  const pct = need ? Math.round((have / need) * 100) : 0;
  return { have, need, pct };
}

export default function Collection() {
  const [sets, setSets] = useState([]);

  useEffect(() => {
    listSets().then(setSets).catch(console.error);
  }, []);

  // Recalcule quand le stockage change (autre onglet/page)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key && e.key.startsWith("checklist_")) {
        setTick((t) => t + 1);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const [tick, setTick] = useState(0); // force recalcul

  const items = useMemo(() => {
    return (sets || [])
      .filter((s) => CARDS_BY_SET[normalizeCode(s.code_raw)])
      .map((s) => {
        const norm = normalizeCode(s.code_raw);
        const cards = CARDS_BY_SET[norm] || [];
        const progress = computeProgress(norm, cards);
        return { ...s, norm, cardsCount: cards.length, progress };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sets, tick]);

  return (
    <div className="px-4 py-6 pb-24 w-full max-w-screen-sm sm:max-w-4xl mx-auto">
      <header className="text-center mb-4">
        <img src={LOGO} alt="CardTrackr" className="h-32 mx-auto mb-2" />
        <h1 className="text-2xl sm:text-3xl font-bold">Ma collection</h1>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-gray-600 text-center">
          Aucun set disponible.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((set) => (
            <Link
              key={set.code_raw}
              to={`/collection/${set.code_raw}`}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-4 text-center hover:bg-blue-50 active:scale-[0.98]"
            >
              <img
                src={set.logo_url}
                alt={set.name || set.code_raw}
                className="w-20 h-auto mx-auto mb-3"
                loading="lazy"
              />
              <p className="text-base font-semibold text-gray-800">
                {set.name || set.code_raw}
              </p>
              <p className="text-xs text-gray-500">Code : {set.code_raw}</p>

              <div className="mt-3 text-xs text-gray-600">
                {set.progress.have}/{set.progress.need} · {set.progress.pct}%
              </div>
              <div className="w-full bg-gray-200 h-2 mt-1 rounded-full">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${set.progress.pct}%` }}
                />
              </div>

              <p className="mt-2 text-[11px] text-gray-500">
                {set.cardsCount} cartes référencées
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
