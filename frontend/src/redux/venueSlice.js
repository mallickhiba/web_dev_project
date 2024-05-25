import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  venues: [],
  filteredVenues: [],
  loading: false,
  error: null,
  favorites: [],
  bookingStatus: null
};

const venueSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    setVenues(state, action) {
      state.venues = action.payload;
    },
    setFilteredVenues(state, action) {
      state.filteredVenues = action.payload;
    },
    addVenue(state, action) {
      state.venues.push(action.payload);
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
  setVenues,
  setFilteredVenues,
  addVenue,
  setLoading,
  setError,
  addFavorite,
  removeFavorite,
  setBookingStatus
} = venueSlice.actions;

export default venueSlice.reducer;
