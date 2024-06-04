import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

const AddRating = ({ value, setValue }) => {
  return (
    <Box sx={{ "& > legend": { mt: 2 } }}>
      <Typography component="legend"></Typography>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
    </Box>
  );
};

export default AddRating;
