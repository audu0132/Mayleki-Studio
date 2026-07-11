import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Determine redirection target (fallback to /dashboard)
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);
      await login(form.email, form.password, form.rememberMe);
      setSuccess("Logged in successfully! Redirecting...");
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
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
            Sign In to Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/register" className="font-semibold text-black hover:underline">
              create a new customer account
            </Link>
          </p>
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

        <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
          
          {/* Email */}
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
                name="email"
                required
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-600 uppercase">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-gray-500 hover:text-black hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
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

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                checked={form.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                Remember me
              </label>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white hover:bg-gray-800 text-sm font-semibold tracking-wider uppercase py-3 rounded-lg transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
