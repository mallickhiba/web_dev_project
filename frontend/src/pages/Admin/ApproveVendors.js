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
  Button,
  Typography,
} from "@mui/material";
import AdminSidebar from '../Admin/components/AdminSidebar';
import axios from "axios";
import { setVendors } from "../../redux//adminVendorSlice";
import SearchIcon from '@mui/icons-material/Search';
import VendorCard from "./components/VendorCard";
import VendorEditModal from "./components/VendorEditModal";
import AddVendorForm from "./components/AddVendorForm";
import DeleteVendorDialog from "./components/DeleteVendorDialog";

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

const AdminVendors = () => {
  const dispatch = useDispatch();
  const vendors = useSelector((state) => state.adminVendors.vendors);
  const token = useSelector((state) => state.user.token);

  const [page, setPage] = useState(1);
  const vendorsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddVendorForm, setOpenAddVendorForm] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        console.log("Fetching vendors...");
        const response = await axios.get("http://localhost:5600/admin/vendors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Vendor details:", response.data.vendors);
        dispatch(setVendors(response.data.vendors));
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
    return vendors.filter(vendor => {
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
  const currentVendors = searchQuery ? handleSearch() : vendors.slice(indexOfFirstVendor, indexOfLastVendor);

  const handleEditVendor = (id) => {
    const vendor = vendors.find(vendor => vendor._id === id);

    if (vendor) {
      setSelectedVendor(vendor);
      setOpenEditModal(true);
    }
  };

  const handleDeleteVendor = (id) => {
    setSelectedVendorId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDeleteVendor = () => {
    console.log("Deleting vendor with ID:", selectedVendorId);
    setOpenDeleteDialog(false);
  };

  const handleAddVendor = () => {
    setShowHeader(false);
    setOpenAddVendorForm(true);
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={3}>
          <AdminSidebar active={2} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box mb={3} mt={5}>
            {showHeader && (
              <Typography variant="h4">Find your listed Vendors</Typography>
            )}
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
              <Box ml="auto" mr={3}>
                <Button variant="contained" color="primary" onClick={handleAddVendor}>Add new Vendor</Button>
              </Box>
            </Box>
         
          )}
          <Box mx={3} mb={3} mt={3}>
            {!openAddVendorForm && !showHeader && (
             setShowHeader(true)
            )}
            {openAddVendorForm ? (
              <AddVendorForm setOpenAddVendorForm={setOpenAddVendorForm} />
            ) : (
              <>
                {currentVendors.map((vendor) => (
                  <VendorCard
                    key={vendor._id}
                    vendor={vendor}
                    onEdit={handleEditVendor}
                    onDelete={handleDeleteVendor}
                  />
                ))}
                <Box mt={3} display="flex" justifyContent="center">
                  <Pagination
                    count={Math.ceil(vendors.length / vendorsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                  />
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
      <VendorEditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        vendor={selectedVendor}
      />
      <DeleteVendorDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDeleteVendor}
        vendorId={selectedVendorId}
        token={token}
      />
    </Container>
  );
};

export default AdminVendors;