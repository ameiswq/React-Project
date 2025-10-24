import { useState } from "react";
import Pokedex from "./components/Pokedex/Pokedex.jsx";
import DetailsModal from "./components/DetailsModal/DetailsModal.jsx";
import "./app.css";

export default function App() {
  const [selectedPokemonName, setSelectedPokemonName] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  function handleSelect(name) {
    setSelectedPokemonName(name);
    setIsDetailsOpen(true);
  }

  function handleClose() {
    setIsDetailsOpen(false);
    setSelectedPokemonName(null);
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Mini Pokédex</h1>
        <p className="app__subtitle">
          React + PokeAPI demo · search, select, and view details
        </p>
      </header>

      <main className="app__main">
        <Pokedex onSelect={handleSelect} />
      </main>

      <DetailsModal
        isOpen={isDetailsOpen}
        name={selectedPokemonName}
        onClose={handleClose}
      />

    </div>
  );
}
