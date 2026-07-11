import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored token and fetch user details on initial mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (storedToken) {
        try {
          setToken(storedToken);
          // Set authorization header explicitly for this check
          const res = await api.get("/api/auth/profile", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          if (res.data && res.data.success) {
            setUser(res.data.user);
          } else {
            // Invalid token
            handleClearAuth();
          }
        } catch (error) {
          console.error("Failed to load user details on startup:", error);
          handleClearAuth();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const handleClearAuth = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Register User
  const register = async (name, email, phone, password, confirmPassword) => {
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        phone,
        password,
        confirmPassword,
      });

      if (res.data && res.data.success) {
        const userToken = res.data.token;
        // Default register to standard session storage
        sessionStorage.setItem("token", userToken);
        setToken(userToken);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: "Registration succeeded but no session returned." };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed. Please try again.";
      throw new Error(errMsg);
    }
  };

  // Login User
  const login = async (email, password, rememberMe) => {
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
        rememberMe,
      });

      if (res.data && res.data.success) {
        const userToken = res.data.token;
        if (rememberMe) {
          localStorage.setItem("token", userToken);
        } else {
          sessionStorage.setItem("token", userToken);
        }
        setToken(userToken);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: "Invalid credentials" };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Login failed. Please try again.";
      throw new Error(errMsg);
    }
  };

  // Logout User
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.warn("Logout endpoint warning:", error);
    } finally {
      handleClearAuth();
    }
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put("/api/auth/profile", profileData);
      if (res.data && res.data.success) {
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: "Failed to update profile details" };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Profile update failed.";
      throw new Error(errMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
