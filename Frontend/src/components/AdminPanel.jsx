import React, { useState } from "react";
import AdminBookings from "./admin/AdminBookings";

const AdminPanel = () => {
  const [title, setTitle] = useState("");
  const [discount, setDiscount] = useState("");
  const [validTill, setValidTill] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, discount, validTill }),
      });

      if (!response.ok) {
        throw new Error("Failed to update offer");
      }

      alert("Offer Updated Successfully!");

      // Clear form after submit
      setTitle("");
      setDiscount("");
      setValidTill("");

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Offer</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Offer Title"
          className="w-full border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Discount (Ex: 40% OFF)"
          className="w-full border p-2"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          required
        />

        <input
          type="date"
          className="w-full border p-2"
          value={validTill}
          onChange={(e) => setValidTill(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-2 w-full"
        >
          Update Offer
        </button>
      </form>

      {/* Optional: Show bookings */}
      <div className="mt-10">
        <AdminBookings />
      </div>
    </div>
  );
};

export default AdminPanel;