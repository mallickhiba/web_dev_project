import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Container,
  Pagination,
  styled,
  InputBase,
  alpha,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import AdminSidebar from './components/AdminSidebar';
import axios from "axios";
import { setVendors } from "../../redux/adminVendorSlice";
import SearchIcon from '@mui/icons-material/Search';
import VendorCard from "./components/VendorCard";
import VendorEditModal from "./components/VendorEditModal";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const ApproveVendors = () => {
  const dispatch = useDispatch();
  const allVendors = useSelector((state) => state.adminVendors.vendors);
  const token = useSelector((state) => state.user.token);

  const [page, setPage] = useState(1);
  const vendorsPerPage = 20;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        console.log("Fetching vendors...");
        const response = await axios.get("http://localhost:5600/admin/vendors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Vendor details:", response.data);
        dispatch(setVendors(response.data));
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };
    fetchVendors();
  }, [dispatch, token]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = () => {
    return allVendors.filter(vendor => {
      const email = vendor.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      return email.includes(query);
    });
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const indexOfLastVendor = page * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;

  const handleEditVendor = (id) => {
    const vendor = allVendors.find(vendor => vendor._id === id);

    if (vendor) {
      setSelectedVendor(vendor);
      setOpenEditModal(true);
    }
  };


  const approvedVendors = allVendors.filter(vendor => vendor.approved);
  const pendingVendors = allVendors.filter(vendor => !vendor.approved);

  const currentAllVendors = searchQuery ? handleSearch() : allVendors.slice(indexOfFirstVendor, indexOfLastVendor);
  const currentApprovedVendors = searchQuery ? handleSearch() : approvedVendors.slice(indexOfFirstVendor, indexOfLastVendor);
  const currentPendingVendors = searchQuery ? handleSearch() : pendingVendors.slice(indexOfFirstVendor, indexOfLastVendor);

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={3}>
          <AdminSidebar active={3} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box mb={3} mt={5}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="All Vendors" />
              <Tab label="Approved Vendors" />
              <Tab label="Pending Vendors" />
            </Tabs>
          </Box>
          {showHeader && (
            <Box mb={3} ml={3} display="flex" alignItems="center">
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
              </Search>
            </Box>
          )}
          {value === 0 && ( // Display All Vendors tab content
            <>
              <Grid container spacing={3}>
                {currentAllVendors.map((vendor) => (
                  <Grid item xs={12} sm={6} md={4} key={vendor._id}>
                    <VendorCard
                      vendor={vendor}
                      onEdit={handleEditVendor}
                    />
                  </Grid>
                ))}
              </Grid>
              <Pagination
                count={Math.ceil(allVendors.length / vendorsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                style={{ marginTop: '20px', marginBottom: '20px' }}
              />
            </>
          )}
          {value === 1 && ( // Display Approved Vendors tab content
            <>
              <Grid container spacing={3}>
                {currentApprovedVendors.map((vendor) => (
                  <Grid item xs={12} sm={6} md={4} key={vendor._id}>
                    <VendorCard
                      vendor={vendor}
                      onEdit={handleEditVendor}
                    />
                  </Grid>
                ))}
              </Grid>
              <Pagination
                count={Math.ceil(approvedVendors.length / vendorsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                style={{ marginTop: '20px', marginBottom: '20px' }}
              />
            </>
          )}
          {value === 2 && ( // Display Pending Vendors tab content
            <>
              <Grid container spacing={3}>
                {currentPendingVendors.map((vendor) => (
                  <Grid item xs={12} sm={6} md={4} key={vendor._id}>
                    <VendorCard
                      vendor={vendor}
                      onEdit={handleEditVendor}
                    />
                  </Grid>
                ))}
              </Grid>
              <Pagination
                count={Math.ceil(pendingVendors.length / vendorsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                style={{ marginTop: '20px', marginBottom: '20px' }}
              />
            </>
          )}
        </Grid>
      </Grid>
      <VendorEditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        vendor={selectedVendor}
      />
    
    </Container>
  );
};

export default ApproveVendors;
