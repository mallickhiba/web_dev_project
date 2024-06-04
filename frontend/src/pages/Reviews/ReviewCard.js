import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ReviewCard = ({ review }) => {
  if (!review || typeof review !== 'object') {
    return null; // Or render a placeholder if review is not a valid object
  }

  const { _id, user, rating, review: reviewText } = review;

  if (!user || typeof user !== 'object') {
    return null; // Or handle cases where user is not a valid object
  }

  const { firstName, lastName } = user;

  return (
    <Card key={_id}>
      <CardContent>
        <Typography variant="h6">
          {firstName} {lastName}
        </Typography>
        <Typography variant="body2">
          Rating: {rating}
        </Typography>
        <Typography variant="body1">
          {reviewText}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
