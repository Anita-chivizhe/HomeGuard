import React from "react";
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
} from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";

export function PropertyConfirmation({
  savedProperty,
  onBackToDashboard,
  onBrowseCoverage,
}) {
  const navigate = useNavigate();

  // Handle navigation
  const handleBackToDashboard = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    } else {
      navigate("/");
    }
  };

  const handleBrowseCoverage = () => {
    if (onBrowseCoverage) {
      onBrowseCoverage();
    } else {
      navigate("/coverage/browse");
    }
  };

  if (!savedProperty) {
    return (
      <Container maxWidth="md" style={{ paddingTop: "20px" }}>
        <Typography variant="h6" color="error">
          No property data available
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      style={{ paddingTop: "20px", paddingBottom: "20px" }}
    >
      {/* Success Header */}
      <Box textAlign="center" style={{ marginBottom: "30px" }}>
        <Typography
          variant="h3"
          style={{ color: "#4caf50", marginBottom: "10px" }}
        >
          ✅ Property Saved Successfully!
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Your property information has been securely stored
        </Typography>
      </Box>

      {/* Property Summary Card */}
      <Card style={{ marginBottom: "30px" }}>
        <CardContent style={{ padding: "30px" }}>
          <Box
            display="flex"
            alignItems="center"
            style={{ marginBottom: "20px" }}
          >
            <HomeIcon
              style={{
                fontSize: "40px",
                color: "#4caf50",
                marginRight: "15px",
              }}
            />
            <Typography variant="h5">Property Summary</Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper style={{ padding: "15px", backgroundColor: "#f5f5f5" }}>
                <Typography variant="subtitle2" color="textSecondary">
                  ADDRESS
                </Typography>
                <Typography variant="h6" style={{ marginBottom: "10px" }}>
                  📍 {savedProperty.address}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper style={{ padding: "15px", backgroundColor: "#f5f5f5" }}>
                <Typography variant="subtitle2" color="textSecondary">
                  PROPERTY TYPE
                </Typography>
                <Typography variant="body1">
                  🏠 {savedProperty.propertyType}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper style={{ padding: "15px", backgroundColor: "#f5f5f5" }}>
                <Typography variant="subtitle2" color="textSecondary">
                  PROPERTY VALUE
                </Typography>
                <Typography
                  variant="body1"
                  style={{ color: "#1976d2", fontWeight: "bold" }}
                >
                  💰 R{parseInt(savedProperty.propertyValue).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={4}>
              <Paper
                style={{
                  padding: "15px",
                  backgroundColor: "#f5f5f5",
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  BEDROOMS
                </Typography>
                <Typography variant="h6">
                  🛏️ {savedProperty.bedrooms}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={4}>
              <Paper
                style={{
                  padding: "15px",
                  backgroundColor: "#f5f5f5",
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  BATHROOMS
                </Typography>
                <Typography variant="h6">
                  🚿 {savedProperty.bathrooms}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={4}>
              <Paper
                style={{
                  padding: "15px",
                  backgroundColor: "#f5f5f5",
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  YEAR BUILT
                </Typography>
                <Typography variant="h6">
                  📅 {savedProperty.yearBuilt}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card style={{ marginBottom: "20px", backgroundColor: "#e3f2fd" }}>
        <CardContent style={{ padding: "20px" }}>
          <Typography variant="h6" style={{ marginBottom: "15px" }}>
            🎯 What's Next?
          </Typography>
          <Typography variant="body1" style={{ marginBottom: "15px" }}>
            Now that your property is set up, you can browse our coverage
            options to protect your home. We'll use your property details to
            provide personalized insurance quotes.
          </Typography>
          <Box display="flex" style={{ gap: "10px", flexWrap: "wrap" }}>
            <Chip label="✅ Property information saved" color="success" />
            <Chip label="🔍 Ready for coverage quotes" color="primary" />
            <Chip label="🏠 Personalized recommendations" color="primary" />
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box
        display="flex"
        justifyContent="center"
        style={{ gap: "15px", flexWrap: "wrap" }}
      >
        <Button
          variant="outlined"
          size="large"
          onClick={handleBackToDashboard}
          style={{ minWidth: "150px" }}
        >
          Back to Dashboard
        </Button>

        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={handleBrowseCoverage}
          style={{ minWidth: "200px" }}
        >
          Browse Coverage Options
        </Button>
      </Box>

      {/* Help Section */}
      <Paper
        style={{
          padding: "20px",
          marginTop: "30px",
          backgroundColor: "#fff3e0",
        }}
      >
        <Typography variant="body2" color="textSecondary" textAlign="center">
          💡 <strong>Tip:</strong> You can always edit your property details
          later from your dashboard
        </Typography>
      </Paper>
    </Container>
  );
}
