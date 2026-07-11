import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import {
  LayoutDashboard,
  Gift,
  Calendar,
  GraduationCap,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  XCircle,
  TrendingUp,
  IndianRupee,
  Briefcase,
  Activity,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  AlertCircle,
  Sparkles
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");

  const [offers, setOffers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [courses, setCourses] = useState([]); // temporary empty until backend route exists

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [editingOffer, setEditingOffer] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    discount: "",
    validTill: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    discount: "",
    validTill: "",
  });

  const [courseForm, setCourseForm] = useState({
    title: "",
    duration: "",
    description: "",
    image: "",
    features: [""],
    isActive: true,
  });

  const [editingCourse, setEditingCourse] = useState(null);
  const [courseEditForm, setCourseEditForm] = useState({
    title: "",
    duration: "",
    description: "",
    image: "",
    features: [""],
    isActive: true,
  });

  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
  ];

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
      "Content-Type": "application/json",
      Authorization: token || "",
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/offers`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Offers API failed: ${res.status}`);
      }

      const data = await res.json();
      setOffers(Array.isArray(data) ? data : data.offers || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/booking`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Bookings API failed: ${res.status}`);
      }

      const data = await res.json();
      setBookings(Array.isArray(data) ? data : data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/analytics/dashboard`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Analytics API failed: ${res.status}`);
      }

      const data = await res.json();
      setAnalytics({
        totalBookings: data?.totalBookings || 0,
        totalRevenue: data?.totalRevenue || 0,
      });
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setAnalytics({
        totalBookings: 0,
        totalRevenue: 0,
      });
    }
  };

  // TEMPORARILY DISABLED because /api/courses backend route not available yet
  // const fetchCourses = async () => {
  //   try {
  //     const res = await fetch(`${API_BASE_URL}/api/courses`, {
  //       headers: getAuthHeaders(),
  //     });
  //
  //     if (!res.ok) {
  //       throw new Error(`Courses API failed: ${res.status}`);
  //     }
  //
  //     const data = await res.json();
  //     setCourses(Array.isArray(data) ? data : data.courses || []);
  //   } catch (err) {
  //     console.error("Error fetching courses:", err);
  //     setCourses([]);
  //   }
  // };

  useEffect(() => {
    fetchOffers();
    fetchBookings();
    fetchAnalytics();
    // fetchCourses();
  }, []);

  const getTodayBookings = () => {
    const today = new Date().toISOString().split("T")[0];
    return bookings.filter((b) => {
      if (!b.date) return false;
      const bookingDate = new Date(b.date).toISOString().split("T")[0];
      return bookingDate === today && b.status !== "Cancelled";
    }).length;
  };

  const getWeekBookings = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return bookings.filter((b) => {
      const bookingDate = new Date(b.createdAt || b.date || 0);
      return bookingDate >= weekAgo && b.status !== "Cancelled";
    }).length;
  };

  const getRecentBookings = () => {
    return [...bookings]
      .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
      .slice(0, 5);
  };

  const isSlotBooked = (slot) => {
    return bookings.some((b) => {
      if (!b.date || b.status === "Cancelled") return false;

      const bookingDate = new Date(b.date).toISOString().split("T")[0];
      const selected = selectedDate
        ? new Date(selectedDate).toISOString().split("T")[0]
        : "";

      return bookingDate === selected && (b.timeSlot === slot || b.time === slot);
    });
  };

  const filteredBookings = bookings.filter((b) => {
    const name = (b.userName || b.name || "").toLowerCase();
    const phone = String(b.phone || "");
    const search = searchQuery.toLowerCase().trim();

    const bookingDate = b.date
      ? new Date(b.date).toISOString().split("T")[0]
      : "";

    const selectedFilterDate = filterDate
      ? new Date(filterDate).toISOString().split("T")[0]
      : "";

    const matchesSearch =
      !search || name.includes(search) || phone.includes(search);

    const matchesDate =
      !selectedFilterDate || bookingDate === selectedFilterDate;

    return matchesSearch && matchesDate;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE_URL}/api/offers`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });

      setForm({
        title: "",
        description: "",
        discount: "",
        validTill: "",
      });

      fetchOffers();
    } catch (err) {
      console.error("Error adding offer:", err);
    }
  };

  const startEditOffer = (offer) => {
    setEditingOffer(offer._id);
    setEditForm({
      title: offer.title || "",
      description: offer.description || "",
      discount: offer.discount || "",
      validTill: offer.validTill ? offer.validTill.split("T")[0] : "",
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
      console.error("Error updating offer:", err);
    }
  };

  const cancelEdit = () => {
    setEditingOffer(null);
    setEditForm({
      title: "",
      description: "",
      discount: "",
      validTill: "",
    });
  };

  const deleteOffer = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/offers/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      fetchOffers();
    } catch (err) {
      console.error("Error deleting offer:", err);
    }
  };

  const deleteBooking = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/booking/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      fetchBookings();
      fetchAnalytics();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  // TEMPORARY UI ONLY until /api/courses backend exists
  const handleCourseSubmit = (e) => {
    e.preventDefault();
    alert("Courses backend route not added yet. First create /api/courses in backend.");
  };

  const startEditCourse = (course) => {
    setEditingCourse(course._id);
    setCourseEditForm({
      title: course.title || "",
      duration: course.duration || "",
      description: course.description || "",
      image: course.image || "",
      features: course.features?.length ? course.features : [""],
      isActive: course.isActive ?? true,
    });
  };

  const saveEditCourse = () => {
    alert("Courses backend route not added yet.");
  };

  const cancelCourseEdit = () => {
    setEditingCourse(null);
    setCourseEditForm({
      title: "",
      duration: "",
      description: "",
      image: "",
      features: [""],
      isActive: true,
    });
  };

  const deleteCourse = () => {
    alert("Courses backend route not added yet.");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#faf9f6] text-gray-800 font-sans">
      
      {/* Sidebar - Charcoal / Black premium Obsidian Panel */}
      <aside className="w-72 bg-[#0c0c0c] text-white p-6 flex flex-col justify-between shrink-0 border-r border-[#1a1a1a]">
        <div>
          {/* Dashboard Logo */}
          <div className="mb-10 text-center md:text-left border-b border-[#222] pb-6">
            <h2 className="text-2xl font-serif font-bold uppercase tracking-wider text-white">
              Mayleki
              <span className="block text-xs font-sans font-normal tracking-widest text-amber-500 normal-case mt-1">
                Studio & Academy
              </span>
            </h2>
            <span className="inline-block mt-3 bg-amber-950/40 text-amber-500 border border-amber-950 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
              Management Portal
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                activeTab === "dashboard"
                  ? "bg-amber-500 text-black shadow-lg"
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <LayoutDashboard size={18} />
              Overview
            </button>

            <button
              onClick={() => setActiveTab("offers")}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                activeTab === "offers"
                  ? "bg-amber-500 text-black shadow-lg"
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <Gift size={18} />
              Manage Offers
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                activeTab === "bookings"
                  ? "bg-amber-500 text-black shadow-lg"
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <Calendar size={18} />
              Manage Bookings
            </button>

            <button
              onClick={() => setActiveTab("courses")}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                activeTab === "courses"
                  ? "bg-amber-500 text-black shadow-lg"
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <GraduationCap size={18} />
              Manage Courses
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-[#1a1a1a] pt-6 space-y-4">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-gray-400 font-medium">Logged in as admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-[#1e1e1e] hover:bg-[#2e2e2e] text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut size={16} />
            Logout Portal
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-8 md:p-10 overflow-y-auto max-w-[1400px] mx-auto w-full">
        
        {/* TAB: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Title */}
            <div>
              <h1 className="text-3xl font-bold font-serif text-gray-900 flex items-center gap-2">
                Dashboard Overview
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Real-time metrics, analytics, and recent reservation activities.
              </p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
              
              {/* Total Offers */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    Total Offers
                  </span>
                  <div className="bg-amber-50 text-amber-600 p-2 rounded-lg">
                    <Gift size={16} />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight mt-auto text-black">
                  {offers.length}
                </h3>
              </div>

              {/* Total Bookings */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    Total Bookings
                  </span>
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <Calendar size={16} />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight mt-auto text-black">
                  {analytics.totalBookings}
                </h3>
              </div>

              {/* Today's Bookings */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    Today&apos;s Appointments
                  </span>
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                    <CalendarDays size={16} />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight mt-auto text-black">
                  {getTodayBookings()}
                </h3>
              </div>

              {/* Weekly Bookings */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    Weekly Bookings
                  </span>
                  <div className="bg-purple-50 text-purple-600 p-2 rounded-lg">
                    <Activity size={16} />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight mt-auto text-black">
                  {getWeekBookings()}
                </h3>
              </div>

              {/* Courses */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    Total Courses
                  </span>
                  <div className="bg-orange-50 text-orange-600 p-2 rounded-lg">
                    <GraduationCap size={16} />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight mt-auto text-black">
                  {courses.length}
                </h3>
              </div>

            </div>

            {/* Revenue Analytics Block */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="bg-emerald-100 text-emerald-800 p-4 rounded-2xl">
                <IndianRupee size={32} />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                  Total Accumulated Revenue
                </span>
                <h2 className="text-4xl font-extrabold text-gray-900 mt-1">
                  ₹{analytics.totalRevenue.toLocaleString("en-IN")}
                </h2>
              </div>
              <div className="ml-auto bg-gray-50 border border-gray-100 py-2 px-4 rounded-xl text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                Live Revenue calculations
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 font-serif">Recent Activity Logs</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {getRecentBookings().length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">No recent bookings found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase text-gray-500">
                        <tr>
                          <th className="px-6 py-4 text-left">Customer Name</th>
                          <th className="px-6 py-4 text-left">Appointment Date</th>
                          <th className="px-6 py-4 text-left">Time Slot</th>
                          <th className="px-6 py-4 text-left">Action Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {getRecentBookings().map((booking) => (
                          <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-gray-900 font-semibold">
                              {booking.userName || booking.name || "-"}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {booking.date
                                ? new Date(booking.date).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {booking.timeSlot || booking.time || "-"}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                booking.status === "Cancelled"
                                  ? "bg-red-50 text-red-700 border-red-100"
                                  : booking.status === "Completed"
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-100"
                              }`}>
                                {booking.status || "Confirmed"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB: MANAGE OFFERS */}
        {activeTab === "offers" && (
          <div className="space-y-8 animate-fadeIn">
            
            <div>
              <h1 className="text-3xl font-bold font-serif text-gray-900">Manage Salon Offers</h1>
              <p className="text-sm text-gray-500 mt-1">Create, edit, or remove promotional discount offers.</p>
            </div>

            {/* Create Offer Form */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-serif text-gray-900 border-b pb-2">Add Promotional Offer</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <input
                  placeholder="Offer Title (Ex: Haircut Special)"
                  className="border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                <input
                  placeholder="Discount Percentage/Text (Ex: 30% OFF)"
                  className="border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  required
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                />

                <input
                  placeholder="Short Description"
                  className="border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black md:col-span-2"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />

                <input
                  type="date"
                  className="border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  required
                  value={form.validTill}
                  onChange={(e) => setForm({ ...form, validTill: e.target.value })}
                />

                <div className="flex items-end justify-end md:col-span-2">
                  <button className="bg-black text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-gray-800 transition flex items-center gap-1.5 cursor-pointer">
                    <Plus size={16} />
                    Add Offer
                  </button>
                </div>
              </form>
            </div>

            {/* Offers List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 font-serif">Active Promotion List</h2>
              
              {loading ? (
                <div className="p-10 text-center text-sm text-gray-500">Loading offers...</div>
              ) : offers.length === 0 ? (
                <div className="bg-white p-8 text-center text-sm text-gray-400 border rounded-2xl">No promotional offers created yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {offers.map((offer) => (
                    <div
                      key={offer._id}
                      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4"
                    >
                      {editingOffer === offer._id ? (
                        /* Edit Offer Mode */
                        <div className="space-y-3 w-full">
                          <input
                            className="border border-gray-300 p-3 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm({ ...editForm, title: e.target.value })
                            }
                            placeholder="Title"
                          />
                          <input
                            className="border border-gray-300 p-3 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                            placeholder="Description"
                          />
                          <input
                            className="border border-gray-300 p-3 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            value={editForm.discount}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                discount: e.target.value,
                              })
                            }
                            placeholder="Discount"
                          />
                          <input
                            type="date"
                            className="border border-gray-300 p-3 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            value={editForm.validTill}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                validTill: e.target.value,
                              })
                            }
                          />

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => saveEditOffer(offer._id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* View Offer Mode */
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-lg text-gray-900 font-serif">{offer.title}</h3>
                              <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                {offer.discount}
                              </span>
                            </div>
                            <p className="text-gray-500 text-xs leading-relaxed">{offer.description}</p>
                            {offer.validTill && (
                              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-2">
                                Valid Till: {new Date(offer.validTill).toLocaleDateString()}
                              </p>
                            )}
                          </div>

                          <div className="flex justify-end gap-3 border-t border-gray-50 pt-3">
                            <button
                              type="button"
                              onClick={() => startEditOffer(offer)}
                              className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1 bg-gray-50 hover:bg-gray-100 py-1.5 px-3 rounded-lg cursor-pointer"
                            >
                              <Edit2 size={12} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteOffer(offer._id)}
                              className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 bg-red-50 hover:bg-red-100 py-1.5 px-3 rounded-lg cursor-pointer"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB: MANAGE BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="space-y-8 animate-fadeIn">
            
            <div>
              <h1 className="text-3xl font-bold font-serif text-gray-900">Manage Reservations</h1>
              <p className="text-sm text-gray-500 mt-1">Search bookings, check scheduling conflicts, and manage appointments.</p>
            </div>

            {/* Filter and search bar */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
              
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Search by client name or mobile number..."
                  className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Filter size={18} />
                </span>
                <input
                  type="date"
                  className="pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              {(searchQuery || filterDate) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterDate("");
                  }}
                  className="bg-black hover:bg-gray-800 text-white font-semibold px-5 py-3 rounded-xl text-sm transition cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Check availability sub-card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold font-serif text-gray-900">Slot Availability Checker</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Pick a date to check which time slots are currently booked.</p>
                </div>
                <input
                  type="date"
                  className="border border-gray-300 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {selectedDate && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                  {timeSlots.map((slot) => {
                    const booked = isSlotBooked(slot);
                    return (
                      <div
                        key={slot}
                        className={`p-3 text-center rounded-xl font-bold shadow-xs border transition-colors ${
                          booked
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        <span className="text-xs tracking-wider block">{slot}</span>
                        <span className="text-[10px] uppercase font-extrabold tracking-widest mt-1 block">
                          {booked ? "● Booked" : "○ Available"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bookings List Cards */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 font-serif">
                Total Matches ({filteredBookings.length})
              </h2>

              {filteredBookings.length === 0 ? (
                <div className="bg-white p-12 text-center text-sm text-gray-400 border rounded-2xl">
                  No reservations matched your criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                  {filteredBookings.map((b) => (
                    <div
                      key={b._id}
                      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            b.status === "Cancelled"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : b.status === "Completed"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }`}>
                            {b.status || "Confirmed"}
                          </span>
                          <span className="text-sm font-bold text-gray-800">
                            {b.service || "Salon Service"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <p>
                            <span className="text-gray-400 text-xs block">Client Name</span>
                            <span className="font-semibold text-gray-900">{b.userName || b.name || "-"}</span>
                          </p>
                          <p>
                            <span className="text-gray-400 text-xs block">Phone Number</span>
                            <span className="font-semibold text-gray-900">{b.phone || "-"}</span>
                          </p>
                          <p>
                            <span className="text-gray-400 text-xs block">Reserved Date</span>
                            <span className="font-semibold text-gray-900">
                              {b.date ? new Date(b.date).toLocaleDateString() : "-"}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-400 text-xs block">Time Slot</span>
                            <span className="font-semibold text-gray-900">{b.timeSlot || b.time || "-"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-50 pt-3 flex justify-end">
                        {deleteConfirm === b._id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-red-600 font-bold">Confirm delete?</span>
                            <button
                              onClick={() => deleteBooking(b._id)}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(b._id)}
                            className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 size={12} />
                            Delete booking record
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB: MANAGE COURSES */}
        {activeTab === "courses" && (
          <div className="space-y-8 animate-fadeIn">
            
            <div>
              <h1 className="text-3xl font-bold font-serif text-gray-900">Manage Academy Courses</h1>
              <p className="text-sm text-gray-500 mt-1">Configure academy course curriculum and features.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="shrink-0 text-amber-700" size={16} />
              <span>Note: The backend routes for courses are currently under setup. Changes below are saved locally.</span>
            </div>

            {/* Create Course Form */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-serif text-gray-900 border-b pb-2">Add New Course</h3>
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    placeholder="Course Title"
                    className="border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    value={courseForm.title}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, title: e.target.value })
                    }
                  />

                  <input
                    placeholder="Duration (Ex: 3 Months)"
                    className="border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    value={courseForm.duration}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, duration: e.target.value })
                    }
                  />
                </div>

                <textarea
                  placeholder="Detailed Course Description"
                  className="border border-gray-300 p-3 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Image URL"
                  className="border border-gray-300 p-3 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  value={courseForm.image}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, image: e.target.value })
                  }
                />

                {/* Course features */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Curriculum Modules</label>
                  {courseForm.features.map((feature, idx) => (
                    <input
                      key={idx}
                      placeholder={`Module Detail ${idx + 1}`}
                      className="border border-gray-300 p-3 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      value={feature}
                      onChange={(e) => {
                        const updated = [...courseForm.features];
                        updated[idx] = e.target.value;
                        setCourseForm({ ...courseForm, features: updated });
                      }}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCourseForm({
                        ...courseForm,
                        features: [...courseForm.features, ""],
                      })
                    }
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold"
                  >
                    + Add Curriculum Module
                  </button>

                  <button className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition cursor-pointer">
                    Add Course
                  </button>
                </div>

              </form>
            </div>

            {/* Courses List */}
            <div className="grid grid-cols-1 gap-6">
              {courses.length === 0 ? (
                <div className="bg-white p-8 text-center text-sm text-gray-400 border rounded-2xl">
                  No academy courses added.
                </div>
              ) : (
                courses.map((course) => (
                  <div key={course._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    {editingCourse === course._id ? (
                      /* Edit Course Mode */
                      <div className="space-y-3">
                        <input
                          className="border p-3 w-full rounded-xl text-sm focus:outline-none"
                          value={courseEditForm.title}
                          onChange={(e) =>
                            setCourseEditForm({
                              ...courseEditForm,
                              title: e.target.value,
                            })
                          }
                          placeholder="Title"
                        />

                        <input
                          className="border p-3 w-full rounded-xl text-sm focus:outline-none"
                          value={courseEditForm.duration}
                          onChange={(e) =>
                            setCourseEditForm({
                              ...courseEditForm,
                              duration: e.target.value,
                            })
                          }
                          placeholder="Duration"
                        />

                        <textarea
                          className="border p-3 w-full rounded-xl text-sm focus:outline-none"
                          rows={3}
                          value={courseEditForm.description}
                          onChange={(e) =>
                            setCourseEditForm({
                              ...courseEditForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Description"
                        />

                        <input
                          className="border p-3 w-full rounded-xl text-sm focus:outline-none"
                          value={courseEditForm.image}
                          onChange={(e) =>
                            setCourseEditForm({
                              ...courseEditForm,
                              image: e.target.value,
                            })
                          }
                          placeholder="Image URL"
                        />

                        {courseEditForm.features.map((feature, idx) => (
                          <input
                            key={idx}
                            className="border p-3 w-full rounded-xl text-sm focus:outline-none"
                            value={feature}
                            onChange={(e) => {
                              const updated = [...courseEditForm.features];
                              updated[idx] = e.target.value;
                              setCourseEditForm({
                                ...courseEditForm,
                                features: updated,
                              });
                            }}
                            placeholder={`Module ${idx + 1}`}
                          />
                        ))}

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() =>
                              setCourseEditForm({
                                ...courseEditForm,
                                features: [...courseEditForm.features, ""],
                              })
                            }
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold"
                          >
                            + Add Module
                          </button>

                          <button
                            type="button"
                            onClick={saveEditCourse}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            onClick={cancelCourseEdit}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Course Mode */
                      <div className="flex flex-col md:flex-row md:justify-between gap-6">
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-xl text-gray-900 font-serif">{course.title}</h3>
                            <span className="text-xs font-bold text-gray-400 bg-gray-50 border px-2 py-0.5 rounded">
                              {course.duration}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed">{course.description}</p>

                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Curriculum Details:</h5>
                            <ul className="list-disc ml-5 text-xs text-gray-600 space-y-0.5">
                              {course.features?.map((f, i) => (
                                <li key={i}>{f}</li>
                              ))}
                            </ul>
                          </div>

                          {course.image && (
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-44 h-28 object-cover rounded-xl mt-3 border border-gray-100 shadow-xs"
                            />
                          )}
                        </div>

                        <div className="flex justify-end gap-3 self-end md:self-start">
                          <button
                            type="button"
                            onClick={() => startEditCourse(course)}
                            className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1 bg-gray-50 hover:bg-gray-100 py-1.5 px-3 rounded-lg cursor-pointer"
                          >
                            <Edit2 size={12} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={deleteCourse}
                            className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 bg-red-50 hover:bg-red-100 py-1.5 px-3 rounded-lg cursor-pointer"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </main>

    </div>
  );
};

export default Dashboard;