import React from "react";

const outlets = [
  { name: "Tomoro Coffee Riau" },
  { name: "Tomoro Coffee Hangtuah" },
  { name: "Tomoro Coffee Sembilang" },
  { name: "Tomoro Coffee Gobah" },
];

const Outlet = () => {
  const [outlets, setOutlets] = useState([
    {
      name: "Tomoro Coffee Riau",
      mapsUrl: "https://maps.app.goo.gl/hP4ihiRr3zkdHcGZA",
      imageUrl:
        "https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/65/2024/09/26/21-1867463046.jpg",
    },
    {
      name: "Tomoro Coffee Hangtuah",
      mapsUrl: "https://maps.app.goo.gl/PcfR4QRvZ1Y9bEEaA",
      imageUrl:
        "https://cdn.8mediatech.com/gambar/59477904392-tomoro_coffee_lakukan_restrukturisasi_kepemimpinan,_lulu_yang_resmi_jabat_ceo_global.jpg",
    },
    {
      name: "Tomoro Coffee Sembilang",
      mapsUrl: "https://maps.app.goo.gl/Ji6yBRXRYdm2WYJc9",
      imageUrl:
        "https://jiaksimipng.wordpress.com/wp-content/uploads/2024/10/04a42838-a066-4fd4-b72b-577c16840b9e-1.jpg?w=1024",
    },
    {
      name: "Tomoro Coffee Gobah",
      mapsUrl: "https://maps.app.goo.gl/gVN1xa6r7j8Zgfze6",
      imageUrl:
        "https://jiaksimipng.wordpress.com/wp-content/uploads/2024/05/7bbe9084-e426-473d-aae6-bc5c1a195671-1.jpg?w=1024",
    },
  ]);

  const [newOutlet, setNewOutlet] = useState({ name: "", mapsUrl: "", imageUrl: "" });

  const handleAddOutlet = () => {
    if (newOutlet.name && newOutlet.mapsUrl && newOutlet.imageUrl) {
      setOutlets([...outlets, newOutlet]);
      setNewOutlet({ name: "", mapsUrl: "", imageUrl: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <h1 className="text-4xl font-bold text-center text-orange-600 mb-4">OUTLET LOCATIONS</h1>
      <p className="text-center text-gray-500 max-w-3xl mx-auto mb-10">
        "Masukan, keluhan, atau kepuasan yang disampaikan pelanggan mengenai produk atau pelayanan yang diterima.
        Feedback berguna untuk menemukan masalah, melakukan perbaikan, dan meningkatkan kepuasan pelanggan."
      </p>

      {/* Form Tambah Outlet */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow border mb-12">
        <h2 className="text-lg font-semibold text-orange-500 mb-4">Tambah Outlet Baru</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <input
            type="text"
            placeholder="Nama Outlet"
            value={newOutlet.name}
            onChange={(e) => setNewOutlet({ ...newOutlet, name: e.target.value })}
            className="border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="text"
            placeholder="Link Maps"
            value={newOutlet.mapsUrl}
            onChange={(e) => setNewOutlet({ ...newOutlet, mapsUrl: e.target.value })}
            className="border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="text"
            placeholder="Link Gambar"
            value={newOutlet.imageUrl}
            onChange={(e) => setNewOutlet({ ...newOutlet, imageUrl: e.target.value })}
            className="border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="text-right mt-4">
          <Button
            onClick={handleAddOutlet}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 text-sm rounded-full shadow"
          >
            Tambahkan Outlet
          </Button>
        </div>
      </div>

      {/* List Outlet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {outlets.map((outlet, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer"
          >
            <div className="overflow-hidden rounded-t-xl">
              <img
                src={outlet.imageUrl}
                alt={outlet.name}
                className="w-full h-60 object-cover"
              />
            </div>
            <div className="p-5 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">{outlet.name}</h2>
              <a
                href={outlet.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm shadow"
              >
                Directions
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Outlet;
