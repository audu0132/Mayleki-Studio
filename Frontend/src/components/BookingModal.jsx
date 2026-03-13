import React, { useState, useEffect } from "react";

const BookingModal = ({ service, onClose }) => {
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

  // ================================
  // Fetch booked slots when date changes
  // ================================
 useEffect(() => {
  if (!form.date) return;

  const fetchSlots = async () => {
    try {
      const res = await fetch(
        `https://mayleki-studio.onrender.com/api/booking/available/${form.date}`
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
      return "bg-black text-white scale-105";

    return "bg-green-500 text-white hover:bg-green-600";
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

      const res = await fetch(
  "https://mayleki-studio.onrender.com/api/booking",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[420px] shadow-2xl">

        <h2 className="text-2xl font-bold mb-4 text-center">
          Book {service.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Your Name"
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            type="date"
             min={new Date().toISOString().split("T")[0]}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value, time: "" })
            }
          />

          {/* SLOT SECTION */}
          {form.date && (
            <div>
              <p className="font-semibold mb-3 text-center">
                Select Time Slot
              </p>

              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    required
                    value={form.date}
                    disabled={bookedSlots.includes(slot)}

                    onClick={() =>
                      setForm({ ...form, time: slot })
                    }
                    className={`p-2 rounded-lg text-sm transition-all duration-200 ${getSlotStyle(slot)}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-between text-xs mt-4">
                <span className="text-green-600">🟢 Available</span>
                <span className="text-black">⚫ Selected</span>
                <span className="text-red-600">🔴 Booked</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
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