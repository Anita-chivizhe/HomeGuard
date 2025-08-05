import React, { useState, useEffect } from "react";
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
  Divider,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  ContactSupport as ContactSupportIcon,
} from "@mui/icons-material";

export function BrowseCoverage() {
  const navigate = useNavigate();
  const [coverageTypes, setCoverageTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const BASE_DATA_URL = "https://6888dcefadf0e59551bbb892.mockapi.io/";

  // Fetch coverage types from API
  useEffect(() => {
    const fetchCoverageTypes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${BASE_DATA_URL}/coverageTypes`);
        if (!response.ok) {
          throw new Error("Failed to fetch coverage types");
        }

        const data = await response.json();
        setCoverageTypes(data);
      } catch (err) {
        console.error("Error fetching coverage types:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverageTypes();
  }, []);

  // Handle button clicks
  const handleGetQuotes = (coverageType) => {
    console.log("Getting quotes for:", coverageType);
    // TODO: Navigate to quotes page with coverage type
    // navigate(`/coverage/quotes/${coverageType.id}`);
  };

  const handleLearnMore = (coverageType) => {
    console.log("Learn more about:", coverageType);
    // TODO: Navigate to detailed coverage info
    // navigate(`/coverage/details/${coverageType.id}`);
  };

  const handleContactExpert = () => {
    console.log("Contact expert clicked");
    // TODO: Navigate to contact page or open chat
  };

  // Loading state
  if (loading) {
    return (
      <Container
        maxWidth="lg"
        style={{ paddingTop: "40px", textAlign: "center" }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Loading coverage options...
        </Typography>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: "20px" }}>
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          Error loading coverage types: {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      style={{ paddingTop: "20px", paddingBottom: "20px" }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" style={{ marginBottom: "20px" }}>
        <IconButton
          onClick={() => navigate("/")}
          style={{ marginRight: "10px" }}
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
            style={{ marginTop: "5px" }}
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
            padding: "40px",
            textAlign: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            No coverage types available
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Please check back later or contact support
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3} style={{ marginBottom: "40px" }}>
          {coverageTypes.map((coverage, index) => (
            <Grid item xs={12} key={index}>
              <Card
                style={{
                  height: "100%",
                  border: `2px solid ${coverage.color}20`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent style={{ padding: "30px" }}>
                  <Grid container spacing={3} alignItems="center">
                    {/* Coverage Icon & Title */}
                    <Grid item xs={12} md={2}>
                      <Box textAlign="center">
                        <Box
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            backgroundColor: `${coverage.color}20`,
                            color: coverage.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "40px",
                            margin: "0 auto 15px auto",
                          }}
                        >
                          {coverage.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          style={{
                            fontWeight: "bold",
                            color: coverage.color,
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
                        style={{ marginBottom: "20px", lineHeight: 1.6 }}
                      >
                        {coverage.description}
                      </Typography>

                      <Box style={{ marginBottom: "20px" }}>
                        <Typography
                          variant="subtitle2"
                          style={{
                            marginBottom: "10px",
                            fontWeight: "bold",
                            color: "#666",
                          }}
                        >
                          Key Features:
                        </Typography>
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          style={{ gap: "8px" }}
                        >
                          {coverage.features.map((feature, idx) => (
                            <Chip
                              key={idx}
                              label={feature}
                              size="small"
                              style={{
                                backgroundColor: `${coverage.color}15`,
                                color: coverage.color,
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
                            color: coverage.color,
                            fontWeight: "bold",
                            marginBottom: "20px",
                          }}
                        >
                          {coverage.startingPrice}
                        </Typography>

                        <Box
                          display="flex"
                          flexDirection="column"
                          style={{ gap: "10px" }}
                        >
                          <Button
                            variant="contained"
                            size="large"
                            onClick={() => handleGetQuotes(coverage)}
                            style={{
                              backgroundColor: coverage.color,
                              "&:hover": {
                                backgroundColor: coverage.color,
                                opacity: 0.9,
                              },
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
                              borderColor: coverage.color,
                              color: coverage.color,
                              "&:hover": {
                                borderColor: coverage.color,
                                backgroundColor: `${coverage.color}10`,
                              },
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
          padding: "30px",
          backgroundColor: "#f8f9fa",
          border: "1px solid #e0e0e0",
        }}
      >
        <Box textAlign="center">
          <ContactSupportIcon
            style={{ fontSize: "48px", color: "#1976d2", marginBottom: "15px" }}
          />
          <Typography
            variant="h5"
            style={{ marginBottom: "10px", fontWeight: "bold" }}
          >
            Need Help Choosing?
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            style={{
              marginBottom: "20px",
              maxWidth: "600px",
              margin: "0 auto 20px auto",
            }}
          >
            Our insurance experts can help you find the perfect coverage
            combination for your specific needs and budget.
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            style={{ gap: "15px", flexWrap: "wrap" }}
          >
            <Button
              variant="outlined"
              size="large"
              startIcon={<ContactSupportIcon />}
              onClick={handleContactExpert}
              style={{ minWidth: "180px" }}
            >
              Contact an Expert
            </Button>

            <Button
              variant="text"
              size="large"
              onClick={() => navigate("/")}
              style={{ minWidth: "150px" }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Coverage Summary */}
      <Paper
        style={{
          padding: "20px",
          marginTop: "20px",
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
