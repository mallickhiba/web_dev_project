import { combineReducers, configureStore } from "@reduxjs/toolkit";
import venueReducer from "./venueSlice";
import cateringReducer from "./CateringSlice.js";
import userSlice from "./userSlice";
import photographyReducer from "./PhotographySlice.js";
import decorReducer from "./DecorSlice.js";
import serviceReducer from "./ServiceSlice.js";
import vendorServiceReducer from "./vendorServiceSlice.js";
import adminVendorReducer from "./adminVendorSlice";
import adminUserReducer from "./adminUserSlice.js";
import adminReviewReducer from "./adminReviewSlice.js";

const rootReducer = combineReducers({
  venues: venueReducer,
  caterings: cateringReducer,
  user: userSlice.reducer,
  photographys: photographyReducer,
  decors: decorReducer,
  services: serviceReducer,
  vendorServices: vendorServiceReducer,
  adminVendors: adminVendorReducer,
  adminUsers: adminUserReducer,
  adminReviews: adminReviewReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
