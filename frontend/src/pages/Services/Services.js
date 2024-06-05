import React from 'react';
import ServiceCard from './ServiceCard';
import {
  fetchCaterings,
  addToFavorites,
  removeFromFavorites,
} from "../../redux/serviceActions.js";
import { useSelector, useDispatch } from "react-redux";
import Heading from "../../common/Heading";
import Header from "../../common/Header";
import { NotificationContainer } from "react-notifications";
import CommonHeading from "../../common/CommonHeading";
import "react-notifications/lib/notifications.css";

export default function Services() {
  // Retrieve the stored API response data from sessionStorage
  const serviceResponse = JSON.parse(sessionStorage.getItem("serviceResponse"));
  const dispatch = useDispatch();

  const { services, loading, error, favorites } = useSelector(
    (state) => state.services
  );
  const handleAddToFavorites = (serviceId) => {
    dispatch(addToFavorites(serviceId));
  };

  const handleRemoveFromFavorites = (serviceId) => {
    dispatch(removeFromFavorites(serviceId));
  };

  const handleBookVenue = (serviceId) => {
    // Implement the logic to book the service
    console.log(`Book venue: ${serviceId}`);
  };

  return (
    <div>
      <Header />
      <Heading heading="Services" title="Home" subtitle="" />
      <div className="container-xxl py-5">
        <div className="container">
          <CommonHeading
            heading="Found Services"
            title="Search Results"
            subtitle=""
          /></div>
    </div>
    <div className="container">
     
      {serviceResponse && serviceResponse.data ? (
        <div className="row">
          {serviceResponse.data.map((service) => (
            <ServiceCard
            key={service._id}
                      service={service}
                      onAddToFavorites={handleAddToFavorites}
                      onRemoveFromFavorites={handleRemoveFromFavorites}
                      isFavorite={favorites.includes(service._id)}
            />
          ))}
        </div>
      ) : (
        <p>No search results available.</p>
      )}
       <NotificationContainer />
    </div>
    </div>
  );
}
