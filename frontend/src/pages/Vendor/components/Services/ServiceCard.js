import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Tooltip,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { Edit, Delete, MoreVert, Add, Close } from "@mui/icons-material";
import { deletePackage, editService } from "../../../../redux/vendorServiceSlice";

const ServiceCard = ({ service, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const [openModal, setOpenModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [editedFields, setEditedFields] = useState({ name: "", price: "", description: "" });
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [addPackageFormOpen, setAddPackageFormOpen] = useState(false);
  const [newPackageFields, setNewPackageFields] = useState({ name: "", price: "", description: "" });

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setAddPackageFormOpen(false);
  };

  const handleOpenAddPackageForm = () => {
    setAddPackageFormOpen(true);
  };

  const handleCloseAddPackageForm = () => {
    setAddPackageFormOpen(false);
    setNewPackageFields({ name: "", price: "", description: "" });
  };

  const handleAddPackage = async () => {
    try {
      const response = await fetch(`http://localhost:5600/services/addPackage/${service._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPackageFields)
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        dispatch(editService({ ...service, packages: [...service.packages, data.package] }));
        handleCloseAddPackageForm();
      } else {
        console.error('Failed to add package');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditPackage = (index) => {
    const initialPackage = service.packages[index];
    setEditedFields({
      name: initialPackage.name,
      price: initialPackage.price,
      description: initialPackage.description
    });
    setEditingPackage(index);
  };

  const handleCancelEdit = () => {
    setEditingPackage(null);
    setEditedFields({ name: "", price: "", description: "" });
  };

  const handleSaveEdit = async (index) => {
    const updatedPackages = service.packages.map((pkg, idx) => {
      if (idx === index) {
        return { ...pkg, ...editedFields };
      }
      return pkg;
    });

    dispatch(editService({ ...service, packages: updatedPackages }));

    try {
      const response = await fetch(`http://localhost:5600/services/editPackage/${service._id}/${service.packages[index]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedFields)
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error('Failed to update package');
      }
    } catch (error) {
      console.error(error);
    }

    setEditingPackage(null);
    setEditedFields({ name: "", price: "", description: "" });
  };

  const handleDeletePackage = async () => {
    // Call the API to delete the package
    try {
      const response = await fetch(`http://localhost:5600/services/deletePackage/${service._id}/${packageToDelete._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        dispatch(deletePackage({ serviceId: service._id, packageId: packageToDelete._id }));
        console.log('Package deleted successfully');
      } else {
        console.error('Failed to delete package');
      }
    } catch (error) {
      console.error(error);
    }
    setDeleteConfirmationOpen(false);
  };

  const handleCancelDelete = () => {
    setPackageToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  const handleOpenDeleteConfirmation = (index) => {
    setPackageToDelete(service.packages[index]);
    setDeleteConfirmationOpen(true);
  };

  const keyMappings = {
    service_name: "Service Name",
    description: "Description",
    start_price: "Start Price",
    cancellation_policy: "Cancellation Policy",
    staff: "Staff",
    city: "City",
    area: "Area",
    cuisine: "Cuisine",
    capacity: "Capacity",
    outdoor: "Outdoor",
    drone: "Drone",
    decortype: "Decor Type",
    latitude: "Latitude",
    longitude: "Longitude"
  };

  const excludeKeys = [
    "packages",
    "average_rating",
    "vendor_id",
    "__v",
    "createdAt",
    "updatedAt",
    "_id",
    "type",
    "service_category"
  ];

  return (
    <>
      <Box border="1px solid #ccc" borderRadius={4} p={3} mb={3} display="flex" justifyContent="space-between">
  <Box>
    <Typography variant="h6">{service.service_name}</Typography>
    <Typography>{service.description}</Typography>
    <Typography>Category: {service.service_category}</Typography>
    <Typography>Rating: {service.average_rating}</Typography>
  </Box>
  <Box display="flex" alignItems="center">
    <Box>
      <Tooltip title="Add new package">
        <IconButton color="primary" onClick={handleOpenAddPackageForm}>
          <Add />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit Service">
      <IconButton color="primary" onClick={() => onEdit(service._id)}>
        <Edit />
      </IconButton>
      </Tooltip>
      <Tooltip title="Delete Service">
      <IconButton color="error" onClick={() => onDelete(service._id)}>
        <Delete />
      </IconButton>
      </Tooltip>
      <Tooltip title="View Details">
        <IconButton color="primary" onClick={handleOpenModal}>
          <MoreVert />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>
</Box>


      <Modal
        open={addPackageFormOpen}
        onClose={handleCloseAddPackageForm}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={addPackageFormOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              Add New Package
            </Typography>
            <TextField
              label="Name"
              value={newPackageFields.name}
              onChange={(e) => setNewPackageFields({ ...newPackageFields, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              value={newPackageFields.price}
              onChange={(e) => setNewPackageFields({ ...newPackageFields, price: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={newPackageFields.description}
              onChange={(e) => setNewPackageFields({ ...newPackageFields, description: e.target.value })}
              fullWidth
              margin="normal"
            />
            <Box display="flex" justifyContent="center" mt={2}>
              <Button variant="contained" color="primary" onClick={handleAddPackage}>
                Add Package
              </Button>
              <Button variant="contained" color="primary" onClick={handleCloseAddPackageForm} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={openModal}>
        <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              maxHeight: "90vh", // Set maximum height for the modal
              overflowY: "auto", // Enable vertical scrolling
            }}
          >
            <IconButton sx={{ position: "absolute", top: 0, right: 0 }} color="primary" onClick={handleCloseModal}>
              <Close />
            </IconButton>
            <Typography variant="h6" align="center" gutterBottom>
              Service Details
            </Typography>
            {Object.entries(service).map(([key, value]) => (
              !excludeKeys.includes(key) && value && (
                <Typography key={key} variant="body1">
                  {keyMappings[key]}: {value}
                </Typography>
              )
            ))}
            {service.packages && service.packages.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Packages
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {service.packages.map((servicePackage, index) => (
                        <TableRow key={servicePackage._id}>
                        <TableCell>
                          {editingPackage === index ? (
                            <TextField
                              value={editedFields.name}
                              onChange={(e) => setEditedFields({ ...editedFields, name: e.target.value })}
                              fullWidth
                              multiline // Allow multiline input
                              variant="outlined" // Use outlined variant
                            />
                          ) : (
                            <Typography>{servicePackage.name}</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingPackage === index ? (
                            <TextField
                              value={editedFields.price}
                              onChange={(e) => setEditedFields({ ...editedFields, price: e.target.value })}
                              fullWidth
                              multiline // Allow multiline input
                              variant="outlined" // Use outlined variant
                            />
                          ) : (
                            <Typography>{servicePackage.price}</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingPackage === index ? (
                            <TextField
                              value={editedFields.description}
                              onChange={(e) => setEditedFields({ ...editedFields, description: e.target.value })}
                              fullWidth
                              multiline // Allow multiline input
                              variant="outlined" // Use outlined variant
                            />
                          ) : (
                            <Typography>{servicePackage.description}</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingPackage === index ? (
                            <>
                              <Button variant="contained" color="primary" onClick={() => handleSaveEdit(index)}>
                                Save
                              </Button>
                              <IconButton color="primary" onClick={handleCancelEdit}>
                                <Close />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              <IconButton color="primary" onClick={() => handleEditPackage(index)}>
                                <Edit />
                              </IconButton>
                              <IconButton color="error" onClick={() => handleOpenDeleteConfirmation(index)}>
                                <Delete />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        </Fade>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-confirmation-dialog-title"
        aria-describedby="delete-confirmation-dialog-description"
      >
        <DialogTitle id="delete-confirmation-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirmation-dialog-description">
            Are you sure you want to delete this package?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={handleDeletePackage} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ServiceCard;
