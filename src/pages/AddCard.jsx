import CardForm from "../components/CardForm";

export default function AddCard({ onAdd }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ajouter une carte</h1>
      <CardForm onAdd={onAdd} />
    </div>
  );
}
