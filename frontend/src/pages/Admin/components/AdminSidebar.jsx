import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { DashboardOutlined, CalendarMonth, AdminPanelSettingsOutlined } from "@mui/icons-material";
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReviewsIcon from '@mui/icons-material/Reviews';
import axios from "axios";
import { logout } from "../../../redux/userSlice";
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

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5600/auth/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(logout());
      localStorage.setItem('userName', "");
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const userRole = useSelector((state) => state.user.role);

  const navItems = [
    { text: "Dashboard", icon: <DashboardOutlined sx={{ color: `${active === 1 ? "#dab61e" : "#f2fdfb"}` }} />, link: "/adminhome" },
    { text: "User Management", icon: <PeopleIcon sx={{ color: `${active === 2 ? "#dab61e" : "#f2fdfb"}` }} />, link: "/user-management" },
    { text: "Approve Vendors", icon: <CheckCircleOutlineIcon sx={{ color: `${active === 3 ? "#dab61e" : "#f2fdfb"}` }} />, link: "/approve-vendors" },
    { text: "Booking Management", icon: <CalendarMonth sx={{ color: `${active === 4 ? "#dab61e" : "#f2fdfb"}` }} />, link: "/booking-management" },
    { text: "Review Management", icon: <ReviewsIcon sx={{ color: `${active === 5 ? "#dab61e" : "#f2fdfb"}` }} />, link: "/review-management" },
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
            color: "#f2fdfb",  // Default text color
            backgroundColor: "#0f172b",  // Sidebar background color
            boxSizing: "border-box",
            width: 240,
          },
        }}
      >
        <Box width="100%">
          {/* Sidebar Header */}
          <Box m="1.5rem 2rem 2rem 3rem">
            <FlexBetween>
              <Link to="/adminhome" className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-start">
                <img src="./favicon.ico" alt="Sh" style={{ width: 50, height: 50 }} />
                <Typography variant="h6" component="span" sx={{ ml: 2, color: "#dab61e", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "24px" }}>
                  Shadiyana
                </Typography>
              </Link>
            </FlexBetween>
          </Box>
          
          {/* Sidebar Items */}
          <List>
            {navItems.map(({ text, icon, link, active: itemActive }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  component="a"
                  href={link}
                  selected={itemActive}
                  sx={{
                    backgroundColor: itemActive ? "secondary.300" : "transparent",
                    color: itemActive ? "#dab61e" : "#f2fdfb", // Set font color dynamically
                    fontFamily: "Heebo, sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                  }}
                >
                  {icon && (
                    <ListItemIcon sx={{ ml: "2rem", color: `${active === 1 ? "#dab61e" : "#f2fdfb"}` }}>
                      {icon}
                    </ListItemIcon>
                  )}
                  <ListItemText primary={text} sx={{ fontWeight: icon === null ? "bold" : "normal", color: "#f2fdfb" }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

        </Box>

        {/* Sidebar Footer */}
        <Box position="absolute" bottom="2rem" width="100%">
          <Divider sx={{ backgroundColor: "#f2fdfb" }} />
          <FlexBetween gap="1rem" p="1.5rem 2rem" alignItems="center">
            {/* User Info */}
            <Box>
              <Typography fontWeight="bold" fontSize="0.9rem" sx={{ color: "#f2fdfb", fontFamily: "Heebo, sans-serif", fontWeight: 400, fontSize: "15px" }}>
              {localStorage.getItem('userName')}
              </Typography>
              <Typography fontSize="0.8rem" sx={{ color: "#f2fdfb", fontFamily: "Heebo, sans-serif", fontWeight: 400, fontSize: "15px" }}>
                {userRole}
              </Typography>
            </Box>
            {/* Admin Settings Icon */}
            <Box>
              <AdminPanelSettingsOutlined sx={{ fontSize: "25px", color: "#f2fdfb" }} />
            </Box>
          </FlexBetween>

          {/* Logout Button */}
          <Box textAlign="center">
            <Button onClick={handleLogout} variant="contained" color="secondary" sx={{ m: "1rem", backgroundColor: "#dab61e" }}>
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DashboardSidebar;

