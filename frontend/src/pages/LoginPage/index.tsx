import React, { useContext, useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // To navigate after successful login
import { ThemeContext } from '../../ThemeContext';
import { useAuth } from '../context/AuthProvider';

const LoginPage: React.FC = () => {
  const { toggleTheme } = useContext(ThemeContext);
  const { login } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate('/'); // Redirect to home or dashboard after successful login
    } catch (error) {
      setError("Invalid email or password");
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
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
