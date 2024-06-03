import React from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Backdrop,
  Fade,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { editVendor } from "../../../redux/adminVendorSlice";

const VendorEditModal = ({ open, onClose, vendor }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const handleApproveVendor = async (values) => {
    try {
      // Send request to approve vendor
      await axios.post(
        `http://localhost:5600/vendors/approve`,
        { email: vendor.email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update Redux state with the edited vendor
      dispatch(editVendor({ ...vendor, approved: true }));

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error approving vendor:", error);
    }
  };

  const validationSchema = Yup.object({
    approved: Yup.boolean().required("Approval status is required"),
  });

  // Render nothing if vendor is null
  if (!vendor) return null;

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
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            Edit Vendor
          </Typography>
          <Formik
            initialValues={{ approved: vendor.approved }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleApproveVendor(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormControlLabel
                  control={
                    <Field
                      as={Checkbox}
                      type="checkbox"
                      name="approved"
                      checked={vendor.approved}
                      disabled
                    />
                  }
                  label="Approved"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Approve Vendor
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Fade>
    </Modal>
  );
};

export default VendorEditModal;
