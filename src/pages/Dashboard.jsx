import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

export function Dashboard() {
  const [userData, setUserData] = useState({});
  const [userCoverages, setUserCoverages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const CURRENT_USER_ID = "1";

  // Function to get user data
  async function getUserData() {
    const response = await fetch(
      `https://6888dcefadf0e59551bbb892.mockapi.io/users/${CURRENT_USER_ID}`
    );
    const user = await response.json();
    return user;
  }

  // Function to get coverage data
  async function getUserCoverages() {
    const response = await fetch(
      `https://688906bcadf0e59551bc3e30.mockapi.io/userCoverage?userId=${CURRENT_USER_ID}`
    );
    const coverages = await response.json();
    return coverages;
  }

  // Function to load all dashboard data
  async function loadDashboardData() {
    setIsLoading(true);
    setError("");
    
    try {
      const user = await getUserData();
      const coverages = await getUserCoverages();
      
      setUserData(user);
      setUserCoverages(coverages);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    }
    
    setIsLoading(false);
  }

  // Load data when component mounts
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filter coverages based on search
  const filteredCoverages = userCoverages.filter((coverage) =>
    coverage.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coverage.plan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total premium
  const totalPremium = userCoverages.reduce((sum, coverage) => {
    return sum + (coverage.premium || 0);
  }, 0);

  // Handle manage coverage click
  function handleManageCoverage(coverage) {
    alert(`Managing ${coverage.type} coverage`);
  }

  // Handle emergency claim
  function handleEmergencyClaim(coverage) {
    alert(`Emergency service activated for ${coverage.type}!`);
  }

  // Handle refresh button
  function handleRefresh() {
    loadDashboardData();
  }

  // Show loading screen
  if (isLoading) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: 40, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" style={{ marginTop: 20 }}>
          Loading your dashboard...
        </Typography>
      </Container>
    );
  }

  // Show error screen
  if (error) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: 20 }}>
        <Alert severity="error" style={{ marginBottom: 20 }}>
          Error loading dashboard: {error}
        </Alert>
        <Button variant="contained" onClick={handleRefresh}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ paddingTop: 20, paddingBottom: 20 }}>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        style={{ marginBottom: 30 }}
      >
        <Box>
          <Typography variant="h4" style={{ marginBottom: 10 }}>
            Welcome back, {userData.firstName}! 👋
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Your insurance dashboard
          </Typography>
        </Box>
        <IconButton onClick={handleRefresh} title="Refresh dashboard data">
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Premium Summary */}
      <Card
        style={{
          background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
          color: "white",
          marginBottom: 30,
        }}
      >
        <CardContent>
          <Typography variant="h5">
            Total Premium: R{totalPremium.toLocaleString()}/month
          </Typography>
          <Typography variant="body2" style={{ opacity: 0.9, marginTop: 5 }}>
            {userCoverages.length} active coverage
            {userCoverages.length !== 1 ? "s" : ""}
          </Typography>
        </CardContent>
      </Card>

      {/* Search Box */}
      <Box style={{ marginBottom: 20 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="🔍 Search coverages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        {searchTerm && (
          <Typography variant="body2" color="textSecondary">
            Showing {filteredCoverages.length} of {userCoverages.length} coverages
          </Typography>
        )}
      </Box>

      {/* Coverages Section */}
      <Typography variant="h5" style={{ marginBottom: 20 }}>
        Your Active Coverages ({filteredCoverages.length})
      </Typography>

      {filteredCoverages.length === 0 ? (
        <Paper
          style={{
            padding: 40,
            textAlign: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Typography variant="h6" style={{ marginBottom: 10 }}>
            {searchTerm ? "No coverages match your search" : "No active coverages"}
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            style={{ marginBottom: 20 }}
          >
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by browsing our coverage options"}
          </Typography>
          {!searchTerm && (
            <Button variant="contained" color="primary">
              Browse Coverage Options
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredCoverages.map((coverage, index) => (
            <Grid item xs={12} md={6} key={coverage.id || index}>
              <Card style={{ height: "100%" }}>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    style={{ marginBottom: 15 }}
                  >
                    <Typography variant="h4" style={{ marginRight: 15 }}>
                      {coverage.icon || "📋"}
                    </Typography>
                    <Box>
                      <Typography variant="h6">{coverage.type}</Typography>
                      <Chip
                        label={`${coverage.plan} Plan`}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </Box>
                  
                  <Typography
                    variant="h4"
                    color="primary"
                    style={{ marginBottom: 10 }}
                  >
                    R{(coverage.premium || 0).toLocaleString()}
                    <Typography
                      variant="body2"
                      component="span"
                      color="textSecondary"
                    >
                      /month
                    </Typography>
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ marginBottom: 10 }}
                  >
                    Coverage: {coverage.coverage || "Standard coverage"}
                  </Typography>
                  
                  <Box
                    display="flex"
                    alignItems="center"
                    style={{ marginBottom: 15, gap: "10px" }}
                  >
                    <Chip
                      label={coverage.status || "Active"}
                      color={coverage.status === "Active" ? "success" : "default"}
                      size="small"
                    />
                    <Typography variant="caption" color="textSecondary">
                      Active Since:{" "}
                      {coverage.startDate
                        ? new Date(coverage.startDate).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" style={{ gap: "10px" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleManageCoverage(coverage)}
                      style={{ flex: 1 }}
                    >
                      Manage
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleEmergencyClaim(coverage)}
                      style={{ flex: 1 }}
                    >
                      Emergency
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
