import * as React from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const Packagesdropdown = ({ packages, onPackageChange }) => {
  const [selectedPackage, setSelectedPackage] = React.useState('');

  const handleChange = (event) => {
    setSelectedPackage(event.target.value);
    onPackageChange(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="packages-select-label">Select Package</InputLabel>
      <Select
        labelId="packages-select-label"
        id="packages-select"
        value={selectedPackage}
        label="Select Package"
        onChange={handleChange}
      >
        {packages.map((packageItem) => (
          <MenuItem key={packageItem._id} value={packageItem.name}>
            {packageItem.name} - ${packageItem.price}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

Packagesdropdown.propTypes = {
  packages: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  onPackageChange: PropTypes.func.isRequired,
};

export default Packagesdropdown;
