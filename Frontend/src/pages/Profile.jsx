import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { User, Phone, Lock, CheckCircle, AlertCircle, Camera } from "lucide-react";

const Profile = ({ embedded = false }) => {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profilePicture: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync state when user context is available
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
        profilePicture: user.profilePicture || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and Phone fields are required.");
      return;
    }

    if (form.phone.length !== 10 || !/^\d+$/.test(form.phone)) {
      setError("Please provide a valid 10-digit mobile number.");
      return;
    }

    if (form.password) {
      if (form.password.length < 6) {
        setError("New password must be at least 6 characters.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);
      const updateData = {
        name: form.name,
        phone: form.phone,
        profilePicture: form.profilePicture,
      };
      if (form.password) {
        updateData.password = form.password;
      }

      await updateProfile(updateData);
      setSuccess("Profile updated successfully!");
      // Reset password fields
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      setError(err.message || "Failed to update profile details.");
    } finally {
      setLoading(false);
    }
  };

  // Simulated avatar picker
  const handleRandomAvatar = () => {
    const avatarIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const randId = avatarIds[Math.floor(Math.random() * avatarIds.length)];
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=mayleki${randId}`;
    setForm((prev) => ({ ...prev, profilePicture: avatarUrl }));
    setSuccess("Avatar selected! Click save to update.");
  };

  const formContent = (
    <div className="space-y-6">
      {/* Alert Messages */}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Profile Picture Mockup */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <img
              src={form.profilePicture || "https://api.dicebear.com/7.x/adventurer/svg?seed=mayleki-studio"}
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full border-2 border-black object-cover bg-gray-50 shadow-inner"
            />
            <button
              type="button"
              onClick={handleRandomAvatar}
              className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors shadow-lg cursor-pointer"
              title="Change Profile Picture"
            >
              <Camera size={14} />
            </button>
          </div>
          <span className="text-xs text-gray-500 font-sans tracking-wide">
            Click camera to pick a styled avatar placeholder
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
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

          {/* Mobile */}
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
                placeholder="10-digit mobile"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Change Password (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
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
                  type="password"
                  name="password"
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                />
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
                  type="password"
                  name="confirmPassword"
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Save Changes Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white hover:bg-gray-800 text-sm font-semibold tracking-wider uppercase py-3 rounded-lg transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:bg-gray-400"
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>

      </form>
    </div>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif border-b pb-4">
          Update Profile
        </h2>
        {formContent}
      </div>
    </div>
  );
};

export default Profile;
