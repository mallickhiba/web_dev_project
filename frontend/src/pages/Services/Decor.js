import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDecors,
  addToFavorites,
  removeFromFavorites,
  bookVenue,
} from "../../redux/serviceActions.js";
import CommonHeading from "../../common/CommonHeading";
import Heading from "../../common/Heading";
import Header from "../../common/Header";
import ServiceCard from "./ServiceCard.js"; // Import the ServiceCard component
import FilterPanel from "./FilterPanel.js"; // Import the FilterPanel component
import { Grid,Pagination } from "@mui/material";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

const Decors = () => {
  const dispatch = useDispatch();
  const { decors, loading, error, favorites } = useSelector(
    (state) => state.decors
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
      fetchDecors({ page, limit, search, sort, filters: appliedFilters })
    );
  }, [dispatch, page, limit, search, sort, appliedFilters]);

  const handleAddToFavorites = (serviceId) => {
    dispatch(addToFavorites(serviceId));
  };

  const handleRemoveFromFavorites = (serviceId) => {
    dispatch(removeFromFavorites(serviceId));
  };
  const handlePageChange = (event, value) => {
    setPage(value);
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

  console.log(decors);

  return (
    <div>
      <Header />
      <Heading heading="Decor" title="Home" subtitle="Decor" />
      <div className="container-xxl py-5">
        <div className="container">
          <CommonHeading
            heading="Our Decor"
            title="Decor"
            subtitle="Explore Our"
          />
          <Grid container spacing={4}>
            <Grid item xs={3}>
              {/* Render the FilterPanel with serviceType="venue" */}
              <FilterPanel
                serviceType="decor"
                handleFilterChange={handleFilterChange}
                handleApplyFilters={handleApplyFilters}
                handleSortChange={handleSortChange}
                sort={sort}
              />
            </Grid>
            <Grid item xs={9}>
              <div className="row g-4">
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {Array.isArray(decors) &&
                  decors.map((service) => (
                    <ServiceCard
                      key={service._id}
                      service={service}
                      onAddToFavorites={handleAddToFavorites}
                      onRemoveFromFavorites={handleRemoveFromFavorites}
                      isFavorite={favorites.includes(service._id)}
                      onBookVenue={handleBookVenue}
                    />
                  ))}
              </div>
              <Pagination
                count={Math.ceil(decors / limit)}
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

export default Decors;
