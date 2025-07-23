import { useState } from "react";

export default function CardForm({ onAdd }) {
  const [card, setCard] = useState({
    name: "",
    series: "",
    number: "",
    condition: "",
    estimatedValue: "",
  });

  const handleChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...card, id: Date.now() });
    setCard({
      name: "",
      series: "",
      number: "",
      condition: "",
      estimatedValue: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded shadow"
    >
      <input
        name="name"
        placeholder="Nom de la carte"
        onChange={handleChange}
        value={card.name}
        className="input"
      />
      <input
        name="series"
        placeholder="Série"
        onChange={handleChange}
        value={card.series}
        className="input"
      />
      <input
        name="number"
        placeholder="Numéro"
        onChange={handleChange}
        value={card.number}
        className="input"
      />
      <input
        name="condition"
        placeholder="État"
        onChange={handleChange}
        value={card.condition}
        className="input"
      />
      <input
        name="estimatedValue"
        placeholder="Valeur (€)"
        type="number"
        onChange={handleChange}
        value={card.estimatedValue}
        className="input"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Ajouter
      </button>
    </form>
  );
}
