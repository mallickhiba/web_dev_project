import React, { useState } from "react";
import { Card, CardActions, CardContent, Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import Rating from "@mui/material/Rating";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import { deleteReview } from "../../redux/adminReviewSlice";

const ReviewCard = ({ review }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const user = review.user ? `${review.user.firstName} ${review.user.lastName}` : "Anonymous";
  const service = review.service ? review.service.service_name : "Unknown Service";

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleOpenDeleteConfirmation = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteReview = async () => {
    try {
      const response = await fetch(`http://localhost:5600/reviews/delete/${review._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      dispatch(deleteReview(review._id));
      setDeleteConfirmationOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <Box
            sx={{
              "& > legend": { mt: 2 },
            }}
          >
            <Typography component="legend">{review.rating}/5</Typography>
            <Rating name="read-only" value={review.rating} readOnly />
          </Box>
          <Typography variant="h5" component="div">
            {service}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {user}
          </Typography>
          <Typography variant="body2">
            {review.review}
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
        <DialogTitle>{"Delete Review"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review? This action cannot be undone.
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

