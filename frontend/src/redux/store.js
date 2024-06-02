import { combineReducers, configureStore } from "@reduxjs/toolkit";
import venueReducer from "./venueSlice";
import cateringReducer from "./CateringSlice.js";
import userSlice from "./userSlice";
import photographyReducer from "./PhotographySlice.js";
import decorReducer from "./DecorSlice.js";
import serviceReducer from './ServiceSlice.js';
import vendorServiceReducer from './vendorServiceSlice.js';
import adminVendorsReducer from './adminVendorSlice';


const rootReducer = combineReducers({
  venues: venueReducer,
  caterings: cateringReducer,
  user: userSlice.reducer,
  photographys: photographyReducer,
  decors: decorReducer,
  services: serviceReducer,
  vendorServices :vendorServiceReducer,
  adminVendors: adminVendorsReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
