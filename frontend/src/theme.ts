import { createTheme } from "@mui/material/styles";

// Define light and dark themes
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#8ba974"}, // Soft Gray
    secondary: { main: "#dcc773"}, // Muted Beige
    background: { default: "#e7e5d9", paper: "#E8E8E8" }, // Off-white and light gray
    text: { primary: "#333333", secondary: "#555555" }, // Dark gray tones for readability
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