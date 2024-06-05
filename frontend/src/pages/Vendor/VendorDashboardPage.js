import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUserDetails } from '../../redux/userSlice';
import { Link, useHistory } from 'react-router-dom'; // Import Link from react-router-dom
import DashboardSidebar from '../../common/DashboardSidebar';
import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  Logout,
  PersonAdd,
  Settings,
  Person,
  Group,
  Store,
  AssignmentInd,
  ListAlt,
  BookOnline,
} from '@mui/icons-material';

const KPI = ({ title, value, icon, onClick, to }) => (
  <Card
    onClick={onClick}
    sx={{ minWidth: 150, m: 2, borderRadius: 2, boxShadow: 3, cursor: 'pointer' }}
    component={to ? Link : 'div'} // Use Link if 'to' prop is provided
    to={to} // Pass 'to' prop to Link
  >
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {icon}
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </Box>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const VendorDashboardPage = () => {

  const newServices = 2; // Example data
  const newBookings = 5; // Example data

  return (
    <Container>
      <Grid container>
        {/* Render the AdminSidebar component */}
        <Grid item xs={12} md={3}>
          <DashboardSidebar active={1} />
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={9}>
          <Box mx={4} my={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              <Typography variant="h6">
                Welcome to vendor dashboard
              </Typography>
              
        
            </Box>
              <Grid item xs={12} sm={6} md={4}>
              <KPI
                  title="Active Services"
                  value={newServices}
                  icon={<ListAlt fontSize="large" />}
                  to="/vendorservices"
                />
                <KPI
                  title="New Bookings Added"
                  value={newBookings}
                  icon={<BookOnline fontSize="large" />}
                  to="/vendorbookings"
                />
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VendorDashboardPage;
