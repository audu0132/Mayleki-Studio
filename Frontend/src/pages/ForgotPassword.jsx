import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Key } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Request, 2 = Reset
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [simulatedToken, setSimulatedToken] = useState("");

  // Step 1: Request Reset Code
  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please provide your email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/auth/forgot-password", { email });
      if (res.data && res.data.success) {
        setSuccess("Reset code generated! Please see below.");
        // Capture token from response so the user can easily reset without email setups
        setSimulatedToken(res.data.resetToken || "");
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate reset code. Verify email.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(`/api/auth/reset-password/${token}`, { password });
      if (res.data && res.data.success) {
        setSuccess("Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Reset token is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="text-3xl font-serif font-bold uppercase tracking-wider text-black">
            Mayleki
            <span className="block text-xs font-sans font-normal tracking-widest text-gray-500 normal-case">
              Studio & Academy
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-sans font-bold tracking-tight text-gray-900">
            Reset Password
          </h2>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 text-sm border border-red-100 animate-fadeIn">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2 text-sm border border-green-100 animate-fadeIn">
            <CheckCircle size={18} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Step 1 Form: Request Token */}
        {step === 1 && (
          <form className="mt-4 space-y-4" onSubmit={handleRequestToken}>
            <p className="text-sm text-gray-600 text-center">
              Enter your registered email address and we'll generate a verification code to reset your password.
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-800 text-sm font-semibold tracking-wider uppercase py-3 rounded-lg transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:bg-gray-400"
            >
              {loading ? "Generating Code..." : "Get Reset Code"}
            </button>
          </form>
        )}

        {/* Step 2 Form: Reset Password */}
        {step === 2 && (
          <form className="mt-4 space-y-4" onSubmit={handleResetPassword}>
            {/* Developer Notice displaying simulated code */}
            {simulatedToken && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-xs space-y-1">
                <p className="font-semibold">Simulated Reset Code (Local Demo):</p>
                <code className="bg-white px-2 py-0.5 border border-yellow-300 font-mono block text-center rounded text-sm font-bold text-black select-all">
                  {simulatedToken}
                </code>
                <p className="text-[10px] text-gray-500">Normally sent via email. Copy and paste into the Code field below.</p>
              </div>
            )}

            {/* Reset Code */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Reset Code
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Key size={18} />
                </span>
                <input
                  type="text"
                  required
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black font-mono font-bold"
                  placeholder="Paste reset code here"
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value);
                    setError("");
                  }}
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-800 text-sm font-semibold tracking-wider uppercase py-3 rounded-lg transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:bg-gray-400"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-black hover:underline">
            Back to login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
