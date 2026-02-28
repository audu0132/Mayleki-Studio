import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [offers, setOffers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

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

  // ================= FETCH DATA =================
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/offers");
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
      const res = await fetch("http://localhost:5000/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchBookings();
  }, []);

  // ================= ADD OFFER =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5000/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ title: "", description: "", discount: "", validTill: "" });
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE OFFER =================
  const deleteOffer = async (id) => {
    await fetch(`http://localhost:5000/api/offers/${id}`, {
      method: "DELETE",
    });
    fetchOffers();
  };

  // ================= SLOT CHECK =================
  const isSlotBooked = (slot) => {
    return bookings.some(
      (b) => b.date === selectedDate && b.time === slot
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-black text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <button onClick={() => setActiveTab("dashboard")} className="block w-full text-left mb-3 hover:text-pink-400">
          Dashboard
        </button>

        <button onClick={() => setActiveTab("offers")} className="block w-full text-left mb-3 hover:text-pink-400">
          Manage Offers
        </button>

        <button onClick={() => setActiveTab("bookings")} className="block w-full text-left mb-3 hover:text-pink-400">
          Manage Bookings
        </button>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-8">

        {/* DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-semibold">Total Offers</h3>
                <p className="text-3xl text-pink-600">{offers.length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-semibold">Total Bookings</h3>
                <p className="text-3xl text-blue-600">{bookings.length}</p>
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

              <button className="bg-pink-600 text-white px-4 py-2 rounded">
                Add Offer
              </button>
            </form>

            {loading ? (
              <p>Loading...</p>
            ) : (
              offers.map((offer) => (
                <div key={offer._id} className="bg-white p-4 mb-3 rounded shadow flex justify-between">
                  <div>
                    <h3 className="font-bold">{offer.title}</h3>
                    <p>{offer.description}</p>
                    <p className="text-red-500">{offer.discount}</p>
                  </div>

                  <button
                    onClick={() => deleteOffer(offer._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ================= BOOKINGS ================= */}
        {activeTab === "bookings" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>

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

            <h2 className="text-xl font-semibold mb-4">All Bookings</h2>

            {bookings.map((b) => (
              <div key={b._id} className="bg-white p-4 mb-2 rounded shadow">
                <p><strong>Name:</strong> {b.name}</p>
                <p><strong>Date:</strong> {b.date}</p>
                <p><strong>Time:</strong> {b.time}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;