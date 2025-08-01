// DashboardSearch.js
import { Box, TextField, Typography } from "@mui/material";

export default function DashboardSearch({ searchTerm, setSearchTerm, total }) {
  return (
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
          Showing filtered results of {total} coverages
        </Typography>
      )}
    </Box>
  );
}
