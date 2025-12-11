import { configureStore } from "@reduxjs/toolkit";
import charactersReducer from "./features/charactersSlice.jsx";
import characterDetailsReducer from "./features/characterDetailsSlice.jsx";
import favoritesReducer from "./features/favoritesSlice.jsx";

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    characterDetails: characterDetailsReducer,
    favorites: favoritesReducer,
  },
});

