// src/components/ServiceDetail.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAllServiceByIdAsync } from "../../redux/serviceSlice";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import PackagesTable from "./PackagesTable";
import ReviewCard from "../Reviews/ReviewCard";
import AddRating from "../Reviews/AddRating";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  Button,
  TextField,
} from "@mui/material";

const ServiceDetail = () => {
  const service = useSelector((state) => state.services.selectedService);
  const dispatch = useDispatch();
  const params = useParams();

  const [rating, setRating] = useState(2); // State for rating
  const [review, setReview] = useState(""); // State for review text

  useEffect(() => {
    dispatch(fetchAllServiceByIdAsync(params.id));
  }, [dispatch, params.id]);

  const handleReviewSubmit = () => {
    // Handle review submission logic
    console.log("Review submitted:", { rating, review });
    // Clear the form
    setRating(2);
    setReview("");
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

              {/* Image Section */}
              <Box sx={{ textAlign: "center", marginBottom: 3 }}>
                <img
                  src="https://via.placeholder.com/600x400" // Replace with actual image URL
                  alt={service.service_name}
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                  }}
                />
              </Box>

              <Typography variant="body1" paragraph>
                {service.description}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography variant="subtitle1">
                        Average Rating:
                      </Typography>
                      <Typography variant="body2">
                        {service.average_rating}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography variant="subtitle1">Start Price:</Typography>
                      <Typography variant="body2">
                        ${service.start_price}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography variant="subtitle1">
                        Cancellation Policy:
                      </Typography>
                      <Typography variant="body2">
                        {service.cancellation_policy}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography variant="subtitle1">Staff:</Typography>
                      <Typography variant="body2">{service.staff}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography variant="subtitle1">City:</Typography>
                      <Typography variant="body2">{service.city}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography variant="subtitle1">
                        Service Category:
                      </Typography>
                      <Typography variant="body2">
                        {service.service_category}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Buttons */}
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ marginBottom: 2 }}
                  >
                    Add to Favourites
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                  >
                    Check Availability
                  </Button>
                  <Button variant="contained" color="secondary">
                    Contact Vendor
                  </Button>
                </Grid>
              </Grid>

              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Packages:
                </Typography>
                <PackagesTable packages={service.packages} />
              </Box>

              {/* Add Review Section */}
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Add a Review (need to add functionality for this to only be available for logged users who have availed the service)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <AddRating value={rating} setValue={setRating} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Your Review"
                      multiline
                      rows={4}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleReviewSubmit}
                    >
                      Post Review
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Reviews Section */}
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Reviews:
                </Typography>
                <Grid container spacing={2}>
                  {/* Example Review Cards */}
                  <Grid item xs={12} sm={6} md={4}>
                    <ReviewCard />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <ReviewCard />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <ReviewCard />
                  </Grid>
                  {/* Add more <Grid item> components with <ReviewCard /> as needed */}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
