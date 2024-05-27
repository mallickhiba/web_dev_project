import React from 'react'
import DashboardSidebar from '../../common/DashboardSidebar';
import { Box, Container, Grid, Typography } from '@mui/material';

const VendorDashboardPage = () => {

  return (
    <Container>
    <Grid container>
      {/* Render the DashboardSidebar component */}
      <Grid item xs={12} md={3}>
        <DashboardSidebar active={2} />
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