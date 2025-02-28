import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Container, Switch, useTheme } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import MailIcon from "@mui/icons-material/Mail";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";

interface NavBarProps {
  children: React.ReactNode;
}

const NavBar: React.FC<NavBarProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">MOTIVIO</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Groups Icon */}
            <IconButton
              color="inherit"
              onClick={() => navigate("/home")}
              sx={location.pathname === "/home" ? { color: theme.palette.secondary.main, transform: "scale(1.2)" } : {}}
            >
              <GroupsIcon />
            </IconButton>

            {/* Mail Icon */}
            <IconButton
              color="inherit"
              onClick={() => navigate("/inbox")}
              sx={location.pathname === "/inbox" ? { color: theme.palette.secondary.main, transform: "scale(1.2)" } : {}}
            >
              <MailIcon />
            </IconButton>

            {/* Profile Icon */}
            <IconButton
              color="inherit"
              onClick={() => navigate("/profile")}
              sx={location.pathname === "/profile" ? { color: theme.palette.secondary.main, transform: "scale(1.2)" } : {}}
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>{children}</Container>
    </Box>
  );
};

export default NavBar;
