import { useEffect, useMemo, useState } from "react";
import "./pokedex.css";
import PokemonGrid from "../PokemonGrid/PokemonGrid.jsx";

export default function Pokedex({ onSelect }) {
  const [query, setQuery] = useState("");      
  const [list, setList] = useState([]);        
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  useEffect(() => {
    async function fetchList() {
      setLoading(true);
      setList([]);
      setError(""); 

      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${100}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const items = (data.results || []).map((p) => {
          const id = p.url.split("/").filter(Boolean).pop();
          const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          return { id, name: p.name, image };
        });
        setList(items);
      } catch (e) {
        setError("Не удалось загрузить список.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchList();
  }, []); 

  const q = query.trim().toLowerCase();
  const filtered = !q ? list : list.filter((p) => p.name.toLowerCase().includes(q));

  return (
    <section className="pdx">
      <div className="pdx__controls">
        <label className="control">
          <span className="control__label">Search for:</span>
          <input
            className="input"
            type="text"
            placeholder="pikachu, bulbasaur…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => setQuery("")}>
          Clear
        </button>
      </div>

      {loading && <div className="pdx__state pdx__state--loading">Loading…</div>}

      {!loading && filtered.length === 0 && (
        <div className="pdx__state">No founds.</div>
      )}

      {!loading && filtered.length > 0 && (
        <PokemonGrid items={filtered} onSelect={onSelect} />
      )}
    </section>
  );
}
