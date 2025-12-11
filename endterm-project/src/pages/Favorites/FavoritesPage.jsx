import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import CharacterCard from "../../components/CharacterCard/characterCard.jsx";
import { toggleFavorite } from "../../features/favoritesSlice.jsx";
import { removeFavoriteForUser } from "../../services/favoritesService.js";
import "./FavoritesPage.css";

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  const { user, favoritesMerged, clearFavoritesMerged } = useAuth();

  async function handleToggleFavorite(char) {
    if (!user) {
      dispatch(toggleFavorite(char));
      return;
    }
    dispatch(toggleFavorite(char));
    try {
      await removeFavoriteForUser(user.uid, char.id);
    } catch (e) {
      console.error("Failed to remove favorite:", e);
    }
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <Link to="/characters" className="back-link">
          ← Back to search
        </Link>
        <h1>Favorite Characters</h1>
      </div>
      {user && favoritesMerged && (
        <div className="merge-banner">
          <span>Your local favorites were merged with your account.</span>
          <button
            className="btn merge-btn"
            type="button"
            onClick={clearFavoritesMerged}
          >
            OK
          </button>
        </div>
      )}
      {!user && (
        <p className="info-text">
          You are not logged in. Favorites on this page are stored only on this
          device.
        </p>
      )}

      {favorites.length === 0 && (
        <p className="info-text">
          No favorites yet. Click the heart icon on a character card.
        </p>
      )}

      {favorites.length > 0 && (
        <div className="characters-grid">
          {favorites.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              isFavorite={true}
              onToggleFavorite={() => handleToggleFavorite(char)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
