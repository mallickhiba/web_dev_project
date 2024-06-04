import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
} from '@mui/material';

const ReviewCard = ({ review }) => {
  if (!review || typeof review !== 'object') {
    return null; // Or render a placeholder if review is not a valid object
  }

  const { _id, user, rating, review: reviewText } = review;

  if (!user || typeof user !== 'object') {
    return null; // Or handle cases where user is not a valid object
  }

  const { firstName, lastName } = user;
  const service = review.service ? review.service.service_name : "Unknown Service";

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
            <Rating name="read-only" value={rating} readOnly />
            <Typography component="legend" sx={{ ml: 1 }}>
              {rating}/5
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
            {firstName} {lastName}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            {reviewText}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReviewCard;
