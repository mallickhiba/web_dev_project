import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFromFavorites } from '../../redux/serviceActions'; // Adjust the import path as necessary
import {
  fetchCaterings,
  addToFavorites,
  removeFromFavorites,
} from "../../redux/serviceActions.js";
import { NotificationContainer } from 'react-notifications';
import {
  Grid,
  Box,
  Typography,
} from "@mui/material";
import DashboardSidebar from "../../common/DashboardSidebar";
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

 

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <DashboardSidebar active={4} />
      </Grid>
      <Grid item xs={12} md={9}>
        <Box p={2}>
          <Typography variant="h4" gutterBottom>
            Favorite Services
          </Typography>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && Array.isArray(favorites) && (
            <Grid container spacing={2}>
              {favorites.map((service) => (
                <Grid key={service._id} item xs={12} sm={6} md={4}>
                  <ServiceCard
                    service={service}
                    onAddToFavorites={handleAddToFavorites}
                    onRemoveFromFavorites={handleRemoveFromFavorites}
                    isFavorite={true}
                    
                  />
                </Grid>
              ))}
            </Grid>
          )}
          <NotificationContainer />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Favorites;
