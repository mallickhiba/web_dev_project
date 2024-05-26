import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  photographys: [],
  filteredPhotographys: [],
  loading: false,
  error: null,
  favorites: [],
  bookingStatus: null
};

const photographySlice = createSlice({
  name: 'photographys',
  initialState,
  reducers: {
    setPhotographys(state, action) {
      state.photographys = action.payload;
      console.log(action.payload);

    },
    setFilteredPhotographys(state, action) {
      state.filteredPhotographys = action.payload;
    },
    addPhotography(state, action) {
      state.photographys.push(action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addFavorite(state, action) {
      state.favorites.push(action.payload);
    },
    removeFavorite(state, action) {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
    setBookingStatus(state, action) {
      state.bookingStatus = action.payload;
    }
  }
});

export const {
  setPhotographys,
  setFilteredPhotographys,
  addPhotography,
  setLoading,
  setError,
  addFavorite,
  removeFavorite,
  setBookingStatus
} =photographySlice.actions;

export default photographySlice.reducer;
