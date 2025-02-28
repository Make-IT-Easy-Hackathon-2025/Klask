// src/LoginPage.tsx
import React, { useContext } from 'react';
import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../ThemeContext';

const LoginPage: React.FC = () => {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Paper
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Login
        </Typography>
        <form style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Log In
          </Button>
        </form>
        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none' }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          onClick={toggleTheme}
          sx={{ marginTop: 3 }}
        >
          Toggle Theme
        </Button>
      </Paper>
    </Container>
  );
};

export default LoginPage;
