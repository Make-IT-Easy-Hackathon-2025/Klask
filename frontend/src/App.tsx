import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { Button, Container, Typography } from "@mui/material";

const App: React.FC = () => {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Material UI Theming Example
      </Typography>
      <Button variant="contained" color="primary" onClick={toggleTheme}>
        Toggle Theme
      </Button>
    </Container>
  );
};

export default App;
