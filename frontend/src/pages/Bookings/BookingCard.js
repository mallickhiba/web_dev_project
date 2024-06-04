import React, { useState } from "react";
import { Card, CardActions, CardContent, Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import { deleteBooking } from "../../redux/adminBookingSlice"; // Assume you have a slice for bookings

const BookingCard = ({ booking }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const customer = booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName}` : "Anonymous";
  const service = booking.service_id ? booking.service_id.service_name : "Unknown Service";
  const vendor = booking.vendor_id ? `${booking.vendor_id.firstName} ${booking.vendor_id.lastName}` : "Unknown Vendor";
  const packageName = booking.selected_package ? booking.selected_package.name : "Unknown Package";
  
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleOpenDeleteConfirmation = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteBooking = async () => {
    try {
      const response = await fetch(`http://localhost:5600/bookings/delete/${booking._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      dispatch(deleteBooking(booking._id));
      setDeleteConfirmationOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ minWidth: 275, mb: 2 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div">
            {service}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Customer: {customer}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Vendor: {vendor}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Package: {packageName}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Guests: {booking.guests}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Status: {booking.status}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Created At: {new Date(booking.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton onClick={handleOpenDeleteConfirmation} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>

      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>{"Delete Booking"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteBooking} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingCard;
