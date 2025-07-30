import { useEffect, useState } from "react";
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

  const [searchTerm, setSearchTerm] = useState("");
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
            if (type === "reverse") return "❌ reverse";
            if (type === "pokeball") return "❌ Pokéball";
            if (type === "masterball") return "❌ Master Ball";
          });

        if (manquantes.length === 0) return null;

        return `Carte ${card.id} : ${manquantes.join(", ")}`;
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
            body {
              padding: 1rem;
              font-family: system-ui, sans-serif;
              background: #f9fafb;
              color: #111827;
              max-width: 600px;
              margin: auto;
            }
            h2 {
              font-size: 1.25rem;
              font-weight: 600;
              text-align: center;
              margin-bottom: 1rem;
            }
            p {
              text-align: center;
              font-size: 0.9rem;
              margin-bottom: 1rem;
            }
            a {
              display: block;
              margin-bottom: 1rem;
              text-align: center;
              color: #2563eb;
              text-decoration: underline;
            }
            textarea {
              width: 100%;
              height: 350px;
              padding: 0.5rem;
              font-size: 0.85rem;
              border: 1px solid #d1d5db;
              border-radius: 0.5rem;
              background: #fff;
              resize: vertical;
            }
            button {
              display: block;
              margin: 1rem auto;
              padding: 0.5rem 1rem;
              background-color: #3b82f6;
              color: white;
              border: none;
              border-radius: 0.5rem;
              font-size: 0.9rem;
              cursor: pointer;
            }
            button:hover {
              background-color: #2563eb;
            }
          </style>
        </head>
        <body>
          <a href="/collection">← Retour à la collection</a>
          <h2>📄 Cartes manquantes (TXT - ${code})</h2>
          <p>Appuie sur le bouton ou copie manuellement le contenu :</p>
          <button onclick="copyText()">📋 Copier dans le presse-papiers</button>
          <textarea id="txtExport" readonly>${content}</textarea>
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
    const rows = [
      ["Carte", "Normal", "Holo", "Reverse", "Pokéball", "Master Ball"],
    ];

    cards.forEach((card) => {
      const state = checklist[card.id] || {};
      const hasAll = variants.every((v) => state[v]);

      if (!hasAll) {
        rows.push([
          `#${card.id}`,
          state.normal ? "✅" : "❌",
          state.holo ? "✅" : "❌",
          state.reverse ? "✅" : "❌",
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
            body {
              padding: 1rem;
              font-family: system-ui, sans-serif;
              background: #f9fafb;
              color: #111827;
              max-width: 600px;
              margin: auto;
            }
            h2 {
              font-size: 1.25rem;
              font-weight: 600;
              text-align: center;
              margin-bottom: 1rem;
            }
            p {
              text-align: center;
              font-size: 0.9rem;
              margin-bottom: 1rem;
            }
            a {
              display: block;
              margin-bottom: 1rem;
              text-align: center;
              color: #2563eb;
              text-decoration: underline;
            }
            textarea {
              width: 100%;
              height: 350px;
              padding: 0.5rem;
              font-size: 0.85rem;
              border: 1px solid #d1d5db;
              border-radius: 0.5rem;
              background: #fff;
              resize: vertical;
            }
            button {
              display: block;
              margin: 1rem auto;
              padding: 0.5rem 1rem;
              background-color: blue;
              color: white;
              border: none;
              border-radius: 0.5rem;
              font-size: 0.9rem;
              cursor: pointer;
            }
            button:hover {
              background-color: #2563eb;
            }
          </style>
        </head>
        <body>
        
          <a href="/collection">← Retour à la collection</a>
          <h2>📊 Cartes manquantes (CSV - ${code})</h2>
          <p>Appuie sur le bouton ou copie manuellement le contenu :</p>
          <button onclick="copyText()">📋 Copier dans le presse-papiers</button>
          <textarea id="csvExport" readonly>${csv}</textarea>
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
    <div className="px-4 py-6 pb-24 w-full max-w-screen-sm sm:max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        Checklist - {code}
      </h1>

      <input
        type="text"
        placeholder="Rechercher par nom ou ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full p-2 border border-gray-300 rounded"
      />

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
        {cards
          .filter(
            (card) =>
              card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              card.id.toString().includes(searchTerm)
          )
          .map((card) => (
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
              <p className="text-xs text-gray-500 mb-2">ID: {card.id}</p>

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
                    {type === "reverse" && "reverse"}
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
