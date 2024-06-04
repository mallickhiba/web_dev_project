import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Container } from "@mui/material";
import axios from "axios";
import BookingCard from "../Bookings/EditableBookingCard"; // Update path if needed
import { useSelector, useDispatch } from "react-redux";
import AdminSidebar from "./components/AdminSidebar";
import { setBookings, deleteBooking, editBooking } from "../../redux/adminBookingSlice"; // Update path if needed

const BookingManagement = () => {
  const dispatch = useDispatch();
  const allBookings = useSelector((state) => state.adminBookings.bookings);
  const token = useSelector((state) => state.user.token);

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("Fetching bookings...");
        const response = await axios.get(
          "http://localhost:5600/bookings/allbookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Booking details:", response.data.bookings);
        dispatch(setBookings(response.data.bookings));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [dispatch, token]);

  const handleEditBooking = (id) => {
    const booking = allBookings.find((booking) => booking._id === id);

    if (booking) {
      setSelectedBooking(booking);
      setOpenEditModal(true);
    }
  };

  const handleDeleteBooking = (id) => {
    setSelectedBookingId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDeleteBooking = () => {
    console.log("Deleting booking with ID:", selectedBookingId);
    dispatch(deleteBooking(selectedBookingId));
    setOpenDeleteDialog(false);
  };

  return (
    <Container>
      <Grid container>
        {/* Render the AdminSidebar component */}
        <Grid item xs={12} md={3}>
          <AdminSidebar active={2} />
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={9}>
          <Box mx={4} my={4}>
            <Box border="1px solid #ccc" borderRadius={4} p={3} mb={3} mt={2}>
              <Typography variant="h4">Showing all bookings</Typography>
            </Box>
            <Grid container spacing={3}>
              {allBookings?.map((booking, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Box display="flex" justifyContent="center">
                    <BookingCard booking={booking} />
                  </Box> 
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingManagement;