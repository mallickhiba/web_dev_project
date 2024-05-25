import React from 'react';
import { Checkbox, FormControlLabel, TextField, Grid, FormGroup, FormControl, InputLabel, Select, MenuItem, FormLabel, Button } from '@mui/material';

const FilterPanel = ({ serviceType, handleFilterChange, handleApplyFilters, handleSortChange, sort }) => {
  const serviceConfig = {
    venue: {
      fields: {
        city: ['Karachi', 'Islamabad', 'Lahore'],
        area: ['Saddar', 'Gulshan-e-Iqbal', 'DHA', 'North Nazimabad', 'Other'],
        cancellation_policy: ['Flexible', 'Moderate', 'Strict'],
        staff: ['Male', 'Female'],
        capacity: true, // Add capacity only for venues
        price: true, // Add price for all service types
      }
    },
    decor: {
      fields: ['city', 'area', 'price', 'cancellation_policy', 'staff', 'decortype'],
      labels: {
        city: 'City',
        area: 'Area',
        price: 'Price',
        cancellation_policy: 'Cancellation Policy',
        staff: 'Staff',
        decortype: 'Decor Type'
      },
      options: {
        decortype: ['wedding', 'birthday party', 'anniversary', 'formal events']
      }
    },
    photography: {
      fields: ['city', 'area', 'price', 'cancellation_policy', 'staff', 'drone'],
      labels: {
        city: 'City',
        area: 'Area',
        price: 'Price',
        cancellation_policy: 'Cancellation Policy',
        staff: 'Staff',
        drone: 'Drone'
      },    
      options: {}
    },
    catering: {
        fields: {
          city: ['Karachi', 'Islamabad', 'Lahore'],
          area: ['Saddar', 'Gulshan-e-Iqbal', 'DHA', 'North Nazimabad', 'Other'],
          cancellation_policy: ['Flexible', 'Moderate', 'Strict'],
          staff: ['Male', 'Female'],
          capacity: true, // Add capacity only for venues
          price: true, // Add price for all service types
        }
      },
  };

  const config = serviceConfig[serviceType];

  return (
    <div className="filter-container">
      <div className="filter-panel">
        {Object.keys(config.fields).map((field) => (
          <FormControl key={field} component="fieldset">
            <FormGroup>
              <FormLabel component="legend">{field}</FormLabel>
              {field === 'capacity' && serviceType === 'venue' ? (
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Min"
                      name={`${field}Min`}
                      type="number"
                      onChange={handleFilterChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Max"
                      name={`${field}Max`}
                      type="number"
                      onChange={handleFilterChange}
                    />
                  </Grid>
                </Grid>
              ) : field === 'price' ? (
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Min"
                      name={`${field}Min`}
                      type="number"
                      onChange={handleFilterChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Max"
                      name={`${field}Max`}
                      type="number"
                      onChange={handleFilterChange}
                    />
                  </Grid>
                </Grid>
              ) : Array.isArray(config.fields[field]) ? (
                config.fields[field].map((option) => (
                  <FormControlLabel
                    key={option}
                    control={<Checkbox name={field} value={option} onChange={handleFilterChange} />}
                    label={option}
                  />
                ))
              ) : null}
            </FormGroup>
          </FormControl>
        ))}
        <Button variant="contained" color="primary" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
      <div className="sort-panel">
        <FormControl fullWidth margin="normal">
          <InputLabel>Sort By</InputLabel>
          <Select value={sort} onChange={handleSortChange}>
            <MenuItem value="average_rating">Average Rating</MenuItem>
            <MenuItem value="start_price">Price (Low to High)</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default FilterPanel;
