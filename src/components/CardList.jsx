import CardItem from "./CardItem";

export default function CardList({ cards, onDelete }) {
  const total = cards.reduce(
    (acc, card) => acc + parseFloat(card.estimatedValue || 0),
    0
  );

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Cartes ({cards.length})</h2>
      <p className="text-sm text-gray-700">
        Valeur totale : <strong>{total.toFixed(2)} €</strong>
      </p>
      {cards.length === 0 && (
        <p className="text-gray-500">Aucune carte pour l’instant.</p>
      )}
      {cards.map((card) => (
        <CardItem key={card.id} card={card} onDelete={onDelete} />
      ))}
    </div>
  );
}
