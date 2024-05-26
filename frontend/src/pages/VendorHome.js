import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails, logout } from '../redux/userSlice';
import { Box, Typography, TextField, Button, Divider,Grid } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { NotificationManager } from 'react-notifications';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VendorHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.user.token);
  const vendorData = useSelector((state) => state.user.userDetails);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5600/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Vendor details:', response.data);
        dispatch(setUserDetails(response.data));
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      }
    };
  
    if (Object.keys(vendorData).length === 0) {
      console.log('Fetching vendor details...');
      fetchVendorDetails();
    }
  }, [dispatch, token, vendorData]);
  

  const handleUpdateProfile = async (values) => {
    try {
      const response = await axios.post('http://localhost:5600/auth/updateaccount', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.msg);
      dispatch(setUserDetails(values));
      setEditMode(false); // Exit edit mode after updating
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChangePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('http://localhost:5600/auth/changepassword', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const msg = response.data.msg;
      NotificationManager.success(msg);
      resetForm(); 
    } catch (error) {
      console.error( error);
      NotificationManager.error('Failed to change password. Please try again.', 'Error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5600/auth/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(logout());
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!vendorData) {
    return <div>Loading...</div>;
  }

  return (
    <Box mx={4} my={4}>
    <Grid container justifyContent="flex-end">
      <Button onClick={handleLogout} variant="contained" color="secondary">
        Logout
      </Button>
    </Grid>


    <Box mx="auto" mt={12} bgcolor="background.paper" maxWidth="7xl" px={4} sm={6} lg={8}>
<Box border="1px solid #ccc" borderRadius={4} p={3} mb={3} mt={2}>
  <Typography variant="h4" gutterBottom>
    Vendor Profile
  </Typography>
        {!editMode ? (
          <div>
            <Typography>Email: {vendorData.email}</Typography>
            <Typography>First Name: {vendorData.firstName}</Typography>
            <Typography>Last Name: {vendorData.lastName}</Typography>
            <Typography>Phone Number: {vendorData.phoneNumber}</Typography>
            <Button onClick={() => setEditMode(true)} variant="outlined" color="primary" mt={2}>
              Edit Profile
            </Button>
          </div>
        ) : (
          <Formik
            initialValues={vendorData}
            onSubmit={(values) => handleUpdateProfile(values)}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Invalid email').required('Required'),
              firstName: Yup.string().required('Required'),
              lastName: Yup.string().required('Required'),
              phoneNumber: Yup.string().required('Required'),
            })}
          >
            {({ errors, touched }) => (
              <Form>
           <Box display="flex" flexDirection="column">
  <Field
    name="email"
    as={TextField}
    label="Email"
    sx={{ mb: 2, width: '100%' }} // Add margin-bottom and set width to 100%
  />
  <ErrorMessage name="email" />
  <Field
    name="firstName"
    as={TextField}
    label="First Name"
    sx={{ mb: 2, width: '100%' }} // Add margin-bottom and set width to 100%
  />
  <ErrorMessage name="firstName" />
  <Field
    name="lastName"
    as={TextField}
    label="Last Name"
    sx={{ mb: 2, width: '100%' }} // Add margin-bottom and set width to 100%
  />
  <ErrorMessage name="lastName" />
  <Field
    name="phoneNumber"
    as={TextField}
    label="Phone Number"
    sx={{ mb: 2, width: '100%' }} // Add margin-bottom and set width to 100%
  />
  <ErrorMessage name="phoneNumber" />




  <Box border="1px solid #ccc" borderRadius={4} p={3} mb={3}>
  <Typography variant="h6" gutterBottom>
    Change Password
  </Typography>
  <Formik
    initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
    validationSchema={Yup.object().shape({
      currentPassword: Yup.string().required('Current Password is required'),
      newPassword: Yup.string()
        .required('New Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(
          /^(?=.*\d)(?=.*[a-zA-Z])/,
          'Password must include at least one number and one alphabet'
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    })}
    onSubmit={async (values, { setSubmitting, resetForm }) => {
      try {
        await handleChangePassword(values, { setSubmitting, resetForm });
      } catch (error) {
        console.error(error);
        // Handle error
      }
    }}
  >
    {(formik) => (
      <Form>
      <div className="form-group">
        <label htmlFor="currentPassword">Current Password</label>
        <Field
          type="password"
          id="currentPassword"
          name="currentPassword"
          className={`form-control ${
            formik.touched.currentPassword && formik.errors.currentPassword ? 'is-invalid' : ''
          }`}
          as={TextField}
        />
        <ErrorMessage
          name="currentPassword"
          component="div"
          className="invalid-feedback"
        />
      </div>
      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <Field
          type="password"
          id="newPassword"
          name="newPassword"
          className={`form-control ${
            formik.touched.newPassword && formik.errors.newPassword ? 'is-invalid' : ''
          }`}
          as={TextField}
        />
        <ErrorMessage
          name="newPassword"
          component="div"
          className="invalid-feedback"
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <Field
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className={`form-control ${
            formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''
          }`}
          as={TextField}
        />
        <ErrorMessage
          name="confirmPassword"
          component="div"
          className="invalid-feedback"
        />
      </div>
      <Box display="flex" justifyContent="center" mt={2}>
  <Button
    type="submit"
    variant="contained"
    color="primary"
    disabled={!formik.isValid || formik.isSubmitting || (editMode && !formik.dirty)}
    >
    Change Password
  </Button>
</Box>

    </Form>
    )}
  </Formik>
</Box>




                  <Button type="submit" variant="contained" color="primary" mt={2}>
                    Update Profile
                  </Button>
                  <Button onClick={() => setEditMode(false)} variant="outlined" color="secondary" mt={2}>
                    Cancel
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        )}
      </Box>
      </Box>

    </Box>
  );
};

export default VendorHome;
