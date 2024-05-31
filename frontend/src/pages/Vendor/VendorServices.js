// VendorServices.js
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
} from "@mui/material";
import DashboardSidebar from "../../common/DashboardSidebar";
import axios from "axios";
import { setServices } from "../../redux/vendorServiceSlice";
import SearchIcon from '@mui/icons-material/Search';
import ServiceCard from "./components/ServiceCard";
import ServiceEditModal from "./components/ServiceEditModal";
import AddServiceForm from "./components/AddServiceForm";
import DeleteServiceDialog from "./components/DeleteServiceDialog"; // Import the DeleteServiceDialog component

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

const VendorServices = () => {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.vendorServices.services);
  const token = useSelector((state) => state.user.token);

  const [page, setPage] = useState(1);
  const servicesPerPage = 5;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(null); // Track the ID of the selected service for deletion
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State to control the delete dialog
  const [selectedService, setSelectedService] = useState(null); // Track the selected service for editing
  const [openEditModal, setOpenEditModal] = useState(false); // State to control the edit modal
  const [openAddServiceForm, setOpenAddServiceForm] = useState(false); // State to control the add service form

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log("Fetching services...");
        const response = await axios.get("http://localhost:5600/services/servicesbyVendor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Service details:", response.data.services);
        dispatch(setServices(response.data.services));
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, [dispatch, token]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = () => {
    return services.filter(service => {
      const serviceName = service.service_name.toLowerCase();
      const query = searchQuery.toLowerCase();
      return serviceName.includes(query);
    });
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const indexOfLastService = page * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = searchQuery ? handleSearch() : services.slice(indexOfFirstService, indexOfLastService);

  const handleEditService = (id) => {
    const service = services.find(service => service._id === id);

    if (service) {
      setSelectedService(service);
      setOpenEditModal(true);
    }
  };

  const handleDeleteService = (id) => {
    setSelectedServiceId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDeleteService = () => {
    // Perform delete service action here
    console.log("Deleting service with ID:", selectedServiceId);
    // Call your delete service API or Redux action here
    setOpenDeleteDialog(false);
  };

  const handleAddService = () => {
    setOpenAddServiceForm(true);
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={3}>
          <DashboardSidebar active={2} />
        </Grid>
        <Grid item xs={12} md={9}>
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
          <Box mx={4} my={4}>
            {!openAddServiceForm && (
              <Button variant="contained" color="primary" onClick={handleAddService}>Add Service</Button>
            )}
            {openAddServiceForm ? (
              <AddServiceForm setOpenAddServiceForm={setOpenAddServiceForm} />
            ) : (
              <>
                {currentServices.map((service) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService} // Pass the delete function
                  />
                ))}
                <Pagination
                  count={Math.ceil(services.length / servicesPerPage)}
                  page={page}
                  onChange={handlePageChange}
                />
              </>
            )}
          </Box>
        </Grid>
      </Grid>
      {/* Render the edit modal */}
      <ServiceEditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        service={selectedService}
      />
      {/* Render the delete dialog */}
      <DeleteServiceDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDeleteService}
        serviceId={selectedServiceId} // Pass the selected service ID
        token={token} // Pass the token
      />
    </Container>
  );
};

export default VendorServices;
