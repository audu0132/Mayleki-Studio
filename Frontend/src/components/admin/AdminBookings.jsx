import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "../../config";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
      "Content-Type": "application/json",
      "Authorization": token || ""
    };
  };

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Use /api/booking (singular) which maps to bookings.js
       const res = await fetch(`${API_BASE_URL}/booking`, {
  headers: getAuthHeaders()
});
        
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }
        
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        <span className="ml-2 text-gray-600">Loading bookings...</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        📅 All Bookings
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="font-bold text-lg">
                {booking.userName}
              </h2>

              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.timeSlot}</p>

              <p className="text-sm text-gray-500 mt-2">
                Booked On: {new Date(booking.createdAt).toDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
