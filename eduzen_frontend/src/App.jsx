import { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
// Optional if we want bootstrap utils, but using custom css mostly
import "./index.css";

import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
function App() {
  const [currentUser, setCurrentUser] = useState(() => AuthService.getCurrentUser());

  useEffect(() => {
    // Theme Initialization
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const user = AuthService.getCurrentUser();
    if (user && JSON.stringify(user) !== JSON.stringify(currentUser)) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Dynamic Navigation */}
      {!currentUser && (
        <nav className="glass nav-glass">
          <Link to={"/"} className="font-black text-gradient" style={{ fontSize: '1.6rem' }}>
            EduZen
          </Link>
          <div style={{ width: '40px' }} />
        </nav>
      )}

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/profile" element={<Navigate to="/dashboard" />} />
          <Route path="/home" element={<Navigate to="/login" />} />
        </Routes>
      </main>

      {!currentUser && (
        <footer className="text-center text-muted" style={{ padding: '3rem 0', fontSize: '0.9rem' }}>
          &copy; 2025 EduZen Management System. All rights reserved.
        </footer>
      )}
    </div>
  );
}

export default App;
