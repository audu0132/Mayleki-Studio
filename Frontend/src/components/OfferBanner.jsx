import React, { useEffect, useState } from "react";

const OfferBanner = () => {
  const [offer, setOffer] = useState(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/offers");
        const data = await res.json();

        // If backend returns array
        if (Array.isArray(data) && data.length > 0) {
          // Get latest offer
          const latestOffer = data[0];

          if (new Date(latestOffer.validTill) > new Date()) {
            setOffer(latestOffer);
          }
        }
      } catch (err) {
        console.error("Error fetching offer:", err);
      }
    };

    fetchOffer();
  }, []);

  if (!offer || !show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl text-center w-80 shadow-xl">
        <h2 className="text-xl font-bold mb-2">
          🎉 {offer.title}
        </h2>

        <p className="mb-2">{offer.description}</p>

        <p className="text-red-500 font-semibold mb-4">
          {offer.discount}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          Valid Till: {new Date(offer.validTill).toDateString()}
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setShow(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>

          <a
            href="https://wa.me/918767875492"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600 text-white px-4 py-2 rounded-lg"
          >
            Claim Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;