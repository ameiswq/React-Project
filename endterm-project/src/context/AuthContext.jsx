import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase";
import { setFavorites } from "../features/favoritesSlice.jsx";
import {loadFavoritesForUser, saveFavoriteForUser} from "../services/favoritesService.js";
import {loadUserAvatar,saveUserAvatar} from "../services/profileService.js";

const AuthContext = createContext(null);

const LOCAL_FAV_KEY = "rm_local_favorites";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [avatar, setAvatar] = useState(null);
  const [favoritesMerged, setFavoritesMerged] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) {
      setAvatar(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const remoteAvatar = await loadUserAvatar(user.uid);
        if (!cancelled) {
          setAvatar(remoteAvatar || null);
        }
      } catch (e) {
        console.error("Failed to load avatar:", e);
        if (!cancelled) setAvatar(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function updateAvatar(dataUrl) {
    if (!user) return;
    setAvatar(dataUrl);
    try {
      await saveUserAvatar(user.uid, dataUrl);
    } catch (e) {
      console.error("Failed to save avatar:", e);
    }
  }

  useEffect(() => {
    if (user) return; 

    try {
      const raw = window.localStorage.getItem(LOCAL_FAV_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        dispatch(setFavorites(parsed));
      } else {
        dispatch(setFavorites([]));
      }
    } catch (e) {
      console.error("Failed to read local favorites:", e);
      dispatch(setFavorites([]));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user) return; 

    try {
      window.localStorage.setItem(LOCAL_FAV_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to write local favorites:", e);
    }
  }, [user, favorites]);

  useEffect(() => {
    if (!user) {
      setFavoritesMerged(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const remoteFavs = await loadFavoritesForUser(user.uid);
        const validRemote = Array.isArray(remoteFavs) ? remoteFavs : [];
        const remoteIds = new Set(validRemote.map((item) => item.id));

        let localFavs = [];
        try {
          const raw = window.localStorage.getItem(LOCAL_FAV_KEY);
          const parsed = raw ? JSON.parse(raw) : [];
          if (Array.isArray(parsed)) localFavs = parsed;
        } catch (e) {
          console.error("Failed to read local favorites for merge:", e);
        }

        const mergedMap = new Map();
        for (const item of validRemote) {
          if (item && typeof item.id !== "undefined") {
            mergedMap.set(item.id, item);
          }
        }
        for (const item of localFavs) {
          if (!item || typeof item.id === "undefined") continue;
          if (!mergedMap.has(item.id)) {
            mergedMap.set(item.id, item);
          }
        }

        const merged = Array.from(mergedMap.values());

        if (cancelled) return;

        dispatch(setFavorites(merged));

        if (localFavs.length > 0) {
          const toAdd = localFavs.filter(
            (item) =>
              item && typeof item.id !== "undefined" && !remoteIds.has(item.id)
          );

          for (const item of toAdd) {
            await saveFavoriteForUser(user.uid, item);
          }

          window.localStorage.removeItem(LOCAL_FAV_KEY);
          setFavoritesMerged(true);
        } else {
          setFavoritesMerged(false);
        }
      } catch (e) {
        console.error("Failed to merge favorites:", e);
        if (!cancelled) {
          try {
            const remoteOnly = await loadFavoritesForUser(user.uid);
            dispatch(
              setFavorites(Array.isArray(remoteOnly) ? remoteOnly : [])
            );
          } catch {
            dispatch(setFavorites([]));
          }
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, dispatch]);

  async function logout() {
    await signOut(auth);
  }

  function clearFavoritesMerged() {
    setFavoritesMerged(false);
  }

  const value = {
    user,
    loading,
    logout,
    avatar,
    updateAvatar,
    favoritesMerged,
    clearFavoritesMerged,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
