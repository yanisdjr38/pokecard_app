import { useState } from "react";
import { useParams } from "react-router-dom";

import { cardsEV10 } from "../data/cardsEV10";
import { cardsEV105BL } from "../data/cardsEV105BL";
import { cardsEV105WH } from "../data/cardsEV105WH";
import { cardsEV8 } from "../data/cardsEV8";
import { cardsEV85 } from "../data/cardsEV85";
import { cardsEV9 } from "../data/cardsEV9";

export default function SetViewer() {
  const { code } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedCode = code
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(".", "");

  let cards = [];
  switch (normalizedCode) {
    case "ev105bl":
      cards = cardsEV105BL;
      break;
    case "ev105wh":
      cards = cardsEV105WH;
      break;
    case "ev10":
      cards = cardsEV10;
      break;
    case "ev9":
      cards = cardsEV9;
      break;
    case "ev85":
      cards = cardsEV85;
      break;
    case "ev8":
      cards = cardsEV8;
      break;
    default:
      cards = [];
  }
  const filteredCards =
    cards.length > 0
      ? cards.filter(
          (card) =>
            card.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.id?.toString().includes(searchTerm)
        )
      : [];
  return (
    <div className="px-4 py-6 pb-24 w-full max-w-screen-sm sm:max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Série : {code}</h1>

      <input
        type="text"
        placeholder="Rechercher par nom ou ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full p-2 border border-gray-300 rounded"
      />

      {filteredCards.length === 0 ? (
        <p className="text-gray-500">Aucune carte trouvée.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition"
            >
              <img
                src={card.image}
                alt={card.name}
                className="w-full object-cover"
                loading="lazy"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-gray-700">{card.name}</p>
                <p className="text-xs text-gray-500">ID: {card.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
