import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Container,
} from "@mui/material";
import axios from "axios";
import DashboardSidebar from "../../common/DashboardSidebar";



const VendorBookings = () => {
  return (
    <Container>
      <Grid container>
        {/* Render the DashboardSidebar component */}
        <Grid item xs={12} md={3}>
          <DashboardSidebar active={4} />
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={9}>
          <Box mx={4} my={4}>
            <Box border="1px  #ccc" borderRadius={4} p={3} mb={3} mt={2}>
              <Typography variant="h4">booking history display here</Typography>
            </Box>
          </Box>
        </Grid>


 {/* Main content end here */}

      </Grid>
    </Container>
  );
};
  

export default VendorBookings