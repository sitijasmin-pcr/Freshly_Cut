import React from "react";

const outlets = [
  { name: "Tomoro Coffee Pekanbaru" },
  { name: "Tomoro Coffee Hangtuah" },
  { name: "Tomoro Coffee Sembilang" },
  { name: "Tomoro Coffee Gobah" },
];

const Outlet = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-4xl font-bold text-center text-orange-600 mb-2">OUTLET LOCATIONS</h1>
      <p className="text-center text-gray-500 max-w-3xl mx-auto mb-12">
        "Masukan, keluhan, atau kepuasan yang disampaikan pelanggan mengenai produk atau pelayanan yang diterima.
        Feedback berguna untuk menemukan masalah, melakukan perbaikan, dan meningkatkan kepuasan pelanggan."
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {outlets.map((outlet, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer"
          >
            <div className="overflow-hidden rounded-t-xl">
              <img
                src="https://bukafranchise.id/wp-content/uploads/2024/09/Franchise-Tomoro-Coffee-1024x683.jpg"
                alt={outlet.name}
                className="w-full h-60 object-cover"
              />
            </div>
            <div className="p-5 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">{outlet.name}</h2>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm shadow">
                Directions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Outlet;
