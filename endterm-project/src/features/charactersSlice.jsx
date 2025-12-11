import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCharacters } from "../services/fetchService";

export const loadCharacters = createAsyncThunk(
  "characters/loadCharacters",
  async ({ name, page }, thunkAPI) => {
    try {
      const data = await fetchCharacters({ name, page });
      return { data, name, page };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to load");
    }
  }
);

const charactersSlice = createSlice({
  name: "characters",
  initialState: {
    characters: [],
    loading: false,
    error: null,
    searchQuery: "",
    currentPage: 1,
    totalPages: 0,
    lastRequestId: null, 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCharacters.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastRequestId = action.meta.requestId;
      })
      .addCase(loadCharacters.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.lastRequestId) return;

        const { data, name, page } = action.payload;
        state.loading = false;
        state.characters = data.results || [];
        state.searchQuery = name;
        state.currentPage = page;
        state.totalPages = data.info?.pages || 0;
      })
      .addCase(loadCharacters.rejected, (state, action) => {
        if (action.meta.requestId !== state.lastRequestId) return;

        state.loading = false;
        state.error = action.payload || "Error loading characters";
        state.characters = [];
        state.totalPages = 0;
      });
  },
});

export default charactersSlice.reducer;
