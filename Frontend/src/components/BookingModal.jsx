import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { API_BASE_URL } from "../config";

const BookingModal = ({ service, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert("Please login to book services.");
      onClose();
      navigate("/login");
    }
  }, [user, navigate, onClose]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
  });

  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    "10:00 AM","11:00 AM","12:00 PM",
    "1:00 PM","2:00 PM","3:00 PM",
    "4:00 PM","5:00 PM","6:00 PM","7:00 PM"
  ];

  // Prefill details if customer is logged in
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // ================================
  // Fetch booked slots when date changes
  // ================================
  useEffect(() => {
    if (!form.date) return;

    const fetchSlots = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/bookings/available/${form.date}`
        );

        const data = await res.json();
        
        if (data.availableSlots) {
          // Find which slots are missing from availableSlots (these are the booked ones)
          const booked = timeSlots.filter(
            (slot) => !data.availableSlots.includes(slot)
          );
          setBookedSlots(booked);
        } else {
          setBookedSlots(data.bookedSlots || []);
        }

      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();

  }, [form.date]);

  // ================================
  // Slot Styling
  // ================================
  const getSlotStyle = (slot) => {
    if (bookedSlots.includes(slot))
      return "bg-red-500 text-white cursor-not-allowed";

    if (form.time === slot)
      return "bg-black text-white scale-105 shadow-md shadow-black/20 font-bold";

    return "bg-green-500 text-white hover:bg-green-600 font-bold";
  };

  // ================================
  // Submit Booking
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.time) {
      alert("Please select a time slot");
      return;
    }

    const bookingData = {
      ...form,
      name: form.name,
      phone: form.phone,
      date: form.date,
      service: service.title,
      price: service.price,
    };

    try {
      setLoading(true);

      // Inject authorization headers if logged in
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/bookings`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(bookingData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }

      alert("Booking Confirmed!");

      // WhatsApp redirect
      const message = `
Hello,
I want to book:

Name: ${form.name}
Phone: ${form.phone}
Service: ${service.title}
Price: ${service.price}
Date: ${form.date}
Time: ${form.time}
      `;

      const encodedMessage = encodeURIComponent(message);

      window.open(
        `https://wa.me/918767875492?text=${encodedMessage}`,
        "_blank"
      );

      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/8 p-6 sm:p-8 rounded-3xl w-full max-w-[420px] shadow-2xl relative overflow-hidden transition-all duration-300">
        
        <h2 className="text-2xl font-serif font-bold text-center text-primary mb-1">
          Book {service.title}
        </h2>
        <div className="h-0.5 w-12 bg-black dark:bg-white mx-auto mb-6"></div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-slate-50 dark:bg-[#0c0b10] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full bg-slate-50 dark:bg-[#0c0b10] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              required
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Appointment Date</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full bg-slate-50 dark:bg-[#0c0b10] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              required
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value, time: "" })
              }
            />
          </div>

          {/* SLOT SECTION */}
          {form.date && (
            <div className="space-y-3 pt-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Select Time Slot</label>

              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    disabled={bookedSlots.includes(slot)}
                    onClick={() =>
                      setForm({ ...form, time: slot })
                    }
                    className={`py-2.5 px-1 rounded-xl text-[11px] font-mono transition-all duration-200 cursor-pointer ${getSlotStyle(slot)}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-5 text-[9px] uppercase font-bold tracking-wider pt-2">
                <span className="text-green-600">● Available</span>
                <span className="text-black dark:text-white">● Selected</span>
                <span className="text-red-600">● Booked</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 text-xs font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer disabled:bg-gray-400"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookingModal;