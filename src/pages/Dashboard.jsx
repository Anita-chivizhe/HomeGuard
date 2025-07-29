import React, { useState, useEffect } from "react";
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
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";

export function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [userProperty, setUserProperty] = useState(null);
  const [userCoverages, setUserCoverages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoverages, setFilteredCoverages] = useState([]);

  const BASE_USER_URL = "https://6888dcefadf0e59551bbb892.mockapi.io";
  const BASE_DATA_URL = "https://688906bcadf0e59551bc3e30.mockapi.io";
  const CURRENT_USER_ID = "1";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userResponse = await fetch(
          `${BASE_USER_URL}/users/${CURRENT_USER_ID}`
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const user = await userResponse.json();
        setUserData(user);

        const propertyResponse = await fetch(
          `${BASE_DATA_URL}/userProperties?userId=${CURRENT_USER_ID}`
        );
        if (!propertyResponse.ok)
          throw new Error("Failed to fetch property data");
        const properties = await propertyResponse.json();
        setUserProperty(properties[0] || null);

        const coverageResponse = await fetch(
          `${BASE_DATA_URL}/userCoverage?userId=${CURRENT_USER_ID}`
        );
        if (!coverageResponse.ok)
          throw new Error("Failed to fetch coverage data");
        const coverages = await coverageResponse.json();
        setUserCoverages(coverages);
        setFilteredCoverages(coverages);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = userCoverages.filter((coverage) =>
      [coverage.type, coverage.plan, coverage.status]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredCoverages(filtered);
  }, [searchTerm, userCoverages]);

  const totalPremium = userCoverages.reduce((sum, c) => sum + c.premium, 0);

  const handleManageCoverage = (coverage) =>
    console.log("Managing coverage:", coverage);
  const handleEmergencyClaim = (coverage) =>
    console.log("Emergency claim for:", coverage);
  const handleBrowseOptions = () => console.log("Browse coverage options");

  if (loading) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: 40, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" style={{ marginTop: 20 }}>
          Loading your dashboard...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: 20 }}>
        <Alert severity="error" style={{ marginBottom: 20 }}>
          Error loading dashboard: {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: 20 }}>
        <Alert severity="warning">
          No user data found. Please check your account setup.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ paddingTop: 20, paddingBottom: 20 }}>
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

      <Box style={{ marginBottom: 30 }}>
        <Typography variant="h4" style={{ marginBottom: 10 }}>
          Welcome back, {userData.firstName}! 👋🏽
        </Typography>
        <Typography
          variant="h6"
          color="textSecondary"
          style={{ marginBottom: 15 }}
        >
          {userProperty
            ? `Your home at ${userProperty.address} is protected`
            : "Set up your property to get started"}
        </Typography>
        <Card
          style={{
            background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
            color: "white",
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
      </Box>

      <Box style={{ marginBottom: 20 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="🔍 Search coverages by type, plan, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        {searchTerm && (
          <Typography variant="body2" color="textSecondary">
            Showing {filteredCoverages.length} of {userCoverages.length}{" "}
            coverages
          </Typography>
        )}
      </Box>

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
            {searchTerm
              ? "No coverages match your search"
              : "No active coverages"}
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleBrowseOptions}
            >
              Browse Coverage Options
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredCoverages.map((coverage) => (
            <Grid
              item
              xs={12}
              md={6}
              key={coverage.userId + coverage.coverageTypeId}
            >
              <Card style={{ height: "100%" }}>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    style={{ marginBottom: 15 }}
                  >
                    <Typography variant="h4" style={{ marginRight: 15 }}>
                      {coverage.icon}
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
                    R{coverage.premium.toLocaleString()}
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
                    Coverage: {coverage.coverage}
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    style={{ marginBottom: 15, gap: "10px" }}
                  >
                    <Chip
                      label={coverage.status}
                      color={
                        coverage.status === "Active" ? "success" : "default"
                      }
                      size="small"
                    />
                    <Typography variant="caption" color="textSecondary">
                      Active Since:{" "}
                      {new Date(coverage.startDate).toLocaleDateString()}
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

      {userCoverages.length < 3 && (
        <Paper
          style={{ padding: 20, marginTop: 20, backgroundColor: "#e3f2fd" }}
        >
          <Typography variant="h6" style={{ marginBottom: 10 }}>
            💡 Enhance Your Protection
          </Typography>
          <Typography variant="body1" style={{ marginBottom: 15 }}>
            You have {userCoverages.length} of 3 possible coverage types.
            Consider adding more protection for complete peace of mind.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBrowseOptions}
          >
            Browse Coverage Options
          </Button>
        </Paper>
      )}
    </Container>
  );
}
