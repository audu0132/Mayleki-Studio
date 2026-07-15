import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import Profile from "./Profile";
import logo from "../assets/logo.png";
import {
  Calendar,
  Clock,
  Tag,
  Award,
  User,
  LogOut,
  XCircle,
  RefreshCw,
  Info,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Gift,
  CheckCircle
} from "lucide-react";

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Rescheduling states
  const [reschedulingBooking, setReschedulingBooking] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  // Detail Modal state
  const [viewingBooking, setViewingBooking] = useState(null);

  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM",
    "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
  ];

  // Fetch customer bookings and active offers
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const bookingsRes = await api.get("/api/bookings/my-bookings");
      setBookings(bookingsRes.data || []);

      const offersRes = await api.get("/api/offers");
      // Offers endpoint might return a single offer or array
      if (offersRes.data) {
        setOffers(Array.isArray(offersRes.data) ? offersRes.data : [offersRes.data]);
      } else {
        setOffers([]);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch available slots for rescheduled date
  useEffect(() => {
    if (!rescheduleDate) return;

    const fetchSlots = async () => {
      try {
        const res = await api.get(`/api/bookings/available/${rescheduleDate}`);
        if (res.data && res.data.availableSlots) {
          setAvailableSlots(res.data.availableSlots);
        } else {
          setAvailableSlots([]);
        }
      } catch (err) {
        console.error("Error fetching slots for reschedule:", err);
      }
    };

    fetchSlots();
  }, [rescheduleDate]);

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Filter Bookings by status/date
  const getUpcomingBookings = () => {
    return bookings.filter((b) => {
      const isFuture = new Date(b.date) >= new Date(new Date().setHours(0, 0, 0, 0));
      return b.status === "Confirmed" && isFuture;
    });
  };

  const getCompletedBookings = () => {
    return bookings.filter((b) => {
      const isPast = new Date(b.date) < new Date(new Date().setHours(0, 0, 0, 0));
      return b.status === "Completed" || (b.status === "Confirmed" && isPast);
    });
  };

  const getCancelledBookings = () => {
    return bookings.filter((b) => b.status === "Cancelled");
  };

  // Stats calculation
  const upcomingCount = getUpcomingBookings().length;
  const completedCount = getCompletedBookings().length;
  const activeOffersCount = offers.filter(o => o.isActive).length;
  const rewardPoints = completedCount * 50; // Dynamic reward points: 50pts per completed service!

  // Cancel Booking
  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await api.put(`/api/bookings/${id}/cancel`);
      alert("Booking cancelled successfully.");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  // Reschedule Booking submit
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleDate || !rescheduleTime) {
      alert("Please select date and slot.");
      return;
    }

    try {
      setRescheduleLoading(true);
      await api.put(`/api/bookings/${reschedulingBooking._id}/reschedule`, {
        date: rescheduleDate,
        time: rescheduleTime,
      });
      alert("Booking rescheduled successfully!");
      setReschedulingBooking(null);
      setRescheduleDate("");
      setRescheduleTime("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reschedule booking.");
    } finally {
      setRescheduleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-black text-white shrink-0 flex flex-col border-r border-gray-900">
        
        {/* Logo */}
        <div className="p-6 border-b border-gray-900 flex justify-center md:justify-start">
          <a href="/">
            <img src={logo} alt="Mayleki Logo" className="h-14 w-auto object-contain" />
          </a>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-6 border-b border-gray-900 flex items-center gap-3">
            <img
              src={user.profilePicture || "https://api.dicebear.com/7.x/adventurer/svg?seed=mayleki-studio"}
              className="w-12 h-12 rounded-full border border-gray-800 bg-white"
              alt="Avatar"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold truncate">{user.name}</h4>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Tabs Links */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 ${
              activeTab === "dashboard" ? "bg-white text-black" : "hover:bg-gray-900 text-gray-300"
            }`}
          >
            <TrendingUp size={18} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("upcoming")}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 ${
              activeTab === "upcoming" ? "bg-white text-black" : "hover:bg-gray-900 text-gray-300"
            }`}
          >
            <Calendar size={18} />
            Upcoming Bookings
            {upcomingCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {upcomingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 ${
              activeTab === "history" ? "bg-white text-black" : "hover:bg-gray-900 text-gray-300"
            }`}
          >
            <Clock size={18} />
            Booking History
          </button>

          <button
            onClick={() => setActiveTab("offers")}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 ${
              activeTab === "offers" ? "bg-white text-black" : "hover:bg-gray-900 text-gray-300"
            }`}
          >
            <Tag size={18} />
            Offers
            {activeOffersCount > 0 && (
              <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                {activeOffersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 ${
              activeTab === "profile" ? "bg-white text-black" : "hover:bg-gray-900 text-gray-300"
            }`}
          >
            <User size={18} />
            My Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left py-3 px-4 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors flex items-center gap-3 mt-8 cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {loading ? (
          /* Skeleton Loaders */
          <div className="space-y-6 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl text-center space-y-3">
            <AlertTriangle className="mx-auto" size={40} />
            <p className="font-semibold">{error}</p>
            <button onClick={fetchData} className="bg-black text-white px-6 py-2 rounded-lg text-sm">
              Try Again
            </button>
          </div>
        ) : (
          <div>
            
            {/* TAB: DASHBOARD OVERVIEW */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                
                {/* Welcome Title */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 font-serif">
                    Welcome back, {user?.name.split(" ")[0]}!
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Manage your bookings, check available beauty offers, and track rewards.
                  </p>
                </div>

                {/* Dashboard Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1: Upcoming Bookings */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        Upcoming Bookings
                      </span>
                      <h3 className="text-3xl font-bold mt-1 text-black">{upcomingCount}</h3>
                    </div>
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                      <Calendar size={24} />
                    </div>
                  </div>

                  {/* Card 2: Completed Services */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        Completed Services
                      </span>
                      <h3 className="text-3xl font-bold mt-1 text-black">{completedCount}</h3>
                    </div>
                    <div className="bg-green-50 text-green-600 p-3 rounded-2xl">
                      <CheckCircle size={24} />
                    </div>
                  </div>

                  {/* Card 3: Offers Available */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        Offers Available
                      </span>
                      <h3 className="text-3xl font-bold mt-1 text-black">{activeOffersCount}</h3>
                    </div>
                    <div className="bg-yellow-50 text-yellow-600 p-3 rounded-2xl">
                      <Tag size={24} />
                    </div>
                  </div>

                  {/* Card 4: Reward Points (Placeholder) */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        Reward Points
                      </span>
                      <h3 className="text-3xl font-bold mt-1 text-black">{rewardPoints} pts</h3>
                    </div>
                    <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
                      <Award size={24} />
                    </div>
                  </div>

                </div>

                {/* Dashboard Recent Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left: Upcoming List */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-800">Your Upcoming Appointment</h2>
                      <button
                        onClick={() => setActiveTab("upcoming")}
                        className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1"
                      >
                        View All <ChevronRight size={14} />
                      </button>
                    </div>

                    {getUpcomingBookings().length === 0 ? (
                      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-2">
                        <Calendar className="mx-auto text-gray-300" size={36} />
                        <p className="text-gray-500 text-sm">No upcoming appointments scheduled.</p>
                        <a
                          href="/#services"
                          className="inline-block mt-2 text-xs font-semibold uppercase tracking-wider bg-black text-white px-4 py-2 rounded-lg"
                        >
                          Book Now
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {getUpcomingBookings().slice(0, 2).map((booking) => (
                          <BookingCard
                            key={booking._id}
                            booking={booking}
                            onCancel={handleCancelBooking}
                            onReschedule={setReschedulingBooking}
                            onViewDetails={setViewingBooking}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Active Offer Preview */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Special Salon Offer</h2>
                    {offers.length === 0 || !offers[0]?.isActive ? (
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center py-10 text-gray-400">
                        <Gift size={32} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No active promotional offers right now.</p>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white p-6 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between h-[200px]">
                        <div className="absolute right-[-20px] top-[-20px] bg-white/10 w-28 h-28 rounded-full"></div>
                        <div className="space-y-1">
                          <span className="bg-white/20 text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {offers[0].discount} Off
                          </span>
                          <h3 className="text-xl font-bold leading-tight font-serif mt-2">{offers[0].title}</h3>
                          <p className="text-xs text-white/80 line-clamp-2">{offers[0].description}</p>
                        </div>
                        <div className="text-[10px] text-white/70 border-t border-white/20 pt-2 flex justify-between items-center">
                          <span>Valid till: {new Date(offers[0].validTill).toLocaleDateString()}</span>
                          <button
                            onClick={() => setActiveTab("offers")}
                            className="bg-white text-amber-900 px-3 py-1 rounded text-xs font-semibold cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* TAB: UPCOMING BOOKINGS */}
            {activeTab === "upcoming" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 font-serif border-b pb-4">
                  Upcoming Appointments
                </h1>
                {getUpcomingBookings().length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center py-20">
                    <Calendar className="mx-auto text-gray-300 mb-3" size={48} />
                    <h3 className="text-lg font-bold text-gray-700">No appointments found</h3>
                    <p className="text-gray-500 text-sm mt-1">You don't have any upcoming salon visits scheduled.</p>
                    <a
                      href="/#services"
                      className="inline-block mt-4 bg-black text-white text-xs font-semibold tracking-widest uppercase py-3 px-6 rounded-lg"
                    >
                      Book a Service
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getUpcomingBookings().map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        onCancel={handleCancelBooking}
                        onReschedule={setReschedulingBooking}
                        onViewDetails={setViewingBooking}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: BOOKING HISTORY */}
            {activeTab === "history" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 font-serif border-b pb-4">
                  Your Booking History
                </h1>

                {/* Sub-sections */}
                <div className="space-y-8">
                  {/* Completed Appointments */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                      Completed Appointments ({completedCount})
                    </h2>
                    {getCompletedBookings().length === 0 ? (
                      <p className="text-sm text-gray-500 italic pl-5">No completed visits recorded.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {getCompletedBookings().map((booking) => (
                          <BookingCard
                            key={booking._id}
                            booking={booking}
                            onViewDetails={setViewingBooking}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cancelled Appointments */}
                  <div className="pt-6 border-t border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                      Cancelled Appointments ({getCancelledBookings().length})
                    </h2>
                    {getCancelledBookings().length === 0 ? (
                      <p className="text-sm text-gray-500 italic pl-5">No cancelled appointments.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {getCancelledBookings().map((booking) => (
                          <BookingCard
                            key={booking._id}
                            booking={booking}
                            onViewDetails={setViewingBooking}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: OFFERS */}
            {activeTab === "offers" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 font-serif border-b pb-4">
                  Available Offers & Deals
                </h1>
                {offers.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center py-20 text-gray-400">
                    <Tag className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-lg font-semibold">No offers currently active.</p>
                    <p className="text-sm">Please check back later for exciting package discounts!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                      <div
                        key={offer._id}
                        className={`bg-white p-6 rounded-2xl border shadow-sm space-y-4 flex flex-col justify-between ${
                          offer.isActive ? "border-amber-200" : "border-gray-200 opacity-60"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                              offer.isActive ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500"
                            }`}>
                              {offer.isActive ? "Active" : "Expired"}
                            </span>
                            <span className="text-lg font-bold text-amber-600 font-mono">
                              {offer.discount} OFF
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 font-serif mt-2">{offer.title}</h3>
                          <p className="text-sm text-gray-500 leading-relaxed">{offer.description}</p>
                        </div>
                        <div className="border-t border-gray-100 pt-3 text-[11px] text-gray-400 flex items-center justify-between">
                          <span>Expires: {new Date(offer.validTill).toLocaleDateString()}</span>
                          {offer.isActive && (
                            <a href="/#services" className="font-semibold text-black hover:underline uppercase text-[10px] tracking-wider">
                              Book Offer
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROFILE EDIT */}
            {activeTab === "profile" && (
              <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 font-serif border-b pb-4 mb-6">
                  Account Management
                </h1>
                <Profile embedded={true} />
              </div>
            )}

          </div>
        )}

      </main>

      {/* DETAIL MODAL */}
      {viewingBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex justify-between items-start border-b pb-3">
              <h3 className="text-xl font-bold font-serif text-gray-900">Appointment Details</h3>
              <button onClick={() => setViewingBooking(null)} className="text-gray-400 hover:text-black">
                ✕
              </button>
            </div>
            
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="font-semibold">Service:</span>
                <span>{viewingBooking.service}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="font-semibold">Date:</span>
                <span>{new Date(viewingBooking.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="font-semibold">Time Slot:</span>
                <span>{viewingBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="font-semibold">Price:</span>
                <span className="font-bold">₹{viewingBooking.price}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="font-semibold">Client Name:</span>
                <span>{viewingBooking.userName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="font-semibold">Client Phone:</span>
                <span>{viewingBooking.phone}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="font-semibold">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  viewingBooking.status === "Cancelled" ? "bg-red-100 text-red-800" :
                  viewingBooking.status === "Completed" ? "bg-blue-100 text-blue-800" :
                  "bg-green-100 text-green-800"
                }`}>
                  {viewingBooking.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => setViewingBooking(null)}
              className="w-full bg-black text-white py-2 rounded-xl text-sm font-semibold tracking-wider hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {reschedulingBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-4 animate-scaleUp">
            
            <div className="flex justify-between items-start border-b pb-3">
              <h3 className="text-xl font-bold font-serif text-gray-900">
                Reschedule: {reschedulingBooking.service}
              </h3>
              <button
                onClick={() => {
                  setReschedulingBooking(null);
                  setRescheduleDate("");
                  setRescheduleTime("");
                }}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              
              {/* Pick New Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                  Select New Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="p-3 w-full border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  value={rescheduleDate}
                  onChange={(e) => {
                    setRescheduleDate(e.target.value);
                    setRescheduleTime("");
                  }}
                />
              </div>

              {/* Pick Slot */}
              {rescheduleDate && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-2 text-center">
                    Available Slots
                  </label>
                  {availableSlots.length === 0 ? (
                    <p className="text-xs text-red-500 text-center italic">No slots available on this date. Select another date.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => {
                        const isBooked = !availableSlots.includes(slot);
                        const isSelected = rescheduleTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setRescheduleTime(slot)}
                            className={`p-2 text-xs rounded-lg font-semibold transition-all border ${
                              isBooked ? "bg-red-100 text-red-400 border-red-100 cursor-not-allowed" :
                              isSelected ? "bg-black text-white border-black" : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setReschedulingBooking(null);
                    setRescheduleDate("");
                    setRescheduleTime("");
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 py-2.5 rounded-xl text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rescheduleLoading || !rescheduleTime}
                  className="flex-1 bg-black text-white hover:bg-gray-800 py-2.5 rounded-xl text-sm font-semibold disabled:bg-gray-400"
                >
                  {rescheduleLoading ? "Saving..." : "Confirm"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

// Sub-Component: BookingCard
const BookingCard = ({ booking, onCancel, onReschedule, onViewDetails }) => {
  const isPast = new Date(booking.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const canModify = booking.status === "Confirmed" && !isPast && onCancel && onReschedule;

  // Status Badge coloring
  const getStatusBadge = (status) => {
    if (status === "Cancelled") return "bg-red-100 text-red-800 border-red-200";
    if (status === "Completed") return "bg-blue-100 text-blue-800 border-blue-200";
    if (isPast) return "bg-blue-100 text-blue-800 border-blue-200"; // Past confirmed bookings are implicitly completed
    return "bg-green-100 text-green-800 border-green-200";
  };

  const displayStatus = (status) => {
    if (status === "Cancelled") return "Cancelled";
    if (status === "Completed" || isPast) return "Completed";
    return "Confirmed";
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between gap-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadge(booking.status)}`}>
            {displayStatus(booking.status)}
          </span>
          <span className="text-sm font-bold text-gray-800">
            ₹{booking.price}
          </span>
        </div>
        <h3 className="text-base font-bold text-gray-900 leading-snug">{booking.service}</h3>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={13} />
            <span>{new Date(booking.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={13} />
            <span>{booking.timeSlot}</span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
        
        {/* View Details */}
        <button
          onClick={() => onViewDetails(booking)}
          className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 hover:text-black py-1 px-2.5 rounded bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Info size={12} />
          Details
        </button>

        {/* Action Buttons if valid */}
        {canModify && (
          <>
            <button
              onClick={() => onReschedule(booking)}
              className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-900 py-1 px-2.5 rounded bg-amber-50 hover:bg-amber-100 transition-colors ml-auto cursor-pointer"
            >
              <RefreshCw size={12} />
              Reschedule
            </button>
            <button
              onClick={() => onCancel(booking._id)}
              className="flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-800 py-1 px-2.5 rounded bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <XCircle size={12} />
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
