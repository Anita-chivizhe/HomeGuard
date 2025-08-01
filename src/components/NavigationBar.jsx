import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  HomeWork as PropertyIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import { useThemeMode } from "./ThemeProvider";

export function NavigationBar() {
  const { darkMode, toggleDarkMode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: <HomeIcon />,
      label: "DASHBOARD",
      path: "/",
      active: location.pathname === "/",
    },
    {
      icon: <PropertyIcon />,
      label: "PROPERTY SETUP",
      path: "/property/setup",
      active: location.pathname === "/property/setup",
    },
    {
      icon: <SearchIcon />,
      label: "BROWSE COVERAGE",
      path: "/coverage/browse",
      active: location.pathname === "/coverage/browse",
    },
    {
      icon: <SettingsIcon />,
      label: "MANAGE COVERAGE",
      path: "/coverage/manage",
      active: location.pathname === "/coverage/manage",
    },
    {
      icon: <InfoIcon />,
      label: "EDIT PROPERTY",
      path: "/property/edit",
      active: location.pathname === "/property/edit",
    },
  ];

  const handleNavClick = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: darkMode
          ? "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)"
          : "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        borderRadius: 0,
        mb: 3,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          py={2}
        >
          <Stack
            direction="row"
            spacing={4}
            sx={{
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 1, sm: 2, md: 4 },
              flex: 1,
            }}
          >
            {navItems.map((item, index) => (
              <Button
                key={index}
                startIcon={item.icon}
                onClick={() => handleNavClick(item.path)}
                sx={{
                  color: item.active ? "#fff" : "rgba(255,255,255,0.7)",
                  fontWeight: item.active ? "bold" : "normal",
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                  textTransform: "none",
                  px: { xs: 1, sm: 2 },
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: item.active
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "#fff",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <IconButton
            onClick={toggleDarkMode}
            sx={{
              color: "white",
              backgroundColor: "rgba(255,255,255,0.1)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              ml: 2,
            }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Container>
    </Paper>
  );
}

export default NavigationBar;
