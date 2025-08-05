import { useEffect, useState } from "react";

export function Dashboard() {
  const [userData, setUserData] = useState({});
  const [userCoverages, setUserCoverages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const CURRENT_USER_ID = "1";

  // Function to get user data
  async function getUserData() {
    const response = await fetch(
      `https://6888dcefadf0e59551bbb892.mockapi.io/users/${CURRENT_USER_ID}`
    );
    const user = await response.json();
    return user;
  }

  // Function to get coverage data
  async function getUserCoverages() {
    const response = await fetch(
      `https://688906bcadf0e59551bc3e30.mockapi.io/userCoverage?userId=${CURRENT_USER_ID}`
    );
    const coverages = await response.json();
    return coverages;
  }

  // Function to load all dashboard data
  async function loadDashboardData() {
    setIsLoading(true);
    setError("");
    
    try {
      const user = await getUserData();
      const coverages = await getUserCoverages();
      
      setUserData(user);
      setUserCoverages(coverages);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    }
    
    setIsLoading(false);
  }

  // Load data when component mounts
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filter coverages based on search
  const filteredCoverages = userCoverages.filter((coverage) =>
    coverage.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coverage.plan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total premium
  const totalPremium = userCoverages.reduce((sum, coverage) => {
    return sum + (coverage.premium || 0);
  }, 0);

  // Handle manage coverage click
  function handleManageCoverage(coverage) {
    alert(`Managing ${coverage.type} coverage`);
  }

  // Handle emergency claim
  function handleEmergencyClaim(coverage) {
    alert(`Emergency service activated for ${coverage.type}!`);
  }

  // Handle refresh button
  function handleRefresh() {
    loadDashboardData();
  }

  // Show loading screen
  if (isLoading) {
    return (
      <div className="dashboard-container">
        <h1>Loading your dashboard...</h1>
      </div>
    );
  }

  // Show error screen
  if (error) {
    return (
      <div className="dashboard-container">
        <h1>Error: {error}</h1>
        <button onClick={handleRefresh}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {userData.firstName}! 👋</h1>
          <p>Your insurance dashboard</p>
        </div>
        <button onClick={handleRefresh} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {/* Premium Summary */}
      <div className="premium-card">
        <h2>Total Premium: R{totalPremium.toLocaleString()}/month</h2>
        <p>{userCoverages.length} active coverages</p>
      </div>

      {/* Search Box */}
      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Search coverages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Coverages Section */}
      <h2>Your Active Coverages ({filteredCoverages.length})</h2>

      {filteredCoverages.length === 0 ? (
        <div className="no-coverages">
          <h3>No coverages found</h3>
          <p>Try adjusting your search or add new coverage</p>
        </div>
      ) : (
        <div className="coverages-grid">
          {filteredCoverages.map((coverage, index) => (
            <div key={coverage.id || index} className="coverage-card">
              <div className="coverage-header">
                <span className="coverage-icon">{coverage.icon || "📋"}</span>
                <div>
                  <h3>{coverage.type}</h3>
                  <span className="plan-badge">{coverage.plan} Plan</span>
                </div>
              </div>
              
              <div className="coverage-premium">
                <h2>R{(coverage.premium || 0).toLocaleString()}</h2>
                <span>/month</span>
              </div>
              
              <p className="coverage-description">
                {coverage.coverage || "Standard coverage"}
              </p>
              
              <div className="coverage-status">
                <span className="status-badge">{coverage.status || "Active"}</span>
                <span className="start-date">
                  Since: {coverage.startDate ? 
                    new Date(coverage.startDate).toLocaleDateString() : "N/A"}
                </span>
              </div>
              
              <div className="coverage-buttons">
                <button 
                  onClick={() => handleManageCoverage(coverage)}
                  className="manage-btn"
                >
                  Manage
                </button>
                <button 
                  onClick={() => handleEmergencyClaim(coverage)}
                  className="emergency-btn"
                >
                  Emergency
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
