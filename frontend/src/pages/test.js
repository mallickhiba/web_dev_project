import React from "react";

export default function Services1() {
  // Retrieve the stored API response data from sessionStorage
  const serviceResponse = JSON.parse(sessionStorage.getItem("serviceResponse"));

  return (
    <div className="container">
      <h3>Services Page</h3>
      {serviceResponse ? (
        <div>
          <h3>Search Results:</h3>
          <pre>{JSON.stringify(serviceResponse, null, 2)}</pre>
        </div>
      ) : (
        <p>No search results available.</p>
      )}
    </div>
  );
}