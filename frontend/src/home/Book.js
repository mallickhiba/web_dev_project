import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Book() {
  const navigate = useNavigate();
  const [serviceName, setServiceName] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.post("http://localhost:5600/services/getbyservicename", {
        serviceName: serviceName
      });
      console.log("API Response:", response.data);

      // Store the API response data in sessionStorage
      sessionStorage.setItem("serviceResponse", JSON.stringify(response.data));

      // Redirect to services.js
      navigate("./pages/test.js");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div className="container-fluid booking pb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container">
          <div className="bg-white shadow" style={{ padding: "35px" }}>
            <div className="row g-2 justify-content-center align-items-center">
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control form-control-lg text-center"
                  style={{ width: "100%", maxWidth: "1000px" }}
                  placeholder="Search for any service"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100" onClick={handleSearch}>Search</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
