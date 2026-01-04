import { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import axios from "axios";

import "./index.css";

import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/public/LandingPage";
import BecomeExpert from "./components/public/BecomeExpert";
import ApplicationStatus from "./components/public/ApplicationStatus";

function App() {
  const [currentUser, setCurrentUser] = useState(() => AuthService.getCurrentUser());

  useEffect(() => {
    // Standardize all axios calls to handle 401 errors globally
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          AuthService.logout();
          setCurrentUser(null);
          window.location.href = "/login?reason=stale";
        }
        return Promise.reject(error);
      }
    );

    // Theme Initialization
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const user = AuthService.getCurrentUser();
    if (user && JSON.stringify(user) !== JSON.stringify(currentUser)) {
      setCurrentUser(user);
    }

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/become-expert" element={<BecomeExpert />} />
          <Route path="/check-application-status" element={<ApplicationStatus />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={<Navigate to="/dashboard" />} />
          <Route path="/home" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
