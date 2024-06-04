import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector from react-redux
import { navList } from "../data/Data";
import icon from "./favicon.ico"; // Adjust the path to where your icon is saved

export default function Header() {
  const [navbarCollapse, setNavbarCollapse] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  
  // Use Redux selectors to access token and user role
  const token = useSelector((state) => state.user.token);
  const userRole = useSelector((state) => state.user.role);

  const handleMouseEnter = (itemId) => {
    setActiveDropdown(itemId);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleProfileClick = () => {
    if (token) {
      navigate(userRole === "customer" ? "/customerprofile" : "/vendorprofile");
    } else {
      alert("Please log in or sign up to access your profile.");
    }
  };

  return (
    <>
      <div className="container-fluid bg-dark px-0">
        <div className="row gx-0">
          <div className="col-lg-3 bg-dark d-none d-lg-block">
            <Link
              to="/"
              className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center"
            >
              <img src={icon} alt="Icon" style={{ width: 50, height: 50, marginRight: 10 }} />
              <h3 className="m-0 text" style={{ color: "#dab61e" }}>Shadiyana</h3>
            </Link>
          </div>
          <div className="col-lg-9">
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark p-3 p-lg-0">
              <Link to="/" className="navbar-brand d-block d-lg-none">
              <h3 className="m-0 text" style={{ color: "#dab61e" }}>Shadiyana</h3>
              </Link>
              <button
                type="button"
                className="navbar-toggler"
                onClick={() => setNavbarCollapse(!navbarCollapse)}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className={
                  navbarCollapse
                    ? "navbar-collapse justify-content-around navbarCollapse"
                    : "collapse navbar-collapse justify-content-around"
                }
              >
                <div className="navbar-nav mr-auto py-0">
                  {navList.map((item, index) => (
                    <div key={index}>
                      {item.subItems ? (
                        <div
                          className="nav-item dropdown"
                          onMouseEnter={() => handleMouseEnter(item.id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <Link className="nav-link dropdown-toggle">
                            {item.text}
                          </Link>
                          <div
                            className={`dropdown-menu rounded-0 m-0 ${
                              activeDropdown === item.id ? "show" : ""
                            }`}
                          >
                            {item.subItems.map((sub) => (
                              <Link key={sub.path} to={sub.path} className="dropdown-item">
                                {sub.text}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link key={item.path} to={item.path} className="nav-item nav-link">
                          {item.text}
                        </Link>
                      )}
                    </div>
                  ))}
                  <Link
                    to={token ? (userRole === "customer" ? "/customerprofile" : "/vendorprofile") : "/"}
                    className="nav-item nav-link bg-transparent border-0"
                    style={{ color: "#fff" }}
                    onClick={handleProfileClick}
                  >
                    Profile
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
