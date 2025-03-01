import React, { useContext, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Box,
  useTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom"; // To navigate after successful login
import { ThemeContext } from "../../ThemeContext";
import { useAuth } from "../../context/AuthProvider";
import ErrorMessage from "../../components/ErrorMessage";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <Container
      sx={{
        height: "100vh",
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
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ marginTop: 2, fontWeight: 'bold' }}
          >
            <Typography variant="button" sx={{ color: "white", fontWeight: 'bold' }}>
              Log In
            </Typography>
          </Button>
        </form>
        <Box sx={{ marginTop: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
             <Link 
                          to="/register" 
                          style={{ 
                          textDecoration: "none", 
                          color: theme.palette.primary.main, 
                          fontWeight: 'bold' 
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = theme.palette.primary.dark}
                          onMouseOut={(e) => e.currentTarget.style.color = theme.palette.primary.main}
                        >
                          Sign in
                        </Link>
          </Typography>
        </Box>
      </Paper>
      <ErrorMessage message={error} onClose={() => setError(null)} />
    </Container>
  );
};

export default LoginPage;
