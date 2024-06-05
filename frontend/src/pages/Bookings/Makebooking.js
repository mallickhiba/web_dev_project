import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { fetchAllServiceByIdAsync, postbooking } from "../../redux/serviceSlice";
import Header from "../../common/Header";
import Packagesdropdown from "../Services/Packagesdropdown";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

const ServiceDetail = () => {
  const service = useSelector((state) => state.services.selectedService);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const params = useParams();

  const [selectedPackage, setSelectedPackage] = useState('');
  const [guests, setGuests] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().substring(0, 10)); // default to today

  useEffect(() => {
    dispatch(fetchAllServiceByIdAsync(params.id));
  }, [dispatch, params.id]);

  const handlePackageChange = (packageName) => {
    setSelectedPackage(packageName);
  };
  

  const getUserIdFromToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.id || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  

  const handleBooking = () => {
    const customerId = getUserIdFromToken(token);
    const selectedPackageId = service.packages.find(p => p.name === selectedPackage)._id;

    dispatch(postbooking({
      customerId,
      serviceId: service._id,
      packageId: selectedPackageId,
      packageName: selectedPackage, // Send package name directly
      vendorId: service.vendor_id,
      guests,
      bookingDate
    }));
  };

  return (
    <div>
      <Header />
      <Container>
        {service && (
          <Card sx={{ marginTop: 3 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {service.service_name}
              </Typography>

              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Packages:
                </Typography>
                <Packagesdropdown packages={service.packages} onPackageChange={handlePackageChange} />
              </Box>

              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Number of Guests:
                </Typography>
                <TextField
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  fullWidth
                />
              </Box>

              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Booking Date:
                </Typography>
                <TextField
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  fullWidth
                />
              </Box>

              <Box mt={4}>
                <Button variant="contained" color="primary" onClick={handleBooking}>
                  Book Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>

      <NotificationContainer />
    </div>
  );
};

export default ServiceDetail;
