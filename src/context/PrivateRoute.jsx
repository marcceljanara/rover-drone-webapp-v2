// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Bisa diganti dengan spinner komponen milikmu
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect ke homepage (atau /login kalau ada halaman login)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
