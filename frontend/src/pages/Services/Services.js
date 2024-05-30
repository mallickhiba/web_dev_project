import React from 'react';
import ServiceCard from './ServiceCard';

export default function Services() {
  // Retrieve the stored API response data from sessionStorage
  const serviceResponse = JSON.parse(sessionStorage.getItem("serviceResponse"));

  const handleAddToFavorites = (serviceId) => {
    // Implement the logic to add the service to favorites
    console.log(`Add to favorites: ${serviceId}`);
  };

  const handleBookVenue = (serviceId) => {
    // Implement the logic to book the service
    console.log(`Book venue: ${serviceId}`);
  };

  return (
    <div className="container">
      <h3>Services Page</h3>
      {serviceResponse && serviceResponse.data ? (
        <div className="row">
          {serviceResponse.data.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onAddToFavorites={handleAddToFavorites}
              onBookVenue={handleBookVenue}
            />
          ))}
        </div>
      ) : (
        <p>No search results available.</p>
      )}
    </div>
  );
}
