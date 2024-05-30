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
        type: ['banquet', 'outdoor', ],
        capacity: true, // Add capacity only for venues
        price: true, // Add price for all service types
      }
    },
    
    decor: {
      fields: {
        city: ['Karachi', 'Islamabad', 'Lahore'],
        area: ['Saddar', 'Gulshan-e-Iqbal', 'DHA', 'North Nazimabad', 'Other'],
        cancellation_policy: ['Flexible', 'Moderate', 'Strict'],
        staff: ['Male', 'Female'],
        type:['wedding', 'birthday party', 'anniversary', 'formal events'],
        price: true, // Add price for all service types
      }
    },
    photography: {
      fields: {
        city: ['Karachi', 'Islamabad', 'Lahore'],
        area: ['Saddar', 'Gulshan-e-Iqbal', 'DHA', 'North Nazimabad', 'Other'],
        cancellation_policy: ['Flexible', 'Moderate', 'Strict'],
        staff: ['Male', 'Female'],
        drone:['true', 'false'],
        price: true, // Add price for all service types
      }
    },
    catering: {
        fields: {
          city: ['Karachi', 'Islamabad', 'Lahore'],
          area: ['Saddar', 'Gulshan-e-Iqbal', 'DHA', 'North Nazimabad', 'Other'],
          cancellation_policy: ['Flexible', 'Moderate', 'Strict'],
          staff: ['Male', 'Female'],
          cuisine:['Pakistani', 'French','Mexican'],
          price: true, // Add price for all service types
        }
      },
  };

  const config = serviceConfig[serviceType];

  return (
    <div className="filter-container">
       <div className="sort-panel">
        <FormControl fullWidth margin="normal">
          <InputLabel>Sort By</InputLabel>
          <Select value={sort} onChange={handleSortChange}>
            <MenuItem value="average_rating">Average Rating</MenuItem>
            <MenuItem value="start_price">Price (Low to High)</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="filter-panel">
        {Object.keys(config.fields).map((field) => (
          <FormControl key={field} component="fieldset">
            <FormGroup>
              <FormLabel component="legend">{getFieldLabel(field)}</FormLabel>
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
                <Grid container spacing={1}>
                  {config.fields[field].map((option) => (
                    <Grid item xs={6} key={option}>
                      <FormControlLabel
                        control={<Checkbox name={field} value={option} onChange={handleFilterChange} />}
                        label={option}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : null}                  
             
          </FormGroup>
        </FormControl>
      ))}
      <Button variant="contained" color="primary" onClick={handleApplyFilters}>
        Apply Filters
      </Button>
    </div>
  </div>
);
};

// Function to convert field names to display labels
const getFieldLabel = (field) => {
switch (field) {
  case 'city':
    return 'City';
  case 'area':
    return 'Area';
  case 'cancellation_policy':
    return 'Cancellation Policy';
  case 'staff':
    return 'Staff';
  case 'type':
    return 'Type';
  case 'capacity':
    return 'Capacity';
  case 'price':
    return 'Price';
  case 'drone':
    return 'Drone';
  case 'cuisine':
    return 'Cuisine';
  default:
    return field;
}
};

export default FilterPanel;

