import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  setVenues,
  setLoading,
  setError,
  setBookingStatus,addFavoriteV, removeFavoriteV
} from "./venueSlice";
import { setCaterings,addFavoriteC, removeFavoriteC} from "./CateringSlice";
import { setPhotographys,addFavoriteP, removeFavoriteP} from "./PhotographySlice";
import { setDecors,addFavoriteD, removeFavoriteD} from "./DecorSlice";
import { setServices, setServiceDetail ,addFavorite, removeFavorite,getFavourites,postareview,getReviews,getBookings} from "./serviceSlice"; // Import setServiceDetail
import { NotificationManager } from "react-notifications";

// Fetch venues with filtering and sorting
export const fetchVenues = createAsyncThunk(
  "venues/fetchVenues",
  async ({ page, limit, search, sort, filters }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        "http://localhost:5600/services/venues1",
        {
          params: { page, limit, search, sort, ...filters },
        }
      );
      dispatch(setVenues(response.data.venues));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  }
);

// Fetch caterings with filtering and sorting
export const fetchCaterings = createAsyncThunk(
  "venues/fetchCaterings",
  async ({ page, limit, search, sort, filters }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        "http://localhost:5600/services/catering1",
        {
          params: { page, limit, search, sort, ...filters },
        }
      );
      dispatch(setCaterings(response.data.caterings));
      console.log(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  }
);

export const fetchPhotographys = createAsyncThunk(
  "venues/fetchPhotographys",
  async ({ page, limit, search, sort, filters }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        "http://localhost:5600/services/photography1",
        {
          params: { page, limit, search, sort, ...filters },
        }
      );
      dispatch(setPhotographys(response.data.photographies)); // Ensure this is correct
      console.log(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  }
);

// Fetch decors with filtering and sorting
export const fetchDecors = createAsyncThunk(
  "venues/fetchDecors",
  async ({ page, limit, search, sort, filters }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        "http://localhost:5600/services/decor1",
        {
          params: { page, limit, search, sort, ...filters },
        }
      );
      dispatch(setDecors(response.data.decors));
      console.log(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  }
);

// Fetch services with filtering and sorting
export const fetchServices = createAsyncThunk(
  "venues/fetchServices",
  async ({ page, limit, search, sort, filters }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        "http://localhost:5600/venues/",
        {
          params: { page, limit, search, sort, ...filters },
        }
      );
      dispatch(setServices(response.data.services));
      console.log(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  }
);


// Fetch service by ID
export const fetchServiceById = createAsyncThunk(
  "service/fetchServiceById",
  async (id, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(`http://localhost:5600/services/byid/${id}`);
      dispatch(setServiceDetail(response.data)); // Dispatch setServiceDetail with the response data
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  }
);




const getToken = () => localStorage.getItem('token');

export const addToFavorites = createAsyncThunk(
  'caterings/addToFavorites',
  async (serviceId, { dispatch }) => {
    const token = getToken();
    if (!token) {
      const errorMessage = 'TOKEN NOT FOUND / INVALID. PLEASE LOG IN';
      dispatch(setError(errorMessage));
      NotificationManager.error(errorMessage);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5600/customer/addtofavs',
        { sid: serviceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      dispatch(addFavoriteV(serviceId));
      dispatch(addFavoriteP(serviceId));
      dispatch(addFavoriteC(serviceId));
      dispatch(addFavoriteD(serviceId));
      dispatch(addFavorite(serviceId));
      
      NotificationManager.success("Service added to favorites successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message;
      dispatch(setError(errorMessage));
      NotificationManager.error(errorMessage);
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'caterings/removeFromFavorites',
  async (serviceId, { dispatch }) => {
    const token = getToken();
    if (!token) {
      dispatch(setError('TOKEN NOT FOUND / INVALID. PLEASE LOG IN'));
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5600/customer/removefromfavs',
        { sid: serviceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(removeFavoriteV(serviceId));
      dispatch(removeFavoriteC(serviceId));
      dispatch(removeFavoriteD(serviceId));
      dispatch(removeFavoriteP(serviceId));
      dispatch(removeFavorite(serviceId));
      
    } catch (error) {
      dispatch(setError(error.response?.data?.msg || error.message));
    }
  }
);

export const postReview = createAsyncThunk(
  'caterings/postreview',
  async ({ serviceId, rating, review }, { dispatch }) => {
    const token = getToken();
    if (!token) {
      dispatch(setError('TOKEN NOT FOUND / INVALID. PLEASE LOG IN'));
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5600/reviews/add',
        { service: serviceId, rating, review }, // Send all necessary data
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(postareview(response.data));
    } catch (error) {
      dispatch(setError(error.response?.data?.msg || error.message));
    }
  }
);
export const getFromFavorites = createAsyncThunk(
  'caterings/getFromFavorites',
  async (_, { dispatch }) => {
    const token = getToken();
    if (!token) {
      const errorMessage = 'TOKEN NOT FOUND / INVALID. PLEASE LOG IN';
      dispatch(setError(errorMessage));
      NotificationManager.error(errorMessage);
      return;
    }

    try {
      const response = await axios.get(
        'http://localhost:5600/customer/favs',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data); // Debugging log
      if (Array.isArray(response.data.favourites)) {
        dispatch(getFavourites(response.data.favourites));
        NotificationManager.success('Favorites fetched successfully');
      } else {
        console.error('Invalid response format', response.data); // Log the response for debugging
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message;
      dispatch(setError(errorMessage));
      NotificationManager.error(errorMessage);
    }
  }
);

export const getFromBookings = createAsyncThunk(
  'caterings/getcustomerbookings',
  async (_, { dispatch }) => {
    const token = getToken();
    if (!token) {
      const errorMessage = 'TOKEN NOT FOUND / INVALID. PLEASE LOG IN';
      dispatch(setError(errorMessage));
      NotificationManager.error(errorMessage);
      return;
    }

    try {
      const response = await axios.get(
        'http://localhost:5600/bookings/customerbookings',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('API Response:', response.data); // Detailed log of the response

      // Check if the response data contains a bookings key that is an array
      if (response.data && Array.isArray(response.data.bookings)) {
        dispatch(getBookings(response.data.bookings));
        NotificationManager.success('Bookings fetched successfully');
      } else {
        console.error('Invalid response format:', response.data); // Detailed log of invalid response
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message;
      console.error('Error fetching bookings:', errorMessage); // Log the error
      dispatch(setError(errorMessage));
      NotificationManager.error(errorMessage);
    }
  }
);


// Fetch service by ID
export const fetchreviews = createAsyncThunk(
  "service/fetchServiceById",
  async (id, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(`http://localhost:5600/reviews/getreviews/${id}`);
      dispatch(getReviews(response.data.reviews)); // Dispatch setServiceDetail with the response data
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  }
);

// Fetch service by ID
export const fetchbookings = createAsyncThunk(
  "service/fetchbookings",
  async (id, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(`http://localhost:5600/bookings/customerbookings`);
      dispatch(getReviews(response.data.booking)); // Dispatch setServiceDetail with the response data
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
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