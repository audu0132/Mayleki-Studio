import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../../config";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Validation
  const validateForm = () => {
    if (!email) return setError("Email is required"), false;
    if (!/\S+@\S+\.\S+/.test(email))
      return setError("Enter valid email"), false;
    if (!password) return setError("Password is required"), false;
    if (password.length < 6)
      return setError("Password must be at least 6 characters"), false;

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ Save token
      localStorage.setItem("adminToken", data.token);

      // clear form
      setEmail("");
      setPassword("");

      // redirect
      navigate("/admin/dashboard");

    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Admin Login
        </h2>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="admin@example.com"
            className="w-full border p-2 rounded-lg"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            disabled={loading}
            required
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full border p-2 pr-10 rounded-lg"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              disabled={loading}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2"
              disabled={loading}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white py-2 rounded-lg flex justify-center items-center gap-2 disabled:bg-pink-300"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* REGISTER LINK */}
        <div className="text-center text-sm">
          <Link
            to="/admin/registration"
            className="text-pink-600 hover:underline"
          >
            Create Admin Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;