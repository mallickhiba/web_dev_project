import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchVenues,
  addToFavorites,
  removeFromFavorites,
  bookVenue,
} from "../../redux/serviceActions.js";
import { Link } from "react-router-dom";
import CommonHeading from "../../common/CommonHeading.jsx";
import Heading from "../../common/Heading.jsx";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import ServiceCard from "./ServiceCard.js"; // Import the ServiceCard component
import FilterPanel from "./FilterPanel.js"; // Import the FilterPanel component
import { Grid,Pagination } from "@mui/material";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

const Venues = () => {
  const dispatch = useDispatch();
  const { venues, loading, error, favorites } = useSelector(
    (state) => state.venues
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("average_rating");
  const [filters, setFilters] = useState({
    capacity: "", // Initialize capacity to an empty string
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    dispatch(
      fetchVenues({ page, limit, search, sort, filters: appliedFilters })
    );
  }, [dispatch, page, limit, search, sort, appliedFilters]);

  const handleAddToFavorites = (serviceId) => {
    dispatch(addToFavorites(serviceId));
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRemoveFromFavorites = (serviceId) => {
    dispatch(removeFromFavorites(serviceId));
  };
  const handleBookVenue = (serviceId) => {
    const date = "2024-06-01"; // Example date
    const customer = "customerId123"; // Replace with actual customer ID
    dispatch(bookVenue({ date, service: serviceId, customer }));
  };

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;

    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (name === "capacityMin" || name === "capacityMax") {
        const min = name === "capacityMin" ? value : prevFilters.capacityMin;
        const max = name === "capacityMax" ? value : prevFilters.capacityMax;
        const range = `${min}-${max}`;
        return {
          ...prevFilters,
          capacityMin: min,
          capacityMax: max,
          capacity: range,
        };
      } else if (name === "priceMin" || name === "priceMax") {
        const min = name === "priceMin" ? value : prevFilters.priceMin;
        const max = name === "priceMax" ? value : prevFilters.priceMax;
        const range = `${min}-${max}`;
        return {
          ...prevFilters,
          priceMin: min,
          priceMax: max,
          start_price: range,
        };
      } else {
        if (checked) {
          if (!updatedFilters[name]) {
            updatedFilters[name] = [];
          }
          updatedFilters[name].push(value);
        } else {
          if (updatedFilters[name]) {
            updatedFilters[name] = updatedFilters[name].filter(
              (val) => val !== value
            );
            if (updatedFilters[name].length === 0) {
              delete updatedFilters[name];
            }
          }
        }
        return updatedFilters;
      }
    });
  };

  const handleApplyFilters = () => {
    const formattedFilters = {};

    Object.keys(filters).forEach((key) => {
      if (Array.isArray(filters[key])) {
        formattedFilters[key] = filters[key].join(",");
      } else {
        formattedFilters[key] = filters[key];
      }
    });

    setAppliedFilters(formattedFilters);
  };


  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  return (
    <div>
      <Header />
      <Heading heading="Venues" title="Home" subtitle="Venues" />
      <div className="container-xxl py-5">
        <div className="container">
          <CommonHeading
            heading="Our Venues"
            title="Venues"
            subtitle="Explore Our"
          />
          <Grid container spacing={4}>
            <Grid item xs={3}>
              {/* Render the FilterPanel with serviceType="venue" */}
              <FilterPanel
                serviceType="venue"
                handleFilterChange={handleFilterChange}
                handleApplyFilters={handleApplyFilters}
                handleSortChange={handleSortChange}
              />
            </Grid>
            <Grid item xs={9}>
              <div className="row g-4">
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {venues.map((service) => (
                  
                    <ServiceCard
                       key={service._id}
                       service={service}
                      onAddToFavorites={handleAddToFavorites}
                      onRemoveFromFavorites={handleRemoveFromFavorites}
                      isFavorite={favorites.includes(service._id)}
                    />
                
                ))}
              </div>
              <Pagination
                count={Math.ceil(venues / limit)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                
                style={{ marginTop: "20px" }}
              />
            </Grid>
          </Grid>
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default Venues;
