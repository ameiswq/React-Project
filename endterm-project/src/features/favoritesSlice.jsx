import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
  },
  reducers: {
    toggleFavorite(state, action) {
      const character = action.payload;
      const idx = state.items.findIndex((c) => c.id === character.id);

      if (idx === -1) {
        state.items.push(character);
      } else {
        state.items.splice(idx, 1);
      }
    },
    setFavorites(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
