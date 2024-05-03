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
import Booking from "./pages/BookingPage.js";
import Team from "./pages/TeamPage.js";
import Services from "./pages/ServicesPage.js";
import Room from "./pages/RoomPage.js";
import Venues from "./pages/VenuePage.js";
import Catering from "./pages/CateringPage.js";
import Photography from "./pages/PhotographyPage.js";
import Decor from "./pages/DecorPage.js";
import Footer from "./common/Footer";

function App() {
  const [data, setData] = useState({
    role:"",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
  });

  const [user, setUser] = useState({ loggedIn: false, token: "" });

  const createCard = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/bank/createCard",
        method: "post",
        data: { email: data.email },
      
      });
      window.alert(res.data.msg);
    } catch (e) {
      window.alert("ERROR");
    }
  };

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />      x
          <Route path="/booking" element={<Booking />} />
          <Route path="/team" element={<Team />} />
          <Route path="/services" element={<Services />} />
          <Route path="/rooms" element={<Room />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/catering" element={<Catering />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/decor" element={<Decor />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


