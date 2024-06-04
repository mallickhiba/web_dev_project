import React, { useState } from 'react';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const defaultTheme = createTheme();

const ResetPassword = () => {
  const [data, setData] = useState({
    email: '',
    token: '',
    newPassword: ''
  });

  const handleForm = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5600/auth/resetpassword', data);
      if (res.status === 200) {
        NotificationManager.success(res.data.msg);
      } else {
        NotificationManager.error(res.data.error);
      }
    } catch (error) {
      console.error(error);
      NotificationManager.error(error.response.data.error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box component="form" noValidate onSubmit={resetPasswordSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={data.email}
              onChange={handleForm}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="token"
              label="Token"
              id="token"
              autoComplete="token"
              value={data.token}
              onChange={handleForm}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="current-password"
              value={data.newPassword}
              onChange={handleForm}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2, mb: 2 }}
              >
                Back to Login
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ResetPassword;