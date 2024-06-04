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
} from "@mui/material";
import axios from "axios";
import BookingCard from "../Bookings/EditableBookingCard"; // Update path if needed
import SearchIcon from '@mui/icons-material/Search';
import AdminSidebar from "./components/AdminSidebar";
import { setBookings, deleteBooking } from "../../redux/adminBookingSlice"; // Update path if needed

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

const BookingManagement = () => {
  const dispatch = useDispatch();
  const allBookings = useSelector((state) => state.adminBookings.bookings);
  const token = useSelector((state) => state.user.token);

  const [page, setPage] = useState(1);
  const bookingsPerPage = 20;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("Fetching bookings...");
        const response = await axios.get(
          "http://localhost:5600/bookings/allbookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Booking details:", response.data.bookings);
        dispatch(setBookings(response.data.bookings));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [dispatch, token]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = () => {
    return allBookings.filter(booking => {
      const customer_name = booking.customer.firstName.toLowerCase();
      const query = searchQuery.toLowerCase();
      return customer_name.includes(query);
    });
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const indexOfLastBooking = page * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;

  const handleEditBooking = (id) => {
    const booking = allBookings.find((booking) => booking._id === id);

    if (booking) {
      setSelectedBooking(booking);
      setOpenEditModal(true);
    }
  };

  const handleDeleteBooking = (id) => {
    setSelectedBookingId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDeleteBooking = () => {
    console.log("Deleting booking with ID:", selectedBookingId);
    dispatch(deleteBooking(selectedBookingId));
    setOpenDeleteDialog(false);
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={3}>
          <AdminSidebar active={4} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box mx={4} my={4}>
            {showHeader && (
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
            )}
            <Grid container spacing={3}>
              {handleSearch().slice(indexOfFirstBooking, indexOfLastBooking).map((booking, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Box display="flex" justifyContent="center">
                    <BookingCard booking={booking} />
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil(allBookings.length / bookingsPerPage)}
                page={page}
                onChange={handlePageChange}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingManagement;