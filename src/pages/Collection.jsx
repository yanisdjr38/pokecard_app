import { Link } from "react-router-dom";
import { cardsEV10 } from "../data/cardsEV10";
import { cardsEV105BL } from "../data/cardsEV105BL";
import { cardsEV105WH } from "../data/cardsEV105WH";
import { cardsEV8 } from "../data/cardsEV8";
import { cardsEV85 } from "../data/cardsEV85";
import { cardsEV9 } from "../data/cardsEV9";

const recentSets = [
  {
    name: "Foudre Noire",
    code: "EV10.5BL",
    logo: "https://pokecardex.b-cdn.net/assets/images/logos/BLK.png",
  },
  {
    name: "Flamme Blanche",
    code: "EV10.5WH",
    logo: "https://pokecardex.b-cdn.net/assets/images/logos/WHT.png",
  },
  {
    name: "Rivalité des Destinées",
    code: "EV10",
    logo: "https://pokecardex.b-cdn.net/assets/images/logos/DRI.png",
  },
  {
    name: "Aventure Ensemble",
    code: "EV9",
    logo: "https://pokecardex.b-cdn.net/assets/images/logos/JTG.png",
  },
  {
    name: "Évolution Prismatique",
    code: "EV8.5",
    logo: "https://pokecardex.b-cdn.net/assets/images/logos/PRE.png",
  },
  {
    name: "Étincelles Déferlantes",
    code: "EV8",
    logo: "https://pokecardex.b-cdn.net/assets/images/logos/SSP.png",
  },
];

const cardsBySet = {
  "EV10.5BL": cardsEV105BL,
  "EV10.5WH": cardsEV105WH,
  EV10: cardsEV10,
  EV9: cardsEV9,
  "EV8.5": cardsEV85,
  EV8: cardsEV8,
};

const variants = ["normal", "holo", "reverse", "pokeball", "masterball"];

export default function Collection() {
  return (
    <div className="px-4 py-6 pb-24 w-full max-w-screen-sm sm:max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Ma Collection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recentSets.map((set) => {
          const cards = cardsBySet[set.code] || [];

          // même clé que dans SetViewer/CollectionSet
          const normalized = set.code
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/\./g, "");
          const checklistRaw = localStorage.getItem(`checklist_${normalized}`);
          const checklist = checklistRaw ? JSON.parse(checklistRaw) : {};

          // Variantes autorisées par set
          const allowedVariants = (card) => {
            const rc = card?.rarityCode || "";
            if (
              normalized === "ev8" ||
              normalized === "ev9" ||
              normalized === "ev10"
            ) {
              if (rc === "C" || rc === "U") return ["normal", "reverse"];
              if (rc === "R") return ["holo"];
              return ["normal"];
            }
            if (
              normalized === "ev85" ||
              normalized === "ev105bl" ||
              normalized === "ev105wh"
            ) {
              if (rc === "C" || rc === "U")
                return ["normal", "reverse", "pokeball", "masterball"];
              if (rc === "R")
                return ["holo", "reverse", "pokeball", "masterball"];
              return ["normal"];
            }
            return variants; // EV10.5 et autres
          };

          // Progression: variantes cochées / variantes requises
          let have = 0,
            need = 0;
          for (const c of cards) {
            const allowed = allowedVariants(c);
            need += allowed.length;
            const state = checklist[c.id] || {};
            for (const v of allowed) if (state[v]) have++;
          }
          const percent = need ? Math.round((have / need) * 100) : 0;

          return (
            <Link
              key={set.code}
              to={`/collection/${set.code}`}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:bg-blue-50 cursor-pointer active:scale-[0.99] transition select-none"
            >
              <img
                src={set.logo}
                alt={set.name}
                className="w-20 h-auto mx-auto mb-3"
                loading="lazy"
              />
              <p className="text-lg font-semibold text-gray-800">{set.name}</p>
              <p className="text-xs text-gray-500 mt-1">Code : {set.code}</p>

              <div className="mt-3 text-sm text-gray-700">
                Progression : {have}/{need} ({percent}%)
              </div>
              <div className="w-full bg-gray-200 h-2 mt-1 rounded-full">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
