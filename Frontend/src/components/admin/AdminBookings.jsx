import React, { useEffect, useState } from "react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        📅 All Bookings
      </h1>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border p-4 rounded-lg shadow"
            >
              <h2 className="font-bold text-lg">
                {booking.name}
              </h2>

              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Service:</strong> {booking.service}</p>
              <p><strong>Price:</strong> {booking.price}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>

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