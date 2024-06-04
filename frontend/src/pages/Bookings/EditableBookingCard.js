import React, { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Divider,
  Avatar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import { useSelector, useDispatch } from "react-redux";
import { deleteBooking } from "../../redux/adminBookingSlice"; // Update the path if needed

const EditableBookingCard = ({ booking }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const customer = booking.customer
    ? `${booking.customer.firstName} ${booking.customer.lastName}`
    : "Anonymous";
  const service = booking.service_id
    ? booking.service_id.service_name
    : "Unknown Service";
  const vendor = booking.vendor_id
    ? `${booking.vendor_id.firstName} ${booking.vendor_id.lastName}`
    : "Unknown Vendor";
  const packageName = booking.selected_package
    ? booking.selected_package.name
    : "Unknown Package";

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [status, setStatus] = useState(booking.status || "");

  useEffect(() => {
    setStatus(booking.status);
  }, [booking.status]);

  const handleOpenDeleteConfirmation = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteBooking = async () => {
    try {
      const response = await fetch(
        `http://localhost:5600/bookings/delete/${booking._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      dispatch(deleteBooking(booking._id));
      setDeleteConfirmationOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 275, mb: 2 }}>
      <Card
        variant="outlined"
        sx={{ backgroundColor: "#f5f5f5", borderRadius: 2, p: 2, width: '100%' }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
              <EventIcon />
            </Avatar>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              {service}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ mb: 1.5, fontWeight: "bold" }} color="text.secondary">
            Customer: <span style={{ fontWeight: "normal" }}>{customer}</span>
          </Typography>
          <Typography sx={{ mb: 1.5, fontWeight: "bold" }} color="text.secondary">
            Vendor: <span style={{ fontWeight: "normal" }}>{vendor}</span>
          </Typography>
          <Typography sx={{ mb: 1.5, fontWeight: "bold" }} color="text.secondary">
            Package: <span style={{ fontWeight: "normal" }}>{packageName}</span>
          </Typography>
          <Typography sx={{ mb: 1.5, fontWeight: "bold" }} color="text.secondary">
            Guests: <span style={{ fontWeight: "normal" }}>{booking.guests}</span>
          </Typography>
          <Typography sx={{ mb: 1.5, fontWeight: "bold" }} color="text.secondary">
            Status: <span style={{ fontWeight: "normal" }}>{booking.status}</span>
          </Typography>
          <Typography sx={{ mb: 1.5, fontWeight: "bold" }} color="text.secondary">
            Booking Date: <span style={{ fontWeight: "normal" }}>{new Date(booking.bookingDate).toLocaleDateString()}</span>
          </Typography>
          <Typography sx={{ fontWeight: "bold" }} color="text.secondary">
            Created At: <span style={{ fontWeight: "normal" }}>{new Date(booking.createdAt).toLocaleDateString()}</span>
          </Typography>
        </CardContent>
        <CardActions>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Status</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={status}
              label="Booking Status"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Pending</em>
              </MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <IconButton
            onClick={handleOpenDeleteConfirmation}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>

      <Dialog open={deleteConfirmationOpen} onClose={handleCancelDelete}>
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

export default EditableBookingCard;
