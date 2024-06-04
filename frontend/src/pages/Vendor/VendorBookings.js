import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Grid, Container } from '@mui/material';
import axios from 'axios';
import DashboardSidebar from '../../common/DashboardSidebar';
import { setBookings, setPagination } from '../../redux/vendor/vendorBookingSlice'; // Updated import
import EnhancedTable from './components/Bookings/BookingsTable';

const VendorBookings = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const bookings = useSelector(state => state.vendorbookings.bookings);
  const pagination = useSelector(state => state.vendorbookings.pagination); 

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5600/bookings/vendorBookings', {
          headers: { Authorization: `Bearer ${token}` },
          params: pagination
        });
        console.log("Response", response)
        dispatch(setBookings(response.data.bookings));
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, [dispatch, token, pagination]);

  const handlePageChange = (event, newPage) => {
    dispatch(setPagination({ ...pagination, page: newPage + 1 }));
  };
  
  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10) || 5;
    dispatch(setPagination({ ...pagination, limit: newRowsPerPage, page: 1 }));
  };
  
  const handleSortChange = (columnId) => {
    dispatch(setPagination({ ...pagination, sort: pagination.sort === 'asc' ? 'desc' : 'asc', page: 1 }));
  };
  
  const handleFilterChange = (status) => {
    dispatch(setPagination({ ...pagination, status, page: 1 }));
  };
  

  return (
    <Container maxWidth={false}>
      <Grid container>
        {/* Render the DashboardSidebar component */}
        <Grid item xs={12} md={2}>
          <DashboardSidebar active={4} />
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={10}>
          <Box mb={3} mt={5}>
            <Typography variant="h4">Booking History</Typography>
          </Box>
          <Box flex="1" width="100%">
            <EnhancedTable
              bookings={bookings}
              pagination={pagination}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VendorBookings;
