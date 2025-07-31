import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
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
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

// Validation Schema (same as PropertySetup)
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

export function PropertyEdit() {
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // API URLs - matching your existing configuration
  const BASE_DATA_URL = "https://688906bcadf0e59551bc3e30.mockapi.io";
  const CURRENT_USER_ID = "1"; // Make this dynamic based on logged-in user

  // Fetch existing property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        const response = await fetch(
          `${BASE_DATA_URL}/userProperties?userId=${CURRENT_USER_ID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch property data");
        }

        const properties = await response.json();
        const userProperty = properties[0]; // Get first property for this user

        if (!userProperty) {
          throw new Error("No property found for this user");
        }

        setProperty(userProperty);
      } catch (error) {
        console.error("Error fetching property:", error);
        setFetchError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, []);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);

      // Prepare data for API (ensure property ID is included)
      const propertyData = {
        ...property, // Keep existing data like ID, userId, etc.
        address: values.address,
        propertyType: values.propertyType,
        propertyValue: values.propertyValue.toString(),
        bedrooms: values.bedrooms.toString(),
        bathrooms: values.bathrooms.toString(),
        yearBuilt: values.yearBuilt.toString(),
      };

      console.log("Updating property data:", propertyData);

      // API call to update property (PUT request)
      const response = await fetch(
        `${BASE_DATA_URL}/userProperties/${property.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(propertyData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update property: ${response.statusText}`);
      }

      const updatedProperty = await response.json();
      console.log("Property updated successfully:", updatedProperty);

      setProperty(updatedProperty);
      setSubmitSuccess(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating property:", error);
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container
        maxWidth="md"
        style={{ paddingTop: "40px", textAlign: "center" }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Loading property details...
        </Typography>
      </Container>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <Container maxWidth="md" style={{ paddingTop: "20px" }}>
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          {fetchError === "No property found for this user"
            ? "No property found. You need to set up your property first."
            : `Error loading property: ${fetchError}`}
        </Alert>
        <Box display="flex" style={{ gap: "15px" }}>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
          {fetchError === "No property found for this user" && (
            <Button
              variant="outlined"
              onClick={() => navigate("/property/setup")}
            >
              Set Up Property
            </Button>
          )}
          <Button variant="text" onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  // Prepare initial values from fetched property
  const initialValues = {
    address: property?.address || "",
    propertyType: property?.propertyType || "",
    propertyValue: property?.propertyValue || "",
    bedrooms: property?.bedrooms || "",
    bathrooms: property?.bathrooms || "",
    yearBuilt: property?.yearBuilt || "",
  };

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
          Edit Your Property
        </Typography>
      </Box>

      {/* Success Message */}
      {submitSuccess && (
        <Alert severity="success" style={{ marginBottom: "20px" }}>
          Property updated successfully! Your changes have been saved.
        </Alert>
      )}

      {/* Error Message */}
      {submitError && (
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          Error: {submitError}
        </Alert>
      )}

      {/* Current Property Info */}
      <Paper
        style={{
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: "#e3f2fd",
        }}
      >
        <Typography variant="h6" style={{ marginBottom: "10px" }}>
          📍 Current Property
        </Typography>
        <Box display="flex" style={{ gap: "10px", flexWrap: "wrap" }}>
          <Chip label={`📍 ${property?.address}`} />
          <Chip label={`🏠 ${property?.propertyType}`} />
          <Chip
            label={`💰 R${parseInt(
              property?.propertyValue || 0
            ).toLocaleString()}`}
          />
        </Box>
      </Paper>

      {/* Form Card */}
      <Card>
        <CardContent style={{ padding: "30px" }}>
          <Box
            display="flex"
            alignItems="center"
            style={{ marginBottom: "20px" }}
          >
            <EditIcon
              style={{
                fontSize: "40px",
                color: "#1976d2",
                marginRight: "15px",
              }}
            />
            <Box>
              <Typography variant="h5" style={{ marginBottom: "5px" }}>
                Update Property Information
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Make changes to your property details below
              </Typography>
            </Box>
          </Box>

          <Formik
            initialValues={initialValues}
            validationSchema={propertyValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true} // Important for pre-populated data
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
                      backgroundColor: "#e8f5e8",
                    }}
                  >
                    <Typography variant="body2" color="success.main">
                      💡 Updated Property Value: R
                      {parseInt(values.propertyValue || 0).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Changes to property value may affect your coverage
                      premiums
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
                    startIcon={<SaveIcon />}
                    style={{ minWidth: "150px" }}
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
                      "Save Changes"
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
          backgroundColor: "#fff3e0",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          💡 <strong>Note:</strong> Changes to your property details may affect
          your insurance premiums. Your existing coverage will be updated
          automatically with the new information.
        </Typography>
      </Paper>
    </Container>
  );
}
