import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Password validation: min 6 chars, includes number & letter
  const getPasswordStrength = (pwd) => {
    if (!pwd) return "";
    if (pwd.length < 6) return "Weak (Min 6 characters)";
    const hasNum = /\d/.test(pwd);
    const hasLetter = /[a-zA-Z]/.test(pwd);
    if (hasNum && hasLetter && pwd.length >= 8) return "Strong";
    return "Medium (Add letters/numbers)";
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, phone, password, confirmPassword } = form;

    // Simple validations
    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }

    // Email regex check
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Phone check (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
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
      await register(name, email, phone, password, confirmPassword);
      setSuccess("Account registered successfully! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.message || "Registration failed. Try again.");
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
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/login" className="font-semibold text-black hover:underline">
              sign in to your existing account
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

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                name="name"
                required
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>

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

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Phone size={18} />
              </span>
              <input
                type="tel"
                name="phone"
                required
                maxLength="10"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="10-digit number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Password
            </label>
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
            
            {/* Password strength feedback */}
            {form.password && (
              <div className="mt-1 text-xs">
                <span className="text-gray-500">Strength: </span>
                <span className={`font-semibold ${
                  strength === "Strong" ? "text-green-600" :
                  strength.startsWith("Medium") ? "text-yellow-600" : "text-red-500"
                }`}>{strength}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
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

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-black text-white hover:bg-gray-800 text-sm font-semibold tracking-wider uppercase py-3 rounded-lg transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Registering...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
