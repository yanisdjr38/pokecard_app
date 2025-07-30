import { Link } from "react-router-dom";

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

export default function Home() {
  return (
    <div className="px-4 py-6 pb-24 w-full max-w-screen-sm sm:max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Nouvelles Series
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recentSets.map((set) => (
          <Link
            key={set.code}
            to={`/set/${set.code}`}
            className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition-all p-4 text-center hover:bg-blue-50 cursor-pointer active:scale-[0.97]"
          >
            <img
              src={set.logo}
              alt={set.name}
              className="w-20 h-auto mx-auto mb-3"
              loading="lazy"
            />
            <p className="text-lg font-semibold text-gray-800">{set.name}</p>
            <p className="text-xs text-gray-500 mt-1">Code : {set.code}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
