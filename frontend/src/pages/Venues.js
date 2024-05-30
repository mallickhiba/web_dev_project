import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVenues, addToFavorites, bookVenue } from '../redux/serviceActions.js';
import CommonHeading from '../common/CommonHeading';
import Heading from '../common/Heading';
import Header from "../common/Header";
import Footer from "../common/Footer";
import ServiceCard from './ServiceCard.js'; // Import the ServiceCard component
import FilterPanel from './FilterPanel'; // Import the FilterPanel component
import { Grid } from '@mui/material';

const Venues = () => {
  const dispatch = useDispatch();
  const { venues, loading, error, favorites } = useSelector((state) => state.venues);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('average_rating');
  const [filters, setFilters] = useState({
    capacity: '', // Initialize capacity to an empty string
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    dispatch(fetchVenues({ page, limit, search, sort, filters: appliedFilters }));
  }, [dispatch, page, limit, search, sort, appliedFilters]);

  const handleAddToFavorites = (serviceId) => {
    dispatch(addToFavorites(serviceId));
  };

  const handleBookVenue = (serviceId) => {
    const date = '2024-06-01'; // Example date
    const customer = 'customerId123'; // Replace with actual customer ID
    dispatch(bookVenue({ date, service: serviceId, customer }));
  };

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'capacityMin' || name === 'capacityMax') {
      const min = name === 'capacityMin' ? value : filters.capacityMin;
      const max = name === 'capacityMax' ? value : filters.capacityMax;
      const range = `${min}-${max}`;
      setFilters((prevFilters) => ({
        ...prevFilters,
        capacityMin: min,
        capacityMax: max,
        capacity: range,
      }));
    } else if (name === 'priceMin' || name === 'priceMax') {
      const min = name === 'priceMin' ? value : filters.priceMin;
      const max = name === 'priceMax' ? value : filters.priceMax;
      const range = `${min}-${max}`;
      setFilters((prevFilters) => ({
        ...prevFilters,
        priceMin: min,
        priceMax: max,
        start_price: range, // Update to start_price if both min and max are set
      }));
    } else {
      // If checkbox is unchecked, remove it from filters
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
    // Check if any filters are present
    if (Object.keys(filters).length === 0) {
      // If no filters, fetch all data by setting appliedFilters to an empty object
      setAppliedFilters({});
    } else {
      // If filters are present, apply them
      setAppliedFilters(filters);
    }
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
          <CommonHeading heading="Our Venues" title="Venues" subtitle="Explore Our" />
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
                    onBookVenue={handleBookVenue}
                  />
                ))}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
     
    </div>
  );
};

export default Venues;
