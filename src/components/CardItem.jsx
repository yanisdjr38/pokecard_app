export default function CardItem({ card, onDelete }) {
  return (
    <div className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-base sm:text-lg text-gray-800 truncate">
          {card.name}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Série : <span className="font-medium">{card.series}</span> •{" "}
          <span className="font-medium">#{card.number}</span> •{" "}
          <span className="font-medium">{card.condition}</span>
        </p>
        <p className="text-sm sm:text-base mt-2">
          Valeur estimée :{" "}
          <strong className="text-green-600">{card.estimatedValue} €</strong>
        </p>
      </div>
      <button
        onClick={() => onDelete(card.id)}
        className="btn btn-sm btn-error text-white font-semibold w-full sm:w-auto whitespace-nowrap"
      >
        Supprimer
      </button>
    </div>
  );
}
