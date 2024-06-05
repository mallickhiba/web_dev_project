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
import DashboardSidebar from "../../common/DashboardSidebar";
import axios from "axios";
import { setServices } from "../../redux/vendor/vendorServiceSlice";
import SearchIcon from '@mui/icons-material/Search';
import ServiceCard from "./components/Services/ServiceCard";
import ServiceEditModal from "./components/Services/ServiceEditModal";
import AddServiceForm from "./components/Services/AddServiceForm";
import DeleteServiceDialog from "./components/Services/DeleteServiceDialog";

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
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddServiceForm, setOpenAddServiceForm] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

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
    console.log("Deleting service with ID:", selectedServiceId);
    setOpenDeleteDialog(false);
  };

  const handleAddService = () => {
    setShowHeader(false);
    setOpenAddServiceForm(true);
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={3}>
          <DashboardSidebar active={2} />
        </Grid>

        
        <Grid item xs={12} md={9}>
          <Box mb={3} mt={5}>
            {showHeader && (
              <Typography variant="h4">Find your listed services</Typography>
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
                <Button variant="contained" color="primary" onClick={handleAddService}>Add new Service</Button>
              </Box>
            </Box>
         
          )}
          <Box mx={3} mb={3} mt={3}>
            {!openAddServiceForm && !showHeader && (
             setShowHeader(true)
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
                    onDelete={handleDeleteService}
                  />
                ))}
                <Box mt={3} display="flex" justifyContent="center">
                  <Pagination
                    count={Math.ceil(services.length / servicesPerPage)}
                    page={page}
                    onChange={handlePageChange}
                  />
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
      <ServiceEditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        service={selectedService}
      />
      <DeleteServiceDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDeleteService}
        serviceId={selectedServiceId}
        token={token}
      />
    </Container>
  );
};

export default VendorServices;
