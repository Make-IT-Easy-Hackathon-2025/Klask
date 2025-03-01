import { createTheme } from "@mui/material/styles";

// Define light and dark themes
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#e3975b" }, // Light mode primary color
    secondary: { main: "#99BC85" }, // Light mode secondary color
    background: { default: "#71915e", paper: "#9aa87d" }, // Light mode background
    text: { primary: "#3c4a35", secondary: "#3c4a35" }, // Light mode text
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#A27B5C" }, // Dark mode primary color
    secondary: { main: "#3F4F44" }, // Dark mode secondary color
    background: { default: "#2C3930", paper: "#1E1E1E" }, // Dark mode background
    text: { primary: "#DCD7C9", secondary: "#DCD7C9" }, // Dark mode text
  },
});