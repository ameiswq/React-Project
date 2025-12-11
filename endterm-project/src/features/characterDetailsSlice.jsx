import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCharacterById } from "../services/fetchService.js";

export const loadCharacterById = createAsyncThunk(
  "characterDetails/loadCharacterById",
  async (id, thunkAPI) => {
    try {
      const data = await fetchCharacterById(id);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to load");
    }
  }
);

const characterDetailsSlice = createSlice({
  name: "characterDetails",
  initialState: {
    character: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCharacter(state) {
      state.character = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCharacterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCharacterById.fulfilled, (state, action) => {
        state.loading = false;
        state.character = action.payload;
      })
      .addCase(loadCharacterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error loading character";
        state.character = null;
      });
  },
});

export const { clearCharacter } = characterDetailsSlice.actions;

export default characterDetailsSlice.reducer;
