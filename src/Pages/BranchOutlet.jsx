// import React, { useState } from "react";

// const Outlet = () => {
//   const [outlets, setOutlets] = useState([
//     {
//       name: "Tomoro Coffee Riau",
//       mapsUrl: "https://maps.app.goo.gl/hP4ihiRr3zkdHcGZA",
//       imageUrl:
//         "https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/65/2024/09/26/21-1867463046.jpg",
//     },
//     {
//       name: "Tomoro Coffee Hangtuah",
//       mapsUrl: "https://maps.app.goo.gl/PcfR4QRvZ1Y9bEEaA",
//       imageUrl:
//         "https://cdn.8mediatech.com/gambar/59477904392-tomoro_coffee_lakukan_restrukturisasi_kepemimpinan,_lulu_yang_resmi_jabat_ceo_global.jpg",
//     },
//     {
//       name: "Tomoro Coffee Sembilang",
//       mapsUrl: "https://maps.app.goo.gl/Ji6yBRXRYdm2WYJc9",
//       imageUrl:
//         "https://jiaksimipng.wordpress.com/wp-content/uploads/2024/10/04a42838-a066-4fd4-b72b-577c16840b9e-1.jpg?w=1024",
//     },
//     {
//       name: "Tomoro Coffee Gobah",
//       mapsUrl: "https://maps.app.goo.gl/gVN1xa6r7j8Zgfze6",
//       imageUrl:
//         "https://jiaksimipng.wordpress.com/wp-content/uploads/2024/05/7bbe9084-e426-473d-aae6-bc5c1a195671-1.jpg?w=1024",
//     },
//   ]);

//   const [newOutlet, setNewOutlet] = useState({
//     name: "",
//     mapsUrl: "",
//     imageUrl: "",
//   });

//   const [showForm, setShowForm] = useState(false);

//   const handleAddOutlet = () => {
//     if (newOutlet.name && newOutlet.mapsUrl && newOutlet.imageUrl) {
//       setOutlets([...outlets, newOutlet]);
//       setNewOutlet({ name: "", mapsUrl: "", imageUrl: "" });
//       setShowForm(false); // hide form after adding
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
//       <h1 className="text-4xl font-bold text-center text-orange-600 mb-4">
//         OUTLET LOCATIONS
//       </h1>
//       <p className="text-center text-gray-500 max-w-3xl mx-auto mb-10">
//         "Masukan, keluhan, atau kepuasan yang disampaikan pelanggan mengenai
//         produk atau pelayanan yang diterima. Feedback berguna untuk menemukan
//         masalah, melakukan perbaikan, dan meningkatkan kepuasan pelanggan."
//       </p>

//       {/* Tombol Tampilkan/Sembunyikan Form */}
//       <div className="text-center mb-6">
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow"
//         >
//           {showForm ? "Tutup Form Tambah Outlet" : "Tambah Outlet"}
//         </button>
//       </div>

//       {/* Form Tambah Outlet (muncul di bawah tombol, bukan modal) */}
//       {showForm && (
//         <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow border mb-12 transition-all duration-300">
//           <h2 className="text-lg font-semibold text-orange-500 mb-4">
//             Tambah Outlet Baru
//           </h2>
//           <div className="grid gap-4 sm:grid-cols-3">
//             <input
//               type="text"
//               placeholder="Nama Outlet"
//               value={newOutlet.name}
//               onChange={(e) =>
//                 setNewOutlet({ ...newOutlet, name: e.target.value })
//               }
//               className="border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />
//             <input
//               type="text"
//               placeholder="Link Maps"
//               value={newOutlet.mapsUrl}
//               onChange={(e) =>
//                 setNewOutlet({ ...newOutlet, mapsUrl: e.target.value })
//               }
//               className="border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />
//             <input
//               type="text"
//               placeholder="Link Gambar"
//               value={newOutlet.imageUrl}
//               onChange={(e) =>
//                 setNewOutlet({ ...newOutlet, imageUrl: e.target.value })
//               }
//               className="border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />
//           </div>
//           <div className="text-right mt-4">
//             <button
//               onClick={handleAddOutlet}
//               className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 text-sm rounded-full shadow"
//             >
//               Simpan Outlet
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Daftar Outlet */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
//         {outlets.map((outlet, idx) => (
//           <div
//             key={idx}
//             className="bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer"
//           >
//             <div className="overflow-hidden rounded-t-xl">
//               <img
//                 src={outlet.imageUrl}
//                 alt={outlet.name}
//                 className="w-full h-60 object-cover"
//               />
//             </div>
//             <div className="p-5 flex justify-between items-center">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 {outlet.name}
//               </h2>
//               <a
//                 href={outlet.mapsUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm shadow"
//               >
//                 Directions
//               </a>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Outlet;


import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import OutletForm from "./OutletForm";
import Swal from "sweetalert2";

export default function Outlet() {
  const [outlets, setOutlets] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState(null);

  const fetchOutlets = async () => {
    const { data, error } = await supabase.from("outlet").select("*").order("created_at", { ascending: false });
    if (error) console.error("Fetch Error:", error);
    else setOutlets(data);
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

  const handleAddNew = () => {
    setEditingOutlet(null);
    setIsFormOpen(true);
  };

  const handleEdit = (outlet) => {
    setEditingOutlet(outlet);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin hapus?",
      text: "Data outlet ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#718096",
      confirmButtonText: "Ya, hapus!",
    });

    if (confirm.isConfirmed) {
      const { error } = await supabase.from("outlet").delete().eq("id", id);
      if (error) {
        console.error("Delete Error:", error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
      } else {
        Swal.fire("Terhapus!", "Outlet berhasil dihapus.", "success");
        fetchOutlets();
      }
    }
  };

  const handleFormClose = (message) => {
    setIsFormOpen(false);
    setEditingOutlet(null);
    fetchOutlets();
    if (message) {
      Swal.fire({
        title: "Berhasil!",
        text: message,
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <h1 className="text-4xl font-bold text-center text-orange-600 mb-4">OUTLET LOCATIONS</h1>

      {/* Tombol Tambah */}
      <div className="text-center mb-6">
        <button
          onClick={handleAddNew}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow"
        >
          Tambah Outlet
        </button>
      </div>

      {/* List Outlet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {outlets.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada data outlet.</p>
        ) : (
          outlets.map((outlet) => (
            <div
              key={outlet.id}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300"
            >
              <div className="overflow-hidden rounded-t-xl">
                <img src={outlet.image_url} alt={outlet.name} className="w-full h-60 object-cover" />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-800">{outlet.name}</h2>
                <div className="flex justify-between items-center mt-2">
                  <a
                    href={outlet.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm shadow"
                  >
                    Directions
                  </a>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(outlet)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(outlet.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <OutletForm
          onClose={handleFormClose}
          editingOutlet={editingOutlet}
        />
      )}
    </div>
  );
}
