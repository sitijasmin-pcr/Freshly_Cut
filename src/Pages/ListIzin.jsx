// import React, { useState } from "react";
// import { Mail, Plus, X } from "lucide-react";

// const initialIzinData = [
//   {
//     nama: "Asep Suracep",
//     posisi: "Barista",
//     alasan: "Sakit",
//     estimasi: "2-3 Hari",
//     surat: "SuratSakitAsep.pdf",
//     foto: "", // default kosong
//   },
//   {
//     nama: "Wwan",
//     posisi: "Waitres",
//     alasan: "Izin",
//     estimasi: "2 Hari",
//     surat: "SuratIzinWawan.pdf",
//     foto: "",
//   },
//   {
//     nama: "Caca",
//     posisi: "Kasir",
//     alasan: "Sakit",
//     estimasi: "3 Hari",
//     surat: "SuratSakitCaca.pdf",
//     foto: "",
//   },
//   {
//     nama: "Dodi",
//     posisi: "Service",
//     alasan: "Sakit",
//     estimasi: "1 Hari",
//     surat: "SuratSakitDodi.pdf",
//     foto: "",
//   },
//   {
//     nama: "Deul",
//     posisi: "Admin",
//     alasan: "Gila",
//     estimasi: "10 Hari",
//     surat: "SuratStressDeul.pdf",
//     foto: "",
//   },
//   {
//     nama: "Budi wiwok detok",
//     posisi: "Chef",
//     alasan: "Tipes",
//     estimasi: "3 Hari",
//     surat: "SuratSakitBudi.pdf",
//     foto: "",
//   },
// ];

// const ListIzin = () => {
//   const [izinData, setIzinData] = useState(initialIzinData);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     nama: "",
//     posisi: "",
//     alasan: "Sakit",
//     estimasi: "",
//     surat: "",
//     foto: "",
//   });

//   const alasanCounts = izinData.reduce((acc, curr) => {
//     const alasan = curr.alasan;
//     acc[alasan] = (acc[alasan] || 0) + 1;
//     return acc;
//   }, {});

//   const handleAddIzin = () => {
//     setIzinData((prev) => [...prev, formData]);
//     setIsModalOpen(false);
//     setFormData({
//       nama: "",
//       posisi: "",
//       alasan: "Sakit",
//       estimasi: "",
//       surat: "",
//       foto: "",
//     });
//   };

//   const handleFotoChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setFormData((prev) => ({ ...prev, foto: url }));
//     }
//   };

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-orange-600">List Izin</h2>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold"
//         >
//           <Plus size={18} /> Tambah Izin
//         </button>
//       </div>

//       {/* Summary Cards */}
//       <div className="flex flex-wrap justify-center gap-6 mb-10 text-center">
//         {Object.entries(alasanCounts).map(([alasan, count]) => (
//           <div
//             key={alasan}
//             className="bg-white rounded-xl shadow-md py-6 px-8 min-w-[150px]"
//           >
//             <p className="text-orange-600 text-lg font-bold">{alasan}</p>
//             <p className="text-2xl font-bold text-gray-800">{count}</p>
//           </div>
//         ))}
//       </div>

//       {/* Cards */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {izinData.map((item, index) => (
//           <div
//             key={index}
//             className="bg-gray-100 rounded-xl shadow-md p-6 relative"
//           >
//             <div className="w-16 h-16 rounded-full absolute -top-8 left-4 border overflow-hidden bg-white">
//               {item.foto ? (
//                 <img src={item.foto} alt="Foto" className="w-full h-full object-cover" />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
//                   No Foto
//                 </div>
//               )}
//             </div>
//             <div className="pl-20">
//               <h3 className="font-bold text-orange-700">{item.nama}</h3>
//               <p className="text-sm text-gray-500 mb-2">{item.posisi}</p>
//               <p className="text-sm text-gray-600">
//                 <span className="font-semibold text-orange-600">Alasan:</span>{" "}
//                 {item.alasan}
//               </p>
//               <p className="text-sm text-gray-600 mb-2">
//                 <span className="font-semibold text-orange-600">Estimasi:</span>{" "}
//                 {item.estimasi}
//               </p>
//               <a
//                 href={`/${item.surat}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1 text-orange-600 text-sm hover:underline"
//               >
//                 <Mail size={16} />
//                 {item.surat}
//               </a>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal Form Tambah Izin */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
//             >
//               <X />
//             </button>
//             <h3 className="text-xl font-semibold mb-4 text-orange-600">Tambah Izin</h3>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Nama"
//                 value={formData.nama}
//                 onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
//                 className="w-full border px-4 py-2 rounded-md"
//               />
//               <input
//                 type="text"
//                 placeholder="Posisi"
//                 value={formData.posisi}
//                 onChange={(e) => setFormData({ ...formData, posisi: e.target.value })}
//                 className="w-full border px-4 py-2 rounded-md"
//               />
//               <select
//                 value={formData.alasan}
//                 onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
//                 className="w-full border px-4 py-2 rounded-md"
//               >
//                 <option value="Sakit">Sakit</option>
//                 <option value="Izin">Izin</option>
//                 <option value="Lainnya">Lainnya</option>
//               </select>
//               <input
//                 type="text"
//                 placeholder="Estimasi"
//                 value={formData.estimasi}
//                 onChange={(e) => setFormData({ ...formData, estimasi: e.target.value })}
//                 className="w-full border px-4 py-2 rounded-md"
//               />
//               <input
//                 type="text"
//                 placeholder="Nama File Surat (contoh: SuratSakitAsep.pdf)"
//                 value={formData.surat}
//                 onChange={(e) => setFormData({ ...formData, surat: e.target.value })}
//                 className="w-full border px-4 py-2 rounded-md"
//               />
//               <div>
//                 <label className="block mb-1 text-sm font-medium">Upload Foto</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFotoChange}
//                   className="w-full border px-4 py-2 rounded-md"
//                 />
//               </div>
//               <button
//                 onClick={handleAddIzin}
//                 className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 font-semibold"
//               >
//                 Simpan Izin
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ListIzin;

import React, { useEffect, useState } from "react";
import { Mail, Plus, X } from "lucide-react";
import { supabase } from "../supabase";
import Swal from "sweetalert2";

const ListIzin = () => {
  const [izinData, setIzinData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    posisi: "",
    alasan: "Sakit",
    estimasi: "",
    surat: "",
    foto: "",
  });

  const fetchIzin = async () => {
    const { data, error } = await supabase.from("izin").select("*");
    if (error) console.error("Fetch error:", error);
    else setIzinData(data);
  };

  useEffect(() => {
    fetchIzin();
  }, []);

  const handleAddIzin = async () => {
    const { error } = await supabase.from("izin").insert([formData]);
    if (!error) {
      setIsModalOpen(false);
      setFormData({
        nama: "",
        posisi: "",
        alasan: "Sakit",
        estimasi: "",
        surat: "",
        foto: "",
      });
      Swal.fire("Berhasil", "Data izin ditambahkan", "success");
      fetchIzin();
    } else {
      Swal.fire("Gagal", error.message, "error");
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, foto: url }));
    }
  };

  const alasanCounts = izinData.reduce((acc, curr) => {
    acc[curr.alasan] = (acc[curr.alasan] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-orange-600">List Izin</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold"
        >
          <Plus size={18} /> Tambah Izin
        </button>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap justify-center gap-6 mb-10 text-center">
        {Object.entries(alasanCounts).map(([alasan, count]) => (
          <div
            key={alasan}
            className="bg-white rounded-xl shadow-md py-6 px-8 min-w-[150px]"
          >
            <p className="text-orange-600 text-lg font-bold">{alasan}</p>
            <p className="text-2xl font-bold text-gray-800">{count}</p>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {izinData.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 rounded-xl shadow-md p-6 relative"
          >
            <div className="w-16 h-16 rounded-full absolute -top-8 left-4 border overflow-hidden bg-white">
              {item.foto ? (
                <img
                  src={item.foto}
                  alt="Foto"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  No Foto
                </div>
              )}
            </div>
            <div className="pl-20">
              <h3 className="font-bold text-orange-700">{item.nama}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.posisi}</p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-orange-600">Alasan:</span>{" "}
                {item.alasan}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold text-orange-600">Estimasi:</span>{" "}
                {item.estimasi}
              </p>
              <a
                href={`/${item.surat}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-orange-600 text-sm hover:underline"
              >
                <Mail size={16} />
                {item.surat}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form Tambah Izin */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-orange-600">
              Tambah Izin
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Posisi"
                value={formData.posisi}
                onChange={(e) =>
                  setFormData({ ...formData, posisi: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-md"
              />
              <select
                value={formData.alasan}
                onChange={(e) =>
                  setFormData({ ...formData, alasan: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-md"
              >
                <option value="Sakit">Sakit</option>
                <option value="Izin">Izin</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <input
                type="text"
                placeholder="Estimasi"
                value={formData.estimasi}
                onChange={(e) =>
                  setFormData({ ...formData, estimasi: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Nama File Surat (contoh: SuratSakitAsep.pdf)"
                value={formData.surat}
                onChange={(e) =>
                  setFormData({ ...formData, surat: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-md"
              />
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Upload Foto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>
              <button
                onClick={handleAddIzin}
                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 font-semibold"
              >
                Simpan Izin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListIzin;
