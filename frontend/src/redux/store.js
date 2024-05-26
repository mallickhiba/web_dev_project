import { configureStore } from '@reduxjs/toolkit';
import venueReducer from './venueSlice';
import cateringReducer from './CateringSlice.js';
import photographyReducer from './PhotographySlice.js';
import decorReducer from './DecorSlice.js';

const store = configureStore({
  reducer: {
    venues: venueReducer,
    caterings: cateringReducer,
    photographys: photographyReducer,
    decors: decorReducer
  }
});

export default store;
