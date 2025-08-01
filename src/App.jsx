import { Link, Navigate, Route, Routes } from "react-router-dom";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { Dashboard } from "./pages/Dashboard";
import { PropertySetup } from "./pages/PropertySetUp";
import { BrowseCoverage } from "./pages/BrowseCoverageScreen";
import { PropertyEdit } from "./pages/EditProperty";
import { ManageCoverageScreen } from "./pages/CoverageManager";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      {/* Material UI NavBar */}
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", gap: 2 }}>
          {/* Optional: Add a logo or title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
          <Button color="inherit" component={Link} to="/">
            🏡 Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/property/setup">
            🏠 Property Setup
          </Button>
          <Button color="inherit" component={Link} to="/coverage/browse">
            🔍 Browse Coverage
          </Button>
          <Button color="inherit" component={Link} to="/coverage/manage">
            ⚙️ Manage Coverage
          </Button>
          <Button color="inherit" component={Link} to="/property/edit">
            ⚙️ Edit Property
          </Button>
        </Toolbar>
      </AppBar>

      {/* Routing Setup */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/property/setup" element={<PropertySetup />} />
        <Route path="/coverage/browse" element={<BrowseCoverage />} />
        <Route path="/property/edit" element={<PropertyEdit />} />
        <Route path="/coverage/manage" element={<ManageCoverageScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
