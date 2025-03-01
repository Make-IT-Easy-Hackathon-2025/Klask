import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Paper, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // To navigate after successful registration
import ErrorMessage from "../../components/ErrorMessage";
import { useAuth } from '../../context/AuthProvider';

const RegisterPage: React.FC = () => {
  const { register } = useAuth(); 
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      await register(email, password, name);
      navigate('/login'); 
    } catch (error: any) {
      setError("Error creating account" + error.message || error);
    }
  };

  return (
    <Container
      sx={{
        height: "100vh",
        width: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Paper
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
          Create an Account
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ marginBottom: 2, fontWeight: 'bold' }}
          >
            Register
          </Button>
        </form>
        <Box sx={{ marginTop: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link 
              to="/login" 
              style={{ 
              textDecoration: "none", 
              color: theme.palette.primary.main, 
              fontWeight: 'bold' 
              }}
              onMouseOver={(e) => e.currentTarget.style.color = theme.palette.primary.dark}
              onMouseOut={(e) => e.currentTarget.style.color = theme.palette.primary.main}
            >
              Log In
            </Link>
          </Typography>
        </Box>
        {/* Add the Toggle Theme Button here */}
      </Paper>
      <ErrorMessage message={error} onClose={() => setError(null)} />
    </Container>
  );
};

export default RegisterPage;
