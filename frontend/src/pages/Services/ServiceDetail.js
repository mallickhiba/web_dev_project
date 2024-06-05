import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAllServiceByIdAsync, fetchreviews } from "../../redux/serviceSlice.js";
import { postReview, addToFavorites, removeFromFavorites } from "../../redux/serviceActions.js";
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
  const favorites = useSelector((state) => state.services.favorites);
  const dispatch = useDispatch();
  const params = useParams();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  useEffect(() => {
    dispatch(fetchAllServiceByIdAsync(params.id));
    dispatch(fetchreviews(params.id));
  }, [dispatch, params.id]);

  const handlePostReview = () => {
    dispatch(postReview({ serviceId: params.id, rating, review })).then(() => {
      dispatch(fetchreviews(params.id)); // Fetch updated reviews after posting a new one
      setRating(2);
      setReview("");
    });
  };

  const handleAddToFavorites = () => {
    if (service) {
      dispatch(addToFavorites(service._id));
    }
  };

  const handleRemoveFromFavorites = () => {
    if (service) {
      dispatch(removeFromFavorites(service._id));
    }
  };

  const isFavorite = service && favorites.includes(service._id);

  return (
    <div>
      <Header />
      <Container>
        {service ? (
          <Card sx={{ marginTop: 3 }}>
            <CardContent>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "#0F172B",
                  fontFamily: "Font Awesome 5 Free",
                }}
              >
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
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "#0F172B",
                  fontFamily: "Font Awesome 5 Free",
                }}
              >
                Description
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontFamily: "Font Awesome 5 Free" }} // Description with sans-serif font
              >
                {service.description}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    {[
                      { label: "Average Rating", value: service.average_rating },
                      { label: "Start Price", value: `$${service.start_price}` },
                      { label: "Cancellation Policy", value: service.cancellation_policy },
                      { label: "Staff", value: service.staff },
                      { label: "City", value: service.city },
                      { label: "Service Category", value: service.service_category },
                    ].map((item) => (
                      <Grid item xs={12} sm={6} md={6} key={item.label}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            color: "#0F172B",
                            fontFamily: "Font Awesome 5 Free",
                          }}
                        >
                          {item.label}:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "Font Awesome 5 Free" }}
                        >
                          {item.value}
                        </Typography>
                      </Grid>
                    ))}
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
                  {isFavorite ? (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#FEA116",
                        color: "#fff",
                        borderRadius: "25px",
                        width: "100%",
                        marginBottom: 2,
                      }}
                      onClick={handleRemoveFromFavorites}
                    >
                      Remove from Favorites
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#FEA116",
                        color: "#fff",
                        borderRadius: "25px",
                        width: "100%",
                        marginBottom: 2,
                      }}
                      onClick={handleAddToFavorites}
                    >
                      Add to Favorites
                    </Button>
                  )}
                  <Link to={`/makebooking/${service._id}`} style={{ textDecoration: "none", marginBottom: 2 }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#FEA116",
                        color: "#fff",
                        borderRadius: "25px",
                        width: "100%",
                        marginBottom: 2,
                      }}
                    >
                      Book Now
                    </Button>
                  </Link>
                </Grid>
              </Grid>
              <Box mt={4}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "#0F172B",
                    fontFamily: "Font Awesome 5 Free",
                  }}
                >
                  Packages:
                </Typography>
                <PackagesTable packages={service.packages} />
              </Box>
              <Box mt={4}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "#0F172B",
                    fontFamily: "Font Awesome 5 Free",
                  }}
                >
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
                      sx={{ fontFamily: "Font Awesome 5 Free" }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#FEA116",
                        color: "#fff",
                        borderRadius: "25px",
                        width: "100%",
                      }}
                      onClick={handlePostReview}
                    >
                      Post Review
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              <Box mt={4}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "#0F172B",
                    fontFamily: "Font Awesome 5 Free",
                  }}
                >
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
        ) : (
          <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>
            Loading service details...
          </Typography>
        )}
      </Container>
      <NotificationContainer />
    </div>
  );
};

export default ServiceDetail;
