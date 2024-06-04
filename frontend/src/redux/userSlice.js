import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: localStorage.getItem('isLoggedIn') === 'true',
  token: localStorage.getItem('token') || '',
  role: localStorage.getItem('role') || '',
  approved: false,
  userDetails: {},
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.loggedIn = true;
      state.token = action.payload.token;
      state.role = action.payload.role; 
      state.approved = action.payload.approved;
      localStorage.setItem('isLoggedIn', true); 
      localStorage.setItem('token', action.payload.token); 
      localStorage.setItem('role', action.payload.role);
      localStorage.setItem('approved', action.payload.approved); 
 
    },
    logout: (state) => {
      state.loggedIn = false;
      state.token = "";
      state.role = ""; 
      state.userDetails = initialState.userDetails;
      localStorage.removeItem('isLoggedIn'); 
      localStorage.removeItem('token'); 
      localStorage.removeItem('role');
      localStorage.removeItem('approved'); 
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
  },
});

export const { login, logout, setUserDetails } = userSlice.actions;
export default userSlice;