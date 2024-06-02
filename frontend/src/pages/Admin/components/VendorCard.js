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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Edit, Delete, MoreVert, Close } from "@mui/icons-material";
import { deleteVendor, editVendor } from "../../../redux/adminVendorSlice";

const VendorCard = ({ vendor, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const [openModal, setOpenModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [editedFields, setEditedFields] = useState({
    firstName: "",
    email: "",
  });
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEditVendor = (vendorId) => {
    setEditingVendor(vendorId);
    setEditedFields({
      firstName: vendor.firstName,
      email: vendor.email,
    });
  };

  const handleCancelEdit = () => {
    setEditingVendor(null);
    setEditedFields({ firstName: "", email: "" });
  };

  const handleSaveEdit = async () => {
    dispatch(editVendor({ ...vendor, ...editedFields }));
    setEditingVendor(null);
  };

  const handleOpenDeleteConfirmation = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteVendor = async () => {
    dispatch(deleteVendor(vendor._id));
    setDeleteConfirmationOpen(false);
  };

  const keyMappings = {
    firstName: "Vendor Name",
    email: "Email",
  };

  const excludeKeys = ["__v", "createdAt", "updatedAt", "_id"];

  return (
    <>
      <Box border="1px solid #ccc" borderRadius={4} p={3} mb={3}>
        <Typography variant="h6">{vendor.firstName}</Typography>
        <Typography>{vendor.email}</Typography>
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <IconButton
            color="primary"
            onClick={() => handleEditVendor(vendor._id)}
          >
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={handleOpenDeleteConfirmation}>
            <Delete />
          </IconButton>
          <Tooltip title="View Details">
            <IconButton color="primary" onClick={handleOpenModal}>
              <MoreVert />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
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
            <IconButton
              sx={{ position: "absolute", top: 0, right: 0 }}
              color="primary"
              onClick={handleCloseModal}
            >
              <Close />
            </IconButton>
            <Typography variant="h6" align="center" gutterBottom>
              Vendor Details
            </Typography>
            {Object.entries(vendor).map(
              ([key, value]) =>
                !excludeKeys.includes(key) &&
                value && (
                  <Typography key={key} variant="body1">
                    {keyMappings[key]}: {value}
                  </Typography>
                )
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
        <DialogTitle id="delete-confirmation-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirmation-dialog-description">
            Are you sure you want to delete this vendor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteVendor} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VendorCard;
