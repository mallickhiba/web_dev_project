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

  const userRole = useSelector((state) => state.user.role);

  const token = useSelector((state) => state.user.token);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5600/auth/logout",
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.setItem("userName", "");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const vendorNavItems = [
    {
      text: "Dashboard",
      icon: (
        <DashboardOutlined
          sx={{ color: `${active === 1 ? "#dab61e" : "white"}` }}
        />
      ),
      link: "/vendordashboard",
    },
    {
      text: "Profile",
      icon: (
        <AccountCircle sx={{ color: `${active === 3 ? "#dab61e" : "white"}` }} />
      ),
      link: "/vendorprofile",
    }
  ];

  const customerNavItems = [
    {
      text: "Dashboard",
      icon: (
        <DashboardOutlined
          sx={{ color: `${active === 1 ? "#dab61e" : "white"}` }}
        />
      ),
      link: "/customerdashboard",
    },
    {
      text: "Favourites",
      icon: (
        <Edit sx={{ color: `${active === 2 ? "#dab61e" : "white"}` }} />
      ),
      link: "/customerfavourites",
    },
    {
      text: "Profile",
      icon: (
        <AccountCircle sx={{ color: `${active === 3 ? "#dab61e" : "white"}` }} />
      ),
      link: "/customerprofile",
    },
    {
      text: "Bookings",
      icon: (
        <CalendarMonth
          sx={{ color: `${active === 4 ? "#dab61e" : "white"}` }}
        />
      ),
      link: "/customerbookings",
    },
  ];

  let navItems = [];
  if (userRole === "vendor") {
    navItems = vendorNavItems;
    if (token.approved) {
      navItems = [
        ...navItems,
        {
          text: "Services",
          icon: (
            <Edit sx={{ color: `${active === 5 ? "#dab61e" : "white"}` }} />
          ),
          link: "/vendorservices",
        },
        {
          text: "Bookings",
          icon: (
            <CalendarMonth
              sx={{ color: `${active === 6 ? "#dab61e" : "white"}` }}
            />
          ),
          link: "/vendorbookings",
        },
      ];
    }
  } else {
    navItems = customerNavItems;
  }

  return (
    <Box component="nav">
      <Drawer
        open={true}
        variant="persistent"
        anchor="left"
        sx={{
          width: 240,
          "& .MuiDrawer-paper": {
            color: "#f2fdfb",
            backgroundColor: "#0f172b",
            boxSizing: "border-box",
            width: 240,
          },
        }}
      >
        <Box width="100%">
          {/* Sidebar Header */}
          <Box m="1.5rem 2rem 2rem 3rem">
            <FlexBetween>
            <Link
  to={userRole === "vendor" ? "/vendordashboard" : "/customerdashboard"}
  className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center"
>
                <img
                  src="./favicon.ico"
                  alt="Sh"
                  style={{ width: 50, height: 50 }}
                />
                <Typography
                  variant="h6"
                  component="span"
                  sx={{
                    ml: 2,
                    color: "#dab61e",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 700,
                    fontSize: "24px",
                  }}
                >
                  Shadiyana
                </Typography>
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
                    backgroundColor: active ? "secondary.300" : "transparent",
                    color: active ? "#dab61e" : "#f2fdfb", // Set font color dynamically
                    fontFamily: "Heebo, sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                  }}
                >
                  {icon && (
                    <ListItemIcon
                      sx={{
                        ml: "2rem",
                        color: `${active === 1 ? "#dab61e" : "#f2fdfb"}`,
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={text}
                    sx={{ fontWeight: icon === null ? "bold" : "normal", color: "#f2fdfb" }}
                  />
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
                {localStorage.getItem("userName")}
              </Typography>
              <Typography fontSize="0.8rem">{userRole}</Typography>
            </Box>
            {/* Admin Settings Icon */}
            <Box>
              <AdminPanelSettingsOutlined sx={{ fontSize: "25px" }} />
            </Box>
          </FlexBetween>
          {/* Logout Button */}
          <Box textAlign="center">
            <Button
              onClick={handleLogout}
              variant="contained"
              color="secondary"
              sx={{ m: "1rem", backgroundColor: "#dab61e" }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DashboardSidebar;

