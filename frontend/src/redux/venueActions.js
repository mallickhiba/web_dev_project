import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  setVenues,
  setLoading,
  setError,
  addFavorite,
  removeFavorite,
  setBookingStatus
} from './venueSlice';
import {
  setCaterings,
} from './CateringSlice';


// Fetch venues with filtering and sorting
export const fetchVenues = createAsyncThunk(
  'venues/fetchVenues',
  async ({ page, limit, search, sort, filters }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get('http://localhost:5600/services/venues1', {
        params: { page, limit, search, sort, ...filters }
      });
      dispatch(setVenues(response.data.venues));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  }
);
// Fetch venues with filtering and sorting
export const fetchCaterings = createAsyncThunk(
  'venues/fetchCaterings',
  async ({ page, limit, search, sort, filters }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get('http://localhost:5600/services/catering1', {
        params: { page, limit, search, sort, ...filters }
      }); 
      dispatch(setCaterings(response.data.caterings));
      console.log(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  }
);


// Add a venue to favorites
export const addToFavorites = createAsyncThunk(
  'venues/addToFavorites',
  async (serviceId, { dispatch }) => {
    try {
      const response = await axios.post('http://localhost:5600/customer/addtofavs', { sid: serviceId });
      dispatch(addFavorite(serviceId));
    } catch (error) {
      dispatch(setError(error.message));
    }
  }
);

// Remove a venue from favorites
export const removeFromFavorites = createAsyncThunk(
  'venues/removeFromFavorites',
  async (serviceId, { dispatch }) => {
    try {
      const response = await axios.post('http://localhost:5600/customer/removefromfavs', { sid: serviceId });
      dispatch(removeFavorite(serviceId));
    } catch (error) {
      dispatch(setError(error.message));
    }
  }
);

// Book a venue
export const bookVenue = createAsyncThunk(
  'venues/bookVenue',
  async ({ date, service, customer }, { dispatch }) => {
    try {
      const response = await axios.post('http://localhost:5600/bookings/', { date, service, customer });
      dispatch(setBookingStatus('success'));
    } catch (error) {
      dispatch(setBookingStatus('error'));
      dispatch(setError(error.message));
    }
  }
);
