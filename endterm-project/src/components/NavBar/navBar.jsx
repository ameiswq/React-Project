import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import useOfflineStatus from "../../hooks/useOfflineStatus.js";
import "./navBar.css";

export default function Navbar() {
  const { user, logout, avatar } = useAuth();
  const isOffline = useOfflineStatus();
  const initial = user && user.email ? user.email[0].toUpperCase() : "";

  async function handleLogout() {
    await logout();
  }

  return (
    <header className="navbar">
      {isOffline && (
        <div className="navbar-offline">
          Вы оффлайн — данные могут быть неактуальны.
        </div>
      )}

      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <span className="logo-accent">RM</span> Explorer
        </NavLink>
        <nav className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link--active" : "")
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/characters"
            end
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link--active" : "")
            }
          >
            Search
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link--active" : "")
            }
          >
            Favorites
          </NavLink>
        </nav>

        <div className="navbar-auth">
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  "nav-link nav-link--pill nav-link--avatar" +
                  (isActive ? " nav-link--active-pill" : "")
                }
              >
                <div className="navbar-avatar">
                  {avatar ? (
                    <img src={avatar} alt="Profile" />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
              </NavLink>

              <button
                className="navbar-logout-btn"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " nav-link--active" : "")
                }
              >
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  "nav-link nav-link--pill" +
                  (isActive ? " nav-link--active-pill" : "")
                }
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
