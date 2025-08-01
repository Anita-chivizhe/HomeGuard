import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import { createContext, useContext, useState, useEffect } from "react";

// Theme Context
const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    console.warn("useThemeMode must be used within CustomThemeProvider");
    return { darkMode: false, toggleDarkMode: () => {} };
  }
  return context;
}

export function CustomThemeProvider({ children }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(false); // Start with light mode

  // Apply system preference on mount
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#90caf9" : "#1976d2",
      },
      secondary: {
        main: darkMode ? "#f48fb1" : "#dc004e",
      },
      background: {
        default: darkMode ? "#121212" : "#f8f9fa",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: darkMode ? "1px solid #333" : "1px solid #f0f0f0",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  const toggleDarkMode = () => {
    console.log("Toggling dark mode from", darkMode, "to", !darkMode);
    setDarkMode(!darkMode);
  };

  const contextValue = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default CustomThemeProvider;
