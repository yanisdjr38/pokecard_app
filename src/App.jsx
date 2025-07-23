import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddCard from "./pages/AddCard";
import Collection from "./pages/Collection";
import CollectionSet from "./pages/CollectionSet";
import Home from "./pages/Home";
import SetViewer from "./pages/SetViewer";

function App() {
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("pokemonCards");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("pokemonCards", JSON.stringify(cards));
  }, [cards]);

  const addCard = (card) => setCards([card, ...cards]);
  const deleteCard = (id) => setCards(cards.filter((c) => c.id !== id));

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home cards={cards} />} />
        <Route path="/add" element={<AddCard onAdd={addCard} />} />
        <Route
          path="/collection"
          element={<Collection cards={cards} onDelete={deleteCard} />}
        />
        <Route path="/set/:code" element={<SetViewer />} />
        <Route path="/collection/:code" element={<CollectionSet />} />
      </Routes>
    </Router>
  );
}

export default App;
