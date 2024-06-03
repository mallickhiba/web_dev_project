import React from "react";
import { Card, CardActions, CardContent, Button, Typography, Box } from "@mui/material";
import Rating from "@mui/material/Rating";

const ReviewCard = ({ review }) => {
  const user = review.user ? `${review.user.firstName} ${review.user.lastName}` : "Anonymous";
  const service = review.service ? review.service.service_name : "Unknown Service";

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
    
      </Card>
    </Box>
  );
};

export default ReviewCard;
