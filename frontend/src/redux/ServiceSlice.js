import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  services: [],
  filteredServices: [],
  loading: false,
  error: null,
  favorites: [],
  booking: [],
  selectedService: null,
  reviews:[]
};
export const fetchAllServiceByIdAsync = createAsyncThunk(
  'service/fetchServiceById',
  async (id) => {
    const response = await axios.get(`http://localhost:5600/services/byid/${id}`);
    return response.data.data;
  }
);

export const fetchreviews = createAsyncThunk(
  'service/fetchreviews',
  async (id) => {
    const response = await axios.get(`http://localhost:5600/reviews/getreviews/${id}`);
    return response.data.reviews;
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
    getFavourites(state, action) {
      state.favorites = action.payload;
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
    postareview(state, action) {
      state.reviews.push(action.payload);
    },
    postabooking(state, action) {
      state.booking.push(action.payload);
    },
    getReviews(state, action) {
      state.reviews = action.payload;
      console.log(action.payload);
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
    builder.addCase(fetchreviews.fulfilled, (state, action) => {
      state.reviews = action.payload;
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
  selectedService,
  getFavourites,
  postareview,
  getReviews,
  postabooking


} = serviceSlice.actions;
export default serviceSlice.reducer;