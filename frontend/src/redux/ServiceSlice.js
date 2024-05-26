import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  services: [],
  filteredServices: [],
  loading: false,
  error: null,
  favorites: [],
  bookingStatus: null
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices(state, action) {
      state.services = action.payload;
      console.log(action.payload);

    },
    setFilteredServices(state, action) {
      state.filteredServices = action.payload;
    },
    addService(state, action) {
      state.services.push(action.payload);
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
  setServices,
  setFilteredServices,
  addService,
  setLoading,
  setError,
  addFavorite,
  removeFavorite,
  setBookingStatus
} = serviceSlice.actions;

export default serviceSlice.reducer;
