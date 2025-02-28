import { createTheme } from "@mui/material/styles";

// Define light and dark themes
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#FFCF50" }, // Light mode primary color
    secondary: { main: "#A4B465" }, // Light mode secondary color
    background: { default: "#626F47", paper: "#9aa87d" }, // Light mode background
    text: { primary: "#FEFAE0", secondary: "#FEFAE0" }, // Light mode text
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