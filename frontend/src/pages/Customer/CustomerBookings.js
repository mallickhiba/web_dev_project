import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Container,
  Pagination,
  styled,
  InputBase,
  alpha,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { getFromBookings } from '../../redux/serviceActions'; // Adjust the import path as necessary
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import BookingCard from "../Bookings/CustomerBookingCard";
import DashboardSidebar from "../../common/DashboardSidebar";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const CustomerBookings = () => {
  const dispatch = useDispatch();
  const { booking: allBookings, loading, error } = useSelector(state => state.services);

  const [page, setPage] = useState(1);
  const bookingsPerPage = 20;
  const [searchQuery, setSearchQuery] = useState('');
  const [value, setValue] = useState(0); // State for controlling tabs

  useEffect(() => {
    dispatch(getFromBookings());
  }, [dispatch]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const filteredBookings = allBookings.filter(booking => {
    return booking.service_id.service_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const tabs = [
    { label: 'All Bookings', bookings: filteredBookings },
    { label: 'Confirmed Bookings', bookings: filteredBookings.filter(booking => booking.status === 'confirmed') },
    { label: 'Pending Bookings', bookings: filteredBookings.filter(booking => booking.status === 'pending') },
    { label: 'Cancelled Bookings', bookings: filteredBookings.filter(booking => booking.status === 'cancelled') },
  ];

  const currentBookings = tabs[value].bookings;
  const totalBookings = currentBookings.length;

  const indexOfLastBooking = page * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={3}>
          <DashboardSidebar active={4} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box mx={4} my={4}>
            <Tabs value={value} onChange={handleTabChange} centered>
              {tabs.map((tab, index) => (
                <Tab key={index} label={tab.label} />
              ))}
            </Tabs>
            <Box mb={3} display="flex" alignItems="center">
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
              </Search>
            </Box>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
              <Grid container spacing={3}>
                {currentBookings
                  .slice(indexOfFirstBooking, indexOfLastBooking)
                  .map((booking, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <Box display="flex" justifyContent="center">
                        <BookingCard booking={booking} />
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            )}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil(totalBookings / bookingsPerPage)}
                page={page}
                onChange={handlePageChange}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
      <NotificationContainer />
    </Container>
  );
};

export default CustomerBookings;
