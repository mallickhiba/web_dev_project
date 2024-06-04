import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Grid, Container } from '@mui/material';
import axios from 'axios';
import DashboardSidebar from '../../common/DashboardSidebar';
import EnhancedTable from './components/Bookings/BookingsTable';
import { setBookings } from '../../redux/vendor/vendorBookingSlice'; // Import setBookings action

const VendorBookings = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const bookings = useSelector((state) => state.vendorbookings.bookings);
  const [orderBy, setOrderBy] = useState('bookingDate');
  const [order, setOrder] = useState('asc');
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 5,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5600/bookings/vendorBookings', {
          headers: { Authorization: `Bearer ${token}` },
          params: { orderBy, order, page: pagination.page, rowsPerPage: pagination.rowsPerPage },
        });
        dispatch(setBookings(response.data.bookings));
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, [dispatch, token, orderBy, order, pagination]);

  const handleSortChange = (property, newOrder) => {
    setOrderBy(property);
    setOrder(newOrder);
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10) || 5;
    setPagination({ ...pagination, rowsPerPage: newRowsPerPage, page: 0 });
  };

  return (
    <Container maxWidth={false}>
      <Grid container>
        <Grid item xs={12} md={2}>
          <DashboardSidebar active={4} />
        </Grid>

        <Grid item xs={12} md={10}>
          <Box mb={3} mt={5}>
            <Typography variant="h4">Booking History</Typography>
          </Box>
          <Box flex="1" width="100%">
            <EnhancedTable
              bookings={bookings}
              orderBy={orderBy}
              order={order}
              pagination={pagination} // Pass pagination object to EnhancedTable
              onSortChange={handleSortChange}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VendorBookings;
