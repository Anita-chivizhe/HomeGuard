import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
  IconButton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { PropertyConfirmation } from "./PropertyConfirmation";

// Validation Schema
const propertyValidationSchema = Yup.object({
  address: Yup.string()
    .required("Property address is required")
    .min(10, "Address must be at least 10 characters long"),
  propertyType: Yup.string()
    .required("Property type is required")
    .oneOf(
      ["House", "Apartment", "Townhouse", "Condo"],
      "Please select a valid property type"
    ),
  propertyValue: Yup.number()
    .required("Property value is required")
    .min(100000, "Property value must be at least R100,000")
    .max(50000000, "Property value cannot exceed R50,000,000"),
  bedrooms: Yup.number()
    .required("Number of bedrooms is required")
    .min(1, "Must have at least 1 bedroom")
    .max(20, "Cannot exceed 20 bedrooms"),
  bathrooms: Yup.number()
    .required("Number of bathrooms is required")
    .min(1, "Must have at least 1 bathroom")
    .max(20, "Cannot exceed 20 bathrooms"),
  yearBuilt: Yup.number()
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
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [savedProperty, setSavedProperty] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // API URLs - matching your Dashboard configuration
  const BASE_DATA_URL = "https://688906bcadf0e59551bc3e30.mockapi.io";
  const CURRENT_USER_ID = "1"; // Make this dynamic based on logged-in user

  // Initial form values
  const initialValues = {
    address: "",
    propertyType: "",
    propertyValue: "",
    bedrooms: "",
    bathrooms: "",
    yearBuilt: "",
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
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
    } finally {
      setSubmitting(false);
    }
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
    <Container
      maxWidth="md"
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
        <Typography variant="h4" component="h1">
          Set Up Your Property
        </Typography>
      </Box>

      {/* Success Message */}
      {submitSuccess && (
        <Alert severity="success" style={{ marginBottom: "20px" }}>
          Property saved successfully! Redirecting to coverage options...
        </Alert>
      )}

      {/* Error Message */}
      {submitError && (
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          Error: {submitError}
        </Alert>
      )}

      {/* Form Card */}
      <Card>
        <CardContent style={{ padding: "30px" }}>
          <Box
            display="flex"
            alignItems="center"
            style={{ marginBottom: "20px" }}
          >
            <HomeIcon
              style={{
                fontSize: "40px",
                color: "#1976d2",
                marginRight: "15px",
              }}
            />
            <Box>
              <Typography variant="h5" style={{ marginBottom: "5px" }}>
                Property Information
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Tell us about your home to get accurate insurance quotes
              </Typography>
            </Box>
          </Box>

          <Formik
            initialValues={initialValues}
            validationSchema={propertyValidationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
            }) => (
              <Form>
                {/* Property Address */}
                <Box style={{ marginBottom: "20px" }}>
                  <TextField
                    fullWidth
                    name="address"
                    label="Property Address"
                    placeholder="123 Main Street, Cape Town"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                    variant="outlined"
                  />
                </Box>

                {/* Property Type and Value */}
                <Grid container spacing={3} style={{ marginBottom: "20px" }}>
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
                          <Typography color="textSecondary">R</Typography>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Bedrooms, Bathrooms, Year Built */}
                <Grid container spacing={3} style={{ marginBottom: "30px" }}>
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
                    />
                  </Grid>
                </Grid>

                {/* Property Value Summary */}
                {values.propertyValue && !errors.propertyValue && (
                  <Paper
                    style={{
                      padding: "15px",
                      marginBottom: "20px",
                      backgroundColor: "#e3f2fd",
                    }}
                  >
                    <Typography variant="body2" color="primary">
                      💡 Property Value: R
                      {parseInt(values.propertyValue || 0).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      This value will be used to calculate your coverage options
                      and premiums
                    </Typography>
                  </Paper>
                )}

                {/* Form Actions */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  style={{ gap: "15px" }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/")}
                    disabled={isSubmitting}
                    style={{ minWidth: "120px" }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    style={{ minWidth: "200px" }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress
                          size={20}
                          style={{ marginRight: "10px" }}
                        />
                        Saving...
                      </>
                    ) : (
                      "Save & Browse Coverage"
                    )}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Paper
        style={{
          padding: "20px",
          marginTop: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h6" style={{ marginBottom: "10px" }}>
          💡 Why do we need this information?
        </Typography>
        <Typography variant="body2" color="textSecondary">
          • <strong>Property value</strong> helps determine coverage limits
          <br />• <strong>Property type & age</strong> affect risk assessment
          <br />• <strong>Size details</strong> help calculate replacement costs
          <br />• <strong>Location</strong> impacts premium rates and coverage
          options
        </Typography>
      </Paper>
    </Container>
  );
}
