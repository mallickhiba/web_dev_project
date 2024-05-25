import { combineReducers, configureStore } from '@reduxjs/toolkit';
import venueReducer from './venueSlice';
import cateringReducer from './CateringSlice.js';
import userSlice from "./userSlice";


const rootReducer = combineReducers({
  venues: venueReducer,
  caterings: cateringReducer,
  user: userSlice.reducer,

});

const store = configureStore({
  reducer: rootReducer,
});

export default store;