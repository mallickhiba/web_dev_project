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
import AdminSidebar from '../Admin/components/AdminSidebar';



const VendorBookingHistory = () => {
  return (
    <Container>
      <Grid container>
        {/* Render the AdminSidebar component */}
      
        <Grid item xs={12} md={3}>
          <AdminSidebar active={2} />
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={9}>
          <Box mx={4} my={4}>
            <Box border="1px  #ccc" borderRadius={4} p={3} mb={3} mt={2}>
              <Typography variant="h4">showing all reviews</Typography>
            </Box>
          </Box>
        </Grid>


 {/* Main content end here */}

      </Grid>
    </Container>
  );
};
  

export default VendorBookingHistory