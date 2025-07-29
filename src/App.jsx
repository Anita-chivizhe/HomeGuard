import { Link, Navigate, Route, Routes } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import "./styles.css";

// Component = UI + Logic
// Default Export
export default function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <Link to="/">🏡 Dashboard</Link>
          </li>
          {/* TODO: Add these routes as we build the components */}
          {/*
          <li>
            <Link to="/property/setup">🏠 Property Setup</Link>
          </li>
          <li>
            <Link to="/coverage/browse">🔍 Browse Coverage</Link>
          </li>
          <li>
            <Link to="/coverage/manage">⚙️ Manage Coverage</Link>
          </li>
          */}
        </ul>
      </nav>

      {/* Routing Setup */}
      <Routes>
        {/* Main dashboard route */}
        <Route path="/" element={<Dashboard />} />

        {/* Redirect /dashboard to / */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />

        {/* TODO: Add these routes as we build the components */}
        {/*
        <Route path="/property/setup" element={<PropertySetup />} />
        <Route path="/property/edit" element={<PropertyEdit />} />
        <Route path="/coverage/browse" element={<CoverageBrowse />} />
        <Route path="/coverage/manage" element={<CoverageManage />} />
        <Route path="/confirm" element={<ConfirmationPage />} />
        */}

        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
