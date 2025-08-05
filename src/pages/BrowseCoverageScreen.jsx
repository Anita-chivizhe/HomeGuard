import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  ContactSupport as ContactSupportIcon,
} from "@mui/icons-material";

export function BrowseCoverage() {
  const navigate = useNavigate();
  const [coverageTypes, setCoverageTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to get coverage types from API
  async function getCoverageTypes() {
    const response = await fetch(
      "https://6888dcefadf0e59551bbb892.mockapi.io/coverageTypes"
    );
    const data = await response.json();
    return data;
  }

  // Load coverage types when component mounts
  async function loadCoverageTypes() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getCoverageTypes();
      setCoverageTypes(data);
    } catch (err) {
      setError("Failed to load coverage types");
      console.error(err);
    }

    setIsLoading(false);
  }

  // Load data when component mounts
  useEffect(() => {
    loadCoverageTypes();
  }, []);

  // Handle get quotes button
  function handleGetQuotes(coverageType) {
    alert(`Getting quotes for ${coverageType.type}`);
    // TODO: Navigate to quotes page
    // navigate(`/coverage/quotes/${coverageType.id}`);
  }

  // Handle learn more button
  function handleLearnMore(coverageType) {
    alert(`Learning more about ${coverageType.type}`);
    // TODO: Navigate to details page
    // navigate(`/coverage/details/${coverageType.id}`);
  }

  // Handle contact expert button
  function handleContactExpert() {
    alert("Contacting expert...");
    // TODO: Navigate to contact page
  }

  // Handle back to dashboard
  function handleBackToDashboard() {
    navigate("/");
  }

  // Show loading screen
  if (isLoading) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: 40, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" style={{ marginTop: 20 }}>
          Loading coverage options...
        </Typography>
      </Container>
    );
  }

  // Show error screen
  if (error) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: 20 }}>
        <Alert severity="error" style={{ marginBottom: 20 }}>
          Error: {error}
        </Alert>
        <Button variant="contained" onClick={loadCoverageTypes}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ paddingTop: 20, paddingBottom: 20 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" style={{ marginBottom: 20 }}>
        <IconButton
          onClick={handleBackToDashboard}
          style={{ marginRight: 10 }}
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1">
            Browse Coverage Types
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            style={{ marginTop: 5 }}
          >
            Choose the protection that fits your needs. You can add multiple
            coverage types.
          </Typography>
        </Box>
      </Box>

      {/* Coverage Types List */}
      {coverageTypes.length === 0 ? (
        <Paper
          style={{
            padding: 40,
            textAlign: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Typography variant="h6" style={{ marginBottom: 10 }}>
            No coverage types available
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Please check back later or contact support
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3} style={{ marginBottom: 40 }}>
          {coverageTypes.map((coverage, index) => (
            <Grid item xs={12} key={index}>
              <Card
                style={{
                  height: "100%",
                  border: `2px solid ${coverage.color || "#1976d2"}20`,
                }}
              >
                <CardContent style={{ padding: 30 }}>
                  <Grid container spacing={3} alignItems="center">
                    {/* Coverage Icon & Title */}
                    <Grid item xs={12} md={2}>
                      <Box textAlign="center">
                        <Box
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            backgroundColor: `${coverage.color || "#1976d2"}20`,
                            color: coverage.color || "#1976d2",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 40,
                            margin: "0 auto 15px auto",
                          }}
                        >
                          {coverage.icon || "📋"}
                        </Box>
                        <Typography
                          variant="h6"
                          style={{
                            fontWeight: "bold",
                            color: coverage.color || "#1976d2",
                          }}
                        >
                          {coverage.type}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Coverage Info */}
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="body1"
                        style={{ marginBottom: 20, lineHeight: 1.6 }}
                      >
                        {coverage.description}
                      </Typography>

                      <Box style={{ marginBottom: 20 }}>
                        <Typography
                          variant="subtitle2"
                          style={{
                            marginBottom: 10,
                            fontWeight: "bold",
                            color: "#666",
                          }}
                        >
                          Key Features:
                        </Typography>
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          style={{ gap: 8 }}
                        >
                          {(coverage.features || []).map((feature, idx) => (
                            <Chip
                              key={idx}
                              label={feature}
                              size="small"
                              style={{
                                backgroundColor: `${coverage.color || "#1976d2"}15`,
                                color: coverage.color || "#1976d2",
                                fontWeight: "500",
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Grid>

                    {/* Pricing & Actions */}
                    <Grid item xs={12} md={4}>
                      <Box textAlign="center">
                        <Typography
                          variant="h5"
                          style={{
                            color: coverage.color || "#1976d2",
                            fontWeight: "bold",
                            marginBottom: 20,
                          }}
                        >
                          {coverage.startingPrice || "From R500/month"}
                        </Typography>

                        <Box
                          display="flex"
                          flexDirection="column"
                          style={{ gap: 10 }}
                        >
                          <Button
                            variant="contained"
                            size="large"
                            onClick={() => handleGetQuotes(coverage)}
                            style={{
                              backgroundColor: coverage.color || "#1976d2",
                            }}
                          >
                            Get Quotes
                          </Button>

                          <Button
                            variant="outlined"
                            size="medium"
                            onClick={() => handleLearnMore(coverage)}
                            startIcon={<InfoIcon />}
                            style={{
                              borderColor: coverage.color || "#1976d2",
                              color: coverage.color || "#1976d2",
                            }}
                          >
                            Learn More
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Help Section */}
      <Paper
        style={{
          padding: 30,
          backgroundColor: "#f8f9fa",
          border: "1px solid #e0e0e0",
        }}
      >
        <Box textAlign="center">
          <ContactSupportIcon
            style={{ fontSize: 48, color: "#1976d2", marginBottom: 15 }}
          />
          <Typography
            variant="h5"
            style={{ marginBottom: 10, fontWeight: "bold" }}
          >
            Need Help Choosing?
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            style={{
              marginBottom: 20,
              maxWidth: 600,
              margin: "0 auto 20px auto",
            }}
          >
            Our insurance experts can help you find the perfect coverage
            combination for your specific needs and budget.
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            style={{ gap: 15, flexWrap: "wrap" }}
          >
            <Button
              variant="outlined"
              size="large"
              startIcon={<ContactSupportIcon />}
              onClick={handleContactExpert}
              style={{ minWidth: 180 }}
            >
              Contact an Expert
            </Button>

            <Button
              variant="text"
              size="large"
              onClick={handleBackToDashboard}
              style={{ minWidth: 150 }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Coverage Summary Tip */}
      <Paper
        style={{
          padding: 20,
          marginTop: 20,
          backgroundColor: "#e3f2fd",
        }}
      >
        <Typography variant="body2" color="primary" textAlign="center">
          💡 <strong>Tip:</strong> You can combine multiple coverage types for
          comprehensive protection. Each coverage type is priced independently
          based on your property details.
        </Typography>
      </Paper>
    </Container>
  );
}
