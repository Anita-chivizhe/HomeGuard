// src/pages/ManageCoverageScreen.jsx
import React, { useEffect, useState } from "react";
import { Typography, Paper, Box, Button, Snackbar, Alert } from "@mui/material";

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

  useEffect(() => {
    fetch(`${COVERAGE_API}?userId=${CURRENT_USER_ID}`)
      .then((res) => res.json())
      .then(setUserCoverages)
      .catch((err) => {
        console.error(err);
        setError("Failed to load user coverages.");
      });
  }, []);

  const handleAddCoverage = async (coverage) => {
    try {
      const response = await fetch(COVERAGE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: CURRENT_USER_ID,
          status: "Active",
          startDate: new Date().toISOString(),
          ...coverage,
        }),
      });
      const newCoverage = await response.json();
      setUserCoverages((prev) => [...prev, newCoverage]);
      setSuccess(`${coverage.type} added.`);
    } catch (err) {
      console.error(err);
      setError("Failed to add coverage.");
    }
  };

  const handleDeleteCoverage = async (id) => {
    try {
      await fetch(`${COVERAGE_API}/${id}`, { method: "DELETE" });
      setUserCoverages((prev) => prev.filter((c) => c.id !== id));
      setSuccess("Coverage removed.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete coverage.");
    }
  };

  const addedCoverageIds = new Set(userCoverages.map((c) => c.coverageTypeId));

  return (
    <div className="screen-container">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button onClick={() => setCurrentScreen("dashboard")}>
          ← Back to Dashboard
        </Button>
        <Typography variant="h5">Manage Your Coverage Plans</Typography>
      </Box>

      <Paper elevation={3} style={{ padding: 24, marginTop: 16 }}>
        {COVERAGE_TYPES.map((cov) => {
          const exists = addedCoverageIds.has(cov.coverageTypeId);
          const current = userCoverages.find(
            (c) => c.coverageTypeId === cov.coverageTypeId
          );

          return (
            <Paper
              key={cov.coverageTypeId}
              style={{ padding: 16, margin: "16px 0" }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h6">
                    {cov.icon} {cov.type}
                  </Typography>
                  <Typography variant="body2">{cov.coverage}</Typography>
                  <Typography variant="caption">
                    Plan: {cov.plan}, R{cov.premium}/month
                  </Typography>
                </Box>
                <Box>
                  {exists ? (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteCoverage(current.id)}
                    >
                      Delete Plan
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handleAddCoverage(cov)}
                    >
                      Add Plan
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
        autoHideDuration={3000}
        onClose={() => setSuccess("")}
      >
        <Alert severity="success" onClose={() => setSuccess("")}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
