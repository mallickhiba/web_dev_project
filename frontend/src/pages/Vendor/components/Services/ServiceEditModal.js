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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { editService } from "../../../../redux/vendor/vendorServiceSlice";

const ServiceEditModal = ({ open, onClose, service }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);


  const handleUpdateService = async (values) => {
    try {
      const initialServiceValues = service;

      // Construct object to store updated values
      const updatedValues = {};
  
      // Iterate over each field in the values object
      Object.keys(values).forEach((key) => {
        // Check if the field value has changed or is empty
        if (values[key] !== initialServiceValues[key] || values[key] === "") {
          // If changed or empty, add it to the updatedValues object
          updatedValues[key] = values[key];
        }
      });
  
      // Send request to update service with updated fields
      const response = await axios.put(
        `http://localhost:5600/services/editService/${service._id}`,
        updatedValues,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Update Redux state with the edited service
      dispatch(editService(response.data.service));
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };
  

  const validationSchema = Yup.object().shape({
    service_name: Yup.string().required("Service Name is required"),
    description: Yup.string().required("Description is required"),
    start_price: Yup.number().required("Start Price is required"),
    cancellation_policy: Yup.string().required("Cancellation Policy is required"),
    staff: Yup.string().required("Staff is required"),
    city: Yup.string().required("City is required"),
    area: Yup.string().required("Area is required"),
    cuisine: Yup.string().when("type", {
      is: "CateringService",
      then: () => Yup.string().required("Cuisine is required"),
    }),
    capacity: Yup.number().when("type", {
      is: "VenueService",
      then: () => Yup.number().required("Capacity is required"),
    }),
    outdoor: Yup.string().when("type", {
      is: "VenueService",
      then:  () => Yup.string().required("Outdoor is required"),
    }),
    drone: Yup.boolean().when("type", {
      is: "PhotographyService",
      then:  () => Yup.boolean().required("Drone is required"),
    }),
    decortype: Yup.string().when("type", {
      is: "DecorService",
      then:  () => Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one decor type")
      .max(4, "Select up to four decor types")
      .required("Decor Type is required"),
    }),    
    latitude: Yup.number(),
    longitude: Yup.number(),
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
            Edit Service
          </Typography>
          <Formik
            initialValues={service}
            onSubmit={handleUpdateService}
            validationSchema={validationSchema}
          >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <TextField
                  name="service_name"
                  label="Service Name"
                  value={values.service_name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={touched.service_name && Boolean(errors.service_name)}
                  helperText={touched.service_name && errors.service_name}
                />

                <TextField
                  name="description"
                  label="Description"
                  value={values.description}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />

                <TextField
                  name="start_price"
                  label="Start Price"
                  value={values.start_price}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  type="number"
                  inputProps={{ inputMode: "numeric" }}
                  error={touched.start_price && Boolean(errors.start_price)}
                  helperText={touched.start_price && errors.start_price}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel id="cancellation-policy-label">
                    Cancellation Policy
                  </InputLabel>
                  <Select
                    labelId="cancellation-policy-label"
                    id="cancellation_policy"
                    name="cancellation_policy"
                    value={values.cancellation_policy}
                    onChange={handleChange}
                    error={
                      touched.cancellation_policy &&
                      Boolean(errors.cancellation_policy)
                    }
                  >
                    <MenuItem value="Flexible">Flexible</MenuItem>
                    <MenuItem value="Moderate">Moderate</MenuItem>
                    <MenuItem value="Strict">Strict</MenuItem>
                  </Select>
                  {touched.cancellation_policy && errors.cancellation_policy && (
                    <Typography color="error" variant="body2">
                      {errors.cancellation_policy}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="staff-label">Staff</InputLabel>
                  <Select
                    labelId="staff-label"
                    id="staff"
                    name="staff"
                    value={values.staff}
                    onChange={handleChange}
                    error={touched.staff && Boolean(errors.staff)}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                  {touched.staff && errors.staff && (
                    <Typography color="error" variant="body2">
                      {errors.staff}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="city-label">City</InputLabel>
                  <Select
                    labelId="city-label"
                    id="city"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    error={touched.city && Boolean(errors.city)}
                  >
                    <MenuItem value="Karachi">Karachi</MenuItem>
                    <MenuItem value="Lahore">Lahore</MenuItem>
                    <MenuItem value="Islamabad">Islamabad</MenuItem>
                  </Select>
                  {touched.city && errors.city && (
                    <Typography color="error" variant="body2">
                      {errors.city}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="area-label">Area</InputLabel>
                  <Select
                    labelId="area-label"
                    id="area"
                    name="area"
                    value={values.area}
                    onChange={handleChange}
                    error={touched.area && Boolean(errors.area)}
                  >
                    <MenuItem value="Saddar">Saddar</MenuItem>
                    <MenuItem value="Gulshan-e-Iqbal">Gulshan-e-Iqbal</MenuItem>
                    <MenuItem value="DHA">DHA</MenuItem>
                    <MenuItem value="North Nazimabad">North Nazimabad</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {touched.area && errors.area && (
                    <Typography color="error" variant="body2">
                      {errors.area}
                    </Typography>
                  )}
                </FormControl>

                {values.type === "CateringService" && (
                  <TextField
                    name="cuisine"
                    label="Cuisine"
                    value={values.cuisine}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={touched.cuisine && Boolean(errors.cuisine)}
                    helperText={touched.cuisine && errors.cuisine}
                  />
                )}

                {values.type === "VenueService" && (
                  <>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="outdoor-label">Outdoor</InputLabel>
                      <Select
                        labelId="outdoor-label"
                        id="outdoor"
                        name="outdoor"
                        value={values.outdoor}
                        onChange={handleChange}
                        error={touched.outdoor && Boolean(errors.outdoor)}
                      >
                        <MenuItem value="outdoor">Outdoor</MenuItem>
                        <MenuItem value="banquet">Banquet</MenuItem>
                      </Select>
                      {touched.outdoor && errors.outdoor && (
                        <Typography color="error" variant="body2">
                          {errors.outdoor}
                        </Typography>
                      )}
                    </FormControl>

                    <TextField
                      name="capacity"
                      label="Capacity"
                      value={values.capacity}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      error={touched.capacity && Boolean(errors.capacity)}
                      helperText={touched.capacity && errors.capacity}
                    />
                  </>
                )}

                {values.type === "PhotographyService" && (
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="drone-label">Drone</InputLabel>
                    <Select
                      labelId="drone-label"
                      id="drone"
                      name="drone"
                      value={values.drone}
                      onChange={handleChange}
                      error={touched.drone && Boolean(errors.drone)}
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                    {touched.drone && errors.drone && (
                      <Typography color="error" variant="body2">
                        {errors.drone}
                      </Typography>
                    )}
                  </FormControl>
                )}

                {values.type === "DecorService" && (
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="decor-type-label">Decor Type</InputLabel>
                    <Select
                     multiple
                      labelId="decor-type-label"
                      id="decortype"
                      name="decortype"
                      value={values.decortype}
                      onChange={handleChange}
                      error={touched.decortype && Boolean(errors.decortype)}
                    >
                      <MenuItem value="wedding">Wedding</MenuItem>
                      <MenuItem value="birthday party">Birthday Party</MenuItem>
                      <MenuItem value="anniversary">Anniversary</MenuItem>
                      <MenuItem value="formal events">Formal Events</MenuItem>
                    </Select>
                    {touched.decortype && errors.decortype && (
                      <Typography color="error" variant="body2">
                        {errors.decortype}
                      </Typography>
                    )}
                  </FormControl>
                )}

                <TextField
                  name="latitude"
                  label="Latitude"
                  value={values.latitude}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  type="number"
                  inputProps={{ step: "any" }}
                  error={touched.latitude && Boolean(errors.latitude)}
                  helperText={touched.latitude && errors.latitude}
                />

                <TextField
                  name="longitude"
                  label="Longitude"
                  value={values.longitude}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  type="number"
                  inputProps={{ step: "any" }}
                  error={touched.longitude && Boolean(errors.longitude)}
                  helperText={touched.longitude && errors.longitude}
                />

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

export default ServiceEditModal;
