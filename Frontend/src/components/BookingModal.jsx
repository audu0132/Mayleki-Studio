import React, { useState, useEffect } from "react";


const BookingModal = ({ service, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    "10:00 AM","11:00 AM","12:00 PM",
    "1:00 PM","2:00 PM","3:00 PM",
    "4:00 PM","5:00 PM","6:00 PM","7:00 PM"
  ];

  // ===============================
  // Fetch booked slots
  // ===============================
  useEffect(() => {
    if (!selectedDate) return;

   const fetchSlots = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/bookings/available/${selectedDate}`
    );

    const data = await res.json();

    // backend sends { available, bookedSlots }
    setBookedSlots(data.bookedSlots || []);

  } catch (error) {
    console.error("Error fetching slots:", error);
  }
};

    fetchSlots();
  }, [ selectedDate]);

  // ===============================
  // Slot Style Function
  // ===============================
  const getSlotStyle = (slot) => {
    if (bookedSlots.includes(slot))
      return "bg-red-400 text-white cursor-not-allowed";

    if (form.time === slot)
      return "bg-black text-white";

    return "bg-green-500 text-white hover:bg-green-600";
  };

  // ===============================
  // Submit Booking
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.time) {
      alert("Please select a time slot");
      return;
    }

    const bookingData = {
      ...form,
      service: service.title,
      price: service.price,
    };

    try {
      setLoading(true);

      await fetch(`http://localhost:5000/api/bookings/available=${selectedDate}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

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
    } catch (error) 
    
    {
      console.error("Booking error:", error);
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center">
          Book {service.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            placeholder="Your Name"
            className="border p-2 w-full rounded"
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Phone Number"
            className="border p-2 w-full rounded"
            required
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value, date: selectedDate })
            }
          />

          <input
            type="date"
            className="border p-2 w-full rounded"
            required
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
          />

          {/* SLOT SECTION */}
          {selectedDate && (
            <div>
              <p className="font-semibold mb-2">Select Time Slot</p>

              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
  <button
    key={slot}
    type="button"
    disabled={bookedSlots.includes(slot)}
    onClick={() => setForm({ ...form, time: slot })}
    className={`p-2 rounded text-sm transition ${
      bookedSlots.includes(slot)
        ? "bg-red-500 text-white cursor-not-allowed"
        : form.time === slot
        ? "bg-black text-white"
        : "bg-green-500 text-white hover:bg-green-600" 
    }`}
      
  >
    {slot}
  </button>
))}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-between pt-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
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