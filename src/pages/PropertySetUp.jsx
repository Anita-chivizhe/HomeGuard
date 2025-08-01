import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { object, string, number } from "yup";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Avatar,
  LinearProgress,
  Chip,
  useTheme,
} from "@mui/material";
import {
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { PropertyConfirmation } from "./PropertyConfirmation";

// Validation Schema
const propertyValidationSchema = object({
  address: string()
    .required("Property address is required")
    .min(10, "Address must be at least 10 characters long"),
  propertyType: string()
    .required("Property type is required")
    .oneOf(
      ["House", "Apartment", "Townhouse", "Condo"],
      "Please select a valid property type"
    ),
  propertyValue: number()
    .required("Property value is required")
    .min(100000, "Property value must be at least R100,000")
    .max(50000000, "Property value cannot exceed R50,000,000"),
  bedrooms: number()
    .required("Number of bedrooms is required")
    .min(1, "Must have at least 1 bedroom")
    .max(20, "Cannot exceed 20 bedrooms"),
  bathrooms: number()
    .required("Number of bathrooms is required")
    .min(1, "Must have at least 1 bathroom")
    .max(20, "Cannot exceed 20 bathrooms"),
  yearBuilt: number()
    .required("Year built is required")
    .min(1800, "Year built cannot be before 1800")
    .max(new Date().getFullYear(), `Year built cannot be in the future`),
});

// Property type options
const propertyTypes = [
  { value: "House", label: "House" },
  { value: "Apartment", label: "Apartment" },
  { value: "Townhouse", label: "Townhouse" },
  { value: "Condo", label: "Condo" },
];

export function PropertySetup() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [savedProperty, setSavedProperty] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // API URLs - matching your Dashboard configuration
  const BASE_DATA_URL = "https://688906bcadf0e59551bc3e30.mockapi.io";
  const CURRENT_USER_ID = "1"; // Make this dynamic based on logged-in user

  // Handle form submission
  const handleSubmitForm = async (values) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);

      // Prepare data for API
      const propertyData = {
        userId: CURRENT_USER_ID,
        address: values.address,
        propertyType: values.propertyType,
        propertyValue: values.propertyValue.toString(),
        bedrooms: values.bedrooms.toString(),
        bathrooms: values.bathrooms.toString(),
        yearBuilt: values.yearBuilt.toString(),
      };

      console.log("Submitting property data:", propertyData);

      // API call to save property
      const response = await fetch(`${BASE_DATA_URL}/userProperties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save property: ${response.statusText}`);
      }

      const savedProperty = await response.json();
      console.log("Property saved successfully:", savedProperty);

      setSavedProperty(savedProperty);
      setSubmitSuccess(true);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error saving property:", error);
      setSubmitError(error.message);
    }
  };

  // useFormik hook
  const { handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting } =
    useFormik({
      initialValues: {
        address: "",
        propertyType: "",
        propertyValue: "",
        bedrooms: "",
        bathrooms: "",
        yearBuilt: "",
      },
      validationSchema: propertyValidationSchema,
      onSubmit: handleSubmitForm,
    });

  // Calculate form completion percentage
  const getFormCompletion = (values) => {
    const fields = ["address", "propertyType", "propertyValue", "bedrooms", "bathrooms", "yearBuilt"];
    const filledFields = fields.filter(field => values[field] && values[field] !== "");
    return (filledFields.length / fields.length) * 100;
  };

  // If showing confirmation, render confirmation page
  if (showConfirmation && savedProperty) {
    return (
      <PropertyConfirmation
        savedProperty={savedProperty}
        onBackToDashboard={() => navigate("/")}
        onBrowseCoverage={() => navigate("/coverage/browse")}
      />
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", pb: 4 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            background: theme.palette.mode === 'dark'
              ? "linear-gradient(135deg, #424242 0%, #616161 100%)"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 3,
            mb: 3,
            overflow: "hidden",
          }}
        >
          <Container maxWidth="xl" sx={{ px: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py={3}
            >
              <Box>
                <Typography
                  variant="h3"
                  fontWeight="700"
                  sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}
                >
                  <HomeIcon sx={{ mr: 1, fontSize: "inherit" }} />
                  Set Up Your Property
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    opacity: 0.9,
                    mt: 1,
                    fontSize: { xs: "1rem", md: "1.2rem" },
                  }}
                >
                  Tell us about your home to get accurate insurance quotes 🏠
                </Typography>
              </Box>
            </Box>
          </Container>
        </Paper>

        {/* Success Message */}
        {submitSuccess && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              "& .MuiAlert-icon": {
                fontSize: "1.5rem"
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <CheckCircleIcon />
              Property saved successfully! Redirecting to coverage options...
            </Box>
          </Alert>
        )}

        {/* Error Message */}
        {submitError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              "& .MuiAlert-icon": {
                fontSize: "1.5rem"
              }
            }}
          >
            <Typography fontWeight="600">Error: {submitError}</Typography>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Progress Card */}
          <Card
            elevation={2}
            sx={{
              mb: 3,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 48,
                    height: 48,
                  }}
                >
                  <TrendingUpIcon />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="600">
                    Setup Progress
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(getFormCompletion(values))}% Complete
                  </Typography>
                </Box>
                <Chip
                  label={`${Math.round(getFormCompletion(values))}%`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={getFormCompletion(values)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                }}
              />
            </CardContent>
          </Card>

          {/* Main Form Card */}
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                display="flex"
                alignItems="center"
                sx={{ mb: 4 }}
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    mr: 2,
                    width: 56,
                    height: 56,
                  }}
                >
                  <HomeIcon sx={{ fontSize: "2rem" }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="600" sx={{ mb: 0.5 }}>
                    Property Information
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Complete all fields to get the most accurate quotes
                  </Typography>
                </Box>
              </Box>

              {/* Property Address */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  name="address"
                  label="Property Address"
                  placeholder="123 Main Street, Cape Town, Western Cape"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              {/* Property Type and Value */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    name="propertyType"
                    label="Property Type"
                    value={values.propertyType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.propertyType && Boolean(errors.propertyType)
                    }
                    helperText={touched.propertyType && errors.propertyType}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select property type...</em>
                    </MenuItem>
                    {propertyTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="propertyValue"
                    label="Property Value (ZAR)"
                    type="number"
                    placeholder="2500000"
                    value={values.propertyValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.propertyValue && Boolean(errors.propertyValue)
                    }
                    helperText={touched.propertyValue && errors.propertyValue}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <Typography color="text.secondary" sx={{ mr: 1 }}>
                          R
                        </Typography>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Bedrooms, Bathrooms, Year Built */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="bedrooms"
                    label="Bedrooms"
                    type="number"
                    placeholder="3"
                    value={values.bedrooms}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.bedrooms && Boolean(errors.bedrooms)}
                    helperText={touched.bedrooms && errors.bedrooms}
                    variant="outlined"
                    inputProps={{ min: 1, max: 20 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="bathrooms"
                    label="Bathrooms"
                    type="number"
                    placeholder="2"
                    value={values.bathrooms}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.bathrooms && Boolean(errors.bathrooms)}
                    helperText={touched.bathrooms && errors.bathrooms}
                    variant="outlined"
                    inputProps={{ min: 1, max: 20 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="yearBuilt"
                    label="Year Built"
                    type="number"
                    placeholder="2015"
                    value={values.yearBuilt}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.yearBuilt && Boolean(errors.yearBuilt)}
                    helperText={touched.yearBuilt && errors.yearBuilt}
                    variant="outlined"
                    inputProps={{
                      min: 1800,
                      max: new Date().getFullYear(),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Property Value Summary */}
              {values.propertyValue && !errors.propertyValue && (
                <Card
                  elevation={0}
                  sx={{
                    mb: 4,
                    bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.lighter',
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          width: 40,
                          height: 40,
                        }}
                      >
                        💡
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="600" color="primary.main">
                          Property Value: R{parseInt(values.propertyValue || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          This value will be used to calculate your coverage options and premiums
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Form Actions */}
              <Box
                display="flex"
                justifyContent="space-between"
                gap={2}
                sx={{ mt: 4 }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/")}
                  disabled={isSubmitting}
                  sx={{
                    minWidth: "120px",
                    borderRadius: 2,
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    minWidth: "200px",
                    borderRadius: 2,
                    fontWeight: "600",
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 4,
                    },
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress
                        size={20}
                        sx={{ mr: 1, color: "white" }}
                      />
                      Saving...
                    </>
                  ) : (
                    "Save & Browse Coverage"
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>

        {/* Help Section */}
        <Card
          elevation={1}
          sx={{
            mt: 3,
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar
                sx={{
                  bgcolor: "info.main",
                  width: 40,
                  height: 40,
                }}
              >
                💡
              </Avatar>
              <Typography variant="h6" fontWeight="600">
                Why do we need this information?
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Property value</strong> helps determine coverage limits
                  <br />• <strong>Property type & age</strong> affect risk assessment
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Size details</strong> help calculate replacement costs
                  <br />• <strong>Location</strong> impacts premium rates and coverage options
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
