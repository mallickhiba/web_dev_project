import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  token: "",
  role: ""
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.loggedIn = true;
      state.token = action.payload.token;
      state.role = action.payload.role; // Set the role from action payload
    },
    logout: (state) => {
      state.loggedIn = initialState.loggedIn;
      state.token = initialState.token;
      state.role = initialState.role; // Reset role on logout
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice;