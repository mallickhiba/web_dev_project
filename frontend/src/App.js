import "./App.css";
import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import axios from "axios";
import SignUp from "./pages/SignupPage.js";
import Login from "./pages/LoginPage.js";
import "./css/style.css";
import "./css/bootstrap.min.css";
import "./css/animate.css";
import "./css/animate.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css";
import Header from "./common/Header";
import Home  from "./home/Homes.js";
import Services from "./pages/ServicesPage.js";
import Footer from "./common/Footer";
import Test from "./pages/test.js";
import { Provider, useSelector } from 'react-redux';
import store from './redux/store'; // Import the Redux store
import AdminHome from './pages/AdminHome';
import Venues from './pages/Venues.js'; // Import your Venues component
import Caterings from './pages/Catering.js'; 
import Photography from './pages/Photography.js'; 
import Decor from './pages/Decor.js'; 
import Services1 from "./pages/Services.js";
import VendorDashboardPage from "./pages/Vendor/VendorDashboardPage.js";
import VendorProfile from "./pages/Vendor/VendorProfile.js";
import VendorServices from "./pages/Vendor/VendorServices.js";
import VendorBookingHistory from "./pages/Vendor/VendorBookingHistory.js";
import VendorPendingBookings from "./pages/Vendor/VendorPendingBookings.js";
import VendorConfirmedBookings from "./pages/Vendor/VendorConfirmedBookings.js";
import VendorCancelledBookings from "./pages/Vendor/VendorCancelledBookings.js";



function App() {
  const { loggedIn, role } = useSelector((state) => state.user);

  return (
    <Provider store={store}>
      <NotificationContainer />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home page route */}
            <Route path="/venues" element={<Venues />} /> {/* Venues page route */}
            <Route path="/catering" element={<Caterings />} /> {/* Venues page route */}
            <Route path="/photography" element={<Photography />} /> {/* Venues page route */}
            <Route path="/decor" element={<Decor />} /> {/* Venues page route */}
            <Route path="/services" element={<Services />} />
            <Route path="/services1" element={<Services1 />} />
          
          <Route path="/pages/test.js" element={<Test />} />
            <Route path="/signup" element={<SignUp />} /> 
            <Route path="/login" element={<Login />} /> 


      {/* Vendor routes */}
            <Route path="/vendordashboard" element={<VendorDashboardPage />} />
            <Route path="/vendorprofile" element={<VendorProfile />} />
            <Route path="/vendorservices" element={<VendorServices />} />
            <Route path="/allbookings" element={<VendorBookingHistory />} />
            <Route path="/pendingbookings" element={<VendorPendingBookings />} />
            <Route path="/confirmedbookings" element={<VendorConfirmedBookings />} />
            <Route path="/cancelledbookings" element={<VendorCancelledBookings />} />

      {/* {loggedIn && role === 'vendor' && (
        <Route path="/vendordashboard" element={<VendorDashboardPage />} />
      )} */}
       

      {/* Admin routes */}
      {loggedIn && role === 'admin' && (
        <Route path="/adminhome" element={<AdminHome />} />
      )}

     
            
            {/* Add other routes as needed */}
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;


