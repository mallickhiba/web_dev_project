import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  DashboardOutlined,
  AccountCircle,
  CalendarMonth,
  AdminPanelSettingsOutlined,
  Cancel,
  Pending,
  CheckCircle,
  Edit,
} from "@mui/icons-material";
import axios from "axios";
import { logout } from "../redux/userSlice";
const { styled } = require("@mui/system");

const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const DashboardSidebar = ({ active }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.user.token);
  const userRole = useSelector((state) => state.user.role);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5600/auth/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(logout());
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { text: "Dashboard", icon: <DashboardOutlined sx={{color: `${active === 1 ? "crimson" : "#555"}` }} />, link: "/vendordashboard" },
    userRole === 'vendor' ? { text: "Services", icon: <Edit sx={{color: `${active === 2 ? "crimson" : "#555"}` }} />, link: "/vendorservices" } :
    { text: "Favourites", icon: <Edit sx={{color: `${active === 2 ? "crimson" : "#555"}` }} />, link: "/customerfavourites" },
    { text: "Profile", icon: <AccountCircle sx={{color: `${active === 3 ? "crimson" : "#555"}` }}/>, link: "/vendorprofile" },
    { text: "Bookings", icon: null },
    { text: "Booking History", icon: <CalendarMonth sx={{color: `${active === 4 ? "crimson" : "#555"}` }}/>, link: "/allbookings" },
    { text: "Pending", icon: <Pending sx={{color: `${active === 5 ? "crimson" : "#555"}` }} />, link: "/pendingbookings" },
    { text: "Cancelled", icon: <Cancel sx={{color: `${active === 6 ? "crimson" : "#555"}` }}/>, link: "/cancelledbookings" },
    { text: "Confirmed", icon: <CheckCircle sx={{color: `${active === 7 ? "crimson" : "#555"}` }}/>, link: "/confirmedbookings" },
  ];

  return (
    <Box component="nav">
      <Drawer
        open={true}
        variant="persistent"
        anchor="left"
        sx={{
          width: 240,
          "& .MuiDrawer-paper": {
            color: "text.secondary",
            backgroundColor: "background.alt",
            boxSizing: "border-box",
            width: 240,
          },
        }}
      >
        <Box width="100%">
          {/* Sidebar Header */}
          <Box m="1.5rem 2rem 2rem 3rem">
            <FlexBetween>
              <Link to="/vendordashboard" className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center">
                <img src="https://www.shadiyana.pk/images/logo.svg" alt="" />
              </Link>
            </FlexBetween>
          </Box>

          {/* Sidebar Items */}
          <List>
            {navItems.map(({ text, icon, link }, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  component="a"
                  href={link}
                  selected={active === index + 1}
                  sx={{
                    backgroundColor: active === index + 1 ? "secondary.300" : "transparent",
                    color: active === index + 1 ? "crimson" : "text.secondary",
                  }}
                >
                  {icon && (
                    <ListItemIcon sx={{ ml: "2rem" }}>
                      {icon}
                    </ListItemIcon>
                  )}
                  <ListItemText primary={text} sx={{ fontWeight: icon === null ? "bold" : "normal" }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Sidebar Footer */}
        <Box position="absolute" bottom="2rem" width="100%">
          <Divider />
          <FlexBetween gap="1rem" p="1.5rem 2rem" alignItems="center">
            {/* User Info */}
            <Box>
              <Typography fontWeight="bold" fontSize="0.9rem">
                John Doe {/* Assuming user name */}
              </Typography>
              <Typography fontSize="0.8rem">
                {userRole}
              </Typography>
            </Box>

            {/* Admin Settings Icon */}
            <Box>
              <AdminPanelSettingsOutlined sx={{ fontSize: "25px" }} />
            </Box>
          </FlexBetween>

          {/* Logout Button */}
          <Box textAlign="center">
            <Button onClick={handleLogout} variant="contained" color="secondary" sx={{ m: "1rem", backgroundColor: "crimson" }}>
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DashboardSidebar;
