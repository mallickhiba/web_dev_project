import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bookings: [],
};

const adminBookingSlice = createSlice({
    name: "adminBookings",
    initialState,
    reducers: {
        setBookings(state, action) {
            state.bookings = action.payload;
        },
        editBooking(state, action) {
            const updatedBooking = action.payload;
            state.bookings = state.bookings.map((booking) =>
                booking._id === updatedBooking._id ? updatedBooking : booking
            );
        },
        deleteBooking(state, action) {
            const idToDelete = action.payload;
            state.bookings = state.bookings.filter((booking) => booking._id !== idToDelete);
        },
    },
});

export const { setBookings, editBooking, deleteBooking } = adminBookingSlice.actions;

export default adminBookingSlice.reducer;
