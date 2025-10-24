import { useEffect, useMemo, useState } from "react";
import "./detailsmodal.css";

export default function DetailsModal({ isOpen, name, onClose }) {
  const [data, setData] = useState(null);     
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !name) return;

    async function fetchDetails() {
      setLoading(true);
      setData(null);
      setError(""); 

      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError("Не удалось загрузить детали."); 
        console.error(e);
      } finally {
        setLoading(false); 
      }
    }
    fetchDetails();
  }, [isOpen, name]);

  const img = data?.sprites?.other?.["official-artwork"]?.front_default ?? data?.sprites?.front_default ??
    "";

  if (!isOpen) return null;

  return (
    <div
      className="modal__backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="modal dm">
        <div className="modal__header">
          <h2 id="dm-title" className="modal__title">
            {formatName(name)}
          </h2>
          <button className="button button--ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="modal__body">
          {loading && <div className="dm__state">Loading…</div>}
          {!loading && data && (
            <div className="dm__content">
              <div className="dm__media">
                <img src={img} alt={name} className="dm__img" />
                
                <div className="dm__badges">
                  {(data.types || []).map((t) => (
                    <span className={`badge type-${t.type.name}`}>
                      {t.type.name}
                    </span>
                  ))}
                </div>

                <div className="dm__basic">
                  <div>Height: <b>{(data.height / 10).toFixed(1)} m</b></div>
                  <div>Weight: <b>{(data.weight / 10).toFixed(1)} kg</b></div>
                  <div>ID: <b>#{data.id}</b></div>
                </div>
              </div>

              <div className="dm__stats">
                <h3 className="dm__blockTitle">Base Stats</h3>
                <ul className="stats">
                  {(data.stats || []).map((s) => (
                    <li className="stat">
                      <span className="stat__name">{labelStat(s.stat.name)}</span>
                      <span className="stat__val">{s.base_stat}</span>
                      <div className="statbar">
                        <div
                          className="statbar__fill"
                          style={{ width: `${Math.min(100, (s.base_stat / 180) * 100)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>

                <h3 className="dm__blockTitle">Abilities</h3>
                <div className="dm__abilities">
                  {(data.abilities || []).map((a) => (
                    <span className="chip">
                      {formatName(a.ability.name)}
                      {a.is_hidden ? " (Hidden)" : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatName(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function labelStat(key) {
  const map = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };
  return map[key] || formatName(key.replace("-", " "));
}
