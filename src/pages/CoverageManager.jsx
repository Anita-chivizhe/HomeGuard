// src/pages/ManageCoverageScreen.jsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";

const COVERAGE_API = "https://688906bcadf0e59551bc3e30.mockapi.io/userCoverage";
const CURRENT_USER_ID = "1";

const COVERAGE_TYPES = [
  {
    coverageTypeId: "1",
    type: "Property Damage",
    plan: "Premium",
    premium: 450,
    icon: "🏠",
    coverage: "Up to R2.5M",
  },
  {
    coverageTypeId: "2",
    type: "Mortgage Protection",
    plan: "Standard",
    premium: 380,
    icon: "🏦",
    coverage: "Up to 50% of mortgage",
  },
  {
    coverageTypeId: "3",
    type: "Emergency Repairs",
    plan: "Basic",
    premium: 200,
    icon: "🔧",
    coverage: "Up to R50k/year",
  },
];

export function ManageCoverageScreen({ setCurrentScreen }) {
  const [userCoverages, setUserCoverages] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Load existing coverages
  useEffect(() => {
    const loadCoverages = async () => {
      try {
        setLoading(true);
        console.log("🔄 Loading user coverages...");

        const response = await fetch(
          `${COVERAGE_API}?userId=${CURRENT_USER_ID}`
        );
        console.log("📡 API Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("📦 Loaded coverages:", data);

        setUserCoverages(data);
        setError("");
      } catch (err) {
        console.error("❌ Error loading coverages:", err);
        setError(`Failed to load coverages: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadCoverages();
  }, []);

  const handleAddCoverage = async (coverage) => {
    try {
      setActionLoading(coverage.coverageTypeId);
      console.log("➕ Adding coverage:", coverage);

      const payload = {
        userId: CURRENT_USER_ID,
        coverageTypeId: coverage.coverageTypeId,
        type: coverage.type,
        plan: coverage.plan,
        premium: coverage.premium,
        icon: coverage.icon,
        coverage: coverage.coverage,
        status: "Active",
        startDate: new Date().toISOString(),
      };

      console.log("📤 Sending payload:", payload);

      const response = await fetch(COVERAGE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📡 POST Response status:", response.status);
      console.log("📡 POST Response headers:", [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const newCoverage = await response.json();
      console.log("✅ Created coverage:", newCoverage);

      setUserCoverages((prev) => [...prev, newCoverage]);
      setSuccess(`${coverage.type} plan added successfully!`);
      setError("");
    } catch (err) {
      console.error("❌ Error adding coverage:", err);
      setError(`Failed to add coverage: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCoverage = async (id) => {
    try {
      setActionLoading(`delete-${id}`);
      console.log("🗑️ Deleting coverage:", id);

      const response = await fetch(`${COVERAGE_API}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("📡 DELETE Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Delete API Error:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      setUserCoverages((prev) => prev.filter((c) => c.id !== id));
      setSuccess("Coverage plan removed successfully!");
      setError("");
    } catch (err) {
      console.error("❌ Error deleting coverage:", err);
      setError(`Failed to delete coverage: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Test API connectivity
  const testAPI = async () => {
    try {
      console.log("🧪 Testing API connectivity...");
      const response = await fetch(COVERAGE_API);
      console.log("📡 API Test - Status:", response.status);
      console.log("📡 API Test - Headers:", [...response.headers.entries()]);

      if (response.ok) {
        const data = await response.json();
        console.log("📦 API Test - Sample data:", data.slice(0, 2));
        setSuccess("API connection successful!");
      } else {
        throw new Error(`API test failed: ${response.status}`);
      }
    } catch (err) {
      console.error("❌ API Test failed:", err);
      setError(`API test failed: ${err.message}`);
    }
  };

  const addedCoverageIds = new Set(userCoverages.map((c) => c.coverageTypeId));

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading coverage plans...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Button
          variant="outlined"
          onClick={() => setCurrentScreen && setCurrentScreen("dashboard")}
        >
          ← Back to Dashboard
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Manage Coverage Plans
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Available Coverage Types
        </Typography>

        {COVERAGE_TYPES.map((cov) => {
          const exists = addedCoverageIds.has(cov.coverageTypeId);
          const current = userCoverages.find(
            (c) => c.coverageTypeId === cov.coverageTypeId
          );
          const isLoading =
            actionLoading === cov.coverageTypeId ||
            actionLoading === `delete-${current?.id}`;

          return (
            <Paper
              key={cov.coverageTypeId}
              elevation={1}
              sx={{ p: 2, mb: 2, border: "1px solid #e0e0e0" }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box flex={1}>
                  <Typography variant="h6" gutterBottom>
                    {cov.icon} {cov.type}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {cov.coverage}
                  </Typography>
                  <Typography variant="caption" color="primary.main">
                    {cov.plan} Plan • R{cov.premium.toLocaleString()}/month
                  </Typography>
                  {exists && (
                    <Typography
                      variant="caption"
                      color="success.main"
                      display="block"
                    >
                      ✅ Currently Active (Added:{" "}
                      {current?.startDate
                        ? new Date(current.startDate).toLocaleDateString()
                        : "Unknown"}
                      )
                    </Typography>
                  )}
                </Box>

                <Box>
                  {exists ? (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteCoverage(current.id)}
                      disabled={isLoading}
                      startIcon={
                        isLoading ? <CircularProgress size={16} /> : null
                      }
                    >
                      {isLoading ? "Removing..." : "Remove Plan"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddCoverage(cov)}
                      disabled={isLoading}
                      startIcon={
                        isLoading ? <CircularProgress size={16} /> : null
                      }
                    >
                      {isLoading ? "Adding..." : "Add Plan"}
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Paper>
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setSuccess("")}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
