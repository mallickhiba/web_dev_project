// DeleteUserDialog.js
import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from "@mui/material";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../../redux/adminUserSlice";

const DeleteUserDialog = ({ open, onClose,userId, token }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5600/admin/user/delete/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        console.log('User deleted successfully');
        dispatch(deleteUser(userId)); // Dispatch the deleteUser action
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-confirmation-dialog-title"
      aria-describedby="delete-confirmation-dialog-description"
    >
      <DialogTitle id="delete-confirmation-dialog-title">Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-confirmation-dialog-description">
          Are you sure you want to delete this user?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus disabled={loading}>
          {loading ? 'Deleting...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserDialog;
