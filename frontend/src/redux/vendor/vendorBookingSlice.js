import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
  pagination: {
    page: 1,
    limit: 10,
    sort: 'asc',
    status: '', 
  },
};

const vendorBookingSlice = createSlice({
  name: "vendorbookings",
  initialState,
  reducers: {
    setBookings(state, action) {
      state.bookings = action.payload;
    },
    setPagination(state, action) {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateBookingStatus(state, action) {
      const { bookingId, status } = action.payload;
      state.bookings = state.bookings.map((booking) =>
        booking._id === bookingId ? { ...booking, status } : booking
      );
    },
    
  },
});

export const { setBookings, setPagination, updateBookingStatus } = vendorBookingSlice.actions;

export default vendorBookingSlice.reducer;
