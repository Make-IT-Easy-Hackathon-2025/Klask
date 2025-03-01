import React, { useEffect } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Container, Switch, useTheme } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import MailIcon from "@mui/icons-material/Mail";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import GroupNavbar from "../GroupNavbar";
import { useAuth } from "../../context/AuthProvider";
import lightLogo from "../../assets/light.png";
import darkLogo from "../../assets/dark.png";

        
interface NavBarProps {
  children: React.ReactNode;
  isGroupPage?: boolean;
  activeTab?: "leaderboard" | "challenges" | "shop" | "manage";
}

const NavBar: React.FC<NavBarProps> = ({ children, isGroupPage, activeTab}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const {refreshUser} = useAuth();

  useEffect(() => {
    refreshUser();
  }
  ,[activeTab]);

  const logo = theme.palette.mode === 'light' ? darkLogo : lightLogo;


  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        <Box onClick={() => navigate("/home")} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <img src={logo} alt="Motivo Logo" style={{ width: '24vh', height: 'auto'}} />
          </Box>        
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Groups Icon */}
            <IconButton
              color="inherit"
              onClick={() => navigate("/home")}
              sx={location.pathname === "/home" ? { color: theme.palette.secondary.main, transform: "scale(1.3)" } : {}}
            >
              <GroupsIcon />
            </IconButton>

            {/* Mail Icon */}
            <IconButton
              color="inherit"
              onClick={() => navigate("/inbox")}
              sx={location.pathname === "/inbox" ? { color: theme.palette.secondary.main, transform: "scale(1.3)" } : {}}
            >
              <MailIcon />
            </IconButton>

            {/* Profile Icon */}
            <IconButton
              color="inherit"
              onClick={() => navigate("/profile")}
              sx={location.pathname === "/profile" ? { color: theme.palette.secondary.main, transform: "scale(1.3)" } : {}}
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {isGroupPage && <GroupNavbar activeTab={activeTab} />}
      <Container sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>{children}</Container>
    </Box>
  );
};

export default NavBar;
