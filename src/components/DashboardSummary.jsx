// DashboardSummary.js
import { Card, CardContent, Typography } from "@mui/material";
import { useDashboard } from "../pages/Dashboard1/DashboardContext";

export default function DashboardSummary() {
  const { userCoverages } = useDashboard();
  const total = userCoverages.reduce((sum, c) => sum + c.premium, 0);

  return (
    <Card
      style={{
        background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
        color: "white",
      }}
    >
      <CardContent>
        <Typography variant="h5">
          Total Premium: R{total.toLocaleString()}/month
        </Typography>
        <Typography variant="body2" style={{ opacity: 0.9, marginTop: 5 }}>
          {userCoverages.length} active coverage
          {userCoverages.length !== 1 ? "s" : ""}
        </Typography>
      </CardContent>
    </Card>
  );
}
