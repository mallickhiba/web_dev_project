import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  decors: [],
  filteredDecors: [],
  loading: false,
  error: null,
  favorites: [],
  bookingStatus: null
};

const decorSlice = createSlice({
  name: 'decors',
  initialState,
  reducers: {
    setDecors(state, action) {
      state.decors = action.payload;
      console.log(action.payload);

    },
    setFilteredDecors(state, action) {
      state.filteredDecors = action.payload;
    },
    addDecor(state, action) {
      state.decors.push(action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addFavoriteD(state, action) {
      state.favorites.push(action.payload);
    },
    removeFavoriteD(state, action) {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
    
    setBookingStatus(state, action) {
      state.bookingStatus = action.payload;
    }
  }
});

export const {
  setDecors,
  setFilteredDecors,
  addDecor,
  setLoading,
  setError,
  addFavoriteD,
  removeFavoriteD,
  setBookingStatus
} = decorSlice.actions;

export default decorSlice.reducer;
