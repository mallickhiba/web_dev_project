import React from 'react';
import { Link, useHistory } from 'react-router-dom'; // Import Link from react-router-dom
import AdminSidebar from '../Admin/components/AdminSidebar';
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

const AdminHomePage = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const newUsers = 120; // Example data
  const newCustomers = 80; // Example data
  const newVendors = 30; // Example data
  const pendingVendors = 5; // Example dat
  const newServices = 50; // Example data
  const newBookings = 150; // Example data

  return (
    <Container>
      <Grid container>
        {/* Render the AdminSidebar component */}
        <Grid item xs={12} md={3}>
          <AdminSidebar active={1} />
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
                Welcome to admin dashboard
              </Typography>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleClose}>
                  <Avatar /> My account
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <PersonAdd fontSize="small" />
                  </ListItemIcon>
                  Add another account
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <KPI
                  title="New Users Joined"
                  value={newUsers}
                  icon={<Person fontSize="large" />}
                  to="/user-management"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <KPI
                  title="New Customers Joined"
                  value={newCustomers}
                  icon={<Group fontSize="large" />}
                  to="/user-management"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <KPI
                  title="New Vendors Joined"
                  value={newVendors}
                  icon={<Store fontSize="large" />}
                  to="/user-management"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <KPI
                  title="Vendors Pending Approval"
                  value={pendingVendors}
                  icon={<AssignmentInd fontSize="large" />}
                  to="/approve-vendors"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <KPI
                  title="New Reviews Posted"
                  value={newServices}
                  icon={<ListAlt fontSize="large" />}
                  to="/review-management"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <KPI
                  title="New Bookings Added"
                  value={newBookings}
                  icon={<BookOnline fontSize="large" />}
                  to="/booking-management"
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminHomePage;