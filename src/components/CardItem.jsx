export default function CardItem({ card, onDelete }) {
  return (
    <div className="p-4 border rounded shadow flex justify-between items-center bg-gray-50">
      <div>
        <h2 className="font-semibold text-lg">{card.name}</h2>
        <p className="text-sm text-gray-600">
          Série : {card.series} • #{card.number} • {card.condition}
        </p>
        <p className="text-sm mt-1">
          Valeur estimée : <strong>{card.estimatedValue} €</strong>
        </p>
      </div>
      <button
        onClick={() => onDelete(card.id)}
        className="text-red-600 hover:text-red-800 font-bold text-sm"
      >
        Supprimer
      </button>
    </div>
  );
}
