import "./App.css";
import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import axios from "axios";
import SignUp from "./SignUp";
import Login from "./Login";
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
import { Provider } from 'react-redux';
import store from './redux/store'; // Import the Redux store
import Venues from './pages/Venues.js'; // Import your Venues component
import Caterings from './pages/Catering.js'; 
import Photography from './pages/Photography.js'; 
import Decor from './pages/Decor.js'; 
import Services1 from "./pages/Services.js";



function App() {
  return (
    <Provider store={store}>
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

            
            {/* Add other routes as needed */}
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;


