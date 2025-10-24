import React from "react";

export default function PokemonGrid({ items = [], onSelect }) {
  if (!items.length) return null;

  return (
    <ul className="pdx__grid">
      {items.map((p) => (
        <li>
          <button
            className="card"
            type="button"
            onClick={() => onSelect?.(p.name)}
            title={`Open ${p.name}`}
          >
            <div className="card__imgWrap">
              <img
                src={p.image}
                alt={p.name}
                className="card__img"
              />
            </div>
            <div className="card__name">#{p.id} {formatName(p.name)}</div>
          </button>
        </li>
      ))}
    </ul>
  );
}

function formatName(name = "") {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
