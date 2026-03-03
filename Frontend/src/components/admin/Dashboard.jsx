import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [offers, setOffers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();
  
  // New state for features
  const [analytics, setAnalytics] = useState({ totalBookings: 0, totalRevenue: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [editingOffer, setEditingOffer] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", discount: "", validTill: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    discount: "",
    validTill: "",
  });

  const timeSlots = [
    "10:00 AM","11:00 AM","12:00 PM",
    "1:00 PM","2:00 PM","3:00 PM",
    "4:00 PM","5:00 PM","6:00 PM","7:00 PM"
  ];

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

  // ================= FETCH DATA =================
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch("${API_BASE_URL}/api/offers", {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      // Use /api/booking (singular) which maps to bookings.js
      const res = await fetch("${API_BASE_URL}/api/booking/admin/all", {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const res = await fetch("${API_BASE_URL}/api/analytics/dashboard", {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setAnalytics({
        totalBookings: data.totalBookings || 0,
        totalRevenue: data.totalRevenue || 0
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate statistics
  const getTodayBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(b => b.date === today).length;
  };

  const getWeekBookings = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return bookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      return bookingDate >= weekAgo;
    }).length;
  };

  const getRecentBookings = () => {
    return [...bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  useEffect(() => {
    fetchOffers();
    fetchBookings();
    fetchAnalytics();
  }, []);

  // ================= ADD OFFER =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("${API_BASE_URL}/api/offers", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      setForm({ title: "", description: "", discount: "", validTill: "" });
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT OFFER =================
  const startEditOffer = (offer) => {
    setEditingOffer(offer._id);
    setEditForm({
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      validTill: offer.validTill
    });
  };

  const saveEditOffer = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/offers/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(editForm),
      });
      setEditingOffer(null);
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingOffer(null);
    setEditForm({ title: "", description: "", discount: "", validTill: "" });
  };

  // ================= DELETE OFFER =================
  const deleteOffer = async (id) => {
    await fetch(`${API_BASE_URL}/api/offers/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    fetchOffers();
  };

  // ================= DELETE BOOKING =================
  const deleteBooking = async (id) => {
    try {
      // Use /api/booking (singular) for delete
      await fetch(`${API_BASE_URL}/api/booking/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      fetchBookings();
      fetchAnalytics();
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= SLOT CHECK =================
  // Fixed: Use timeSlot instead of time (matching MongoDB schema)
  const isSlotBooked = (slot) => {
  return bookings.some(
    (b) =>
      new Date(b.date).toISOString().split("T")[0] === selectedDate &&
      b.timeSlot === slot                  
  );
};

  // ================= FILTER & SEARCH BOOKINGS =================
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = searchQuery === "" || 
      (b.userName && b.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.phone && b.phone.includes(searchQuery));
    const matchesDate = filterDate === "" || b.date === filterDate;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-black text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <button onClick={() => setActiveTab("dashboard")} className={`block w-full text-left mb-3 hover:text-pink-400 ${activeTab === "dashboard" ? "text-pink-400" : ""}`}>
          Dashboard
        </button>

        <button onClick={() => setActiveTab("offers")} className={`block w-full text-left mb-3 hover:text-pink-400 ${activeTab === "offers" ? "text-pink-400" : ""}`}>
          Manage Offers
        </button>

        <button onClick={() => setActiveTab("bookings")} className={`block w-full text-left mb-3 hover:text-pink-400 ${activeTab === "bookings" ? "text-pink-400" : ""}`}>
          Manage Bookings
        </button>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-8">

        {/* DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Offers */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-semibold">Total Offers</h3>
                <p className="text-3xl text-pink-600">{offers.length}</p>
              </div>

              {/* Total Bookings */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-semibold">Total Bookings</h3>
                <p className="text-3xl text-blue-600">{analytics.totalBookings}</p>
              </div>

              {/* Today's Bookings */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-semibold">Today's Bookings</h3>
                <p className="text-3xl text-green-600">{getTodayBookings()}</p>
              </div>

              {/* This Week's Bookings */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-semibold">This Week</h3>
                <p className="text-3xl text-purple-600">{getWeekBookings()}</p>
              </div>

              {/* Total Revenue */}
              <div className="bg-white p-6 rounded-xl shadow col-span-2">
                <h3 className="text-xl font-semibold">Total Revenue</h3>
                <p className="text-3xl text-green-600">₹{analytics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
              <div className="bg-white rounded-xl shadow overflow-hidden">
                {getRecentBookings().length === 0 ? (
                  <p className="p-4 text-gray-500">No recent bookings</p>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">Customer</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Time</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getRecentBookings().map((booking) => (
                        <tr key={booking._id} className="border-t">
                          <td className="px-4 py-3">{booking.userName}</td>
                          <td className="px-4 py-3">{booking.date}</td>
                          <td className="px-4 py-3">{booking.timeSlot}</td>
                          <td className="px-4 py-3">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                              Confirmed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= OFFERS ================= */}
        {activeTab === "offers" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Manage Offers</h1>

            <form onSubmit={handleSubmit} className="space-y-3 mb-6 bg-white p-6 rounded shadow">
              <input
                placeholder="Title"
                className="border p-2 w-full"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <input
                placeholder="Description"
                className="border p-2 w-full"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <input
                placeholder="Discount"
                className="border p-2 w-full"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
              />

              <input
                type="date"
                className="border p-2 w-full"
                value={form.validTill}
                onChange={(e) => setForm({ ...form, validTill: e.target.value })}
              />

              <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
                Add Offer
              </button>
            </form>

            {loading ? (
              <p>Loading...</p>
            ) : (
              offers.map((offer) => (
                <div key={offer._id} className="bg-white p-4 mb-3 rounded shadow flex justify-between items-start">
                  {editingOffer === offer._id ? (
                    <div className="flex-1 space-y-2">
                      <input
                        className="border p-2 w-full"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="Title"
                      />
                      <input
                        className="border p-2 w-full"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Description"
                      />
                      <input
                        className="border p-2 w-full"
                        value={editForm.discount}
                        onChange={(e) => setEditForm({ ...editForm, discount: e.target.value })}
                        placeholder="Discount"
                      />
                      <input
                        type="date"
                        className="border p-2 w-full"
                        value={editForm.validTill}
                        onChange={(e) => setEditForm({ ...editForm, validTill: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEditOffer(offer._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-bold">{offer.title}</h3>
                      <p>{offer.description}</p>
                      <p className="text-red-500">{offer.discount}</p>
                      {offer.validTill && (
                      <p className="text-sm text-gray-500">Valid till: {offer.validTill}</p>
                      )}
                    </div>
                  )}

                  {editingOffer !== offer._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditOffer(offer)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteOffer(offer._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ================= BOOKINGS ================= */}
        {activeTab === "bookings" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by name or phone..."
                className="border p-2 flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <input
                type="date"
                className="border p-2"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              {(searchQuery || filterDate) && (
                <button
                  onClick={() => { setSearchQuery(""); setFilterDate(""); }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            <input
              type="date"
              className="border p-2 mb-6"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            {selectedDate && (
              <div className="grid grid-cols-5 gap-4 mb-8">
                {timeSlots.map((slot) => (
                  <div
                    key={slot}
                    className={`p-3 text-center rounded-lg font-semibold ${
                      isSlotBooked(slot)
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {slot}
                    <div className="text-xs">
                      {isSlotBooked(slot) ? "Booked" : "Available"}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h2 className="text-xl font-semibold mb-4">All Bookings ({filteredBookings.length})</h2>

            {filteredBookings.length === 0 ? (
              <p className="text-gray-500">No bookings found</p>
            ) : (
              filteredBookings.map((b) => (
                <div key={b._id} className="bg-white p-4 mb-2 rounded shadow flex justify-between items-center">
                  <div>
                    <p><strong>Name:</strong> {b.userName}</p>
                    <p><strong>Phone:</strong> {b.phone}</p>
                    <p><strong>Date:</strong> {b.date}</p>
                    <p><strong>Time:</strong> {b.timeSlot}</p>
                  </div>
                  
                  {deleteConfirm === b._id ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-red-600">Confirm delete?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteBooking(b._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(b._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
