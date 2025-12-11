import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { loadCharacterById, clearCharacter } from "../../features/characterDetailsSlice.jsx";
import "./characterDetail.css";

export default function CharacterDetail() {
  const dispatch = useDispatch();
  const { id } = useParams(); 
  const { character, loading, error } = useSelector((state) => state.characterDetails);

  useEffect(() => {
    if (id) {
      dispatch(loadCharacterById(id));
    }
    return () => {
      dispatch(clearCharacter());
    };
  }, [id, dispatch]);

  return (
    <div className="character-page">
      <div className="character-page-header">
        <Link to="/characters" className="back-link">
          ← Back to list
        </Link>
      </div>

      {loading && <p className="info-text">Loading character...</p>}
      {error && <p className="error-text">{error}</p>}

      {character && (
        <div className="character-details-card">
          <div className="character-image-wrapper">
            <img src={character.image} alt={character.name} />
          </div>

          <div className="character-info">
            <h1>{character.name}</h1>

            <div className="info-row">
              <span className="label">Status:</span>
              <span>{character.status}</span>
            </div>

            <div className="info-row">
              <span className="label">Species:</span>
              <span>{character.species}</span>
            </div>

            {character.type && (
              <div className="info-row">
                <span className="label">Type:</span>
                <span>{character.type}</span>
              </div>
            )}

            <div className="info-row">
              <span className="label">Gender:</span>
              <span>{character.gender}</span>
            </div>

            <div className="info-row">
              <span className="label">Origin:</span>
              <span>{character.origin?.name}</span>
            </div>

            <div className="info-row">
              <span className="label">Location:</span>
              <span>{character.location?.name}</span>
            </div>

            <div className="info-row">
              <span className="label">Episodes count:</span>
              <span>{character.episode?.length}</span>
            </div>

            <div className="info-row">
              <span className="label">Created:</span>
              <span>{new Date(character.created).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && !character && (
        <p className="info-text">No character data.</p>
      )}
    </div>
  );
}
