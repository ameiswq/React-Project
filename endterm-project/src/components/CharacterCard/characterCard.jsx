import { Link } from "react-router-dom";
import "./characterCard.css";

export default function CharacterCard({character, isFavorite, onToggleFavorite}) {
  function handleHeartClick(e) {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(character);
  }

  return (
    <Link to={`/character/${character.id}`} className="character-card-link">
      <div className="character-card">
        <button
          className={`favorite-btn ${isFavorite ? "favorite-btn--active" : ""}`}
          onClick={handleHeartClick}>
          <span className="heart-icon">{isFavorite ? "❤️" : "🤍"}</span>
        </button>

        <img src={character.image} alt={character.name} />
        <h3>{character.name}</h3>
        <p>Status: {character.status}</p>
        <p>Species: {character.species}</p>
        <p>Gender: {character.gender}</p>
      </div>
    </Link>
  );
}
