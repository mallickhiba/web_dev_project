import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Avatar,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

const BookingCard = ({ booking }) => {
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

  return (
    <Box sx={{ minWidth: 275, mb: 2 }}>
      <Card
        variant="outlined"
        sx={{ backgroundColor: "#f5f5f5", borderRadius: 2, p: 2, width: '100%' }}
      >
        <CardContent>
          <Box
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
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
      </Card>
    </Box>
  );
};

export default BookingCard;
