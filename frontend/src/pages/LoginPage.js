import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux'; // Importing useDispatch

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '../redux/userSlice'; // Importing the login action
import { NotificationManager } from "react-notifications";
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleForm = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const loginSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post('http://localhost:5600/auth/login', data);
      if (res.status === 200) {
        NotificationManager.success(res.data.msg);
        const { token } = res.data;
        const role = JSON.parse(atob(token.split('.')[1])).role;
        dispatch(login({ token, role }));
        redirectToRolePage(role);
      } else {
        NotificationManager.error(res.data.error);
      }
    } catch (error) {
      console.error(error);
      NotificationManager.error(error.response.data.error); 
    }
  };
  
  const redirectToRolePage = (role) => {
    switch (role) {
      case 'admin':
        navigate('/adminhome');
        break;
      case 'vendor':
        navigate('/vendordashboard');
        break;
      default:
        navigate('/');
        break;
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
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={loginSubmit} sx={{ mt: 1 }}>
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
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={data.password}
              onChange={handleForm}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
