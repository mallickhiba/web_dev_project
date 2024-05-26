import { configureStore } from '@reduxjs/toolkit';
import venueReducer from './venueSlice';
import cateringReducer from './CateringSlice.js';
import photographyReducer from './PhotographySlice.js';
import decorReducer from './DecorSlice.js';
import serviceReducer from './ServiceSlice.js';

const store = configureStore({
  reducer: {
    venues: venueReducer,
    caterings: cateringReducer,
    photographys: photographyReducer,
    decors: decorReducer,
    services: serviceReducer
  }
});

export default store;
