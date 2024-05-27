import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  services: [],
  filteredServices: [],
  loading: false,
  error: null,
  favorites: [],
  bookingStatus: null,
  selectedService: null
};
export const fetchAllServiceByIdAsync = createAsyncThunk(
  'service/fetchServiceById',
  async (id) => {
    const response = await axios.get(`http://localhost:5600/services/byid/${id}`);
    return response.data.data;
  }
);


const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices(state, action) {
      state.services = action.payload;
      console.log(action.payload);
    },
    setServiceDetail(state, action) {
      state.serviceDetail = action.payload; // Define setServiceDetail action
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
    },
    fetchAllServiceByIdAsync(state, action) {
      state.selectedService = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllServiceByIdAsync.fulfilled, (state, action) => {
      state.selectedService = action.payload;
    });
  }
});

export const {
  setServices,
  setServiceDetail, // Export the action
  setFilteredServices,
  addService,
  setLoading,
  setError,
  addFavorite,
  removeFavorite,
  setBookingStatus,
  selectedService

} = serviceSlice.actions;

export default serviceSlice.reducer;