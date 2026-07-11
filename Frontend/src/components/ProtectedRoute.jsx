import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center">
        {/* Sleek Golden-Black Loader */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-sm tracking-widest text-gray-500 uppercase font-sans">
          Loading Mayleki Studio...
        </p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and save the state location so they can return
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
