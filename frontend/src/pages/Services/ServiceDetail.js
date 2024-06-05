import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAllServiceByIdAsync, fetchreviews } from "../../redux/serviceSlice";
import { postReview } from "../../redux/serviceActions";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import PackagesTable from "./PackagesTable";
import ReviewCard from "../Reviews/ReviewCard";
import AddRating from "../Reviews/AddRating";
import { Link } from "react-router-dom";

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
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

const ServiceDetail = () => {
  const service = useSelector((state) => state.services.selectedService);
  const reviews = useSelector((state) => state.services.reviews);
  const dispatch = useDispatch();
  const params = useParams();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  useEffect(() => {
    dispatch(fetchAllServiceByIdAsync(params.id));
    dispatch(fetchreviews(params.id));
  }, [dispatch, params.id]);

  const handlepostreview = () => {
    dispatch(postReview({ serviceId: params.id, rating, review })).then(() => {
      dispatch(fetchreviews(params.id)); // Fetch updated reviews after posting a new one
      setRating(2);
      setReview("");
    });
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
                  <Link to={`/makebooking/${service._id}`} style={{ textDecoration: "none" }}>
  <Button variant="contained" color="primary" sx={{ marginBottom: 2 }}>
    Book Now
  </Button>
</Link>

                  
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
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Add a Review
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
                      onClick={handlepostreview}  
                    >
                      Post Review
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Reviews:
                </Typography>
                <Grid container spacing={2}>
                  {reviews.map((review) => (
                    <Grid item xs={12} sm={6} md={4} key={review._id}>
                       {review && <ReviewCard review={review} />}
                    </Grid>
                  ))}
                </Grid>
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
