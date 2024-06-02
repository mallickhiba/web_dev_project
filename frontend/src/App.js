import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import SignUp from "./pages/Auth/SignupPage.js";
import Login from "./pages/Auth/LoginPage.js";
import "./css/style.css";
import "./css/bootstrap.min.css";
import "./css/animate.css";
import "./css/animate.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import Home from "./home/Homes.js";
import Services from "./pages/Services/Services.js";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store"; // Import the Redux store
import AdminHome from "./pages/Admin/AdminHome.js"; 
import UserManagement from "./pages/Admin/UserManagement.js";
import ApproveVendors from "./pages/Admin/ApproveVendors.js";
import BookingManagement from "./pages/Admin/BookingManagement.js";
import ReviewManagement from "./pages/Admin/ReviewManagement.js";
import Venues from "./pages/Services/Venues.js"; // Import your Venues component
import Caterings from "./pages/Services/Catering.js";
import Photography from "./pages/Services/Photography.js";
import Decor from "./pages/Services/Decor.js";
//import Services1 from "./pages/Services/Services.js";
import ServiceDetail from "./pages/Services/ServiceDetail.js";
import VendorDashboardPage from "./pages/Vendor/VendorDashboardPage.js";
import VendorProfile from "./pages/Vendor/VendorProfile.js";
import VendorServices from "./pages/Vendor/VendorServices.js";
import VendorBookings from "./pages/Vendor/VendorBookings.js";
import VendorList from "./pages/Admin/VendorList.js"

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
            <Route path="/servicedetail" component={<ServiceDetail />} />
            <Route path="/service/:id" element={<ServiceDetail />} />  
            <Route path="/signup" element={<SignUp />} /> 
            <Route path="/login" element={<Login />} /> 

        {loggedIn && role === 'vendor' && (
        <Route path="/vendordashboard" element={<VendorDashboardPage />} />
          )}
       
       {loggedIn && role === 'vendor' && (
            <Route path="/vendorprofile" element={<VendorProfile />} />
          )}      
      {loggedIn && role === 'vendor' && (
            <Route path="/vendorservices" element={<VendorServices />} />
          )}
         
      {loggedIn && role === 'vendor' && (
            <Route path="/vendorbookings" element={<VendorBookings />} />
          )}

      {loggedIn && role === 'admin' && (
            <Route path="/adminhome" element={<AdminHome />} />
          )}
       {loggedIn && role === 'admin' && (
            <Route path="/user-management" element={<UserManagement />} />
          )}
        {loggedIn && role === 'admin' && (
           <Route path="/approve-vendors" element={<ApproveVendors />} />
          )}
        {loggedIn && role === 'admin' && (
           <Route path="/booking-management" element={<BookingManagement />} />            
          )}
        {loggedIn && role === 'admin' && (      
           <Route path="/review-management" element={<ReviewManagement />} />
          )}
          
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;