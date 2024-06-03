import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setServices } from "../../../../redux/vendor/vendorServiceSlice";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
} from "@mui/material";

const AddServiceForm = ({ setOpenAddServiceForm }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const services = useSelector((state) => state.vendorServices.services);

  // Define the serviceCategoryValidation function
  const serviceCategoryValidation = (values) => {
    if (values && values.service_category) {
      switch (values.service_category) {
        case "decor":
          return {
            decortype: Yup.array()
              .of(Yup.string())
              .min(1, "Select at least one decor type")
              .max(4, "Select up to four decor types")
              .required("Decor Type is required"),
          };
        case "venue":
          return {
            capacity: Yup.number()
              .typeError("Capacity must be a number")
              .required("Capacity is required"),
            outdoor: Yup.string().required("Outdoor type is required"),
          };
        case "catering":
          return {
            cuisine: Yup.string().required("Cuisine is required"),
          };
        case "photography":
          return {
            drone: Yup.boolean().required("Drone field is required"),
          };
        default:
          return {};
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form values:", values);
    const { packages, ...formData } = values;
    const formattedPackages = packages.map(({ name, price, description }) => ({ name, price, description }));

    try {
      const response = await axios.post(
        "http://localhost:5600/services/addService",
        { ...formData, packages: formattedPackages },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setServices([...services, response.data.service]));
      setOpenAddServiceForm(false);
      console.log("Service added", response.data.service);
    } catch (error) {
      console.error("Error adding service:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        service_name: "",
        service_category: "",
        description: "",
        start_price: "",
        staff: "",
        cancellation_policy: "",
        cuisine: "",
        capacity: "",
        outdoor: "",
        drone: false,
        decortype: [],
        latitude: "",
        longitude: "",
        city: "",
        area: "",
        packages: [{ name: "", price: "", description: "" }],
      }}
      validationSchema={Yup.object().shape({
        service_name: Yup.string().required("Service Name is required"),
        service_category: Yup.string().required("Service Category is required"),
        description: Yup.string().required("Description is required"),
        start_price: Yup.number().typeError("Start Price must be a number").required("Start Price is required"),
        staff: Yup.string().required("Staff is required"),
        cancellation_policy: Yup.string().required("Cancellation Policy is required"),
        latitude: Yup.number().typeError("Latitude must be a number"),
        longitude: Yup.number().typeError("Longitude must be a number"),
        city: Yup.string().required("City is required"),
        area: Yup.string().required("Area is required"),
        ...(serviceCategoryValidation()), // Pass values to the function
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          console.log("api hit");
          await handleSubmit(values, { setSubmitting });
        } catch (error) {
          console.error(error);
          // Handle error
        }
      }}
    >
      {({ isSubmitting, values, setFieldValue, touched, errors }) => (
        <Form>
          {/* Form fields */}
          {/* Service Name */}
          <Field
            name="service_name"
            as={TextField}
            label="Service Name"
            fullWidth
            margin="normal"
            id="service_name"
          />
          {/* Service Category */}
          <Field
            name="service_category"
            as={TextField}
            select
            label="Service Category"
            fullWidth
            margin="normal"
            value={values.service_category}
            onChange={(e) => {
              setFieldValue("service_category", e.target.value);
            }}
            error={Boolean(touched.service_category && errors.service_category)}
            helperText={touched.service_category && errors.service_category}
            id="service_category"
          >
            {["decor", "venue", "catering", "photography"].map((category) => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </Field>
          {/* Description */}
          <Field
            name="description"
            as={TextField}
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            id="description"
          />
          {/* Start Price */}
          <Field
            name="start_price"
            as={TextField}
            label="Start Price"
            fullWidth
            margin="normal"
            type="number"
            id="start_price"
          />
          {/* Staff */}
          <Field
            name="staff"
            as={TextField}
            select
            label="Staff"
            fullWidth
            margin="normal"
            id="staff"
          >
            {["Male", "Female"].map((staffType) => (
              <MenuItem key={staffType} value={staffType}>
                {staffType}
              </MenuItem>
            ))}
          </Field>
          {/* Cancellation Policy */}
          <Field
            name="cancellation_policy"
            as={TextField}
            select
            label="Cancellation Policy"
            fullWidth
            margin="normal"
            id="cancellation_policy"
          >
            {["Flexible", "Moderate", "Strict"].map((policy) => (
              <MenuItem key={policy} value={policy}>
                {policy}
              </MenuItem>
            ))}
          </Field>
          {/* Additional fields based on service category */}
          {/* Cuisine */}
          {values.service_category === "catering" && (
            <Field
              name="cuisine"
              as={TextField}
              label="Cuisine"
              fullWidth
              margin="normal"
              id="cuisine"
            />
          )}
          {/* Capacity and Outdoor */}
          {values.service_category === "venue" && (
            <>
              <Field
                name="capacity"
                as={TextField}
                label="Capacity"
                fullWidth
                margin="normal"
                type="number"
                id="capacity"
              />
              <Field
                name="outdoor"
                as={TextField}
                select
                label="Hall Type"
                fullWidth
                margin="normal"
                id="outdoor"
              >
                {["outdoor", "banquet"].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Field>
            </>
          )}
          {/* Drone */}
          {values.service_category === "photography" && (
            <Field
              name="drone"
              label="Drone"
              as={FormControl}
              fullWidth
              margin="normal"
              id="drone"
            >
              <InputLabel>Drone</InputLabel>
              <Select
                value={values.drone}
                onChange={(e) => {
                  setFieldValue("drone", e.target.value);
                }}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </Field>
          )}
          {/* Decor Type */}
          {values.service_category === "decor" && (
            <Field
              name="decortype"
              label="Decor Type"
              as={FormControl}
              fullWidth
              margin="normal"
              id="decortype"
            >
              <InputLabel>Decor Type</InputLabel>
              <Select
                multiple
                value={values.decortype}
                onChange={(e) => {
                  setFieldValue("decortype", e.target.value);
                }}
                renderValue={(selected) => selected.join(", ")}
              >
                {["wedding", "birthday party", "anniversary", "formal events"].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
              <ErrorMessage name="decortype" component="div" />
            </Field>
          )}
          {/* Location */}
          {/* Latitude */}
          <Field
            name="latitude"
            as={TextField}
            label="Latitude"
            fullWidth
            margin="normal"
            type="number"
            id="latitude"
          />
          {/* Longitude */}
          <Field
            name="longitude"
            as={TextField}
            label="Longitude"
            fullWidth
            margin="normal"
            type="number"
            id="longitude"
          />
          {/* City */}
          <Field
            name="city"
            as={TextField}
            select
            label="City"
            fullWidth
            margin="normal"
            id="city"
          >
            {["Karachi", "Lahore", "Islamabad"].map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Field>
          {/* Area */}
          <Field
            name="area"
            as={TextField}
            select
            label="Area"
            fullWidth
            margin="normal"
            id="area"
          >
            {["Saddar", "Gulshan-e-Iqbal", "DHA", "North Nazimabad", "Other"].map((area) => (
              <MenuItem key={area} value={area}>
                {area}
              </MenuItem>
            ))}
          </Field>

          {/* Packages Field Array */}
          <FieldArray name="packages">
            {({ push, remove }) => (
              <>
                <Box mt={2}>
                  {values.packages.map((_, index) => (
                    <div key={index}>
                      <Field
                        name={`packages[${index}].name`}
                        as={TextField}
                        label="Package Name"
                        fullWidth
                        margin="normal"
                        id={`packages[${index}].name`}
                      />
                      <Field
                        name={`packages[${index}].price`}
                        as={TextField}
                        label="Price"
                        fullWidth
                        margin="normal"
                        type="number"
                        id={`packages[${index}].price`}
                      />
                      <Field
                        name={`packages[${index}].description`}
                        as={TextField}
                        label="Description"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        id={`packages[${index}].description`}
                      />
                      <Button type="button" onClick={() => remove(index)} disabled={values.packages.length === 1}>Remove</Button>
                    </div>
                  ))}
                </Box>
                <Box mt={2}>
                  <Button type="button" onClick={() => push({ name: "", price: "", description: "" })}>Add Package</Button>
                </Box>
              </>
            )}
          </FieldArray>

          {/* Submit and Cancel Buttons */}
          <Box mt={2}>
            <Button type= "submit" variant="contained" color="primary" disabled={isSubmitting}>
              Add
            </Button>
            <Button type="button" onClick={() => setOpenAddServiceForm(false)} disabled={isSubmitting}>
              Cancel
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddServiceForm;
