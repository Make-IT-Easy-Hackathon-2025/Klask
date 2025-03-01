import React, { useEffect } from "react";
import { Button, Container, Typography, useTheme, Box, AppBar, Toolbar, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext"; // Import your ThemeContext
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Icon for rewards/achievements
import WorkIcon from "@mui/icons-material/Work"; // Icon for tasks/work
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard"; // Icon for rewards/gifts
import Brightness4Icon from "@mui/icons-material/Brightness4"; // Icon for dark mode
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Icon for light mode

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { toggleTheme } = React.useContext(ThemeContext); // Use the ThemeContext to toggle themes

  // Data for alternating icon-text sections
  const sections = [
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      text: "Complete tasks, earn coins, and unlock rewards!",
    },
    {
      icon: <WorkIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      text: "Stay productive and achieve your goals with Motivo.",
    },
    {
      icon: <CardGiftcardIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      text: "Redeem your coins for exciting prizes and perks.",
    },
  ];

  return (
    <>
      {/* AppBar */}
      <AppBar position="static" sx={{ boxShadow: "none", mb: 2, bgcolor: theme.palette.secondary.main }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: theme.palette.text.primary }}>
            Motivo
          </Typography>
          {/* Theme Toggle Button */}
          <IconButton onClick={toggleTheme} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "90vh", // Slightly less than full viewport height
          padding: "10px", // Minimal padding
          bgcolor: theme.palette.background.default, // Dynamic background color
        }}
      >
        {/* Header Section (Top) */}
        <Box
          sx={{
            textAlign: "center",
            marginBottom: "40px", // Spacing between header and prompts
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
            Welcome to Motivo
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom sx={{ color: theme.palette.text.secondary }}>
            Motivate, Achieve, Reward
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/login")}
            sx={{ marginTop: "10px", bgcolor: theme.palette.primary.main, color: theme.palette.text.primary }}
          >
            Get Started
          </Button>
        </Box>

        {/* Icon-Text Sections (Alternating Layout) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "40px", // Increased spacing between prompts
            width: "100%",
            maxWidth: "800px", // Limit width for better readability
          }}
        >
          {sections.map((section, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                alignItems: "center",
                gap: "20px", // Spacing between icon and text
              }}
            >
              <Box sx={{ flexShrink: 0 }}>{section.icon}</Box>
              <Typography variant="body1" sx={{ fontSize: "18px", color: theme.palette.text.primary }}>
                {section.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default LandingPage;