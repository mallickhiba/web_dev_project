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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
} from "@mui/material";
import { Delete, MoreVert, Close } from "@mui/icons-material";
import { editVendor } from "../../../redux/adminVendorSlice";
import BASE_URL from "../../../../src/baseURL";


const VendorCard = ({ vendor }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const [openModal, setOpenModal] = useState(false);
  const [approved, setApproved] = useState(vendor.approved);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleApprovedChange = async () => {
    setApproved(!approved);
    // Dispatch action to update vendor's approved field
    dispatch(editVendor({ ...vendor, approved: !approved }));

    try {
      // Make the POST request to update vendor's approval status
      const response = await fetch(`${BASE_URL}admin/vendors/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: vendor.email }) // Send vendor's email in the request body
      });

      if (!response.ok) {
        throw new Error('Failed to update vendor approval status');
      }

      const data = await response.json();
      console.log(data); // Log success message or handle response data as needed
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show error message to the user)
    }
  };

  const excludeKeys = ["__v", "_id", "password", "favourites", "createdAt", "updatedAt"];

  return (
    <>
      <Box border="1px solid #ccc" borderRadius={4} p={3} mb={3}>
        <Typography variant="h6">{vendor.firstName} {vendor.lastName}</Typography>
        <Typography>{vendor.email}</Typography>
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
           <Button color="primary" onClick={handleOpenModal}>
    View Details
  </Button>

          <Tooltip title="Approve Vendor">
            <Switch
              checked={approved}
              onChange={handleApprovedChange}
              inputProps={{ 'aria-label': 'approved switch' }}
            />
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
            {Object.entries(vendor).map(([key, value]) =>
              !excludeKeys.includes(key) ? (
                <Typography key={key} variant="body1">
                  {key}: {value}
                </Typography>
              ) : null
            )}
          </Box>
        </Fade>
      </Modal>    
    </>
  );
};

export default VendorCard;
