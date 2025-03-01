import React, { useEffect } from "react";
import { Button, Container, Typography, useTheme, Box, AppBar, Toolbar, IconButton, Fade, Zoom } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkIcon from "@mui/icons-material/Work";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ReactComponent as MotivoLogo } from "../../assets/motivo-logo.svg";

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { toggleTheme } = React.useContext(ThemeContext);

  const sections = [
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      text: "Complete tasks, earn coins, and unlock rewards!",
    },
    {
      icon: <WorkIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      text: "Stay productive and achieve your goals with us!",
    },
    {
      icon: <CardGiftcardIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      text: "Redeem your coins for exciting prizes and perks.",
    },
  ];

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height to prevent scrolling
        padding: "20px",
        bgcolor: theme.palette.background.default,
        overflow: "hidden", // Prevent scrolling
      }}
    >
      {/* Centered Title Section */}
      <Fade in={true} timeout={1000}>
        <Box
          sx={{
            textAlign: "center",
            mb: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: "bold", 
              color: theme.palette.text.primary,
              fontSize: {xs: '2.5rem', sm: '3.5rem', md: '4.5rem'}
            }}
          >
            Welcome, to Motivo!
          </Typography>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              color: theme.palette.text.secondary,
              mb: 3,
              fontStyle: "italic"
            }}
          >
            "{sections[1].text}"
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/login")}
            sx={{ 
              mt: 2, 
              bgcolor: theme.palette.primary.main, 
              color: theme.palette.text.primary,
              px: 4, 
              py: 1.5, 
              fontSize: '1.2rem',
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                transform: 'translateY(-3px)',
              },
              animation: 'pulse 2.5s infinite',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: `0 0 0 0 ${theme.palette.primary.main}99`,
                  transform: 'scale(1)',
                },
                '70%': {
                  boxShadow: `0 0 0 10px ${theme.palette.primary.main}00`,
                  transform: 'scale(1.05)',
                },
                '100%': {
                  boxShadow: `0 0 0 0 ${theme.palette.primary.main}00`,
                  transform: 'scale(1)',
                },
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Fade>

      {/* Animated Sections */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        {sections.map((section, index) => (
          <Zoom 
            in={true} 
            style={{ transitionDelay: `${index * 300}ms` }}
            key={index}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                alignItems: "center",
                gap: "20px",
                p: 1,
                borderRadius: "10px",
              }}
            >
              <Box sx={{ flexShrink: 0 }}>{section.icon}</Box>
              <Typography variant="body1" sx={{ fontSize: "18px", color: theme.palette.text.primary }}>
                {section.text}
              </Typography>
            </Box>
          </Zoom>
        ))}
      </Box>
      
      {/* Theme Toggle Button (optional) */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton onClick={toggleTheme} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
    </Container>
  );
};

export default LandingPage;