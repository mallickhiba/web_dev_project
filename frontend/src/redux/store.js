import { configureStore } from '@reduxjs/toolkit';
import venueReducer from './venueSlice';
import cateringReducer from './CateringSlice.js';

const store = configureStore({
  reducer: {
    venues: venueReducer,
    caterings: cateringReducer
  }
});

export default store;
