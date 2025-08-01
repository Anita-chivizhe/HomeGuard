export default function CoverageCardList({ filtered, onManage, onEmergency }) {
  if (filtered.length === 0) {
    return (
      <Paper
        style={{ padding: 40, textAlign: "center", backgroundColor: "#f5f5f5" }}
      >
        <Typography variant="h6" style={{ marginBottom: 10 }}>
          No matching coverages
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          style={{ marginBottom: 20 }}
        >
          Try adjusting your search terms
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {filtered.map((coverage) => (
        <Grid item xs={12} md={6} key={coverage.id}>
          <Card style={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h4" mr={2}>
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
              <Typography variant="h4" color="primary" mb={1}>
                R{coverage.premium.toLocaleString()}
                <Typography
                  variant="body2"
                  component="span"
                  color="textSecondary"
                >
                  /month
                </Typography>
              </Typography>
              <Typography variant="body2" color="textSecondary" mb={2}>
                Coverage: {coverage.coverage}
              </Typography>
              <Box display="flex" alignItems="center" mb={2} gap={1}>
                <Chip
                  label={coverage.status}
                  color={coverage.status === "Active" ? "success" : "default"}
                  size="small"
                />
                <Typography variant="caption" color="textSecondary">
                  Active Since:{" "}
                  {new Date(coverage.startDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => onManage(coverage)}
                >
                  Manage
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  fullWidth
                  onClick={() => onEmergency(coverage)}
                >
                  Emergency
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
