import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCaterings,
  addToFavorites,
  removeFromFavorites,
} from "../../redux/serviceActions.js";
import CommonHeading from "../../common/CommonHeading";
import Heading from "../../common/Heading";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import ServiceCard from "./ServiceCard.js";
import FilterPanel from "./FilterPanel.js";
import { Grid } from "@mui/material";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

const Caterings = () => {
  const dispatch = useDispatch();

  const { caterings, loading, error, favorites } = useSelector(
    (state) => state.caterings
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
      fetchCaterings({ page, limit, search, sort, filters: appliedFilters })
    );
  }, [dispatch, page, limit, search, sort, appliedFilters]);

  const handleAddToFavorites = (serviceId) => {
    dispatch(addToFavorites(serviceId));
  };

  const handleRemoveFromFavorites = (serviceId) => {
    dispatch(removeFromFavorites(serviceId));
  };

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "capacityMin" || name === "capacityMax") {
      const min = name === "capacityMin" ? value : filters.capacityMin;
      const max = name === "capacityMax" ? value : filters.capacityMax;
      const range = `${min}-${max}`;
      setFilters((prevFilters) => ({
        ...prevFilters,
        capacityMin: min,
        capacityMax: max,
        capacity: range,
      }));
    } else if (name === "priceMin" || name === "priceMax") {
      const min = name === "priceMin" ? value : filters.priceMin;
      const max = name === "priceMax" ? value : filters.priceMax;
      const range = `${min}-${max}`;
      setFilters((prevFilters) => ({
        ...prevFilters,
        priceMin: min,
        priceMax: max,
        start_price: range,
      }));
    } else {
      if (!checked) {
        const updatedFilters = { ...filters };
        delete updatedFilters[name];
        setFilters(updatedFilters);
      } else {
        setFilters((prevFilters) => ({
          ...prevFilters,
          [name]: value ?? checked,
        }));
      }
    }
  };

  const handleApplyFilters = () => {
    if (Object.keys(filters).length === 0) {
      setAppliedFilters({});
    } else {
      setAppliedFilters(filters);
    }
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  return (
    <div>
      <Header />
      <Heading heading="Catering" title="Home" subtitle="Catering" />
      <div className="container-xxl py-5">
        <div className="container">
          <CommonHeading
            heading="Our Catering"
            title="Catering"
            subtitle="Explore Our"
          />
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <FilterPanel
                serviceType="catering"
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
                {Array.isArray(caterings) &&
                  caterings.map((service) => (
                    <ServiceCard
                      key={service._id}
                      service={service}
                      onAddToFavorites={handleAddToFavorites}
                      onRemoveFromFavorites={handleRemoveFromFavorites}
                      isFavorite={favorites.includes(service._id)}
                    />
                  ))}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <Footer />
      <NotificationContainer />
    </div>
  );
};

export default Caterings;
