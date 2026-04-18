import CardItem from "./CardItem";

export default function CardList({ cards, onDelete }) {
  const total = cards.reduce(
    (acc, card) => acc + parseFloat(card.estimatedValue || 0),
    0,
  );

  return (
    <div className="mt-6 sm:mt-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Cartes ({cards.length})
        </h2>
        <p className="text-sm sm:text-base text-gray-700">
          Valeur totale :{" "}
          <strong className="text-green-600 text-lg">
            {total.toFixed(2)} €
          </strong>
        </p>
      </div>

      {cards.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          Aucune carte pour l'instant.
        </p>
      )}

      <div className="space-y-3">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
