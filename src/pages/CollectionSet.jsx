import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { cardsEV10 } from "../data/cardsEV10";
import { cardsEV105BL } from "../data/cardsEV105BL";
import { cardsEV105WH } from "../data/cardsEV105WH";
import { cardsEV8 } from "../data/cardsEV8";
import { cardsEV85 } from "../data/cardsEV85";
import { cardsEV9 } from "../data/cardsEV9";

const variants = ["normal", "holo", "pokeball", "masterball"];

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

  const toggle = (cardId, type) => {
    setChecklist((prev) => {
      const current = prev[cardId] || {};
      return {
        ...prev,
        [cardId]: { ...current, [type]: !current[type] },
      };
    });
  };

  const exportMissingCardsTXT = () => {
    const lines = cards
      .map((card) => {
        const state = checklist[card.id] || {};
        const manquantes = variants
          .filter((type) => !state[type])
          .map((type) => {
            if (type === "normal") return "❌ Normal";
            if (type === "holo") return "❌ Holo";
            if (type === "pokeball") return "❌ Pokéball";
            if (type === "masterball") return "❌ Master Ball";
          });

        if (manquantes.length === 0) return null;

        return `Carte ${card.id} - ${card.name} : ${manquantes.join(", ")}`;
      })
      .filter(Boolean);

    if (lines.length === 0) {
      alert("🎉 Toutes les cartes sont complètes !");
      return;
    }

    const content = lines.join("\n");

    const newWindow = window.open();
    newWindow.document.write(`
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Cartes manquantes - ${code}</title>
          <style>
            body { padding: 1rem; font-family: sans-serif; }
            textarea { width: 100%; height: 400px; }
            button { margin: 1rem 0; padding: 0.5rem 1rem; font-size: 1rem; }
          </style>
        </head>
        <body>
          <h2>📄 Cartes manquantes (${code})</h2>
          <p>Sélectionne ou copie le texte ci-dessous :</p>
          <button onclick="copyText()">📋 Copier dans le presse-papiers</button>
          <textarea id="txtExport">${content}</textarea>
          <script>
            function copyText() {
              const textarea = document.getElementById("txtExport");
              textarea.select();
              try {
                document.execCommand("copy");
                alert("Contenu copié !");
              } catch (err) {
                alert("Erreur lors de la copie. Copie manuelle possible.");
              }
            }
          </script>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  const exportMissingCardsCSV = () => {
    const rows = [["Carte", "Normal", "Holo", "Pokéball", "Master Ball"]];

    cards.forEach((card) => {
      const state = checklist[card.id] || {};
      const hasAll = variants.every((v) => state[v]);

      if (!hasAll) {
        rows.push([
          card.name,
          state.normal ? "✅" : "❌",
          state.holo ? "✅" : "❌",
          state.pokeball ? "✅" : "❌",
          state.masterball ? "✅" : "❌",
        ]);
      }
    });

    if (rows.length === 1) {
      alert("🎉 Toutes les cartes sont complètes !");
      return;
    }

    const csv = rows.map((row) => row.join(",")).join("\n");

    const newWindow = window.open();
    newWindow.document.write(`
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Cartes manquantes - ${code}</title>
          <style>
            body { padding: 1rem; font-family: sans-serif; }
            textarea { width: 100%; height: 400px; }
            button { margin: 1rem 0; padding: 0.5rem 1rem; font-size: 1rem; }
          </style>
        </head>
        <body>
          <h2>📊 Cartes manquantes (CSV - ${code})</h2>
          <p>Sélectionne ou copie le texte ci-dessous :</p>
          <button onclick="copyText()">📋 Copier dans le presse-papiers</button>
          <textarea id="csvExport">${csv}</textarea>
          <script>
            function copyText() {
              const textarea = document.getElementById("csvExport");
              textarea.select();
              try {
                document.execCommand("copy");
                alert("Contenu copié !");
              } catch (err) {
                alert("Erreur lors de la copie. Copie manuelle possible.");
              }
            }
          </script>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <div className="px-2 py-4 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        Checklist - {code}
      </h1>

      <div className="flex justify-center mb-6 gap-4 flex-wrap">
        <button
          onClick={exportMissingCardsTXT}
          className="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded shadow text-sm"
        >
          📄 Exporter TXT
        </button>
        <button
          onClick={exportMissingCardsCSV}
          className="bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded shadow text-sm"
        >
          📊 Exporter CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {cards.map((card) => (
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
            <p className="font-semibold text-sm mb-2">{card.name}</p>

            <div className="grid grid-cols-2 gap-2 w-full text-xs px-2">
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
                  {type === "pokeball" && "Pokéball"}
                  {type === "masterball" && "Master Ball"}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
