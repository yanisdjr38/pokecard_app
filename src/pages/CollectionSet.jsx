import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// Datasets
import { cardsEV10 } from "../data/cardsEV10";
import { cardsEV105BL } from "../data/cardsEV105BL";
import { cardsEV105WH } from "../data/cardsEV105WH";
import { cardsEV8 } from "../data/cardsEV8";
import { cardsEV85 } from "../data/cardsEV85";
import { cardsEV9 } from "../data/cardsEV9";

// Variantes globales
const VARIANTS = ["normal", "holo", "reverse", "pokeball", "masterball"];

const EMPTY = [];
const CARDS_BY_SET = {
  ev10: cardsEV10,
  ev105bl: cardsEV105BL,
  ev105wh: cardsEV105WH,
  ev9: cardsEV9,
  ev85: cardsEV85, // EV 8.5
  ev8: cardsEV8,
};

export default function CollectionSet() {
  const { code } = useParams();

  const normalizedCode = useMemo(
    () =>
      String(code || "")
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/\./g, ""),
    [code]
  );

  const cards = useMemo(
    () => CARDS_BY_SET[normalizedCode] ?? EMPTY,
    [normalizedCode]
  );

  const storageKey = `checklist:${normalizedCode}`;
  const [checklist, setChecklist] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [missingTypes, setMissingTypes] = useState(VARIANTS);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checklist));
    } catch {
      // Ignoring error
    }
  }, [checklist, storageKey]);

  // EV8
  // C/U -> normal+reverse
  // R   -> holo
  // autres -> normal
  // EV8.5
  // C/U -> normal, reverse, pokeball, masterball
  // R   -> holo, reverse, pokeball, masterball
  // autres -> normal
  const allowedVariants = (card) => {
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

    // EV8.5
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
    return VARIANTS;
  };

  const hasAllAllowed = (card) => {
    const allowed = allowedVariants(card);
    const checks = checklist[card.id] || {};
    return allowed.every((v) => !!checks[v]);
  };

  const toggleVariant = (card, type) => {
    const allowed = new Set(allowedVariants(card));
    if (!allowed.has(type)) return;
    setChecklist((prev) => {
      const current = prev[card.id] || {};
      return { ...prev, [card.id]: { ...current, [type]: !current[type] } };
    });
  };

  const setAllForCard = (card, value) => {
    const allowed = allowedVariants(card);
    setChecklist((prev) => {
      const base = { ...(prev[card.id] || {}) };
      for (const v of VARIANTS) if (!allowed.includes(v)) delete base[v];
      for (const v of allowed) base[v] = !!value;
      return { ...prev, [card.id]: base };
    });
  };

  const matchesMissing = (card) => {
    if (!showMissingOnly) return true;
    const checks = checklist[card.id] || {};
    const allowed = new Set(allowedVariants(card));
    if (!missingTypes || missingTypes.length === 0) return !hasAllAllowed(card);
    const filtered = missingTypes.filter((t) => allowed.has(t));
    if (filtered.length === 0) return false;
    return filtered.some((t) => !checks[t]);
  };

  const toggleMissingType = (type) => {
    setMissingTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div style={{ padding: "16px", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>
        Set: {code}{" "}
        <span style={{ color: "#666", fontSize: 14 }}>
          ({cards.length} cartes)
        </span>
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
          padding: "8px 12px",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={showMissingOnly}
            onChange={(e) => setShowMissingOnly(e.target.checked)}
          />
          Afficher uniquement les manquantes
        </label>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {VARIANTS.map((t) => (
            <button
              key={t}
              onClick={() => toggleMissingType(t)}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                background: missingTypes.includes(t) ? "#111827" : "#fff",
                color: missingTypes.includes(t) ? "#fff" : "#111827",
                cursor: "pointer",
                fontSize: 13,
              }}
              title={`Filtrer sur le type "${t}"`}
            >
              {t === "normal" && "Normal"}
              {t === "holo" && "Holo"}
              {t === "reverse" && "Reverse"}
              {t === "pokeball" && "Pokéball"}
              {t === "masterball" && "Master Ball"}
            </button>
          ))}
        </div>
      </div>

      {cards.length === 0 ? (
        <p>Aucune carte.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {cards.filter(matchesMissing).map((card) => {
            const checks = checklist[card.id] || {};
            const allowed = allowedVariants(card);

            return (
              <div
                key={card.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", gap: 10 }}>
                  <img
                    src={card.image}
                    alt={`${card.name || "Carte"} #${card.id}`}
                    loading="lazy"
                    style={{
                      width: 90,
                      height: 125,
                      objectFit: "cover",
                      borderRadius: 6,
                      border: "1px solid #e5e7eb",
                      background: "#f9fafb",
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                      e.currentTarget.parentElement.style.minHeight = "125px";
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>
                      #{card.id} {card.name || ""}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>
                      {card.rarity || card.rarityCode || "Rareté inconnue"}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() => setAllForCard(card, true)}
                        style={{
                          padding: "4px 8px",
                          fontSize: 12,
                          border: "1px solid #d1d5db",
                          borderRadius: 6,
                          background: "#fff",
                          cursor: "pointer",
                        }}
                        title="Cocher toutes les variantes permises"
                      >
                        Tout cocher
                      </button>
                      <button
                        onClick={() => setAllForCard(card, false)}
                        style={{
                          padding: "4px 8px",
                          fontSize: 12,
                          border: "1px solid #d1d5db",
                          borderRadius: 6,
                          background: "#fff",
                          cursor: "pointer",
                        }}
                        title="Tout décocher"
                      >
                        Tout décocher
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {allowed.map((type) => (
                    <label
                      key={type}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <input
                        type="checkbox"
                        checked={!!checks[type]}
                        onChange={() => toggleVariant(card, type)}
                      />
                      <span style={{ fontSize: 14 }}>
                        {type === "normal" && "Normal"}
                        {type === "holo" && "Holo"}
                        {type === "reverse" && "Reverse"}
                        {type === "pokeball" && "Pokéball"}
                        {type === "masterball" && "Master Ball"}
                      </span>
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>
                  {allowed.every((v) => checks[v])
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
