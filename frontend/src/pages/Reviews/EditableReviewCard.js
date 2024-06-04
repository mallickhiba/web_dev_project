import React, { useState } from "react";
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
  Rating,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import { deleteReview } from "../../redux/adminReviewSlice";

const ReviewCard = ({ review }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const user = review.user
    ? `${review.user.firstName} ${review.user.lastName}`
    : "Anonymous";
  const service = review.service
    ? review.service.service_name
    : "Unknown Service";

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleOpenDeleteConfirmation = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteReview = async () => {
    try {
      const response = await fetch(
        `http://localhost:5600/reviews/delete/${review._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      dispatch(deleteReview(review._id));
      setDeleteConfirmationOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ minWidth: 275, mb: 2 }}>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          p: 2,
          width: "100%",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Rating name="read-only" value={review.rating} readOnly />
            <Typography component="legend" sx={{ ml: 1 }}>
              {review.rating}/5
            </Typography>
          </Box>
          <Typography
            variant="body1"
            component="div"
            sx={{ fontWeight: "bold", mt: 1 }}
          >
            {service}
          </Typography>
          <Typography sx={{ mb: 1.5, fontWeight: "bold" }} color="text.secondary">
            {user}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            {review.review}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton
            onClick={handleOpenDeleteConfirmation}
            aria-label="delete"
            sx={{ ml: "auto" }}
          >
            <DeleteIcon color="error" />
          </IconButton>
        </CardActions>
      </Card>

      <Dialog open={deleteConfirmationOpen} onClose={handleCancelDelete}>
        <DialogTitle>{"Delete Review"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteReview} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewCard;
