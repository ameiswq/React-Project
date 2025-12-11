import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, useLocation, } from "react-router-dom";
import { loadCharacters } from "../../features/charactersSlice.jsx";
import CharacterCard from "../../components/CharacterCard/characterCard.jsx";
import {buildParamsOnSearchInput, buildParamsOnLimitChange,buildParamsOnPrevPage,buildParamsOnNextPage} from "../../services/urlParamsService.js";
import "./SearchPage.css";
import { toggleFavorite } from "../../features/favoritesSlice.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { saveFavoriteForUser, removeFavoriteForUser } from "../../services/favoritesService.js";
import { useDebouncedValue } from "../../hooks/useDebouncedValue.js";

export default function SearchPage() {
  const dispatch = useDispatch();
  const {characters, loading, error, totalPages} = useSelector((state) => state.characters);
  const favorites = useSelector((state) => state.favorites.items);
  const {user} = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const nameFromUrl = searchParams.get("name") || "";
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const limitFromUrl = Number(searchParams.get("limit")) || 20;
  const [inputValue, setInputValue] = useState(nameFromUrl);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => { 
    setInputValue(nameFromUrl);
  }, [nameFromUrl]);

  const debouncedName = useDebouncedValue(inputValue, 400);

  useEffect(() => {
    const next = buildParamsOnSearchInput({inputValue: debouncedName, currentName: nameFromUrl, page: pageFromUrl, limit: limitFromUrl});
    if (next) {
      setSearchParams(next);
    }
  }, [debouncedName, nameFromUrl, pageFromUrl, limitFromUrl, setSearchParams]);

  useEffect(() => {
    if (!isActive) return;
    dispatch(loadCharacters({ name: nameFromUrl, page: pageFromUrl }));
  }, [isActive, nameFromUrl, pageFromUrl, dispatch]);

  const favoriteIds = useMemo(() => new Set(favorites.map((c) => c.id)), [favorites]);

  const visibleCharacters = useMemo(() => characters.slice(0, limitFromUrl), [characters, limitFromUrl]);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleLoadClick = useCallback(() => {
    setIsActive(true);
    dispatch(loadCharacters({ name: nameFromUrl, page: pageFromUrl }));
  }, [dispatch, nameFromUrl, pageFromUrl]);

  const handleLimitChange = useCallback(
    (e) => {
      const newLimit = Number(e.target.value) || 20;
      const next = buildParamsOnLimitChange({ currentName: nameFromUrl, newLimit: newLimit, page: pageFromUrl});
      if (next) setSearchParams(next);
    },
    [nameFromUrl, setSearchParams]
  );

  const handlePrevPage = useCallback(() => {
    const next = buildParamsOnPrevPage({currentName: nameFromUrl, page: pageFromUrl,limit: limitFromUrl});
    if (next) setSearchParams(next);
  }, [nameFromUrl, pageFromUrl, limitFromUrl, setSearchParams]);

  const handleNextPage = useCallback(() => {
    const next = buildParamsOnNextPage({currentName: nameFromUrl, page: pageFromUrl,limit: limitFromUrl, totalPages});
    if (next) setSearchParams(next);
  }, [nameFromUrl, pageFromUrl, limitFromUrl, totalPages, setSearchParams]);

  const handleToggleFavorite = useCallback(
    async (char) => {
      if (!user) {
        dispatch(toggleFavorite(char));
        return;
      }
      const isFavNow = favoriteIds.has(char.id);
      dispatch(toggleFavorite(char));
      try {
        if (isFavNow) {
          await removeFavoriteForUser(user.uid, char.id);
        } else {
          await saveFavoriteForUser(user.uid, char);
        }
      } catch (e) {
        console.error("Failed to sync favorites:", e);
      }
    },
    [user, favoriteIds, dispatch]
  );

  return (
    <div className="search-page">
      <h1 className="title">Rick and Morty Characters</h1>

      <div className="top-bar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Type character name..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            className="btn primary"
            onClick={handleLoadClick}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load"}
          </button>
        </div>

        <div className="pagination">
          <label className="limit-label">
            Items:
            <select value={limitFromUrl} onChange={handleLimitChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>

          <button
            className="btn"
            onClick={handlePrevPage}
            disabled={!isActive || loading || pageFromUrl === 1}
          >
            ◀ Prev
          </button>
          <span className="page-info">
            Page {isActive ? pageFromUrl : "-"} /{" "}
            {isActive ? totalPages || "?" : "-"}
          </span>
          <button
            className="btn"
            onClick={handleNextPage}
            disabled={
              !isActive ||
              loading ||
              totalPages === 0 ||
              pageFromUrl === totalPages
            }
          >
            Next ▶
          </button>
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="characters-grid">
        {isActive &&
          visibleCharacters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              isFavorite={favoriteIds.has(char.id)}
              onToggleFavorite={() => handleToggleFavorite(char)}
            />
          ))}

        {!loading && isActive && visibleCharacters.length === 0 && !error && (
          <p className="empty-msg">No characters found.</p>
        )}

        {!isActive && !loading && (
          <p className="empty-msg">Click “Load” to fetch characters.</p>
        )}
      </div>
    </div>
  );
}