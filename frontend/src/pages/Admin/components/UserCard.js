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
  TextField,
} from "@mui/material";
import { Delete, MoreVert, Close, Edit } from "@mui/icons-material";
import { deleteUser, editUser } from "../../../redux/adminUserSlice";
import BASE_URL from "../../../../src/baseURL";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [editValues, setEditValues] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleOpenDeleteConfirmation = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${BASE_URL}admin/users/delete/${user._id}`, 
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      dispatch(deleteUser(user._id));
      setDeleteConfirmationOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues({ ...editValues, [name]: value });
  };

  const handleEditUser = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/users/update/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editValues)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      dispatch(editUser(data.user));
      setOpenEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const excludeKeys = ["__v", "_id", "password", "createdAt", "updatedAt"];

  return (
    <>
      <Box border="1px solid #ccc" borderRadius={4} p={3} mb={3}>
        <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
        <Typography>{user.email}</Typography>
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button color="primary" onClick={handleOpenModal}>
    View Details
  </Button>


          <Tooltip title="Edit User">
            <IconButton color="primary" onClick={handleOpenEditModal}>
              <Edit />
            </IconButton>
          </Tooltip>
          <IconButton color="error" onClick={handleOpenDeleteConfirmation}>
            <Delete />
          </IconButton>
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
              maxHeight: "90vh",
              overflowY: "auto",
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
              User Details
              </Typography>
      {Object.entries(user).map(([key, value]) => {
        if (!excludeKeys.includes(key)) {
          if (key === "favourites" && user.role === "vendor") {
            return null; // Exclude favourites for vendor
          } else if (key === "approved" && user.role === "customer") {
            return null; // Exclude approved for customer
          } else {
            return (
              <Typography key={key} variant="body1">
                {key}: {Array.isArray(value) ? value.join(', ') : value.toString()}
              </Typography>
            );
          }
        }
        return null;
      })}
          </Box>
        </Fade>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openEditModal}>
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
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <IconButton
              sx={{ position: "absolute", top: 0, right: 0 }}
              color="primary"
              onClick={handleCloseEditModal}
            >
              <Close />
            </IconButton>
            <Typography variant="h6" align="center" gutterBottom>
              Edit User
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <TextField
                fullWidth
                margin="normal"
                label="First Name"
                name="firstName"
                value={editValues.firstName}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Last Name"
                name="lastName"
                value={editValues.lastName}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={editValues.email}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Phone Number"
                name="phoneNumber"
                value={editValues.phoneNumber}
                onChange={handleEditChange}
              />
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleEditUser}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
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
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteUser} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserCard;