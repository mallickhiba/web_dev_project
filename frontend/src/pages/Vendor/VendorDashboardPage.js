import React, { useEffect } from 'react'
import DashboardSidebar from '../../common/DashboardSidebar';
import {  Box, Container, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUserDetails } from '../../redux/userSlice';

const VendorDashboardPage = () => {
 
  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.token);
  const vendorData = useSelector((state) => state.user.userDetails);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5600/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Vendor details:", response.data);
        dispatch(setUserDetails(response.data));
        const { firstName, lastName } = response.data;
const userName = `${firstName} ${lastName}`;
localStorage.setItem('userName', userName);
      } catch (error) {
        console.error("Error fetching vendor details:", error);
      }
    };

  
  }, [dispatch, token, vendorData]);


  return (
    <Container>
    <Grid container>
      {/* Render the DashboardSidebar component */}
      <Grid item xs={12} md={3}>
        <DashboardSidebar active={1} />
      </Grid>

      {/* Main content */}
      <Grid item xs={12} md={9}>
        <Box mx={4} my={4}>
          <Box border="1px  #ccc" borderRadius={4} p={3} mb={3} mt={2}>
            <Typography variant="h4">i am Dashboard </Typography>
           
      </Box>
          </Box>

      
        
      </Grid>


{/* Main content end here */}

    </Grid>
  </Container> 

  )
}

export default VendorDashboardPage