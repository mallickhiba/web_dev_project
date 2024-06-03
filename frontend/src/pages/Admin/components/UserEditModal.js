import React from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Backdrop,
  Fade,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../../../redux/adminUserSlice";

const UserEditModal = ({ open, onClose, user }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const handleUpdateUser = async (values) => {
    try {
      const initialUserValues = user;

      // Construct object to store updated values
      const updatedValues = {};

      // Iterate over each field in the values object
      Object.keys(values).forEach((key) => {
        // Check if the field value has changed or is empty
        if (values[key] !== initialUserValues[key] || values[key] === "") {
          // If changed or empty, add it to the updatedValues object
          updatedValues[key] = values[key];
        }
      });

      // Send request to update user with updated fields
      const response = await axios.put(
        `http://localhost:5600/admin/users/editUser/${user._id}`,
        updatedValues,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update Redux state with the edited user
      dispatch(editUser(response.data.user));

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    role: Yup.string().required("Role is required"),
    status: Yup.string().required("Status is required"),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
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
          <Typography variant="h6" align="center" gutterBottom>
            Edit User
          </Typography>
          <Formik
            initialValues={user}
            onSubmit={handleUpdateUser}
            validationSchema={validationSchema}
          >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={values.firstName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />

                <TextField
                  name="lastName"
                  label="Last Name"
                  value={values.lastName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />

                <TextField
                  name="email"
                  label="Email"
                  value={values.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    error={touched.role && Boolean(errors.role)}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="vendor">Vendor</MenuItem>
                    <MenuItem value="customer">Customer</MenuItem>
                  </Select>
                  {touched.role && errors.role && (
                    <Typography color="error" variant="body2">
                      {errors.role}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    error={touched.status && Boolean(errors.status)}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                  {touched.status && errors.status && (
                    <Typography color="error" variant="body2">
                      {errors.status}
                    </Typography>
                  )}
                </FormControl>

                <Box sx={{ textAlign: "center" }}>
                  <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Save Changes
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UserEditModal;
