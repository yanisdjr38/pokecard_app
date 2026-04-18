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
    const hasError =
      !card.name || !card.series || !card.number || !card.condition;
    if (hasError) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
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
      className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200 w-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <input
          name="name"
          placeholder="Nom de la carte *"
          onChange={handleChange}
          value={card.name}
          className="input input-bordered w-full text-sm sm:text-base"
          required
        />
        <input
          name="series"
          placeholder="Série *"
          onChange={handleChange}
          value={card.series}
          className="input input-bordered w-full text-sm sm:text-base"
          required
        />
        <input
          name="number"
          placeholder="Numéro *"
          onChange={handleChange}
          value={card.number}
          className="input input-bordered w-full text-sm sm:text-base"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <input
          name="condition"
          placeholder="État (ex: Mint) *"
          onChange={handleChange}
          value={card.condition}
          className="input input-bordered w-full text-sm sm:text-base"
          required
        />
        <input
          name="estimatedValue"
          placeholder="Valeur estimée (€)"
          type="number"
          onChange={handleChange}
          value={card.estimatedValue}
          className="input input-bordered w-full text-sm sm:text-base"
          step="0.01"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full text-sm sm:text-base font-semibold"
      >
        + Ajouter une carte
      </button>
    </form>
  );
}
