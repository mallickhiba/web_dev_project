import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFromFavorites } from '../../redux/serviceActions'; // Adjust the import path as necessary
import {
  fetchCaterings,
  addToFavorites,
  removeFromFavorites,
} from "../../redux/serviceActions.js";
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ServiceCard from '../Services/ServiceCard'; // Adjust the import path as necessary

const Favorites = () => {
  const dispatch = useDispatch();
  const { favorites, loading, error } = useSelector(state => state.services);

  useEffect(() => {
    dispatch(getFromFavorites());
  }, [dispatch]);

  const handleAddToFavorites = (serviceId) => {
    dispatch(addToFavorites(serviceId));
  };

  const handleRemoveFromFavorites = (serviceId) => {
    dispatch(removeFromFavorites(serviceId));
  };

  const handleBookVenue = (id) => {
    // Add your logic to handle booking a venue
  };

  return (
    <div>
      <h1>Favorite Services</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && Array.isArray(favorites) && (
        <div className="row">
          {favorites.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onAddToFavorites={handleAddToFavorites}
              onRemoveFromFavorites={handleRemoveFromFavorites}
              isFavorite={true}
              onBookVenue={handleBookVenue}
            />
          ))}
        </div>
      )}
      <NotificationContainer />
    </div>
  );
};



export default Favorites;
