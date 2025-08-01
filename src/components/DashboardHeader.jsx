// DashboardHeader.js
import { Box, Typography, IconButton, Paper } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function DashboardHeader() {
  return (
    <Paper
      style={{
        padding: 20,
        marginBottom: 20,
        backgroundColor: "#1976d2",
        color: "white",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">🏡 HomeGuard Dashboard</Typography>
        <Box>
          <IconButton style={{ color: "white", marginRight: 8 }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton style={{ color: "white" }}>
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}
