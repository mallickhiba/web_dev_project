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
import Venues from "./pages/VenuePage.js";
import Catering from "./pages/CateringPage.js";
import Photography from "./pages/PhotographyPage.js";
import Decor from "./pages/DecorPage.js";
import Footer from "./common/Footer";
import Test from "./pages/test.js";
import { Provider, useSelector } from 'react-redux';
import store from './redux/store'; // Import the Redux store
import Venues1 from './pages/Venues.js'; // Import your Venues component
import Caterings1 from './pages/Catering.js'; 
import VendorHome from './pages/VendorHome';
import AdminHome from './pages/AdminHome';


function App() {
  const { loggedIn, role } = useSelector((state) => state.user);

  return (
    <Provider store={store}>
      <NotificationContainer />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home page route */}
            <Route path="/venues1" element={<Venues1 />} /> {/* Venues page route */}
            <Route path="/catering1" element={<Caterings1 />} /> 
            <Route path="/signup" element={<SignUp />} /> 
            <Route path="/login" element={<Login />} /> 

      {/* Vendor routes */}
      {loggedIn && role === 'vendor' && (
        <Route path="/vendorhome" element={<VendorHome />} />
      )}

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


