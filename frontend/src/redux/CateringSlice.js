import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  caterings: [],
  filteredCaterings: [],
  loading: false,
  error: null,
  favorites: [],
  bookingStatus: null
};

const cateringSlice = createSlice({
  name: 'caterings',
  initialState,
  reducers: {
    setCaterings(state, action) {
      state.caterings = action.payload;
    },
    setFilteredCaterings(state, action) {
      state.filteredCaterings = action.payload;
    },
    addCatering(state, action) {
      state.caterings.push(action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addFavoriteC(state, action) {
      state.favorites.push(action.payload);
    },
    removeFavoriteC(state, action) {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
    setBookingStatus(state, action) {
      state.bookingStatus = action.payload;
    }
  }
});

export const {
  setCaterings,
  setFilteredCaterings,
  addCatering,
  setLoading,
  setError,
  addFavoriteC,
  removeFavoriteC,
  setBookingStatus
} = cateringSlice.actions;

export default cateringSlice.reducer;
