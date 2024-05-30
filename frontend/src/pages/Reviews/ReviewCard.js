import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Box,
} from "@mui/material";
import SeeRating from "./SeeRating.js";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const card = (
  <React.Fragment>
    <CardContent>
      <SeeRating></SeeRating>
      <Typography variant="h5" component="div">
        Review Summary
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        [username]
      </Typography>
      <Typography variant="body2">
        *review text*
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small">Learn More</Button>
    </CardActions>
  </React.Fragment>
);

export default function ReviewCard() {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}
