import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Container, Box, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // To navigate after successful registration
import { ThemeContext } from '../../ThemeContext';
import { useAuth } from '../context/AuthProvider';

const RegisterPage: React.FC = () => {
  const { toggleTheme } = useContext(ThemeContext);  // Getting toggleTheme from ThemeContext
  const { register } = useAuth(); // Access the register method from AuthProvider

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      await register(email, password);
      navigate('/'); // Redirect to home or dashboard page after successful registration
    } catch (error) {
      setError("Error creating account");
    }
  };

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
          Create an Account
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Register
          </Button>
        </form>
        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              Log In
            </Link>
          </Typography>
        </Box>
        {/* Add the Toggle Theme Button here */}
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

export default RegisterPage;
