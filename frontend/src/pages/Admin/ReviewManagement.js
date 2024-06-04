import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Container } from "@mui/material";
import axios from "axios";
import ReviewCard from "../Reviews/EditableReviewCard";
import { useSelector, useDispatch } from "react-redux";
import AdminSidebar from "./components/AdminSidebar";
import { setReviews } from "../../redux/adminReviewSlice";
import SearchIcon from "@mui/icons-material/Search";

const ReviewManagement = () => {
  const dispatch = useDispatch();
  const allReviews = useSelector((state) => state.adminReviews.reviews); // Adjusted the selector key
  const token = useSelector((state) => state.user.token);

  const [page, setPage] = useState(1);
  const reviewsPerPage = 20;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log("Fetching reviews...");
        const response = await axios.get(
          "http://localhost:5600/reviews/view-reviews",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Review details:", response.data.reviews);
        dispatch(setReviews(response.data.reviews));
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [dispatch, token]);

  const handleEditReview = (id) => {
    const review = allReviews.find((review) => review._id === id);

    if (review) {
      setSelectedReview(review);
      setOpenEditModal(true);
    }
  };

  const handleDeleteReview = (id) => {
    setSelectedReviewId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDeleteReview = () => {
    console.log("Deleting review with ID:", selectedReviewId);
    setOpenDeleteDialog(false);
  };

  return (
    <Container>
      <Grid container>
        {/* Render the AdminSidebar component */}
        <Grid item xs={12} md={3}>
          <AdminSidebar active={5} />
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={9}>
          <Box mx={4} my={4}>
            <Box border="1px solid #ccc" borderRadius={4} p={3} mb={3} mt={2}>
              <Typography variant="h4">Showing all reviews</Typography>
            </Box>
            <Grid container spacing={2}>
              {allReviews?.map((review, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <ReviewCard review={review} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReviewManagement;
