import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  token: "",
  role: "",
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
    },
    logout: (state) => {
      state.loggedIn = initialState.loggedIn;
      state.token = initialState.token;
      state.role = initialState.role; 
      state.userDetails = initialState.userDetails;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
  },
});

export const { login, logout, setUserDetails } = userSlice.actions;
export default userSlice;