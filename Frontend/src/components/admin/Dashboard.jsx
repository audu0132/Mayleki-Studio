import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

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
      return bookingDate === today;
    }).length;
  };

  const getWeekBookings = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return bookings.filter((b) => {
      const bookingDate = new Date(b.createdAt || b.date || 0);
      return bookingDate >= weekAgo;
    }).length;
  };

  const getRecentBookings = () => {
    return [...bookings]
      .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
      .slice(0, 5);
  };

  const isSlotBooked = (slot) => {
    return bookings.some((b) => {
      if (!b.date) return false;

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
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-72 bg-black text-white p-6 flex flex-col">
        <h2 className="text-3xl font-bold mb-8">Admin Panel</h2>

        <button
          onClick={() => setActiveTab("dashboard")}
          className={`block w-full text-left mb-3 px-4 py-3 rounded-lg transition ${
            activeTab === "dashboard"
              ? "bg-pink-600 text-white"
              : "hover:bg-white/10"
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab("offers")}
          className={`block w-full text-left mb-3 px-4 py-3 rounded-lg transition ${
            activeTab === "offers"
              ? "bg-pink-600 text-white"
              : "hover:bg-white/10"
          }`}
        >
          Manage Offers
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`block w-full text-left mb-3 px-4 py-3 rounded-lg transition ${
            activeTab === "bookings"
              ? "bg-pink-600 text-white"
              : "hover:bg-white/10"
          }`}
        >
          Manage Bookings
        </button>

        <button
          onClick={() => setActiveTab("courses")}
          className={`block w-full text-left mb-3 px-4 py-3 rounded-lg transition ${
            activeTab === "courses"
              ? "bg-pink-600 text-white"
              : "hover:bg-white/10"
          }`}
        >
          Manage Courses
        </button>

        <div className="mt-auto pt-8">
          <button
            onClick={handleLogout}
            className="w-full bg-white text-black px-4 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg font-semibold text-gray-600">
                  Total Offers
                </h3>
                <p className="text-4xl text-pink-600 font-bold mt-2">
                  {offers.length}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg font-semibold text-gray-600">
                  Total Bookings
                </h3>
                <p className="text-4xl text-blue-600 font-bold mt-2">
                  {analytics.totalBookings}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg font-semibold text-gray-600">
                  Today&apos;s Bookings
                </h3>
                <p className="text-4xl text-green-600 font-bold mt-2">
                  {getTodayBookings()}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg font-semibold text-gray-600">
                  This Week
                </h3>
                <p className="text-4xl text-purple-600 font-bold mt-2">
                  {getWeekBookings()}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg font-semibold text-gray-600">
                  Total Courses
                </h3>
                <p className="text-4xl text-orange-600 font-bold mt-2">
                  {courses.length}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-2xl shadow">
              <h3 className="text-lg font-semibold text-gray-600">
                Total Revenue
              </h3>
              <p className="text-4xl text-green-600 font-bold mt-2">
                ₹{analytics.totalRevenue.toLocaleString()}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                {getRecentBookings().length === 0 ? (
                  <p className="p-4 text-gray-500">No recent bookings</p>
                ) : (
                  <div className="overflow-x-auto">
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
                            <td className="px-4 py-3">
                              {booking.userName || booking.name || "-"}
                            </td>
                            <td className="px-4 py-3">
                              {booking.date
                                ? new Date(booking.date).toISOString().split("T")[0]
                                : "-"}
                            </td>
                            <td className="px-4 py-3">
                              {booking.timeSlot || booking.time || "-"}
                            </td>
                            <td className="px-4 py-3">
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                Confirmed
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

        {activeTab === "offers" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Manage Offers</h1>

            <form
              onSubmit={handleSubmit}
              className="space-y-3 mb-6 bg-white p-6 rounded-2xl shadow"
            >
              <input
                placeholder="Title"
                className="border p-3 w-full rounded-lg"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <input
                placeholder="Description"
                className="border p-3 w-full rounded-lg"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <input
                placeholder="Discount"
                className="border p-3 w-full rounded-lg"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
              />

              <input
                type="date"
                className="border p-3 w-full rounded-lg"
                value={form.validTill}
                onChange={(e) => setForm({ ...form, validTill: e.target.value })}
              />

              <button className="bg-pink-600 text-white px-5 py-3 rounded-lg hover:bg-pink-700 transition">
                Add Offer
              </button>
            </form>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid gap-4">
                {offers.map((offer) => (
                  <div
                    key={offer._id}
                    className="bg-white p-5 rounded-2xl shadow flex justify-between items-start gap-4"
                  >
                    {editingOffer === offer._id ? (
                      <div className="flex-1 space-y-3">
                        <input
                          className="border p-3 w-full rounded-lg"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          placeholder="Title"
                        />
                        <input
                          className="border p-3 w-full rounded-lg"
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
                          className="border p-3 w-full rounded-lg"
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
                          className="border p-3 w-full rounded-lg"
                          value={editForm.validTill}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              validTill: e.target.value,
                            })
                          }
                        />

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => saveEditOffer(offer._id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h3 className="font-bold text-lg">{offer.title}</h3>
                          <p className="text-gray-700 mt-1">
                            {offer.description}
                          </p>
                          <p className="text-pink-600 font-semibold mt-2">
                            {offer.discount}
                          </p>
                          {offer.validTill && (
                            <p className="text-sm text-gray-500 mt-1">
                              Valid till:{" "}
                              {new Date(offer.validTill).toISOString().split("T")[0]}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEditOffer(offer)}
                            className="text-blue-600 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteOffer(offer._id)}
                            className="text-red-600 font-medium"
                          >
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
        )}

        {activeTab === "bookings" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by name or phone..."
                className="border p-3 flex-1 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <input
                type="date"
                className="border p-3 rounded-lg"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />

              {(searchQuery || filterDate) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterDate("");
                  }}
                  className="bg-gray-600 text-white px-4 py-3 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="bg-white p-4 rounded-2xl shadow mb-6">
              <label className="block text-sm font-medium mb-2">
                Check slot availability by date
              </label>
              <input
                type="date"
                className="border p-3 rounded-lg"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {selectedDate && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                {timeSlots.map((slot) => (
                  <div
                    key={slot}
                    className={`p-4 text-center rounded-xl font-semibold shadow ${
                      isSlotBooked(slot)
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {slot}
                    <div className="text-xs mt-1">
                      {isSlotBooked(slot) ? "Booked" : "Available"}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h2 className="text-xl font-semibold mb-4">
              All Bookings ({filteredBookings.length})
            </h2>

            {filteredBookings.length === 0 ? (
              <p className="text-gray-500">No bookings found</p>
            ) : (
              <div className="grid gap-4">
                {filteredBookings.map((b) => (
                  <div
                    key={b._id}
                    className="bg-white p-5 rounded-2xl shadow flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                  >
                    <div className="space-y-1">
                      <p>
                        <strong>Name:</strong> {b.userName || b.name || "-"}
                      </p>
                      <p>
                        <strong>Phone:</strong> {b.phone || "-"}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {b.date
                          ? new Date(b.date).toISOString().split("T")[0]
                          : "-"}
                      </p>
                      <p>
                        <strong>Time:</strong> {b.timeSlot || b.time || "-"}
                      </p>
                    </div>

                    {deleteConfirm === b._id ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-red-600">Confirm delete?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => deleteBooking(b._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(b._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "courses" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>

            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl mb-6">
              Courses backend route is not created yet. Create <code>/api/courses</code> in backend first.
            </div>

            <form
              onSubmit={handleCourseSubmit}
              className="space-y-3 mb-6 bg-white p-6 rounded-2xl shadow"
            >
              <input
                placeholder="Course Title"
                className="border p-3 w-full rounded-lg"
                value={courseForm.title}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, title: e.target.value })
                }
              />

              <input
                placeholder="Duration"
                className="border p-3 w-full rounded-lg"
                value={courseForm.duration}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, duration: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                className="border p-3 w-full rounded-lg"
                rows={4}
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
                className="border p-3 w-full rounded-lg"
                value={courseForm.image}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, image: e.target.value })
                }
              />

              {courseForm.features.map((feature, idx) => (
                <input
                  key={idx}
                  placeholder={`Feature ${idx + 1}`}
                  className="border p-3 w-full rounded-lg"
                  value={feature}
                  onChange={(e) => {
                    const updated = [...courseForm.features];
                    updated[idx] = e.target.value;
                    setCourseForm({ ...courseForm, features: updated });
                  }}
                />
              ))}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setCourseForm({
                      ...courseForm,
                      features: [...courseForm.features, ""],
                    })
                  }
                  className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                  + Add Feature
                </button>

                <button className="bg-pink-600 text-white px-5 py-2 rounded-lg hover:bg-pink-700 transition">
                  Add Course
                </button>
              </div>
            </form>

            <div className="grid gap-4">
              {courses.length === 0 ? (
                <div className="bg-white p-5 rounded-2xl shadow text-gray-500">
                  No courses found.
                </div>
              ) : (
                courses.map((course) => (
                  <div key={course._id} className="bg-white p-5 rounded-2xl shadow">
                    {editingCourse === course._id ? (
                      <div className="space-y-3">
                        <input
                          className="border p-3 w-full rounded-lg"
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
                          className="border p-3 w-full rounded-lg"
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
                          className="border p-3 w-full rounded-lg"
                          rows={4}
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
                          className="border p-3 w-full rounded-lg"
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
                            className="border p-3 w-full rounded-lg"
                            value={feature}
                            onChange={(e) => {
                              const updated = [...courseEditForm.features];
                              updated[idx] = e.target.value;
                              setCourseEditForm({
                                ...courseEditForm,
                                features: updated,
                              });
                            }}
                            placeholder={`Feature ${idx + 1}`}
                          />
                        ))}

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setCourseEditForm({
                                ...courseEditForm,
                                features: [...courseEditForm.features, ""],
                              })
                            }
                            className="bg-gray-200 px-4 py-2 rounded-lg"
                          >
                            + Add Feature
                          </button>

                          <button
                            type="button"
                            onClick={saveEditCourse}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg"
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            onClick={cancelCourseEdit}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl">{course.title}</h3>
                          <p className="text-gray-500 mt-1">{course.duration}</p>
                          <p className="text-gray-700 mt-3">{course.description}</p>

                          <ul className="list-disc ml-5 mt-3 text-sm text-gray-700">
                            {course.features?.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>

                          {course.image && (
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-40 h-28 object-cover rounded-lg mt-4 border"
                            />
                          )}
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => startEditCourse(course)}
                            className="text-blue-600 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={deleteCourse}
                            className="text-red-600 font-medium"
                          >
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
      </div>
    </div>
  );
};

export default Dashboard;